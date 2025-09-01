"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { EnvelopeIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { Metadata } from "next";
import React, { useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Blank Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Blank Page TailAdmin Dashboard Template",
// };

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

// Define the table data using the interface
const initialTableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: {
      images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"],
    },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: {
      images: ["/images/user/user-27.jpg"],
    },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

export default function BlankPage() {
  const [tableData, setTableData] = useState<Order[]>(initialTableData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    projectName: "",
    budget: "",
    status: "Active",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const itemsPerPage = 10;

  // Pagination logic
  const filteredData = tableData.filter(
    (order) =>
      (statusFilter === "All" || order.status === statusFilter) &&
      (order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddOrUpdate = () => {
    if (editId) {
      // Update existing order
      setTableData(
        tableData.map((order) =>
          order.id === editId
            ? {
                ...order,
                user: { ...order.user, name: formData.name, role: formData.role },
                projectName: formData.projectName,
                budget: formData.budget,
                status: formData.status,
              }
            : order
        )
      );
    } else {
      // Add new order
      const newOrder: Order = {
        id: tableData.length + 1,
        user: {
          image: "/images/user/user-default.jpg",
          name: formData.name,
          role: formData.role,
        },
        projectName: formData.projectName,
        team: { images: ["/images/user/user-default.jpg"] },
        budget: formData.budget,
        status: formData.status,
      };
      setTableData([...tableData, newOrder]);
    }
    setIsModalOpen(false);
    setFormData({ name: "", role: "", projectName: "", budget: "", status: "Active" });
    setEditId(null);
  };

  const handleEdit = (order: Order) => {
    setEditId(order.id);
    setFormData({
      name: order.user.name,
      role: order.user.role,
      projectName: order.projectName,
      budget: order.budget,
      status: order.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setTableData(tableData.filter((order) => order.id !== id));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const countries = [
    { code: "MAD", label: "+261" },
    
  ];
  const handlePhoneNumberChange = (phoneNumber: string) => {
    console.log("Updated phone number:", phoneNumber);
  };
  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <div>
      <PageBreadcrumb pageTitle="Page blanche" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <div className="mx-auto w-full py-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-8">
          <h2 className="text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 
            hover:text-gray-800 dark:border-gray-700  dark:text-gray-400 dark:hover:bg-white/[0.03] 
            dark:hover:text-gray-200 lg:inline-flex lg:w-auto">Tous ( {filteredData.length} )</h2>

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
                value={searchTerm}
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
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Cancel">Cancel</option>
              </select>
              </div>
            </div>
            

            <button
              onClick={() => {
                setEditId(null);
                setFormData({ name: "", role: "", projectName: "", budget: "", status: "Active" });
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

        <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen} className="max-w-[640px] m-4">
        <div className="no-scrollbar relative w-full max-w-[640px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-xl text-center font-semibold text-gray-800 dark:text-white/90">
            {editId ? "Modifier" : "Ajouter"} un enregistrement
            </h4>
            
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Nom</Label>
                    <Input
                      id="name"
                      defaultValue={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Rôle</Label>
                    <Input id="role"
                      defaultValue={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })} />
                  </div>

                  <div>
                    <Label>Nom du projet</Label>
                    <Input
                      id="projectName"
                      defaultValue={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Budget</Label>
                    <Input
                      id="budget"
                      defaultValue={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="col-span-2 h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nom de famille <span className="text-error-500">*</span>{" "}</Label>
                    <Input type="text" placeholder="Nom de famille" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>
                      Prénom <span className="text-error-500">*</span>{" "}
                      </Label>
                    <Input type="text" placeholder="Prénom" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>
                      Adresse Email
                      <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="info@gmail.com"
                        type="text"
                        className="pl-[62px]"
                      />
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        <EnvelopeIcon />
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Numéro Télephone</Label>
                      <PhoneInput
                      selectPosition="start"
                      countries={countries}
                      placeholder="+261 00 00 000 00"
                      onChange={handlePhoneNumberChange}
                    />
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

          
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[900px]">
            <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        User
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Project Name
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Team
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Status
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Budget
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedData.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="px-2 py-1 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 overflow-hidden rounded-full">
                              {/* <Image width={40} height={40} src={order.user.image} alt={order.user.name} /> */}
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {order.user.name}
                              </span>
                              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                {order.user.role}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {order.projectName}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex -space-x-2">
                            {order.team.images.map((teamImage, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900"
                              >
                                {/* <Image width={24} height={24} src={teamImage} alt={`Team member ${index + 1}`} className="w-full" /> */}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              order.status === "Active" ? "success" : order.status === "Pending" ? "warning" : "error"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {order.budget}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <div className="flex gap-2">
                            <button onClick={() => handleEdit(order)} className="text-blue-600 hover:text-blue-800">
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
                                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                                  fill=""
                                />
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-800">
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
                                  d="M6.75 3C6.75 2.58579 7.08579 2.25 7.5 2.25H10.5C10.9142 2.25 11.25 2.58579 11.25 3V4.5H14.25C14.6642 4.5 15 4.83579 15 5.25C15 5.66421 14.6642 6 14.25 6H13.5V13.5C13.5 14.3284 12.8284 15 12 15H6C5.17157 15 4.5 14.3284 4.5 13.5V6H3.75C3.33579 6 3 5.66421 3 5.25C3 4.83579 3.33579 4.5 3.75 4.5H6.75V3ZM6 6V13.5H12V6H6ZM9 8.25C9.41421 8.25 9.75 8.58579 9.75 9V11.25C9.75 11.6642 9.41421 12 9 12C8.58579 12 8.25 11.6642 8.25 11.25V9C8.25 8.58579 8.58579 8.25 9 8.25Z"
                                  fill=""
                                />
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
                  variant={currentPage === page ? "default" : "outline"}
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
