import { Service, Studio, Subservice, ClothingItem } from "@/types/serviceTypes";

export const mockServices: Service[] = [
  {
    id: "service1",
    name: "Core Laundry Services",
    enabled: true,
    subservices: [
      {
        id: "sub1",
        name: "Wash & Fold",
        basePrice: 59,
        priceUnit: "per Kg",
        enabled: true,
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
        enabled: true,
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
        enabled: true,
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
    enabled: true,
    subservices: [
      {
        id: "sub4",
        name: "Stain Removal",
        basePrice: 150,
        priceUnit: "per piece",
        enabled: true,
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
        enabled: true,
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
  {
    id: "service3",
    name: "Home Laundry",
    enabled: true,
    subservices: [
      {
        id: "sub6",
        name: "Bedding",
        basePrice: 120,
        priceUnit: "per piece",
        enabled: true,
        items: [
          {
            id: "item15",
            name: "Bed Sheet",
            standardPrice: 90,
            expressPrice: 140,
            icon: "sheet",
          },
          {
            id: "item16",
            name: "Duvet Cover",
            standardPrice: 120,
            expressPrice: 180,
            icon: "cover",
          },
          {
            id: "item17",
            name: "Pillow Case",
            standardPrice: 40,
            expressPrice: 60,
            icon: "pillow",
          }
        ],
      },
      {
        id: "sub7",
        name: "Bath Essentials",
        basePrice: 80,
        priceUnit: "per piece",
        enabled: true,
        items: [
          {
            id: "item18",
            name: "Bath Towel",
            standardPrice: 60,
            expressPrice: 90,
            icon: "towel",
          },
          {
            id: "item19",
            name: "Bath Mat",
            standardPrice: 45,
            expressPrice: 70,
            icon: "mat",
          }
        ],
      }
    ],
  },
  {
    id: "service4",
    name: "Business Laundry",
    enabled: true,
    subservices: [
      {
        id: "sub8",
        name: "Formal Wear",
        basePrice: 100,
        priceUnit: "per piece",
        enabled: true,
        items: [
          {
            id: "item20",
            name: "Business Shirt",
            standardPrice: 80,
            expressPrice: 120,
            icon: "shirt",
          },
          {
            id: "item21",
            name: "Formal Trousers",
            standardPrice: 90,
            expressPrice: 135,
            icon: "pants",
          },
          {
            id: "item22",
            name: "Tie",
            standardPrice: 40,
            expressPrice: 60,
            icon: "tie",
          }
        ],
      },
      {
        id: "sub9",
        name: "Workwear Cleaning",
        basePrice: 110,
        priceUnit: "per piece",
        enabled: true,
        items: [
          {
            id: "item23",
            name: "Uniform",
            standardPrice: 85,
            expressPrice: 130,
            icon: "shirt",
          },
          {
            id: "item24",
            name: "Lab Coat",
            standardPrice: 75,
            expressPrice: 115,
            icon: "coat",
          }
        ],
      }
    ],
  },
  {
    id: "service5",
    name: "Specialty Cleaning",
    enabled: true,
    subservices: [
      {
        id: "sub10",
        name: "Leather Care",
        basePrice: 250,
        priceUnit: "per piece",
        enabled: true,
        items: [
          {
            id: "item25",
            name: "Leather Jacket",
            standardPrice: 350,
            expressPrice: 500,
            icon: "jacket",
          },
          {
            id: "item26",
            name: "Leather Shoes",
            standardPrice: 200,
            expressPrice: 300,
            icon: "shoes",
          }
        ],
      },
      {
        id: "sub11",
        name: "Wedding Attire",
        basePrice: 500,
        priceUnit: "per piece",
        enabled: true,
        items: [
          {
            id: "item27",
            name: "Wedding Gown",
            standardPrice: 800,
            expressPrice: 1200,
            icon: "dress",
          },
          {
            id: "item28",
            name: "Wedding Suit",
            standardPrice: 400,
            expressPrice: 600,
            icon: "suit",
          }
        ],
      }
    ],
  }
];

export const mockStudios: Studio[] = [
  {
    id: "1",
    name: "Saiteja Laundry",
    services: mockServices,
    location: "123 Main St, Mumbai, India",
    status: "active"
  },
  {
    id: "2",
    name: "Sparkle Clean Laundry",
    services: mockServices,
    location: "456 Park Avenue, Delhi, India",
    status: "active"
  },
  {
    id: "3",
    name: "Fresh Fold Services",
    services: mockServices,
    location: "789 Central Road, Bangalore, India",
    status: "inactive"
  },
  {
    id: "4",
    name: "Royal Wash",
    services: mockServices,
    location: "321 Queen Street, Hyderabad, India",
    status: "active"
  },
  {
    id: "5",
    name: "Urban Laundromat",
    services: mockServices,
    location: "987 Urban Complex, Chennai, India",
    status: "inactive"
  },
  {
    id: "6",
    name: "Quick & Clean",
    services: mockServices,
    location: "234 Fast Lane, Pune, India",
    status: "active"
  },
  {
    id: "7",
    name: "Wash Masters",
    services: mockServices,
    location: "567 Clean Street, Kolkata, India",
    status: "active"
  },
  {
    id: "8",
    name: "Pristine Garments",
    services: mockServices,
    location: "876 Garment Ave, Ahmedabad, India",
    status: "inactive"
  }
];

export const getStudioById = (studioId: string): Studio | undefined => {
  if (studioId === "global") {
    return {
      id: "global",
      name: "Global Services",
      services: mockServices,
    };
  }
  
  return mockStudios.find(studio => studio.id === studioId);
};

export const addServiceToStudio = (studioId: string, newService: Omit<Service, "id">): Service => {
  const studio = getStudioById(studioId);
  if (!studio) {
    throw new Error("Studio not found");
  }
  
  const serviceId = `service${Date.now()}`;
  const service: Service = {
    id: serviceId,
    ...newService,
    enabled: true
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
    ...newSubservice,
    enabled: true
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

export const toggleServiceEnabled = (
  studioId: string,
  serviceId: string
): Service => {
  const studio = getStudioById(studioId);
  if (!studio) {
    throw new Error("Studio not found");
  }
  
  const service = studio.services.find(s => s.id === serviceId);
  if (!service) {
    throw new Error("Service not found");
  }
  
  service.enabled = !service.enabled;
  return service;
};

export const toggleSubserviceEnabled = (
  studioId: string,
  serviceId: string,
  subserviceId: string
): Subservice => {
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
  
  subservice.enabled = !subservice.enabled;
  return subservice;
};
