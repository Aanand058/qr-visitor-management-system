// Dashboard Configuration
const DashboardConfig = {
    // API endpoints
    endpoints: {
      visitors: '/api/visitor',
      parking: '/api/parking',
      dashboard: '/api/dashboard'
    },
    
    // Refresh intervals (in milliseconds)
    refreshIntervals: {
      data: 30000,      // 30 seconds
      charts: 60000,    // 1 minute
      stats: 15000      // 15 seconds
    },
    
    // Chart colors (matches your CSS variables)
    chartColors: {
      primary: '#667eea',
      secondary: '#764ba2',
      success: '#32b8c6',
      warning: '#e68161',
      error: '#ff5459',
      surface: '#fcfcf9'
    },
    
    // Chart options
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 750,
        easing: 'easeInOutQuart'
      }
    }
  };
  
  
// ✅ Don’t export, just attach globally
window.DashboardConfig = DashboardConfig;