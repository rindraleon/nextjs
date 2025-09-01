import { Unite, MovementType, StockMovement } from "@/types";

export interface Stock {
  id: number;
  name: string;
  quantity: number;
  unite: Unite;
  alertThreshold: number;
  createdAt: string;
}

export class StockService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  static async getAllItems(): Promise<Stock[]> {
    const response = await fetch(`${this.baseUrl}/stock-items`);
    if (!response.ok) throw new Error('Failed to fetch stock items');
    return response.json();
  }

  static async createItem(data: {
    name: string;
    quantity: number;
    unite: Unite;
    alertThreshold: number;
  }): Promise<Stock> {
    const response = await fetch(`${this.baseUrl}/stock-items/ajout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create stock item');
    return response.json();
  }

  static async createMovement(data: {
    itemId: number;
    quantity: number;
    type: MovementType;
    reason?: string;
  }): Promise<StockMovement> {
    const response = await fetch(`${this.baseUrl}/stock-mouvements/ajout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create stock movement');
    }
    return response.json();
  }

  static async getItemHistory(itemId: number): Promise<StockMovement[]> {
    const response = await fetch(`${this.baseUrl}/stock-mouvements/item/${itemId}`);
    if (!response.ok) throw new Error('Failed to fetch stock history');
    return response.json();
  }

  static async updateItem(id: string, data: {
    name?: string;
    quantity?: string;
    unite?: Unite;
    alertThreshold?: string;
    type?: MovementType;
  }): Promise<Stock> {
    // Update stock item
    const itemResponse = await fetch(`${this.baseUrl}/stock-items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        unite: data.unite,
        quantity: data.quantity,
        alertThreshold: data.alertThreshold ? parseFloat(data.alertThreshold) : undefined,
      }),
    });

    if (!itemResponse.ok) {
      throw new Error('Failed to update stock item');
    }

    const item: Stock = await itemResponse.json();

    // Create new movement if quantity or type is provided
    if (data.quantity && data.type) {
      const movementResponse = await fetch(`${this.baseUrl}/stock-movements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          quantity: parseFloat(data.quantity),
          type: data.type,
        }),
      });

      if (!movementResponse.ok) {
        throw new Error('Failed to create stock movement');
      }
    }

    return { ...item, createdAt: new Date().toISOString() };
  }

  static async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/stock-items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete stock item');
  }
}