
// Define main types for the application

export interface Studio {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive?: boolean;
}

export interface ServiceCategory {
  category: string;
  price: number;
  unit?: string;
}

export interface ClothingCategory {
  category: string;
  standardPrice: number;
  expressPrice: number;
}

export interface ServiceSection {
  name: string;
  categories: ServiceCategory[];
  clothingCategories?: ClothingCategory[];
}

export interface StudioService {
  title: string;
  sections: ServiceSection[];
}

export interface StudioServiceData {
  studioName: string;
  services: Record<string, StudioService>;
}
