import api from '@/lib/axios';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '@/types';

export const UserService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async getByUsername(username: string): Promise<User> {
    const response = await api.get<User>(`/users/username/${username}`);
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await api.post<User>('/users/ajouter', data);
    return response.data;
  },

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  async findByRole(role: UserRole): Promise<User[]> {
    const response = await api.get<User[]>(`/users/role/${role}`);
    return response.data;
  },

  async getTeachers(): Promise<User[]> {
    return this.findByRole('teacher');
  },
};
