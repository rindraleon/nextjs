"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import LogsService from "@/services/logs";
import React, { useState, useEffect } from "react";

// Defining interface for Log data
interface Log {
  id: string;
  user: { username: string; name: string } | null;
  action: string;
  createdAt: string;
  message: string;
  details: any;
}

export default function Journal() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;
  
  // État pour le filtre global
  const [globalFilter, setGlobalFilter] = useState("");
  const [globalActionFilter, setGlobalActionFilter] = useState("All");

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        // On demande un grand nombre d'éléments pour tout charger
        const data = await LogsService.getLogs({ limit: 10000 });
        
        // Tri par date décroissante
        const sortedData = [...data].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setLogs(sortedData);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Date invalide";
    }
  };

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Filtrage avec recherche unifiée
  const filteredData = logs.filter((log) => {
    // Filtre par action
    const matchesAction = globalActionFilter === "All" ||
      (globalActionFilter === "CREATE" && log.action === "CREATE") ||
      (globalActionFilter === "UPDATE" && log.action === "UPDATE") ||
      (globalActionFilter === "DELETE" && log.action === "DELETE");
    
    // Si le filtre global est vide, on retourne seulement le filtre d'action
    if (globalFilter === "") {
      return matchesAction;
    }
    
    // Filtre global: cherche dans le nom d'utilisateur, le type d'action, la date et le message
    const searchTerm = normalizeString(globalFilter);
    
    // Vérification du nom d'utilisateur
    const matchesUsername = (
      (log.user?.username && normalizeString(log.user.username).includes(searchTerm)) ||
      (log.user?.name && normalizeString(log.user.name).includes(searchTerm))
    );
    
    // Vérification du type d'action
    const actionText = 
      log.action === "CREATE" ? "ajout" : 
      log.action === "UPDATE" ? "modification" : 
      log.action === "DELETE" ? "suppression" : log.action;
    const matchesActionText = normalizeString(actionText).includes(searchTerm);
    
    // Vérification de la date
    const formattedDate = formatDate(log.createdAt);
    const matchesDate = normalizeString(formattedDate).includes(searchTerm);
    
    // Vérification du message
    const matchesMessage = normalizeString(log.message).includes(searchTerm);
    
    return matchesAction && (matchesUsername || matchesActionText || matchesDate || matchesMessage);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setGlobalFilter("");
    setGlobalActionFilter("All");
    setCurrentPage(1);
  };

  // Helper pour les couleurs des actions
  const getActionColor = (action: string) => {
    return action === "CREATE" 
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
      : action === "UPDATE" 
        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
        : action === "DELETE" 
          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" 
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  // Helper pour le texte des actions
  const getActionText = (action: string) => {
    return action === "CREATE" ? "Ajout" : 
      action === "UPDATE" ? "Modification" : 
      action === "DELETE" ? "Suppression" : action;
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Journal d'activité" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-6">
        <div className="mx-auto w-full py-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Tous les historiques ({filteredData.length})
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* Champ de recherche global unique */}
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg className="fill-gray-500 dark:fill-gray-400" width="20" height="20" viewBox="0 0 20 20">
                    <path d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z" />
                  </svg>
                </span>
                <Input
                  type="text"
                  placeholder="Rechercher dans le journal..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={globalActionFilter}
                  onChange={(e) => setGlobalActionFilter(e.target.value)}
                  className="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 w-full md:w-auto"
                >
                  <option value="All">Toutes les actions</option>
                  <option value="CREATE">Ajout</option>
                  <option value="UPDATE">Modification</option>
                  <option value="DELETE">Suppression</option>
                </select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="h-11"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] mt-4">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[900px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                      Utilisateur
                    </TableCell>
                    <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                      Action
                    </TableCell>
                    <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                      Date
                    </TableCell>
                    <TableCell isHeader className="px-5 py-1 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                      Détails
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-4 py-1 text-center">
                        <div className="flex justify-center items-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-4 py-1 text-center">
                        <div className="py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Aucun résultat trouvé</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Essayez de modifier vos filtres de recherche
                          </p>
                          <div className="mt-6">
                            <Button onClick={resetFilters}>Réinitialiser les filtres</Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <TableCell className="px-2 py-1 sm:px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {(log.user?.username || log.user?.name || 'Système').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                {log.user?.username || log.user?.name || 'Système'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-4 py-1 text-start">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                            {getActionText(log.action)}
                          </span>
                        </TableCell>
                        <TableCell className="px-4 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {formatDate(log.createdAt)}
                        </TableCell>
                        <TableCell className="px-4 py-1 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {log.message}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} sur {filteredData.length} éléments
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant="outline"
                disabled={currentPage === 1 || isLoading}
                onClick={() => handlePageChange(currentPage - 1)}
                className="min-w-[100px]"
              >
                Précédent
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return pageNum > 0 && pageNum <= totalPages ? (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "primary" : "outline"}
                    disabled={isLoading}
                    onClick={() => handlePageChange(pageNum)}
                    className="w-10 h-10 p-0 flex items-center justify-center"
                  >
                    {pageNum}
                  </Button>
                ) : null;
              })}
              
              <Button
                variant="outline"
                disabled={currentPage === totalPages || isLoading || totalPages === 0}
                onClick={() => handlePageChange(currentPage + 1)}
                className="min-w-[100px]"
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}