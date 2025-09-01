import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";


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


type AttendanceInputTableProps = {
  students: Student[];
  attendanceData: AttendanceItem[];
  isLoading: boolean;
  isEditing: boolean;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onJustificationChange: (studentId: string, justification: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function AttendanceInputTable({
  students,
  attendanceData,
  isLoading,
  isEditing,
  onStatusChange,
  onJustificationChange,
  onCancel,
  onSubmit,
}: AttendanceInputTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="mt-8">
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-200 mb-4">
        {isEditing ? "Modifier les présences" : "Saisie des présences"}
      </h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Élève</TableCell>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Date de naissance</TableCell>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Statut</TableCell>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Justification (si absent)</TableCell>
            </TableRow>
          </TableHeader>
          
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Aucun élève trouvé
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => {
                const attendance = attendanceData.find(a => a.studentId === student.id);
                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>
                      {formatDate(student.dateNaiss)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        {(["present", "absent", "justified"] as AttendanceStatus[]).map(status => (
                          <label key={status} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`status-${student.id}`}
                              checked={attendance?.status === status}
                              onChange={() => onStatusChange(student.id, status)}
                              className={`h-5 w-5 rounded border-gray-300 focus:ring-2 ${
                                status === "present" ? "text-green-500 focus:ring-green-500" :
                                status === "absent" ? "text-red-500 focus:ring-red-500" :
                                "text-yellow-500 focus:ring-yellow-500"
                              }`}
                            />
                            {status === "present" ? "Présent" : 
                             status === "absent" ? "Absent" : "Justifié"}
                          </label>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        defaultValue={attendance?.justification || ""}
                        onChange={e => onJustificationChange(student.id, e.target.value)}
                        disabled={attendance?.status === "present"}
                        placeholder="Raison de l'absence"
                        className="h-11"
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-6 flex justify-end gap-4">
        <Button onClick={onCancel} className="bg-gray-500 hover:bg-gray-600">
          Annuler
        </Button>
        {students.length > 0 && (
          <Button onClick={onSubmit}>
            {isEditing ? "Mettre à jour" : "Enregistrer"}
          </Button>
        )}
      </div>
    </div>
  );
}
