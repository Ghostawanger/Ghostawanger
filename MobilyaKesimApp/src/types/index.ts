export interface User {
  id: number;
  phone: string;
  name: string;
  isManager: boolean;
  createdAt: string;
}

export interface EdgeBanding {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface Order {
  id: number;
  userId: number;
  length: number;
  width: number;
  quantity: number;
  edgeBanding: EdgeBanding;
  status: 'pending' | 'approved' | 'rejected' | 'payment_pending';
  createdAt: string;
  updatedAt: string;
}

export interface OrderInput {
  length: number;
  width: number;
  quantity: number;
  edgeBanding: EdgeBanding;
}

export interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}