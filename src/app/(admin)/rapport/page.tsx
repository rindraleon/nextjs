
"use client"
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { ReportService, StockItem , StockReport,MealsReport, AttendanceReport} from "@/services/rapport";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

// Options de menu pour le filtre des repas
const menuOptions = [
  { value: "Standard - Riz au poulet", label: "Riz au poulet (Standard)" },
  { value: "Standard - Pâtes au bœuf", label: "Pâtes au bœuf (Standard)" },
  { value: "Standard - Poisson et pommes de terre", label: "Poisson et pommes de terre (Standard)" },
  { value: "Vegetarian - Sauté de légumes", label: "Sauté de légumes (Végétarien)" },
  { value: "Vegetarian - Curry de lentilles", label: "Curry de lentilles (Végétarien)" },
  { value: "Vegetarian - Pâtes aux légumes", label: "Pâtes aux légumes (Végétarien)" },
  { value: "Halal - Riz au poulet halal", label: "Riz au poulet halal (Halal)" },
  { value: "Halal - Kebab d’agneau", label: "Kebab d’agneau (Halal)" },
  { value: "Halal - Ragoût de pois chiches", label: "Ragoût de pois chiches (Halal)" },
  { value: "Others - Bol de quinoa végan", label: "Bol de quinoa végan (Autres)" },
  { value: "Others - Pâtes sans gluten", label: "Pâtes sans gluten (Autres)" },
  { value: "Others - Salade de haricots mélangés", label: "Salade de haricots mélangés (Autres)" },
];

// Fonction pour formater les dates en français (dd/mm/yyyy)
const formatDate = (dateInput: string | Date): string => {
  let date: Date;
  
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }
  
  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    return "Date invalide";
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Card component amélioré pour thème clair/sombre
const ReportCard = ({ title, value, className = "" }: { title: string; value: string | number; className?: string }) => (
  <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}>
    <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);
// Types pour les rapports
interface StudentReport {
  studentId: number;
  student: string;
  presentCount: number;
  absentCount: number;
  justifiedCount: number;
  attendanceRate: number;
}

interface DailyMealReport {
  date: string;
  totalMeals: number;
  menu: string;
  mealsByType: Record<string, number>;
}

