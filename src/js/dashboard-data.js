
// Module to fetch and provide dashboard data
const DashboardData = {
  cache: {
    stats: null,
    visitors: [],
    parking: []
  },

  // Refresh all dashboard data
  async refreshAll() {
    await Promise.all([
      this.fetchStats(),
      this.fetchRecentEntries()
    ]);
  },

  // Fetch total and today stats
  async fetchStats() {
    try {
      const response = await fetch("/api/get-stats");
      const result = await response.json();

      if (result.success) {
        this.cache.stats = {
          visitors: {
            total: result.data.total.visitors,
            today: result.data.today.visitors
          },
          parking: {
            total: result.data.total.parking,
            today: result.data.today.parking
          },
          weekly: result.data.weekly,
          monthly: result.data.monthly
        };
      } else {
        console.error("Stats error:", result.error);
      }
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  },

  // Fetch recent entries for table
  async fetchRecentEntries(limit = 20) {
    try {
      const response = await fetch(`/api/get-recent?limit=${limit}`);
      const result = await response.json();

      if (result.success) {
        // Separate visitors and parking for convenience
        this.cache.visitors = result.data.filter(entry => entry.type === 'visitor');
        this.cache.parking = result.data.filter(entry => entry.type === 'parking');
      } else {
        console.error("Recent entries error:", result.error);
      }
    } catch (err) {
      console.error("Fetch recent entries error:", err);
    }
  },

  // Data for trends chart
  getTrendsData() {
    if (!this.cache.visitors.length && !this.cache.parking.length) return { labels: [], visitors: [], parking: [] };

    // Example: last 7 days
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const visitorsData = days.map(day =>
      this.cache.visitors.filter(v => v.visitDate === day).length
    );
    const parkingData = days.map(day =>
      this.cache.parking.filter(p => p.visitDate === day).length
    );

    return { labels: days, visitors: visitorsData, parking: parkingData };
  },

  // Data for distribution chart (total ratio)
  getDistributionData() {
    const visitorsCount = this.cache.visitors.length;
    const parkingCount = this.cache.parking.length;

    return {
      labels: ["Visitors", "Parking"],
      data: [visitorsCount, parkingCount]
    };
  }
};


