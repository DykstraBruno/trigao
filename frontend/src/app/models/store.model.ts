export interface Store {
  id: number;
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  active: boolean;
}

export interface Manager {
  id: number;
  name: string;
  email: string;
  phone?: string;
  storeId?: number;
  storeName?: string;
}

export interface CreateManagerRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  storeId: number;
}
