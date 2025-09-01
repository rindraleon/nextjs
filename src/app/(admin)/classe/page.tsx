"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/button/Button";
import { ClassService } from "@/services/classe";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClassTable from "@/components/classe/ClasseTable";
import DeleteClassModal from "@/components/classe/DeleteClassModal";
import AddEditClassModal from "@/components/classe/AddEditClasseModal";
import SearchAndAdd from "@/components/classe/SearchAddModal";

interface Class {
  id: string;
  name: string;
  description?: string;
}

export default function ClassPage() {
  const [tableData, setTableData] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ClassService.getAll();
        setTableData(data);
      } catch (error) {
        console.error("Erreur lors du chargement des classes :", error);
        toast.error("Erreur lors du chargement des classes");
      }
    };
    fetchData();
  }, []);

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError("Le nom de la classe est requis");
      return false;
    }
    if (formData.name.length > 50) {
      setFormError("Le nom de la classe ne doit pas dépasser 50 caractères");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleAddOrUpdate = async () => {
    if (!validateForm()) return;

    try {
      if (editId) {
        await ClassService.update(editId, formData);
        toast.success("Classe modifiée avec succès");
      } else {
        await ClassService.create(formData);
        toast.success("Classe ajoutée avec succès");
      }
      const data = await ClassService.getAll();
      setTableData(data);
      setIsModalOpen(false);
      setFormData({ name: "" });
      setEditId(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      toast.error("Erreur lors de l'enregistrement de la classe");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await ClassService.delete(deleteId);
      setTableData(tableData.filter((classe) => classe.id !== deleteId));
      toast.success("Classe supprimée avec succès");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (error: any) {
      console.error("Erreur lors de la suppression :", error);
      toast.error(error.message || "Erreur lors de la suppression de la classe");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (classe: Class) => {
    setEditId(classe.id);
    setFormData({ name: classe.name || "" });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredData = tableData.filter((classe) =>
    classe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageBreadcrumb pageTitle="Page Classe" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <SearchAndAdd
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          openModal={() => {
            setEditId(null);
            setFormData({ name: "" });
            setFormError(null);
            setIsModalOpen(true);
          }}
          itemCount={filteredData.length}
        />
        
        <AddEditClassModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          formError={formError}
          handleSubmit={handleAddOrUpdate}
          isEdit={!!editId}
        />
        
        <DeleteClassModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          handleDelete={handleDelete}
        />
        
        <ClassTable 
          data={paginatedData} 
          onEdit={handleEdit} 
          onDelete={(id) => {
            setDeleteId(id);
            setIsDeleteModalOpen(true);
          }}
        />

        

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