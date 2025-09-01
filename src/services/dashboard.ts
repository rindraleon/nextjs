const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const DashboardService = {
  async getStats(): Promise<any> {
    try {
      const response = await fetch(`${BASE_URL}/dashboard`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: 'include' // Si vous utilisez des cookies d'authentification
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      // Transformez les données pour qu'elles correspondent à l'attente du frontend
      return {
        numUsers: data.users,
        numStudents: data.students,
        numClasses: data.classes,
        stock: data.stockQuantity,
        stockItems: data.stockItems,
        presenceRate: data.presenceRate,
        rateChange: data.rateChange,
        inscrit: data.inscrit,
        present: data.present,
        absent: data.absent,
        inscritChange: data.inscritChange,
        presentChange: data.presentChange,
        absentChange: data.absentChange
      };
      
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};