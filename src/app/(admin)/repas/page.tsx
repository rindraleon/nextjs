"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import { RepasService } from "@/services/repas";
import toast, { Toaster } from "react-hot-toast";
import { Repas as RepasType } from "@/types";
import { RepasModal } from "@/components/repas/RepasModal";
import { SearchAndFilter } from "@/components/repas/RepasSearchAndFilter";
import { ActionButtons } from "@/components/repas/RepasAddButton";
import { DeleteConfirmationModal } from "@/components/repas/RepasDeleteModal";
import { RepasTable } from "@/components/repas/RepasTable";
import Pagination from "@/components/common/Pagination";


export default function Repas() {
  const [tableData, setTableData] = useState<RepasType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    totalPresence: "",
    date: new Date().toISOString().split("T")[0],
    menuName: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [repasFilter, setRepasFilter] = useState("All");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [repasToDelete, setRepasToDelete] = useState<RepasType | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRepasData();
  }, []);

  const fetchRepasData = async () => {
    try {
      const data = await RepasService.getAll();
      const transformedData = data.map((item: any) => ({
        id: item.id,
        student: item.student || undefined,
        menuName: item.menuName || item.type,
        ingredients: item.ingredients,
        date: item.date,
        isManual: !item.student,
        totalPresence: item.totalPresence
      }));
      setTableData(transformedData);
    } catch (error) {
      showToast('Erreur lors du chargement des repas', 'error');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(message, { 
        position: 'top-right',
        duration: 3000,
        style: { background: '#4caf50', color: 'white', marginTop: '80px' }
      });
    } else {
      toast.error(message, { 
        position: 'top-right',
        duration: 5000,
        style: { background: '#f44336', color: 'white', marginTop: '80px' }
      });
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      if (!formData.date) {
        showToast('La date est obligatoire', 'error');
        return;
      }
      
      if (!formData.menuName) {
        showToast('Veuillez sélectionner un menu', 'error');
        return;
      }
      
      if (isManualMode) {
        if (!formData.totalPresence || parseInt(formData.totalPresence) <= 0) {
          showToast('Le nombre de présences doit être supérieur à 0', 'error');
          return;
        }
      } else {
        if (!formData.studentId) {
          showToast("L'ID de l'étudiant est obligatoire", 'error');
          return;
        }
      }

      const data: any = {
        date: formData.date,
        menuName: formData.menuName,
      };
      
      if (isManualMode) {
        data.totalPresence = parseInt(formData.totalPresence);
      } else {
        data.studentId = parseInt(formData.studentId);
      }
      
      if (editId) {
        await RepasService.update(editId, data);
        showToast('Repas modifié avec succès');
      } else {
        const result = await RepasService.create(data, isManualMode);
        
        if (result.alerts && result.alerts.length > 0) {
          result.alerts.forEach((alert: string) => showToast(alert, 'error'));
          showToast('Repas créé avec alertes de stock', 'error');
        } else {
          showToast(isManualMode ? 'Repas manuel créé avec succès' : 'Repas créé avec succès');
        }
      }
      
      await fetchRepasData();
      setIsModalOpen(false);
      resetForm();
    } catch (error: any) {
      showToast(`Erreur: ${error.message}`, 'error');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({ 
      studentId: "", 
      totalPresence: "", 
      date: new Date().toISOString().split("T")[0],
      menuName: "" 
    });
    setEditId(null);
    setIsManualMode(false);
  };

  const handleEdit = (repas: RepasType) => {
    setEditId(repas.id);
    setFormData({
      studentId: repas.student?.id?.toString() || repas.studentId?.toString() || "",
      totalPresence: repas.totalPresence?.toString() || "",
      date: repas.date,
      menuName: repas.menuName,
    });
    setIsManualMode(repas.isManual || false);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await RepasService.delete(id);
      fetchRepasData();
      showToast("Repas supprimé avec succès !");
    } catch (error) {
      showToast("Erreur lors de la suppression du repas.", 'error');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredData = tableData.filter((repas) => {
    const searchLower = searchTerm.toLowerCase();
    
    if (repasFilter === "type") {
      return repas.menuName.toLowerCase().includes(searchLower);
    } else if (repasFilter === "nom") {
      if (repas.isManual) {
        return "Repas Manuel".toLowerCase().includes(searchLower);
      }
      return repas.student ? 
        `${repas.student.firstName} ${repas.student.lastName}`.toLowerCase().includes(searchLower) : 
        false;
    }
    
    return (
      repas.menuName.toLowerCase().includes(searchLower) ||
      (repas.isManual ? 
        "Repas Manuel".toLowerCase().includes(searchLower) : 
        (repas.student ? 
          `${repas.student.firstName} ${repas.student.lastName}`.toLowerCase().includes(searchLower) : 
          false)
    ));
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <Toaster position="top-right" />
      <PageBreadcrumb pageTitle="Gestion des Repas" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <div className="mx-auto w-full py-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
              Tous ({filteredData.length})
            </h2>

            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterValue={repasFilter}
              onFilterChange={setRepasFilter}
            />

            <ActionButtons
              onAddManual={() => {
                setEditId(null);
                resetForm();
                setIsManualMode(true);
                setIsModalOpen(true);
              }}
              onAddSpecialized={() => {
                setEditId(null);
                resetForm();
                setIsManualMode(false);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => repasToDelete && handleDelete(repasToDelete.id)}
        />

        <RepasModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isManualMode={isManualMode}
          formData={formData}
          editId={editId}
          onInputChange={handleInputChange}
          onSubmit={handleAddOrUpdate}
          onResetForm={resetForm}
        />

        <RepasTable
          data={paginatedData}
          onEdit={handleEdit}
          onDelete={(repas) => {
            setRepasToDelete(repas);
            setIsDeleteModalOpen(true);
          }}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}