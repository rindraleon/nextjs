
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Interfaces
export interface StudentReport {
  student: string;
  presentCount: number;
  absentCount: number;
  justifiedCount: number;
  attendanceRate: number;
}

export interface AttendanceReport {
  className: string;
  startDate: string;
  endDate: string;
  students: StudentReport[];
}

export interface MealReport {
  date: string;
  totalMeals: number;
  mealsByType: Record<string, number>;
}

export interface MealsReport {
  startDate: string;
  endDate: string;
  dailyReports: MealReport[];
}

export interface StockItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  threshold?: number;
}

export interface StockMovement {
  id: number;
  date: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
}

export interface StockReport {
  totalItems: number;
  lowStockItems: StockItem[];
  items: StockItem[];
  movements: StockMovement[];
}

// Helper function to handle fetch responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export const ReportService = {
  async getAttendanceReport(
    classId: string,
    startDate: string,
    endDate: string
  ): Promise<AttendanceReport> {
    const url = new URL(`${baseUrl}/rapport/attendance`);
    url.searchParams.append('classId', classId);
    url.searchParams.append('startDate', startDate);
    url.searchParams.append('endDate', endDate);

    const response = await fetch(url.toString());
    
    return handleResponse<AttendanceReport>(response);
  },

  async getMealsReport(
    startDate: string, 
    endDate: string,
    mealType?: string
  ): Promise<MealsReport> {
    const url = new URL(`${baseUrl}/rapport/meals`);
    url.searchParams.append('startDate', startDate);
    url.searchParams.append('endDate', endDate);
    if (mealType) url.searchParams.append('mealType', mealType);

    const response = await fetch(url.toString());
    return handleResponse<MealsReport>(response);
  },

  async getStockReport(
    movementType: string = 'ALL',
    startDate?: string,
    endDate?: string
  ): Promise<StockReport> {
    const url = new URL(`${baseUrl}/rapport/stock`);
    if (movementType !== 'ALL') url.searchParams.append('movementType', movementType);
    if (startDate) url.searchParams.append('startDate', startDate);
    if (endDate) url.searchParams.append('endDate', endDate);

    const response = await fetch(url.toString());
    return handleResponse<StockReport>(response);
  },

  async getClasses(): Promise<any[]> {
    const response = await fetch(`${baseUrl}/classes`);
    return handleResponse<any[]>(response);
  },
};