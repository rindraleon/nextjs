"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDownIcon, EyeCloseIcon, EyeIcon, UserCircleIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo, useState } from "react";
import { UserService } from '@/services/user';
import { User, UserRole } from '@/types';

// Toast notification
function Toast({ message, type, onClose }: { message: string; type: 'success'|'error'; onClose: () => void }) {
  return (
    <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded shadow-lg text-white ${type==='success'?'bg-green-600':'bg-red-600'}`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

export default function Utilisateur() {
  const [tableData, setTableData] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [errors, setErrors] = useState<Partial<Record<keyof User, string>>>({});
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{message:string,type:'success'|'error'}|null>(null);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contact: "",
    role: "",
    isActive: true,
    username:"",

  });

    const router= useRouter();

  // Fetch users from API
  useEffect(() => {
    UserService.getAll()
      .then(setTableData)
      .catch(() => setToast({ message: "Erreur de chargement des utilisateurs", type: "error" }));
  }, []);


  const filteredData = tableData.filter((user) => {
    const statusMatch =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && user.isActive) ||
      (statusFilter === 'Inactif' && !user.isActive);
    const search = searchTerm.toLowerCase();
    return statusMatch && (
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof User, string>> = {};
    if (!formData.firstName) newErrors.firstName = "Le nom est requis";
    if (!formData.lastName) newErrors.lastName = "Le prénom est requis";
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email est invalide";
    }
    if (!formData.contact) {
      newErrors.contact = "Le contact téléphonique est requis";
    } else if (!/^\+?\d{10,}$/.test(formData.contact)) {
      newErrors.contact = "Le numéro de téléphone est invalide";
    }
    if (!editId && !formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (!editId && formData.password && formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    } else if (!["admin", "teacher", "canteen_manager"].includes(formData.role)) {
      newErrors.role = "Le rôle sélectionné est invalide";
    }
    if (!formData.username) {
      newErrors.username = "Le nom d'utilisateur est requis"
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Memoize isFormValid to prevent re-renders
  const isFormValid = useMemo(() => {
    const newErrors: Partial<Record<keyof User, string>> = {};
    if (!formData.firstName) newErrors.firstName = "Le nom est requis";
    if (!formData.lastName) newErrors.lastName = "Le prénom est requis";
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email est invalide";
    }
    if (!formData.contact) {
      newErrors.contact = "Le contact téléphonique est requis";
    } else if (!/^\+?\d{10,}$/.test(formData.contact)) {
      newErrors.contact = "Le numéro de téléphone est invalide";
    }
    if (!editId && !formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (!editId && formData.password && formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    } else if (!["admin", "teacher", "canteen_manager"].includes(formData.role)) {
      newErrors.role = "Le rôle sélectionné est invalide";
    }

    return Object.keys(newErrors).length === 0;
  }, [formData, editId]);



  const handleAddOrUpdate = async () => {
    if (!validateForm()) {
      setToast({ message: "Veuillez corriger les erreurs dans le formulaire", type: "error" });
      return;
    }

    try {
      const formattedData = {
        ...formData,
        firstName: formData.firstName?.toUpperCase(),
        lastName: formData.lastName
          ? formData.lastName.charAt(0).toUpperCase() + formData.lastName.slice(1).toLowerCase()
          : "",
        isActive: formData.isActive ?? true,
      };

      if (editId) {
        await UserService.update(editId, formattedData);
        setToast({ message: "Utilisateur modifié avec succès", type: "success" });
      } else {
        await UserService.create(formattedData);
        setToast({ message: "Utilisateur ajouté avec succès", type: "success" });
      }
      const users = await UserService.getAll();
      setTableData(users);
      setIsModalOpen(false);
      setFormData({ firstName: "", lastName: "", email: "", password: "", contact: "", role: "", isActive: true });
      setErrors({});
      setEditId(null);
    } catch (e: any) {
      const errorMessage = e.response?.data?.message || e.message || "Erreur lors de la sauvegarde";
      setToast({ message: errorMessage, type: "error" });
      // Modal stays open on error
    }
  };


  const handleEdit = (user: User) => {
    setEditId(user.id);
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      contact: user.contact || "",
      role: user.role || "",
      password: user.password || "",
      isActive: user.isActive ?? true,
      username: user.username || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await UserService.delete(userToDelete);
      setTableData(tableData.filter((user) => user.id !== userToDelete));
      setToast({ message: 'Utilisateur supprimé avec succès', type: 'success' });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch {
      setToast({ message: 'Erreur lors de la suppression', type: 'error' });
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  

  const options = [
    { value: "admin", label: "Administrateur" },
    { value: "teacher", label: "Enseignant" },
    { value: "canteen_manager", label: "Responsable de cantine" },
  ];

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData, role: value as UserRole
    });
    console.log("Selected value:", value);
  };
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Page Utilisateur" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <div className="mx-auto w-full py-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-8">
          <h2 className="text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 
            hover:text-gray-800 dark:border-gray-700  dark:text-gray-400 dark:hover:bg-white/[0.03] 
            dark:hover:text-gray-200 lg:inline-flex lg:w-auto">Tous les utilisateurs ( {filteredData.length} )</h2>

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
                  xmlns="http://www.w3.org/2000/svg"
                  >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
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
                <option value="All">Tous les statuts</option>
                  <option value="Active">Actif</option>
                  <option value="Inactif">Inactif</option>
              </select>
              </div>
            </div>
            

            <button
              onClick={() => {
                setEditId(null);
                setFormData({ firstName: '', lastName: '', email: '', password: '', contact: '', role: '', isActive: true, username: '' });
                setErrors({});
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
            </button>
          </div>

        </div>

        {/* Modal */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={()=>setToast(null)} />}

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-[640px] m-4">
      
        <div className="no-scrollbar relative w-full max-w-[640px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14 mt-2">
            <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
            {editId ? "Modifier" : "Ajouter"} un utilisateur
            </h4>           
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-auto overflow-y-auto px-2 pb-3 mt-4">
              <div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Votre nom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Saisir votre nom"
                      defaultValue={formData.firstName}
                      onChange={(e)=> setFormData({ ...formData, firstName: e.target.value})}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Votre prénom<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="lname"
                      name="lname"
                      placeholder="Saisir votre prénom"
                      defaultValue={formData.lastName}
                      onChange={(e)=> setFormData({ ...formData, lastName: e.target.value})}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Contact téléphonique<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="+261 3..."
                      defaultValue={formData.contact}
                      onChange={(e)=> setFormData({ ...formData, contact: e.target.value})}
                    />
                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      Nom d'utilsateur<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="Username"
                      defaultValue={formData.username}
                      onChange={(e)=> setFormData({ ...formData, username: e.target.value})}
                    />
                    {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                  </div>


                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>Rôle</Label>
                    <div className="relative">
                      <Select
                        options={options}
                        placeholder="Selectionner le role"
                        onChange={handleSelectChange}
                        defaultValue= {formData.role}
                        className="dark:bg-dark-900"
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon/>
                      </span>
                    </div>
                    {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                  </div>

                  

                  <div className="sm:col-span-1">
                    <Label>
                      Statut<span className="text-error-500">*</span>
                    </Label>
                    <Select
                    id="isActive"
                    value={formData.isActive ? "active" : "inactive"}
                    onChange={(value) => setFormData({ ...formData, isActive: value === "active" })}
                    options={[
                      { value: "active", label: "Actif" },
                      { value: "inactive", label: "Inactif" },
                    ]}
                  />
                  {errors.isActive && <p className="text-red-500 text-sm mt-1">{errors.isActive}</p>}

                  </div>


                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                    Votre adresse Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Votre email"
                    defaultValue={formData.email}
                      onChange={(e)=> setFormData({ ...formData, email: e.target.value})}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label>
                    Votre mot de pass<span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Enter your password"
                        defaultValue={formData.password}
                        onChange={(e)=> setFormData({ ...formData, password: e.target.value})}
                        type={showPassword ? "text" : "password"}
                        className={errors.password ? "border-red-500" : ""}
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddOrUpdate}>{editId ? "Modifier" : "Ajouter"}</Button>
            </div>
          </form>
        </div>
      </Modal>
      

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} className="max-w-[400px] m-4">
          <div className="relative w-full max-w-[400px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
            <h4 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
              Confirmer la suppression
            </h4>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
          
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[900px]">
            <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Nom Complet
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Adresse email
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Contact
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Statut
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Role
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedData.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="px-2 py-1 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 py-2 overflow-hidden rounded-full">
                              <UserCircleIcon />
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {user.firstName?.toUpperCase()} {user.lastName ? user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1).toLowerCase() : ''}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                {user.username}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.email}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.contact}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={user.isActive ? "success" : "error"}
                          >
                            {user.isActive ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {user.role}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z" fill="" />
                              </svg>
                            </button>
                            <button onClick={() => openDeleteModal(user.id)} className="text-red-600 hover:text-red-800">
                              <svg className="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.75 3C6.75 2.58579 7.08579 2.25 7.5 2.25H10.5C10.9142 2.25 11.25 2.58579 11.25 3V4.5H14.25C14.6642 4.5 15 4.83579 15 5.25C15 5.66421 14.6642 6 14.25 6H13.5V13.5C13.5 14.3284 12.8284 15 12 15H6C5.17157 15 4.5 14.3284 4.5 13.5V6H3.75C3.33579 6 3 5.66421 3 5.25C3 4.83579 3.33579 4.5 3.75 4.5H6.75V3ZM6 6V13.5H12V6H6ZM9 8.25C9.41421 8.25 9.75 8.58579 9.75 9V11.25C9.75 11.6642 9.41421 12 9 12C8.58579 12 8.25 11.6642 8.25 11.25V9C8.25 8.58579 8.58579 8.25 9 8.25Z" fill="" />
                              </svg>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </div>
          </div>
        </div>

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
