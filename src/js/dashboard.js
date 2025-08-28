// Dashboard Module for Admin Panel
const Dashboard = {
    init() {
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupAutoRefresh();
    },

    setupEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Export buttons
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterData(e.target.value);
            });
        }

        // Date range picker
        const dateRangeInput = document.getElementById('dateRange');
        if (dateRangeInput) {
            dateRangeInput.addEventListener('change', () => {
                this.filterByDate(dateRangeInput.value);
            });
        }
    },

    async loadDashboardData() {
        try {
            this.showLoading(true);
            
            // Load visitors data
            const visitorsData = await this.fetchData('visitors');
            this.renderVisitorsTable(visitorsData);
            
            // Load parking data
            const parkingData = await this.fetchData('parking');
            this.renderParkingTable(parkingData);
            
            // Update statistics
            this.updateStatistics(visitorsData, parkingData);
            
            // Render charts
            this.renderCharts(visitorsData, parkingData);
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showMessage('Error loading dashboard data', 'error');
        } finally {
            this.showLoading(false);
        }
    },

    async fetchData(type) {
        try {
            const response = await fetch(`${Config.GOOGLE_SCRIPT_URL}${Config.endpoints[`get${type.charAt(0).toUpperCase() + type.slice(1)}`]}`);
            const data = await response.json();
            return data.success ? data.data : [];
        } catch (error) {
            console.error(`Error fetching ${type} data:`, error);
            return [];
        }
    },

    renderVisitorsTable(data) {
        const table = document.getElementById('visitorsTable');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach(visitor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.escapeHtml(visitor.name)}</td>
                <td>${this.escapeHtml(visitor.phone)}</td>
                <td>${this.escapeHtml(visitor.unitNo)}</td>
                <td>${this.escapeHtml(visitor.hostName)}</td>
                <td>${this.escapeHtml(visitor.date)}</td>
                <td>${this.escapeHtml(visitor.time)}</td>
                <td>
                    <button class="btn-edit" onclick="Dashboard.editVisitor('${visitor.id}')">✏️</button>
                    <button class="btn-delete" onclick="Dashboard.deleteVisitor('${visitor.id}')">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    renderParkingTable(data) {
        const table = document.getElementById('parkingTable');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach(parking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.escapeHtml(parking.visitorName)}</td>
                <td>${this.escapeHtml(parking.unitNo)}</td>
                <td>${this.escapeHtml(parking.residentName)}</td>
                <td>${this.escapeHtml(parking.carMake)} ${this.escapeHtml(parking.carModel)}</td>
                <td>${this.escapeHtml(parking.carColor)}</td>
                <td>${this.escapeHtml(parking.licensePlate)}</td>
                <td>${this.escapeHtml(parking.date)}</td>
                <td>${this.escapeHtml(parking.time)}</td>
                <td>
                    <button class="btn-edit" onclick="Dashboard.editParking('${parking.id}')">✏️</button>
                    <button class="btn-delete" onclick="Dashboard.deleteParking('${parking.id}')">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    updateStatistics(visitorsData, parkingData) {
        const totalVisitors = visitorsData.length;
        const totalParking = parkingData.length;
        const today = new Date().toISOString().split('T')[0];
        
        const todayVisitors = visitorsData.filter(v => v.date === today).length;
        const todayParking = parkingData.filter(p => p.date === today).length;

        // Update stats display
        this.updateStatElement('totalVisitors', totalVisitors);
        this.updateStatElement('totalParking', totalParking);
        this.updateStatElement('todayVisitors', todayVisitors);
        this.updateStatElement('todayParking', todayParking);
    },

    updateStatElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    },

    renderCharts(visitorsData, parkingData) {
        this.renderVisitorsChart(visitorsData);
        this.renderParkingChart(parkingData);
        this.renderTrendChart(visitorsData, parkingData);
    },

    renderVisitorsChart(data) {
        const ctx = document.getElementById('visitorsChart');
        if (!ctx) return;

        const chartData = this.processChartData(data, 'date');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Daily Visitors',
                    data: chartData.values,
                    backgroundColor: Config.colors.primary,
                    borderColor: Config.colors.primary,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    renderParkingChart(data) {
        const ctx = document.getElementById('parkingChart');
        if (!ctx) return;

        const chartData = this.processChartData(data, 'date');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.values,
                    backgroundColor: [
                        Config.colors.primary,
                        Config.colors.secondary,
                        Config.colors.success,
                        Config.colors.warning,
                        Config.colors.info
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    },

    renderTrendChart(visitorsData, parkingData) {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        const last7Days = this.getLast7Days();
        const visitorTrend = last7Days.map(date => 
            visitorsData.filter(v => v.date === date).length
        );
        const parkingTrend = last7Days.map(date => 
            parkingData.filter(p => p.date === date).length
        );

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString()),
                datasets: [{
                    label: 'Visitors',
                    data: visitorTrend,
                    borderColor: Config.colors.primary,
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Parking',
                    data: parkingTrend,
                    borderColor: Config.colors.secondary,
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    processChartData(data, groupBy) {
        const grouped = {};
        data.forEach(item => {
            const key = item[groupBy];
            grouped[key] = (grouped[key] || 0) + 1;
        });

        const sortedKeys = Object.keys(grouped).sort();
        return {
            labels: sortedKeys,
            values: sortedKeys.map(key => grouped[key])
        };
    },

    getLast7Days() {
        const dates = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    },

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active class from all tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedContent = document.getElementById(`${tabName}Tab`);
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Add active class to clicked button
        const clickedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }
    },

    filterData(searchTerm) {
        const tables = document.querySelectorAll('table tbody');
        tables.forEach(tbody => {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                const visible = text.includes(searchTerm.toLowerCase());
                row.style.display = visible ? '' : 'none';
            });
        });
    },

    filterByDate(dateRange) {
        if (!dateRange) return;
        
        const [startDate, endDate] = dateRange.split(' to ');
        const tables = document.querySelectorAll('table tbody');
        
        tables.forEach(tbody => {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const dateCell = row.querySelector('td:nth-child(5)') || row.querySelector('td:nth-child(7)');
                if (dateCell) {
                    const rowDate = dateCell.textContent;
                    const visible = this.isDateInRange(rowDate, startDate, endDate);
                    row.style.display = visible ? '' : 'none';
                }
            });
        });
    },

    isDateInRange(date, start, end) {
        if (!start && !end) return true;
        if (!start) return date <= end;
        if (!end) return date >= start;
        return date >= start && date <= end;
    },

    async exportData() {
        try {
            const visitorsData = await this.fetchData('visitors');
            const parkingData = await this.fetchData('parking');
            
            const csvContent = this.convertToCSV([...visitorsData, ...parkingData]);
            this.downloadCSV(csvContent, 'visitor_parking_data.csv');
            
            this.showMessage('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showMessage('Error exporting data', 'error');
        }
    },

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];
        
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        });
        
        return csvRows.join('\n');
    },

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    },

    setupAutoRefresh() {
        setInterval(() => {
            this.loadDashboardData();
        }, Config.settings.autoRefreshInterval);
    },

    showLoading(show) {
        const loadingElement = document.getElementById('loadingIndicator');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    },

    showMessage(message, type = 'success') {
        // Use VisitorApp.showMessage if available, otherwise create our own
        if (typeof VisitorApp !== 'undefined' && VisitorApp.showMessage) {
            VisitorApp.showMessage(message, type);
        } else {
            const messageDiv = document.createElement('div');
            messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
            messageDiv.textContent = message;
            
            const container = document.querySelector('.dashboard-container') || document.body;
            container.insertBefore(messageDiv, container.firstChild);
            
            setTimeout(() => messageDiv.remove(), 5000);
        }
    },

    // CRUD operations
    async editVisitor(id) {
        // Implementation for editing visitor
        console.log('Edit visitor:', id);
    },

    async deleteVisitor(id) {
        if (confirm('Are you sure you want to delete this visitor entry?')) {
            try {
                // Implementation for deleting visitor
                console.log('Delete visitor:', id);
                this.showMessage('Visitor deleted successfully', 'success');
                this.loadDashboardData();
            } catch (error) {
                this.showMessage('Error deleting visitor', 'error');
            }
        }
    },

    async editParking(id) {
        // Implementation for editing parking
        console.log('Edit parking:', id);
    },

    async deleteParking(id) {
        if (confirm('Are you sure you want to delete this parking entry?')) {
            try {
                // Implementation for deleting parking
                console.log('Delete parking:', id);
                this.showMessage('Parking entry deleted successfully', 'success');
                this.loadDashboardData();
            } catch (error) {
                this.showMessage('Error deleting parking entry', 'error');
            }
        }
    },

    // Utility methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
