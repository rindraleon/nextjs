"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import toast, { Toaster } from "react-hot-toast";
import { StockService } from "@/services/stock";
import StockModal from "@/components/stock/StockModal";
import MovementModal from "@/components/stock/MouvementModal";
import DeleteModal from "@/components/stock/DeleteModal";
import HistoryModal from "@/components/stock/HistoryModal";
import ToastNotification from "@/components/common/ToastNoification";


// Interfaces
interface StockItem {
  id: number;
  name: string;
  quantity: number;
  unite: string;
  alertThreshold: number;
  createdAt: string;
}

interface StockMovement {
  id: number;
  item: StockItem;
  quantity: number;
  type: "IN" | "OUT";
  reason?: string;
  date: string;
  newQuantity: number; // Ajout de la nouvelle quantité après mouvement
}

export default function StockPage() {
  /// États principaux
  const [tableData, setTableData] = useState<StockItem[]>([]);
  const [historyData, setHistoryData] = useState<StockMovement[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("All");
  const itemsPerPage = 10;

  // États des modales
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [toast, setToast] = useState(null)

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await StockService.getAllItems();
        setTableData(data);
      } catch (error) {
        showToast("Erreur lors du chargement des stocks", "error");
      }
    };
    fetchData();
  }, []);

  // Afficher une notification toast avec marge
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Gérer la suppression d'un élément
  const handleDelete = async () => {
    if (deleteId === null) return;

    try {
      await StockService.deleteItem(deleteId);
      
      // Mise à jour optimisée sans recharger toute la page
      setTableData(prev => prev.filter(stock => stock.id !== deleteId));
      
      showToast("Stock supprimé avec succès", "success");
    } catch (error) {
      showToast("Erreur lors de la suppression du stock", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  // Gérer la visualisation de l'historique
  const handleViewHistory = async (itemId: number) => {
    try {
      const history = await StockService.getItemHistory(itemId);
      setHistoryData(history);
      setIsHistoryModalOpen(true);
    } catch (error) {
      showToast("Erreur lors du chargement de l'historique", "error");
    }
  };
  
  // Mettre à jour un stock existant
  const handleUpdateStock = async (id: number, updatedData: StockItem) => {
    try {
      // Mise à jour optimisée sans recharger toute la page
      setTableData(prev => prev.map(stock => 
        stock.id === id ? { ...stock, ...updatedData } : stock
      ));
      
      showToast("Stock mis à jour avec succès", "success");
    } catch (error) {
      showToast(`Erreur lors de la mise à jour: ${error.message}`, "error");
    }
  };

  // Gérer la création/mise à jour d'un mouvement
  const handleMovementCreated = (updatedStock: StockItem) => {
    // Mise à jour optimisée de la quantité du stock
    setTableData(prev => prev.map(stock => 
      stock.id === updatedStock.id ? updatedStock : stock
    ));
  };

  

  // Filtrer et paginer les données
  const filteredData = tableData.filter((stock) => {
    const nameMatch = stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const lowStockMatch = stockFilter === "low" ? stock.quantity <= stock.alertThreshold : true;
    return nameMatch && (stockFilter === "All" || lowStockMatch);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      {/* Toast notification */}
            {toast && (
              <ToastNotification 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(null)} 
              />
            )}
      <PageBreadcrumb pageTitle="Gestion des Stocks" />
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <div className="mx-auto w-full py-2">
          {/* En-tête avec filtres */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-gray-700 shadow-theme-xs dark:text-gray-400">
              Tous ({filteredData.length})
            </h2>

            <div className="flex gap-4">
              {/* Champ de recherche */}
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20">
                    <path d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Rechercher par nom..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[250px]"
                />
              </div>

              {/* Filtre de stock */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="All">Tous les stocks</option>
                <option value="low">Stock faible</option>
              </select>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setEditId(null);
                  setIsStockModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                Ajouter un stock
              </Button>
              <Button
                onClick={() => setIsMovementModalOpen(true)}
                className="flex items-center gap-2"
              >
                Ajouter un mouvement
              </Button>
            </div>
          </div>

          {/* Tableau des stocks */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
            <div className="max-w-full overflow-x-auto">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Nom du stock
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Quantité
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Seuil d'alerte
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Date de création
                      </TableCell>
                      <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {paginatedData.map((stock) => (
                      <TableRow key={stock.id}>
                        <TableCell className="px-2 py-1 sm:px-6 text-start">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {stock.name}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {stock.quantity} {stock.unite}
                          {stock.quantity <= stock.alertThreshold && (
                            <span className="text-red-600"> (Stock faible)</span>
                          )}
                        </TableCell>
                        
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {stock.alertThreshold}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {new Date(stock.createdAt).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setEditId(stock.id);
                              setIsStockModalOpen(true);
                            }} className="text-blue-600 hover:text-blue-800">
                              {/* Icône d'édition */}
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
                            <button onClick={() => {
                              setDeleteId(stock.id);
                              setIsDeleteModalOpen(true);
                            }} className="text-red-600 hover:text-red-800">
                              {/* Icône de suppression */}
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
                            <button onClick={() => handleViewHistory(stock.id)} className="text-green-600 hover:text-green-800">
                              {/* Icône d'historique */}
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
                                   d="M9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3ZM9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5ZM9.75 5.25C9.75 4.83579 9.41421 4.5 9 4.5C8.58579 4.5 8.25 4.83579 8.25 5.25V9C8.25 9.41421 8.58579 9.75 9 9.75H11.25C11.6642 9.75 12 9.41421 12 9C12 8.58579 11.6642 8.25 11.25 8.25H9.75V5.25Z"
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
              {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} stocks
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Précédent
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "primary" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSave={(result) => {
          if (editId) {
            // Mise à jour d'un stock existant
            handleUpdateStock(editId, result);
          } else {
            // Ajout d'un nouveau stock
            setTableData(prev => [...prev, result]);
            showToast("Stock créé avec succès", "success");
          }
        }}
        editId={editId}
        stockItems={tableData}
        showToast={showToast}
      />

      <MovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        onSave={handleMovementCreated}
        stockItems={tableData}
        showToast={showToast}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyData={historyData}
      />
    </div>
  );
}
