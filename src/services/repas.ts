const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const RepasService = {
  async getAll(): Promise<any[]> {
    const response = await fetch(`${BASE_URL}/repas`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération des repas");
    return response.json();
  },

  async create(data: any, isManual: boolean): Promise<any> {
    try {
      // Préparer le payload selon ce que le backend attend
      const payload = {
        ...data,
        isManual: isManual
      };
      
      console.log("Envoi des données au backend:", payload);
      
      const response = await fetch(`${BASE_URL}/repas/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la création du repas");
      }
      
      return response.json();
    } catch (error) {
      console.error("Erreur dans RepasService.create:", error);
      throw error;
    }
  },

  async update(id: number, data: any): Promise<any> {
    const response = await fetch(`${BASE_URL}/repas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour du repas");
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/repas/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression du repas");
  },

  async generateDailyMeals(date: string): Promise<any> {
    const response = await fetch(`${BASE_URL}/repas/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });
    if (!response.ok) throw new Error("Erreur lors de la génération des repas");
    return response.json();
  },
};