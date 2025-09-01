
import api from '@/lib/axios';
import { Student, CreateStudentDto, UpdateStudentDto } from '@/types';
import axios from 'axios';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'; 


export const StudentService = {

  getAllStudents: async () => {
    try {
      const response = await api.get('/student');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Échec de la récupération des étudiants : ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Erreur inconnue lors de la récupération des étudiants');
    }
  },

  getStudentById: async (id: string) => {
    try {
      const response = await api.get(`/student/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Échec de la récupération de l'étudiant ${id} : ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error(`Erreur inconnue pour l'étudiant ${id}`);
    }
  },

  create: async (studentData: {
    firstName: string;
    lastName: string;
    dateNaiss: string;
    dietaryRegime: string;
    classId: string;
  }) => {
    try {
      const payload = {
        ...studentData,
        dateNaiss: new Date(studentData.dateNaiss).toISOString(),
      };
      const response = await api.post('/student/add', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Échec de la création de l'étudiant : ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error('Erreur inconnue lors de la création de l\'étudiant');
    }
  },

  updateStudent: async (id: string, studentData: {
    firstName?: string;
    lastName?: string;
    dateNaiss?: string;
    dietaryRegime?: string;
    classId?: number;
  }) => {
    try {
      const payload = {
        ...studentData,
        dateNaiss: studentData.dateNaiss ? new Date(studentData.dateNaiss).toISOString() : undefined,
      };
      const response = await api.put(`/student/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Échec de la mise à jour de l'étudiant ${id} : ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error(`Erreur inconnue lors de la mise à jour de l'étudiant ${id}`);
    }
  },

  deleteStudent: async (id: string) => {
    try {
      await api.delete(`/student/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Échec de la suppression de l'étudiant ${id} : ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error(`Erreur inconnue lors de la suppression de l'étudiant ${id}`);
    }
  },

  getStudentsByClass: async (classId: string) => {
    try {
      const response = await api.get(`/student/class/${classId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Échec de la récupération des étudiants pour la classe ${classId} : ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error(`Erreur inconnue pour la classe ${classId}`);
    }
  },

  getStudentAttendance: async (studentId: string) => {
    try {
      const response = await api.get(`/student/${studentId}/attendance`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Échec de la récupération des présences pour l'étudiant ${studentId} : ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }
      throw new Error(`Erreur inconnue lors de la récupération des présences pour l'étudiant ${studentId}`);
    }
  },


};
