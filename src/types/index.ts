// Types communs
export type EntityStatus = 'active' | 'inactive';

// Gestion des élèves
export interface Student {
  dateNaiss: string;
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  dietaryRegime: DietaryRegime;
  classId: string;
  createdAt: string;
  updatedAt: string;
}

export type DietaryRegime = 
  | 'standard'
  | 'vegetarian'
  | 'halal'
  | 'kosher'
  | 'gluten_free'
  | 'other';

// Gestion des classes
export interface Class {
  id: string;
  name: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  name: string,
}

export interface UpdateClassDto {
  name: string
}

// Pointage de présence
export interface Presence {
  id: number;
  date: string;
  studentId: string;
  status: PresenceStatus;
  justification?: string;
}

export interface CreateAttendanceDto {
    date: string;
    studentId: string;
    justification: string;
    status: string
}

export interface UpdateAttendanceDto {
    date: string;
    studentId: string;
    justification: string;
}

export type PresenceStatus = 'present' | 'absent' | 'justified';

// Gestion des repas
export interface Student {
  // id: number;
  firstName: string;
  lastName: string;
  DietaryRegime: string;
  class?: {
    id: number;
    name: string;
  };
}

export interface Ingredient {
  stockItemId: number;
  name: string;
  quantity: number;
  unit: string;
}

export interface Repas {
  id: number;
  student?: Student;
  menuName: string;
  ingredients: Ingredient[];
  date: string;
  isManual?: boolean;
  totalPresence?: number;
  studentId?: number;
}

// Gestion du stock
export interface Stock {
  id: string;
  name: string;
  quantity: number;
  unite: Unite;
  type: MovementType;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export type Unite = 'kg' | 'g' | 'l' | 'unit';

export interface StockMovement {
  
  itemId: string;
  quantity: number;
  type: MovementType;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  initialQuantity: number; // Ajouté
  finalQuantity: number;   // Ajouté
}

export interface CreateStockItemDto {
  name: string;
  unite: Unite;
  quantity: number;
  alertThreshold: number;
}

export interface UpdateStockItemDto {
  name: string;
  unite: Unite;
  quantity: number;
  alertThreshold: number;
}

export interface CreateStockMovementDto {
  
}

export type MovementType = 'IN' | 'OUT';

// Gestion des utilisateurs


export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  contact: string;
  role: UserRole;
  isActive: boolean;
  username?: string; // Optional for UserDropdown
}

export interface CreateUserDto extends Omit<User, "id"> {}
export interface UpdateUserDto extends Partial<User> {}


export interface CreateUserDto {
  firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  contact: string;
  password: string;
  username: string;
}

export interface UpdateUserDto {
    firstName: string;
  lastName: string;
  role: UserRole;
  email: string;
  contact: string;
  password: string;
  username:string;
}

export type UserRole = 'admin' | 'canteen_manager' | 'teacher';

// DTOs pour les formulaires
export interface CreateStudentDto {
  firstName: string;
  lastName: string;
  dateNaiss: string;
  dietaryRegime: DietaryRegime;
  classId: string;
  isActive?: boolean;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {}

// ... Ajouter les autres DTOs selon le même modèle
