// Modern Dashboard UI Module
const DashboardUI = {
  // State management
  state: {
    currentPage: 1,
    itemsPerPage: 10,
    selectedItems: new Set(),
    sidebarOpen: false,
    theme: 'dark',
    searchTerm: '',
    filterType: 'all',
    sortColumn: 'date',
    sortDirection: 'desc',
    isLoading: false
  },

  // Initialize the dashboard
  async init() {
    this.setupEventListeners();
    this.initializeTheme();
    this.setupDateRange();
    await this.refreshUI();
    this.initializeSparklines();
  },

  // Setup all event listeners
  setupEventListeners() {
    // Sidebar controls
    document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
    document.getElementById('sidebarClose').addEventListener('click', () => this.closeSidebar());

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => this.refreshUI());

    // Search and filters
    document.getElementById('searchInput').addEventListener('input', (e) => {
      this.state.searchTerm = e.target.value;
      this.debounceSearch();
    });

    document.getElementById('filterType').addEventListener('change', (e) => {
      this.state.filterType = e.target.value;
      this.filterAndUpdateTable();
    });

    document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());

    // Export functionality
    document.getElementById('exportBtn').addEventListener('click', () => this.toggleExportMenu());
    document.querySelectorAll('.export-item').forEach(item => {
      item.addEventListener('click', (e) => this.handleExport(e.target.dataset.format));
    });

    // Bulk actions
    document.getElementById('selectAll').addEventListener('change', (e) => this.toggleSelectAll(e.target.checked));
    document.getElementById('bulkExport').addEventListener('click', () => this.bulkExport());
    document.getElementById('bulkDelete').addEventListener('click', () => this.bulkDelete());
    document.getElementById('bulkClear').addEventListener('click', () => this.clearSelection());

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => this.previousPage());
    document.getElementById('nextPage').addEventListener('click', () => this.nextPage());

    // FAB and modal
    document.getElementById('fab').addEventListener('click', () => this.openQuickActions());
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeModal();
    });

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
    });

    // Close export menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.export-dropdown')) {
        this.closeExportMenu();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
  },

  // Initialize theme from localStorage or system preference
  initializeTheme() {
    const savedTheme = localStorage.getItem('dashboard-theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.state.theme = savedTheme || systemTheme;
    this.applyTheme();
  },

  // Apply theme to document
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.innerHTML = this.state.theme === 'dark' ? 
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>Light Mode' :
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>Dark Mode';
  },

  // Toggle theme
  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('dashboard-theme', this.state.theme);
    this.applyTheme();
    this.showToast('Theme changed', 'success');
  },

  // Setup date range picker
  setupDateRange() {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    document.getElementById('startDate').value = lastWeek.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
  },

  // Toggle sidebar
  toggleSidebar() {
    this.state.sidebarOpen = !this.state.sidebarOpen;
    document.getElementById('sidebar').classList.toggle('open', this.state.sidebarOpen);
    document.getElementById('mainLayout').classList.toggle('sidebar-open', this.state.sidebarOpen);
  },

  // Close sidebar
  closeSidebar() {
    this.state.sidebarOpen = false;
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('mainLayout').classList.remove('sidebar-open');
  },

  // Debounced search
  debounceSearch() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filterAndUpdateTable();
    }, 300);
  },

  // Refresh UI with loading states
  async refreshUI() {
    this.state.isLoading = true;
    this.showSkeletonLoading();
    
    try {
    await DashboardData.refreshAll();
    this.updateStats();
    this.updateTable();
      this.updateSparklines();
      this.showToast('Data refreshed successfully', 'success');
    } catch (error) {
      console.error('Error refreshing data:', error);
      this.showToast('Failed to refresh data', 'error');
    } finally {
      this.state.isLoading = false;
      this.hideSkeletonLoading();
    }
  },

  // Show skeleton loading
  showSkeletonLoading() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
      card.classList.add('skeleton');
    });
  },

  // Hide skeleton loading
  hideSkeletonLoading() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach(card => {
      card.classList.remove('skeleton');
    });
  },

  // Update stats with animation
  updateStats() {
    const stats = DashboardData.cache.stats;
    if (!stats) return;

    this.animateNumber('totalVisitors', stats.visitors.total);
    this.animateNumber('totalParking', stats.parking.total);
    this.animateNumber('todayVisitors', stats.visitors.today);
    this.animateNumber('todayParking', stats.parking.today);
  },

  // Animate number counting
  animateNumber(elementId, target) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const start = parseInt(element.textContent) || 0;
    const duration = 1500;
    const steps = 60;
    const step = (target - start) / steps;
    const stepDuration = duration / steps;

    let current = start;
    let stepCount = 0;

    const animate = () => {
      if (stepCount >= steps) {
        element.textContent = target.toLocaleString();
        return;
      }

      current += step;
      element.textContent = Math.round(current).toLocaleString();
      stepCount++;
      setTimeout(animate, stepDuration);
    };

    animate();
  },

  // Update table with modern features
  updateTable() {
    const tbody = document.getElementById('entriesTable');
    const visitors = DashboardData.cache.visitors || [];
    const parking = DashboardData.cache.parking || [];

    const entries = [
      ...visitors.map(v => ({ ...v, type: 'visitor' })),
      ...parking.map(p => ({ ...p, type: 'parking' }))
    ].sort((a, b) => {
      const dateA = new Date(a.visitDate + ' ' + a.visitTime);
      const dateB = new Date(b.visitDate + ' ' + b.visitTime);
      return this.state.sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });

    // Filter entries
    const filteredEntries = this.filterEntries(entries);
    
    // Paginate entries
    const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const endIndex = startIndex + this.state.itemsPerPage;
    const paginatedEntries = filteredEntries.slice(startIndex, endIndex);

    if (paginatedEntries.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="no-data">
            <div class="no-data-icon">📊</div>
            <div>No entries found</div>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = paginatedEntries.map(entry => this.createTableRow(entry)).join('');
    }

    this.updatePagination(filteredEntries.length);
    this.updateBulkActions();
  },

  // Filter entries based on search and type
  filterEntries(entries) {
    return entries.filter(entry => {
      const matchesSearch = !this.state.searchTerm || 
        entry.name?.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        entry.visitorName?.toLowerCase().includes(this.state.searchTerm.toLowerCase());
      
      const matchesType = this.state.filterType === 'all' || entry.type === this.state.filterType;
      
      return matchesSearch && matchesType;
    });
  },

  // Create table row with modern styling
  createTableRow(entry) {
    const name = entry.name || entry.visitorName || 'Unknown';
    const date = this.formatDate(entry.visitDate);
    const time = this.formatTime(entry.visitTime);
    const status = this.getEntryStatus(entry);
    const isSelected = this.state.selectedItems.has(entry.id || entry.name);

    return `
      <tr data-type="${entry.type}" data-id="${entry.id || entry.name}" class="${isSelected ? 'selected' : ''}">
        <td>
          <input type="checkbox" class="table-checkbox row-checkbox" 
                 ${isSelected ? 'checked' : ''} 
                 data-id="${entry.id || entry.name}">
        </td>
        <td>
          <span class="status-badge ${entry.type}">
            ${entry.type === 'visitor' ? '👤' : '🚗'} ${entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
          </span>
        </td>
        <td>${name}</td>
        <td>${date}</td>
        <td>${time}</td>
        <td>
          <span class="status-badge ${status.class}">${status.text}</span>
        </td>
      </tr>
    `;
  },

  // Format date to human readable
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString();
  },

  // Format time to human readable
  formatTime(timeString) {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  // Get entry status
  getEntryStatus(entry) {
    const now = new Date();
    const entryTime = new Date(entry.visitDate + ' ' + entry.visitTime);
    const diffHours = (now - entryTime) / (1000 * 60 * 60);

    if (diffHours < 1) return { text: 'Just Now', class: 'success' };
    if (diffHours < 24) return { text: 'Today', class: 'info' };
    if (diffHours < 168) return { text: 'This Week', class: 'warning' };
    return { text: 'Older', class: 'secondary' };
  },

  // Update pagination
  updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / this.state.itemsPerPage);
    const startItem = (this.state.currentPage - 1) * this.state.itemsPerPage + 1;
    const endItem = Math.min(this.state.currentPage * this.state.itemsPerPage, totalItems);

    document.getElementById('prevPage').disabled = this.state.currentPage === 1;
    document.getElementById('nextPage').disabled = this.state.currentPage === totalPages;
    document.getElementById('paginationInfo').textContent = 
      `Showing ${startItem}-${endItem} of ${totalItems} entries`;
  },

  // Previous page
  previousPage() {
    if (this.state.currentPage > 1) {
      this.state.currentPage--;
      this.updateTable();
    }
  },

  // Next page
  nextPage() {
    const totalPages = Math.ceil(this.getFilteredEntries().length / this.state.itemsPerPage);
    if (this.state.currentPage < totalPages) {
      this.state.currentPage++;
      this.updateTable();
    }
  },

  // Get filtered entries
  getFilteredEntries() {
    const visitors = DashboardData.cache.visitors || [];
    const parking = DashboardData.cache.parking || [];
    const entries = [
      ...visitors.map(v => ({ ...v, type: 'visitor' })),
      ...parking.map(p => ({ ...p, type: 'parking' }))
    ];
    return this.filterEntries(entries);
  },

  // Filter and update table
  filterAndUpdateTable() {
    this.state.currentPage = 1;
    this.updateTable();
  },

  // Clear all filters
  clearFilters() {
    this.state.searchTerm = '';
    this.state.filterType = 'all';
    document.getElementById('searchInput').value = '';
    document.getElementById('filterType').value = 'all';
    this.filterAndUpdateTable();
    this.showToast('Filters cleared', 'info');
  },

  // Toggle select all
  toggleSelectAll(checked) {
    const checkboxes = document.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.checked = checked;
      const rowId = checkbox.dataset.id;
      if (checked) {
        this.state.selectedItems.add(rowId);
      } else {
        this.state.selectedItems.delete(rowId);
      }
    });
    this.updateBulkActions();
  },

  // Update bulk actions visibility
  updateBulkActions() {
    const bulkActions = document.getElementById('bulkActions');
    const count = this.state.selectedItems.size;
    
    if (count > 0) {
      bulkActions.classList.add('show');
      document.getElementById('bulkSelectionCount').textContent = `${count} selected`;
    } else {
      bulkActions.classList.remove('show');
    }
  },

  // Clear selection
  clearSelection() {
    this.state.selectedItems.clear();
    document.getElementById('selectAll').checked = false;
    document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = false);
    this.updateBulkActions();
    this.updateTable();
  },

  // Bulk export
  bulkExport() {
    const selectedIds = Array.from(this.state.selectedItems);
    this.showToast(`Exporting ${selectedIds.length} items...`, 'info');
    // Implementation would go here
  },

  // Bulk delete
  bulkDelete() {
    const selectedIds = Array.from(this.state.selectedItems);
    if (confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      this.showToast(`Deleting ${selectedIds.length} items...`, 'warning');
      // Implementation would go here
      this.clearSelection();
    }
  },

  // Toggle export menu
  toggleExportMenu() {
    const menu = document.getElementById('exportMenu');
    menu.classList.toggle('open');
  },

  // Close export menu
  closeExportMenu() {
    document.getElementById('exportMenu').classList.remove('open');
  },

  // Handle export
  handleExport(format) {
    this.closeExportMenu();
    this.showToast(`Exporting as ${format.toUpperCase()}...`, 'info');
    // Implementation would go here
  },

  // Open quick actions modal
  openQuickActions() {
    document.getElementById('modalOverlay').classList.add('show');
  },

  // Close modal
  closeModal() {
    document.getElementById('modalOverlay').classList.remove('show');
  },

  // Handle quick actions
  handleQuickAction(action) {
    this.closeModal();
    switch (action) {
      case 'add-visitor':
        window.location.href = 'visitor.html';
        break;
      case 'add-parking':
        window.location.href = 'parking.html';
        break;
      case 'generate-qr':
        this.showToast('QR generation feature coming soon', 'info');
        break;
      case 'view-reports':
        this.showToast('Reports feature coming soon', 'info');
        break;
    }
  },

  // Show toast notification
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type] || icons.info}</div>
      <div class="toast-content">
        <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">×</button>
    `;

    container.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    });
  },

  // Initialize sparklines
  initializeSparklines() {
    this.updateSparklines();
  },

  // Update sparklines with sample data
  updateSparklines() {
    const sparklines = [
      { id: 'visitorsSparkline', data: this.generateSparklineData(7) },
      { id: 'parkingSparkline', data: this.generateSparklineData(7) },
      { id: 'todaySparkline', data: this.generateSparklineData(7) },
      { id: 'todayParkingSparkline', data: this.generateSparklineData(7) }
    ];

    sparklines.forEach(({ id, data }) => {
      const svg = document.getElementById(id);
      if (svg) {
        this.drawSparkline(svg, data);
      }
    });
  },

  // Generate sample sparkline data
  generateSparklineData(days) {
    return Array.from({ length: days }, () => Math.floor(Math.random() * 20) + 5);
  },

  // Draw sparkline
  drawSparkline(svg, data) {
    const width = 100;
    const height = 40;
    const padding = 2;
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    path.setAttribute('points', points);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    svg.innerHTML = '';
    svg.appendChild(path);
  },

  // Handle keyboard shortcuts
  handleKeyboardShortcuts(e) {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'r':
          e.preventDefault();
          this.refreshUI();
          break;
        case 'a':
          e.preventDefault();
          document.getElementById('selectAll').click();
          break;
        case 'f':
          e.preventDefault();
          document.getElementById('searchInput').focus();
          break;
      }
    }
  }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  DashboardUI.init().catch(console.error);
});
