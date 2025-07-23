export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray' | 'orange';
  onClick?: () => void;
}

export interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size: 'sm' | 'md' | 'lg';
  onClick: () => void;
  disabled?: boolean;
}

export interface DashboardStats {
  activeClients: number;
  staffOnDuty: number;
  pendingClients: number;
  activeAlerts: number;
  pendingAssessments: number;
  clientsEndingSoon: number;
  staffOnLeave: number;
  incidentReporting: number;
}

export interface FilterState {
  district: string;
  date: Date;
  range: string;
}

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}