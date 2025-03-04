
import { Service, Studio } from "@/types/serviceTypes";

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
          },
          {
            id: "item2",
            name: "Pant",
            standardPrice: 20,
            expressPrice: 30,
          },
          {
            id: "item3",
            name: "Shorts",
            standardPrice: 30,
            expressPrice: 45,
          },
          {
            id: "item4",
            name: "T-Shirt",
            standardPrice: 15,
            expressPrice: 25,
          },
          {
            id: "item5",
            name: "Jeans",
            standardPrice: 35,
            expressPrice: 50,
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
          },
          {
            id: "item7",
            name: "Blazer",
            standardPrice: 120,
            expressPrice: 180,
          },
          {
            id: "item8",
            name: "Coat",
            standardPrice: 200,
            expressPrice: 300,
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
          },
          {
            id: "item10",
            name: "Pant",
            standardPrice: 7,
            expressPrice: 12,
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
          },
          {
            id: "item12",
            name: "Wool Garment",
            standardPrice: 200,
            expressPrice: 300,
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
          },
          {
            id: "item14",
            name: "Linen",
            standardPrice: 180,
            expressPrice: 260,
          },
        ],
      },
    ],
  },
];

export const mockStudios: Studio[] = [
  {
    id: "studio1",
    name: "City Center Laundry",
    services: mockServices,
  },
  {
    id: "studio2",
    name: "Premium Washers",
    services: mockServices,
  },
];

export const getStudioById = (studioId: string): Studio | undefined => {
  return mockStudios.find(studio => studio.id === studioId);
};
