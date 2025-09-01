"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { PresenceService } from "@/services/presence";
import ToastNotification from "@/components/common/ToastNoification";
import DeleteConfirmationModal from "@/components/modal/DeleteCormationModal";
import AttendanceInputTable from "@/components/attendance/AttendanceInputTable";
import AttendanceSummaryTable from "@/components/attendance/AttendanceSummaryTable";

const BASE_URL = 'http://localhost:8000';

export default function PresencePage() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [toast, setToast] = useState<ToastType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary[]>([]);
  const [presences, setPresences] = useState<Presence[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [classToDelete, setClassToDelete] = useState<ClassInfo | null>(null);

  // Fetch classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${BASE_URL}/classes`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        handleError("Erreur lors du chargement des classes", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch attendance data when date changes
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const [presenceData, summaryData] = await Promise.all([
          PresenceService.getAll(date),
          PresenceService.getClassAttendanceSummary(date),
        ]);
        
        setPresences(presenceData);
        setAttendanceSummary(summaryData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch (error) {
        handleError("Erreur lors du chargement des données", error);
      }
    };
    fetchAttendanceData();
  }, [date]);

  // Fetch students and attendance when class is selected
useEffect(() => {
  if (!selectedClassId) {
    setStudents([]);
    setAttendanceData([]);
    return;
  }

  const fetchStudentsAndAttendance = async () => {
    setIsLoading(true);
    try {
      const [studentsResponse, attendanceResponse] = await Promise.all([
        fetch(`${BASE_URL}/student/class/${selectedClassId}`),
        fetch(`${BASE_URL}/presences/daily?classId=${selectedClassId}&date=${date}`),
      ]);

      const studentsData = await studentsResponse.json();
      const attendanceData = await attendanceResponse.json();

      // Debug: Log API responses
      console.log("Students API response:", studentsData);
      console.log("Attendance API response:", attendanceData);

      // Convertir les IDs en chaînes de caractères pour la cohérence
      const studentsWithStringIds = studentsData.map((s: any) => ({
        ...s,
        id: String(s.id),
      }));

      setStudents(studentsWithStringIds);

      setAttendanceData(
        studentsWithStringIds.map((student: Student) => {
          const existingAttendance = attendanceData.find(
            (a: any) => String(a.student.id) === student.id
          );
          
          console.log(`Existing attendance for ${student.id}:`, existingAttendance);
          
          return {
            studentId: student.id,
            status: existingAttendance?.status || "absent",
            justification: existingAttendance?.justification || "",
            presenceId: existingAttendance?.id,
          };
        })
      );
    } catch (error) {
      handleError("Erreur lors du chargement des élèves", error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchStudentsAndAttendance();
}, [selectedClassId, date]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData(prev => prev.map(item => 
      item.studentId === studentId 
        ? { ...item, status, justification: status === "present" ? "" : item.justification } 
        : item
    ));
  };

  const handleJustificationChange = (studentId: string, justification: string) => {
    setAttendanceData((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, justification } : item))
    );
  };

  const handleSubmitAttendance = async () => {
    try {
      const recordsToCreate = attendanceData
        .filter(data => !data.presenceId)
        .map(data => ({
          studentId: data.studentId,
          classId: selectedClassId,
          status: data.status,
          date,
          justification: data.justification || undefined,
        }));
        console.log ('sttttttttttttttttttttttttttttt', recordsToCreate)
      const recordsToUpdate = attendanceData
        .filter(data => data.presenceId)
        .map(data => ({
          id: data.presenceId!,
          status: data.status,
          justification: data.justification || undefined,
        }));

      await Promise.all([
        ...recordsToCreate.map(PresenceService.create),
        ...recordsToUpdate.map(record => 
          PresenceService.update(String(record.id), record)
        ),
      ]);

      showToast(
        isEditing 
          ? "Présences mises à jour avec succès" 
          : "Présences enregistrées avec succès", 
        "success"
      );

      // Reset form
      const summary = await PresenceService.getClassAttendanceSummary(date);
      setAttendanceSummary(summary);
      setSelectedClassId("");
      setIsEditing(false);
    } catch (error) {
      handleError("Erreur lors de l'enregistrement", error);
    }
  };

  const handleEdit = (classId: string, presenceDate: string) => {
  setSelectedClassId(classId);
  setDate(presenceDate); // METTRE À JOUR LA DATE AVEC CELLE DE LA PRÉSENCE
  setIsEditing(true);
};

  const handleDelete = async () => {
    if (!classToDelete) return;
    
    try {
      const presencesToDelete = presences.filter(
        p => p.class.id === classToDelete.id && p.date === date
      );
      
      await Promise.all(
        presencesToDelete.map(p => PresenceService.delete(String(p.id)))
      );
      
      showToast("Présences supprimées avec succès", "success");
      
      const summary = await PresenceService.getClassAttendanceSummary(date);
      setAttendanceSummary(summary);
      setPresences(presences.filter(
        p => p.class.id !== classToDelete.id || p.date !== date
      ));
    } catch (error) {
      handleError("Erreur lors de la suppression", error);
    } finally {
      setClassToDelete(null);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleError = (message: string, error: any) => {
    console.error(message, error);
    const errorMsg = error instanceof Error ? error.message : "Erreur inconnue";
    showToast(`${message}: ${errorMsg}`, "error");
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Gestion des Présences" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <div className="mx-auto w-full py-2">
          {/* Header and filters */}
          <div className="flex flex-wrap items-center justify-between gap-8">
            <h2 className="text-lg font-medium text-gray-700 shadow-theme-xs dark:text-gray-400">
              Gestion des présences
            </h2>

            <div className="flex gap-8">
              <div>
                <Label>Classe</Label>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  defaultValue={date}
                  onChange={e => setDate(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Attendance input section */}
          {selectedClassId && (
            <AttendanceInputTable
              students={students}
              attendanceData={attendanceData}
              isLoading={isLoading}
              isEditing={isEditing}
              onStatusChange={handleStatusChange}
              onJustificationChange={handleJustificationChange}
              onCancel={() => {
                setSelectedClassId("");
                setIsEditing(false);
              }}
              onSubmit={handleSubmitAttendance}
            />
          )}
          
          {/* Attendance summary section */}
          <AttendanceSummaryTable 
            attendanceSummary={attendanceSummary}
            currentDate={date}
            onEdit={handleEdit}
            onDelete={(classInfo) => setClassToDelete(classInfo)}
          />
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <ToastNotification 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      {/* Delete confirmation modal */}
      {classToDelete && (
        <DeleteConfirmationModal
          className={classToDelete.name}
          onClose={() => setClassToDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

// Types
type Class = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  dateNaiss: string;
};

type AttendanceStatus = "present" | "absent" | "justified";

type AttendanceItem = {
  studentId: string;
  status: AttendanceStatus;
  justification?: string;
  presenceId?: number;
};

type AttendanceSummary = {
  classId: number;
  className: string;
  presentCount: number;
  absentCount: number;
  date: string;
};

type Presence = {
  id: number;
  student: Student;
  class: Class;
  date: string;
  status: AttendanceStatus;
  justification?: string;
};

type ToastType = {
  message: string;
  type: "success" | "error";
};

type ClassInfo = {
  id: string;
  name: string;
};
