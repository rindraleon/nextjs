
export default class LogsService {
    private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    static async getLogs(params: Record<string, any> = {}) {
    try {
        const query = new URLSearchParams(params).toString();
        const res = await fetch(`${this.baseUrl}/logs${query ? `?${query}` : ''}`);
        
        if(!res.ok) throw new Error(`Erreur API: ${res.status}`);
        
        // Correction ici : l'API retourne probablement un objet avec une propriété 'data'
        const response = await res.json();
        console.log('reponsessssssssssssssssssssssssss', response)
        return response.data || []; // Retourne le tableau de logs ou un tableau vide
    } catch (error) {
        console.error("Erreur de chargement des logs:", error);
        return [];
    }
}
}