export default function Rapports() {
  const [reportType, setReportType] = useState<'attendance' | 'meals' | 'stock'>('attendance');
  const [attendanceReport, setAttendanceReport] = useState<AttendanceReport | null>(null);
  const [mealsReport, setMealsReport] = useState<MealsReport | null>(null);
  const [stockReport, setStockReport] = useState<StockReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | undefined>();
  const [classes, setClasses] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    classId: '',
    startDate: '',
    endDate: '',
    search: '',
    movementType: 'ALL',
    mealType: '',
    page: 1,
    pageSize: 10
  });

  const [newReport, setNewReport] = useState({
    type: 'presence' as 'presence' | 'repas' | 'stock',
    data: {} as any
  });

  // Charger les classes disponibles
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await ReportService.getClasses();
        setClasses(classesData);
      } catch (error) {
        //toast.error("Erreur lors du chargement des classes");
      }
    };
    fetchClasses();
  }, []);

  // Charger les rapports
  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (reportType === 'attendance' && filters.classId) {
          const report = await ReportService.getAttendanceReport(
            filters.classId,
            filters.startDate,
            filters.endDate
          );
          setAttendanceReport(report);
        } else if (reportType === 'meals') {
          const report = await ReportService.getMealsReport(
            filters.startDate,
            filters.endDate,
            filters.mealType
          );
          
          // Ajouter un menu fictif pour chaque jour (pour la démo)
          const reportWithMenu = {
            ...report,
            dailyReports: report.dailyReports.map((daily, index) => ({
              ...daily,
              menu: menuOptions[index % menuOptions.length].value
            }))
          };
          
          setMealsReport(reportWithMenu);
        } else if (reportType === 'stock') {
          const report = await ReportService.getStockReport(
            filters.movementType,
            filters.startDate,
            filters.endDate
          );
          setStockReport(report);
        }
      } catch (error) {
        console.error("Erreur lors du chargement du rapport:", error);
      }
    };

    fetchReport();
  }, [reportType, filters]);


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  // Vérifier si les dates sont vides pour désactiver les boutons
  const areDatesEmpty = filters.startDate === '' || filters.endDate === '';
  const isAttendanceDisabled = areDatesEmpty || filters.classId === '';

  // Calcul des totaux pour les cartes
  const getReportSummary = () => {
    switch (reportType) {
      case 'attendance':
        if (!attendanceReport) return [];
        const totalStudents = attendanceReport.students.length;
        const totalPresent = attendanceReport.students.reduce((sum, s) => sum + s.presentCount, 0);
        const totalAbsent = attendanceReport.students.reduce((sum, s) => sum + s.absentCount, 0);
        const avgRate = attendanceReport.students.reduce((sum, s) => sum + s.attendanceRate, 0) / totalStudents;
        
        return [
          { title: "Élèves", value: totalStudents },
          { title: "Présences", value: totalPresent },
          { title: "Absences", value: totalAbsent },
          { title: "Taux moyen", value: `${avgRate.toFixed(2)}%` }
        ];
      
      case 'meals':
        if (!mealsReport) return [];
        const totalMeals = mealsReport.dailyReports.reduce((sum, r) => sum + r.totalMeals, 0);
        const mealTypes = new Set<string>();
        mealsReport.dailyReports.forEach(r => {
          Object.keys(r.mealsByType).forEach(type => mealTypes.add(type));
        });
        
        // Formater la période correctement
        const period = mealsReport.startDate && mealsReport.endDate
          ? `${formatDate(mealsReport.startDate)} - ${formatDate(mealsReport.endDate)}`
          : "Toutes dates";
        
        return [
          { title: "Jours", value: mealsReport.dailyReports.length },
          { title: "Repas total", value: totalMeals },
          { title: "Types de repas", value: mealTypes.size },
          { title: "Période", value: period }
        ];
      
      case 'stock':
        if (!stockReport) return [];
        // Formater la période correctement
        const stockPeriod = filters.startDate && filters.endDate
          ? `${formatDate(filters.startDate)} - ${formatDate(filters.endDate)}`
          : "Toutes dates";
        
        return [
          { title: "Articles", value: stockReport.totalItems },
          { title: "Faible stock", value: stockReport.lowStockItems.length },
          { title: "Mouvements", value: stockReport.movements?.length || 0 },
          { title: "Période", value: stockPeriod }
        ];
      
      default:
        return [];
    }
  };

  const summaryCards = getReportSummary();

  // Pagination et filtrage avec tri décroissant
  const getPaginatedData = () => {
    switch (reportType) {
      case 'attendance':
        const attendanceData = attendanceReport?.students || [];
        // Trier par taux de présence décroissant
        return [...attendanceData].sort((a, b) => b.attendanceRate - a.attendanceRate);
      
      case 'meals':
        const mealsData = mealsReport?.dailyReports || [];
        // Trier par date décroissante
        return [...mealsData].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      
      case 'stock':
        const stockData = stockReport?.items?.filter(item => 
          item.name.toLowerCase().includes(filters.search.toLowerCase())
        ) || [];
        // Trier par quantité décroissante
        return [...stockData].sort((a, b) => b.quantity - a.quantity);
      
      default:
        return [];
    }
  };

  const paginatedData = getPaginatedData();
  const totalItems = paginatedData.length;
  const totalPages = Math.ceil(totalItems / filters.pageSize) || 1;
  const currentPageData = paginatedData.slice(
    (filters.page - 1) * filters.pageSize,
    filters.page * filters.pageSize
  );

  return (
    <div>
      <div>
      {/* <Toaster position="top-right" /> */}
      {/* <PageBreadcrumb pageTitle="Rapports" /> */}
      
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-2">
        {/* En-tête avec sélecteur de rapport */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestion des Rapports</h2>
          
          <div className="flex gap-4">
            <Button
              variant={reportType === 'attendance' ? 'primary' : 'outline'}
              onClick={() => setReportType('attendance')}
              disabled={isAttendanceDisabled}
              className={isAttendanceDisabled ? "opacity-50 cursor-not-allowed" : ""}
            >
              Présence
            </Button>
            <Button
              variant={reportType === 'meals' ? 'primary' : 'outline'}
              onClick={() => setReportType('meals')}
              disabled={areDatesEmpty}
              className={areDatesEmpty ? "opacity-50 cursor-not-allowed" : ""}
            >
              Repas
            </Button>
            <Button
              variant={reportType === 'stock' ? 'primary' : 'outline'}
              onClick={() => setReportType('stock')}
              disabled={areDatesEmpty}
              className={areDatesEmpty ? "opacity-50 cursor-not-allowed" : ""}
            >
              Stock
            </Button>
          </div>
        </div>

        {/* Cartes de résumé */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <ReportCard 
              key={index} 
              title={card.title} 
              value={card.value} 
              className="dark:bg-gray-800 dark:border-gray-700"
            />
          ))}
        </div>

        {/* Filtres spécifiques au rapport */}
        <div className="bg-white rounded-lg shadow p-2 mb-8 dark:bg-gray-800 dark:border dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(reportType === 'attendance' || reportType === 'meals' || reportType === 'stock') && (
              <>
                <div>
                  <Label>Date de début</Label>
                  <Input
                    type="date"
                    name="startDate"
                    defaultValue={filters.startDate}
                    onChange={handleFilterChange}
                    className="dark:bg-gray-700"
                  />
                </div>
                <div>
                  <Label>Date de fin</Label>
                  <Input
                    type="date"
                    name="endDate"
                    defaultValue={filters.endDate}
                    onChange={handleFilterChange}
                    className="dark:bg-gray-700"
                  />
                </div>
              </>
            )}

            {reportType === 'attendance' && (
              <div>
                <Label>Classe</Label>
                <select
                  name="classId"
                  value={filters.classId}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90"
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map(classe => (
                    <option key={classe.id} value={classe.id}>
                      {classe.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {reportType === 'meals' && (
              <div>
                <Label>Menu du jour</Label>
                <select
                  name="mealType"
                  value={filters.mealType}
                  onChange={handleFilterChange}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90"
                >
                  <option value="">Tous les menus</option>
                  {menuOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {reportType === 'stock' && (
              <>
                <div>
                  <Label>Type de mouvement</Label>
                  <select
                    name="movementType"
                    value={filters.movementType}
                    onChange={handleFilterChange}
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-700 dark:text-white/90"
                  >
                    <option value="ALL">Tous</option>
                    <option value="IN">Entrées</option>
                    <option value="OUT">Sorties</option>
                  </select>
                </div>
                <div>
                  <Label>Recherche</Label>
                  <Input
                    type="text"
                    name="search"
                    placeholder="Rechercher un article"
                    defaultValue={filters.search}
                    onChange={handleFilterChange}
                    className="dark:bg-gray-700"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tableau de données */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                {reportType === 'attendance' && (
                  <>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Étudiant</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Présences</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Absences</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Justifiés</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Taux</TableCell>
                  </>
                )}
                {reportType === 'meals' && (
                  <>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Date</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Total Repas</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Détails par type</TableCell>
                  </>
                )}
                {reportType === 'stock' && (
                  <>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Article</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Quantité</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Unité</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Seuil</TableCell>
                    <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Actions</TableCell>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentPageData.length > 0 ? (
                currentPageData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {reportType === 'attendance' && (
                      <>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StudentReport).student}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StudentReport).presentCount}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StudentReport).absentCount}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StudentReport).justifiedCount}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StudentReport).attendanceRate}%
                        </TableCell>
                      </>
                    )}
                    {reportType === 'meals' && (
                      <>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {formatDate((item as DailyMealReport).date)}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as DailyMealReport).totalMeals}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as DailyMealReport).menu}
                        </TableCell>
                      </>
                    )}
                    {reportType === 'stock' && (
                      <>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StockItem).name}
                        </TableCell>
                        <TableCell className={`px-5 py-3 font-medium text-start text-theme-xm dark:text-gray-400 
                          ${(item as StockItem).quantity <= ((item as StockItem).threshold || 0) ? 'text-red-500 font-bold' : ''}`}>
                          {(item as StockItem).quantity}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StockItem).unit}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          {(item as StockItem).threshold || '-'}
                        </TableCell>
                        <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item as StockItem);
                              setIsModalOpen(true);
                            }}
                          >
                            Détails
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Affichage de {(filters.page - 1) * filters.pageSize + 1} à{' '}
            {Math.min(filters.page * filters.pageSize, totalItems)} sur {totalItems} éléments
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              Précédent
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, filters.page - 2)) + i;
              return page <= totalPages ? (
                <Button
                  key={page}
                  variant={filters.page === page ? 'primary' : 'outline'}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ) : null;
            })}
            
            <Button
              variant="outline"
              disabled={filters.page >= totalPages}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de détails du stock */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        className="max-w-3xl"
      >
        <div className="bg-white p-6 rounded-lg dark:bg-gray-800">
          <h3 className="text-xl font-bold mb-4">Détails du stock: {selectedItem?.name}</h3>
          
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                  <h4 className="font-medium text-gray-500 dark:text-gray-400">Stock actuel</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                  <h4 className="font-medium text-gray-500 dark:text-gray-400">Seuil d'alerte</h4>
                  <p className="text-2xl font-bold mt-1 dark:text-white">
                    {selectedItem.threshold || 'Non défini'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
                  <h4 className="font-medium text-gray-500 dark:text-gray-400">Statut</h4>
                  <p className={`text-2xl font-bold mt-1 ${
                    selectedItem.threshold && selectedItem.quantity <= selectedItem.threshold 
                      ? 'text-red-500' 
                      : 'text-green-500'
                  }`}>
                    {selectedItem.threshold && selectedItem.quantity <= selectedItem.threshold 
                      ? 'Stock faible' 
                      : 'Stock suffisant'}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 dark:text-white">Historique des mouvements</h4>
                <div className="border rounded-lg overflow-hidden dark:border-gray-700">
                  <Table>
                    <TableHeader className="bg-gray-50 dark:bg-gray-700">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Date</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Type</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Quantité</TableCell>
                        <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">Raison</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockReport?.movements?.filter(m => m.itemId === selectedItem.id).map((movement, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">{movement.date}</TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              movement.type === 'IN' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {movement.type === 'IN' ? 'Entrée' : 'Sortie'}
                            </span>
                          </TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">{movement.quantity} {selectedItem.unit}</TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400">{movement.reason}</TableCell>
                        </TableRow>
                      )) || (
                        <TableRow>
                          <TableCell className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xm dark:text-gray-400" colSpan={4} className="text-center py-4 text-gray-500">
                            Aucun mouvement enregistré
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
    </div>
  );
}
