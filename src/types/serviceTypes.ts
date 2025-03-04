
export interface ClothingItem {
  id: string;
  name: string;
  standardPrice: number;
  expressPrice: number;
  icon?: string;
}

export interface Subservice {
  id: string;
  name: string;
  basePrice?: number;
  priceUnit?: string;
  items: ClothingItem[];
}

export interface Service {
  id: string;
  name: string;
  subservices: Subservice[];
}

export interface Studio {
  id: string;
  name: string;
  services: Service[];
}
