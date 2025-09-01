import {  Presence } from '@/types';

const BASE_URL = 'http://localhost:8000';

export interface CreateAttendanceDto {
  studentId: string;
  classId: string;
  status: 'present' | 'absent' | 'justified';
  date: string;
  justification?: string;
}

export interface UpdateAttendanceDto {
  status: 'present' | 'absent' | 'justified';
  justification?: string;
}

export const PresenceService = {
  async getAll(date?: string): Promise<Presence[]> {
    const url = date ? `${BASE_URL}/presences?date=${date}` : `${BASE_URL}/presences`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch presences: ${response.statusText} (Status: ${response.status}, URL: ${url})`);
    }
    return response.json();
  },

  async getById(id: string): Promise<Presence> {
    const response = await fetch(`${BASE_URL}/presences/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch presence by ID: ${response.statusText}`);
    }
    return response.json();
  },

  async create(data: CreateAttendanceDto): Promise<Presence> {
    const response = await fetch(`${BASE_URL}/presences/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create presence: ${response.statusText}`);
    }
    return response.json();
  },

  async update(id: string, data: UpdateAttendanceDto): Promise<Presence> {
    const response = await fetch(`${BASE_URL}/presences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update presence: ${response.statusText}`);
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/presences/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to delete presence: ${response.statusText}`);
    }
  },

  async getDailyAttendance(classId: string, date: string): Promise<Presence[]> {
    const response = await fetch(`${BASE_URL}/presences/daily?classId=${classId}&date=${date}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch daily attendance: ${response.statusText}`);
    }
    return response.json();
  },

  async getStudentAttendance(studentId: string): Promise<Presence[]> {
    const response = await fetch(`${BASE_URL}/presences/student/${studentId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch student attendance: ${response.statusText}`);
    }
    return response.json();
  },

  async getClassAttendanceSummary(date: string): Promise<{ classId: number, className: string, presentCount: number, absentCount: number }[]> {
    const response = await fetch(`${BASE_URL}/presences/summary?date=${date}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch class attendance summary: ${response.statusText}`);
    }
    return response.json();
  },
};