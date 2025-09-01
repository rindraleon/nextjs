import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Student, Presence } from "@/types";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  attendances: Presence[];
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  student,
  attendances,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
    <div className="p-6">
      <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Présences de {student?.firstName} {student?.lastName} (7 derniers jours)
      </h4>
      {attendances.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">Aucune présence enregistrée pour les 7 derniers jours.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Date</TableCell>
              <TableCell isHeader>Statut</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendances.map((attendance) => (
              <TableRow key={attendance.id}>
                <TableCell>{new Date(attendance.date).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  {attendance.status === "present" 
                    ? "Présent" 
                    : attendance.status === "absent" 
                      ? "Absent" 
                      : "En retard"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  </Modal>
);

export default AttendanceModal;