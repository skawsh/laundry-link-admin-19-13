
import { Service, Studio, Subservice, ClothingItem } from "@/types/serviceTypes";

export const mockServices: Service[] = [
  {
    id: "service1",
    name: "Core Laundry Services",
    subservices: [
      {
        id: "sub1",
        name: "Wash & Fold",
        basePrice: 59,
        priceUnit: "per Kg",
        items: [
          {
            id: "item1",
            name: "Shirt",
            standardPrice: 10,
            expressPrice: 15,
            icon: "shirt",
          },
          {
            id: "item2",
            name: "Pant",
            standardPrice: 20,
            expressPrice: 30,
            icon: "pants",
          },
          {
            id: "item3",
            name: "Shorts",
            standardPrice: 30,
            expressPrice: 45,
            icon: "shorts",
          },
          {
            id: "item4",
            name: "T-Shirt",
            standardPrice: 15,
            expressPrice: 25,
            icon: "tshirt",
          },
          {
            id: "item5",
            name: "Jeans",
            standardPrice: 35,
            expressPrice: 50,
            icon: "jeans",
          },
        ],
      },
      {
        id: "sub2",
        name: "Dry Cleaning",
        basePrice: 99,
        priceUnit: "per piece",
        items: [
          {
            id: "item6",
            name: "Suit",
            standardPrice: 150,
            expressPrice: 250,
            icon: "suit",
          },
          {
            id: "item7",
            name: "Blazer",
            standardPrice: 120,
            expressPrice: 180,
            icon: "blazer",
          },
          {
            id: "item8",
            name: "Coat",
            standardPrice: 200,
            expressPrice: 300,
            icon: "coat",
          },
        ],
      },
      {
        id: "sub3",
        name: "Ironing",
        basePrice: 10,
        priceUnit: "per piece",
        items: [
          {
            id: "item9",
            name: "Shirt",
            standardPrice: 5,
            expressPrice: 8,
            icon: "shirt",
          },
          {
            id: "item10",
            name: "Pant",
            standardPrice: 7,
            expressPrice: 12,
            icon: "pants",
          },
        ],
      },
    ],
  },
  {
    id: "service2",
    name: "Premium Laundry Services",
    subservices: [
      {
        id: "sub4",
        name: "Stain Removal",
        basePrice: 150,
        priceUnit: "per piece",
        items: [
          {
            id: "item11",
            name: "Silk Garment",
            standardPrice: 250,
            expressPrice: 350,
            icon: "silk",
          },
          {
            id: "item12",
            name: "Wool Garment",
            standardPrice: 200,
            expressPrice: 300,
            icon: "wool",
          },
        ],
      },
      {
        id: "sub5",
        name: "Fabric Care",
        basePrice: 125,
        priceUnit: "per piece",
        items: [
          {
            id: "item13",
            name: "Cashmere",
            standardPrice: 300,
            expressPrice: 450,
            icon: "cashmere",
          },
          {
            id: "item14",
            name: "Linen",
            standardPrice: 180,
            expressPrice: 260,
            icon: "linen",
          },
        ],
      },
    ],
  },
];

// Update mockStudios to include numeric IDs that match the ones in the Studios.tsx file
export const mockStudios: Studio[] = [
  {
    id: "1",
    name: "Saiteja Laundry",
    services: mockServices,
  },
  {
    id: "2",
    name: "Sparkle Clean Laundry",
    services: mockServices,
  },
  {
    id: "3",
    name: "Fresh Fold Services",
    services: mockServices,
  },
  {
    id: "4",
    name: "Royal Wash",
    services: mockServices,
  },
  {
    id: "5",
    name: "Urban Laundromat",
    services: mockServices,
  },
  {
    id: "6",
    name: "Quick & Clean",
    services: mockServices,
  },
  {
    id: "7",
    name: "Wash Masters",
    services: mockServices,
  },
  {
    id: "8",
    name: "Pristine Garments",
    services: mockServices,
  }
];

export const getStudioById = (studioId: string): Studio | undefined => {
  return mockStudios.find(studio => studio.id === studioId);
};

// Add new functions to manipulate services data
export const addServiceToStudio = (studioId: string, newService: Omit<Service, "id">): Service => {
  const studio = getStudioById(studioId);
  if (!studio) {
    throw new Error("Studio not found");
  }
  
  const serviceId = `service${Date.now()}`;
  const service: Service = {
    id: serviceId,
    ...newService
  };
  
  studio.services.push(service);
  return service;
};

export const addSubserviceToService = (
  studioId: string, 
  serviceId: string, 
  newSubservice: Omit<Subservice, "id">
): Subservice => {
  const studio = getStudioById(studioId);
  if (!studio) {
    throw new Error("Studio not found");
  }
  
  const service = studio.services.find(s => s.id === serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  
  const subserviceId = `sub${Date.now()}`;
  const subservice: Subservice = {
    id: subserviceId,
    ...newSubservice
  };
  
  service.subservices.push(subservice);
  return subservice;
};

export const addItemToSubservice = (
  studioId: string,
  serviceId: string,
  subserviceId: string,
  newItem: Omit<ClothingItem, "id">
): ClothingItem => {
  const studio = getStudioById(studioId);
  if (!studio) {
    throw new Error("Studio not found");
  }
  
  const service = studio.services.find(s => s.id === serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  
  const subservice = service.subservices.find(s => s.id === subserviceId);
  if (!subservice) {
    throw new Error("Subservice not found");
  }
  
  const itemId = `item${Date.now()}`;
  const item: ClothingItem = {
    id: itemId,
    ...newItem
  };
  
  subservice.items.push(item);
  return item;
};
