
export interface ClothingItem {
  id: string;
  name: string;
  price: number;
  expressPrice?: number;
  isEditing?: boolean;
}

export interface Subservice {
  id: string;
  name: string;
  pricePerUnit?: string;
  unit?: string;
  items: ClothingItem[];
  isExpanded: boolean;
  isEditing?: boolean;
}

export interface Service {
  id: string;
  name: string;
  subservices: Subservice[];
  isExpanded: boolean;
  isEditing?: boolean;
}

export type ItemToDelete = {
  type: 'service' | 'subservice' | 'item';
  id: string;
  name: string;
  parentId?: string;
  subParentId?: string;
} | null;

export type FilterType = 'all' | 'services' | 'subservices' | 'items';
