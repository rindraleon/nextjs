import api from '@/lib/axios';

interface Class {
  id: string;
  name: string;
  description?: string;
}

interface CreateClassDto {
  name: string;
}

interface UpdateClassDto {
  name?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const ClassService = {
  async getAll(): Promise<Class[]> {
    try {
      const response = await api.get<Class[]>('/classes');
      return response.data;
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw new Error('Failed to fetch classes. Please try again later.');
    }
  },

  async getById(id: string): Promise<Class> {
    try {
      const response = await api.get<Class>(`/classes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error);
      throw new Error(`Failed to fetch class ${id}.`);
    }
  },

  async create(data: CreateClassDto): Promise<Class> {
    try {
      const response = await api.post<Class>('/classes/add', data);
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw new Error('Failed to create class.');
    }
  },

  async update(id: string, data: UpdateClassDto): Promise<Class> {
    try {
      const response = await api.put<Class>(`/classes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating class ${id}:`, error);
      throw new Error(`Failed to update class ${id}.`);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/classes/${id}`);
    } catch (error: any) {
      console.error(`Error deleting class ${id}:`, error);
      throw new Error(error.response?.data?.message || `Failed to delete class ${id}.`);
    }
  },
};