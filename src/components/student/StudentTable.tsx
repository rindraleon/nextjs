import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Button from "@/components/ui/button/Button";
import { Class, Student } from "@/types";

interface StudentTableProps {
  data: Student[];
  classes: Class[];
  onEdit: (student: Student) => void;
  onViewAttendance: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({
  data,
  classes,
  onEdit,
  onViewAttendance,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Nom complet
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Classe
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Régime alimentaire
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Date de naissance
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {data.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="px-2 py-1 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {student.firstName} {student.lastName}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {classes.find((cls) => cls.id === student.classId)?.name || "N/A"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {student.dietaryRegime === "standard" 
                      ? "Régime standard" 
                      : student.dietaryRegime === "vegetarian" 
                        ? "Végétarien" 
                        : "Végétalien"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {new Date(student.dateNaiss).toLocaleDateString("fr-FR")}
                  </TableCell>
                  
                  <TableCell className="px-1 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => onEdit(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onViewAttendance(student)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 3C5.96243 3 3.17564 4.92893 1.75736 7.75736C0.339073 10.5858 0.339073 13.4142 1.75736 16.2426C3.17564 19.0711 5.96243 21 9 21C12.0376 21 14.8244 19.0711 16.2426 16.2426C17.6609 13.4142 17.6609 10.5858 16.2426 7.75736C14.8244 4.92893 12.0376 3 9 3ZM9 19C6.79086 19 4.85786 17.5858 3.75736 15.2426C2.65685 12.8995 2.65685 10.1005 3.75736 7.75736C4.85786 5.41421 6.79086 4 9 4C11.2091 4 13.1421 5.41421 14.2426 7.75736C15.3431 10.1005 15.3431 12.8995 14.2426 15.2426C13.1421 17.5858 11.2091 19 9 19ZM9 15C10.6569 15 12 13.6569 12 12C12 10.3431 10.6569 9 9 9C7.34315 9 6 10.3431 6 12C6 13.6569 7.34315 15 9 15Z"
                          />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.75 3C6.75 2.58579 7.08579 2.25 7.5 2.25H10.5C10.9142 2.25 11.25 2.58579 11.25 3V4.5H14.25C14.6642 4.5 15 4.83579 15 5.25C15 5.66421 14.6642 6 14.25 6H13.5V13.5C13.5 14.3284 12.8284 15 12 15H6C5.17157 15 4.5 14.3284 4.5 13.5V6H3.75C3.33579 6 3 5.66421 3 5.25C3 4.83579 3.33579 4.5 3.75 4.5H6.75V3ZM6 6V13.5H12V6H6ZM9 8.25C9.41421 8.25 9.75 8.58579 9.75 9V11.25C9.75 11.6642 9.41421 12 9 12C8.58579 12 8.25 11.6642 8.25 11.25V9C8.25 8.58579 8.58579 8.25 9 8.25Z"
                          />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StudentTable;