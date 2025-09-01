// src/app/(admin)/(others-pages)/eleve/page.tsx
"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useMemo, useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Select from "@/components/form/Select";
import { Class, DietaryRegime, Presence, Student } from "@/types";
import { StudentService } from "@/services/sutudent"; 
import { ClassService } from "@/services/classe";

// Toast notification component
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-8 right-6 z-50 px-4 py-10 rounded shadow-lg text-white ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

// Confirmation Modal component
function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] m-4">
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Confirmer la suppression</h4>
        <p className="mb-6 text-gray-600 dark:text-gray-400">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Supprimer
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// Nouvelle modale pour afficher les présences
function AttendanceModal({
  isOpen,
  onClose,
  student,
  attendances,
}: {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  attendances: Presence[];
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold text-center text-gray-800 dark:text-white/90">
          Présences pour le 7 derniers jours de :<br /> <br />
          {student?.firstName} {student?.lastName} 
        </h4>
        {attendances.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Aucune présence enregistrée pour les 7 derniers jours.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Date</TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Statut</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.map((attendance) => (
                <TableRow key={attendance.id}>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                    {new Date(attendance.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                  <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                    {attendance.status === "present" ? "Présent" : attendance.status === "absent" ? "Absent" : "En retard"}
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
}


export default function Eleve() {
  const [tableData, setTableData] = useState<Student[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    classId: "",
    dietaryRegime: "",
    dateNaiss: "",
  });
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    classId: "",
    dietaryRegime: "",
    dateNaiss: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [IsSubmitted, setIsSubmitted] = useState(false);
  const itemsPerPage = 10;
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Presence[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);


  // Fonction pour récupérer les présences
const handleViewAttendance = async (student: Student) => {
  try {
    const attendances = await StudentService.getStudentAttendance(student.id);
    setAttendanceData(attendances);
    setSelectedStudent(student);
    setIsAttendanceModalOpen(true);
  } catch (error) {
    setToast({
      message: error instanceof Error ? error.message : "Erreur lors de la récupération des présences",
      type: "error",
    });
  }
};


  // Fetch students and classes together to ensure data consistency
   useEffect(() => {
     const fetchData = async () => {
       try {
         const [students, classesData] = await Promise.all([
          StudentService.getAllStudents(),
          ClassService.getAll(),
        ]);

        // Convertir les classes en format {id: string, name: string}
        const formattedClasses = classesData.map(cls => ({
          ...cls,
          id: cls.id.toString()
        }));

        // Convertir les étudiants pour ajouter classId à partir de class.id
        const formattedStudents = students.map((student) => {
          const classId = student.class?.id?.toString() || "";
          return {
            ...student,
            classId,
            firstName: student.firstName?.toUpperCase() || "",
            lastName: student.lastName
              ? student.lastName.charAt(0).toUpperCase() + student.lastName.slice(1).toLowerCase()
              : "",
          };
        });

        setTableData(formattedStudents);
        setClasses(formattedClasses);

        // Set default classId
        if (formattedClasses.length > 0 && !formData.classId) {
          setFormData(prev => ({ ...prev, classId: formattedClasses[0].id }));
        }
         
       } catch (error) {
         console.error('Erreur lors du chargement des données :', error); // Ajout pour débogage
         setToast({
           message: error instanceof Error ? error.message : "Erreur lors du chargement des données",
           type: "error",
         });
       }
     };
     fetchData();
   }, []);


  // Form validation
  const validateForm = () => {
    const errors = {
      firstName: formData.firstName.trim() ? "" : "Le nom est requis",
      lastName: formData.lastName.trim() ? "" : "Le prénom est requis",
      classId: formData.classId.trim() ? "" : "La classe est requise",
      dietaryRegime: formData.dietaryRegime ? "" : "Le régime alimentaire est requis",
      dateNaiss: formData.dateNaiss ? "" : "La date de naissance est requise",
    };
    setFormErrors(errors);
    return Object.values(errors).every((error) => error === "");
  };

  

  const handleAddOrUpdate = async () => {
    setIsSubmitted(true);
      if (!validateForm()) {
      setToast({ message: "Veuillez remplir tous les champs requis", type: "error" });
      return;
    }

    try {
      const formattedData = {
        firstName: formData.firstName.toUpperCase(),
        lastName: formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1).toLowerCase(),
        classId: formData.classId,
        dietaryRegime: formData.dietaryRegime as DietaryRegime,
        dateNaiss: formData.dateNaiss,
      };

      let updatedStudent: Student;
      if (editId) {
        updatedStudent = await StudentService.updateStudent(editId, formattedData);
        
        // Mise à jour locale
        setTableData(prev => prev.map(s => 
          s.id === editId ? { ...updatedStudent, classId: formattedData.classId } : s
        ));
      } else {
        updatedStudent = await StudentService.create(formattedData);
        
        // Ajout local
        setTableData(prev => [
          ...prev, 
          { 
            ...updatedStudent,
            classId: formattedData.classId,
            firstName: formattedData.firstName,
            lastName: formattedData.lastName
          }
        ]);
      }
      setClasses(classesData);

      setIsModalOpen(false);
      setFormData({ firstName: "", lastName: "", dateNaiss: "", dietaryRegime: "", classId: classesData[0]?.id || "" });
      setEditId(null);
      setFormErrors({ firstName: "", lastName: "", classId: "", dietaryRegime: "", dateNaiss: "" });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Erreur lors de l'enregistrement de l'élève",
        type: "error",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await StudentService.deleteStudent(deleteId);
      setTableData(prev => prev.filter(student => student.id !== deleteId));
      setToast({ message: "Élève supprimé avec succès", type: "success" });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : "Erreur lors de la suppression de l'élève",
        type: "error",
      });
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (student: Student) => {
    setEditId(student.id);
    setFormData({
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      classId: student.classId || classes[0]?.id || "",
      dietaryRegime: student.dietaryRegime || "",
      dateNaiss: student.dateNaiss ? new Date(student.dateNaiss).toISOString().split("T")[0] : "",
    });
    setFormErrors({ firstName: "", lastName: "", classId: "", dietaryRegime: "", dateNaiss: "" });
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const dietaryOptions = [
    { value: "standard", label: "Régime standard" },
    { value: "vegetarian", label: "Végétarien" },
    { value: "vegan", label: "Végétalien" },
  ];

  const filteredData = useMemo(() => {
    return tableData.filter((student) => {
      const nameMatch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       student.lastName.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (statusFilter === "All") return nameMatch;
      
      if (statusFilter === "Class") {
        const className = classes.find(c => c.id === student.classId)?.name || "";
        return className.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      if (statusFilter === "Dietary") {
        return student.dietaryRegime?.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      return true;
    });
  }, [tableData, searchTerm, statusFilter, classes]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        message="Êtes-vous sûr de vouloir supprimer cet élève ?"
      />

      <PageBreadcrumb pageTitle="Gestion des Élèves" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <div className="mx-auto w-full py-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-8">
            <h2 className="text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
              Tous les élèves ( {filteredData.length} )
            </h2>

            {/* Filter Inputs */}
            <div className="flex gap-8">
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.Org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.01075 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <Input
                  type="text"
                  placeholder="Recherche..."
                  defaultValue={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[250px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                >
                  <option value="All">Tous les élèves</option>
                  <option value="Class">Classe</option>
                  <option value="Dietary">Régime alimentaire</option>
                </select>
              </div>
            </div>

            <Button
              onClick={() => {
                setEditId(null);
                setFormData({
                  firstName: "",
                  lastName: "",
                  dateNaiss: "",
                  dietaryRegime: "",
                  classId: classes[0]?.id || "",
                });
                setFormErrors({ firstName: "", lastName: "", classId: "", dietaryRegime: "", dateNaiss: "" });
                setIsModalOpen(true);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 4.5C9.41421 4.5 9.75 4.83579 9.75 5.25V8.25H12.75C13.1642 8.25 13.5 8.58579 13.5 9C13.5 9.41421 13.1642 9.75 12.75 9.75H9.75V12.75C9.75 13.1642 9.41421 13.5 9 13.5C8.58579 13.5 8.25 13.1642 8.25 12.75V9.75H5.25C4.83579 9.75 4.5 9.41421 4.5 9C4.5 8.58579 4.83579 8.25 5.25 8.25H8.25V5.25C8.25 4.83579 8.58579 4.5 9 4.5Z"
                  fill=""
                />
              </svg>
              Ajouter nouveau
            </Button>
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[600px] m-4">
          <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-2 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
                {editId ? "Modifier" : "Ajouter"} un élève
              </h4>
            </div>
            <form className="flex flex-col py-4">
              <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Nom de famille</Label>
                    <Input
                      id="firstName"
                      defaultValue={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        if (IsSubmitted) validateForm();
                      }}

                      placeholder="Nom de famille"
                      className={formErrors.firstName ? "border-red-500" : ""}
                    />
                    {formErrors.firstName && <p className="text-red-500 text-sm">{formErrors.firstName}</p>}
                  </div>

                  <div>
                    <Label>Prénom</Label>
                    <Input
                      id="lastName"
                      defaultValue={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        if (IsSubmitted) validateForm();
                      }}
                      placeholder="Prénom"
                      className={formErrors.lastName ? "border-red-500" : ""}
                    />
                    {formErrors.lastName && <p className="text-red-500 text-sm">{formErrors.lastName}</p>}
                  </div>

                  <div>
                    <Label>Date de naissance</Label>
                    <Input
                      id="dateNaiss"
                      defaultValue={formData.dateNaiss}
                      onChange={(e) => {
                        setFormData({ ...formData, dateNaiss: e.target.value });
                        if(IsSubmitted) validateForm();
                      }}
                      type="date"
                      className={formErrors.dateNaiss ? "border-red-500" : ""}
                    />
                    {formErrors.dateNaiss && <p className="text-red-500 text-sm">{formErrors.dateNaiss}</p>}
                  </div>

                  <div>
                    <Label>Classe</Label>
                    <select
                      id="classId"
                      value={formData.classId}
                      onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                      className={`w-full px-3 py-2 border rounded ${formErrors.classId ? "border-red-500" : "border-gray-200"}`}
                    >
                      <option value="">Sélectionner une classe</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.classId && <p className="text-red-500 text-sm">{formErrors.classId}</p>}
                  </div>

                  <div>
                    <Label>Régime alimentaire</Label>
                    <Select
                      options={dietaryOptions}
                      defaultValue={formData.dietaryRegime}
                      onChange={(value) => {
                        setFormData({ ...formData, dietaryRegime: value });
                        if (IsSubmitted) validateForm();
                      }}
                      placeholder="Choisir régime alimentaire"
                      className={formErrors.dietaryRegime ? "border-red-500" : ""}
                    />
                    {formErrors.dietaryRegime && <p className="text-red-500 text-sm">{formErrors.dietaryRegime}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleAddOrUpdate}
                  disabled={!validateForm}
                  className={validateForm ? "" : "opacity-50 cursor-not-allowed"}
                >
                  {editId ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </div>
        </Modal>

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
                  {paginatedData.map((student) => (
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
                        {dietaryOptions.find((opt) => opt.value === student.dietaryRegime)?.label || student.dietaryRegime}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {new Date(student.dateNaiss).toLocaleDateString("fr-FR")}
                      </TableCell>
                      

                      <TableCell className="px-1 py-1 text-gray-500 text-theme-sm dark:text-gray-400">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(student)}
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
                            onClick={() => handleViewAttendance(student)}
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
                            onClick={() => {
                              setDeleteId(student.id);
                              setIsDeleteModalOpen(true);
                            }}
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
        <AttendanceModal
          isOpen={isAttendanceModalOpen}
          onClose={() => setIsAttendanceModalOpen(false)}
          student={selectedStudent}
          attendances={attendanceData}
        />


        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div>
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} éléments
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Précédent
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}