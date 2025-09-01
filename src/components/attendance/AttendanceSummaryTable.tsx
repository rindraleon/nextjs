import React from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";

interface AttendanceSummary {
  classId: number;
  className: string;
  presentCount: number;
  absentCount: number;
  date: string;
}

type AttendanceSummaryTableProps = {
  attendanceSummary: AttendanceSummary[];
  currentDate: string;
  onEdit: (classId: string) => void;
  onDelete: (classInfo: ClassInfo) => void;
};

export default function AttendanceSummaryTable({
  attendanceSummary,
  currentDate,
  onEdit,
  onDelete,
}: AttendanceSummaryTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                Nom de la classe
                </TableCell>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Date

              </TableCell>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Présents

              </TableCell>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Absents

              </TableCell>
              <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Actions
                
              </TableCell>
            </TableRow>
          </TableHeader>
          
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {attendanceSummary.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Aucune donnée pour {formatDate(currentDate)}
                </TableCell>
              </TableRow>
            ) : (
              attendanceSummary.map(summary => (
                <TableRow key={`${summary.classId}-${summary.date}`}>
                  <TableCell className="px-4 py-1 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {summary.className}
                  </TableCell>
                  <TableCell className="px-4 py-1 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {formatDate(summary.date)}
                  </TableCell>
                  <TableCell className="px-4 py-1 text-gray-800 text-center text-theme-sm dark:text-white/90">
                  {summary.presentCount}
                    </TableCell>
                  <TableCell className="px-4 py-1 text-gray-800 text-center text-theme-sm dark:text-white/90">
                    {summary.absentCount}
                  </TableCell>
                  <TableCell className="px-4 py-1 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(String(summary.classId))}
                        className="text-blue-500 hover:text-blue-700"
                        title="Modifier"
                      >
                        {/* Icône d'édition */}
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                              />
                            </svg>
                      </button>
                      <button
                        onClick={() => onDelete({ 
                          id: String(summary.classId), 
                          name: summary.className 
                        })}
                        className="text-red-500 hover:text-red-700"
                        title="Supprimer"
                      >
                        {/* Icône de suppression */}
                        <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.75 3C6.75 2.58579 7.08579 2.25 7.5 2.25H10.5C10.9142 2.25 11.25 2.58579 11.25 3V4.5H14.25C14.6642 4.5 15 4.83579 15 5.25C15 5.66421 14.6642 6 14.25 6H13.5V13.5C13.5 14.3284 12.8284 15 12 15H6C5.17157 15 4.5 14.3284 4.5 13.5V6H3.75C3.33579 6 3 5.66421 3 5.25C3 4.83579 3.33579 4.5 3.75 4.5H6.75V3ZM6 6V13.5H12V6H6ZM9 8.25C9.41421 8.25 9.75 8.58579 9.75 9V11.25C9.75 11.6642 9.41421 12 9 12C8.58579 12 8.25 11.6642 8.25 11.25V9C8.25 8.58579 8.58579 8.25 9 8.25Z"
                              />
                            </svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
