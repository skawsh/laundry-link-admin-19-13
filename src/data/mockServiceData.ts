
import { Service } from '@/components/studio-services/types';

// Mock data for services
export const initialServices: Service[] = [
  {
    id: "service-1",
    name: "Core Laundry Services",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-1-1",
        name: "Wash & Fold",
        pricePerUnit: "59",
        unit: "per Kg",
        isExpanded: false,
        items: [
          { id: "item-1-1-1", name: "Shirt", price: 10, expressPrice: 15 },
          { id: "item-1-1-2", name: "Pant", price: 20, expressPrice: 30 },
          { id: "item-1-1-3", name: "Shorts", price: 30, expressPrice: 45 },
          { id: "item-1-1-4", name: "T-shirt", price: 15, expressPrice: 25 },
          { id: "item-1-1-5", name: "Jeans", price: 25, expressPrice: 40 },
        ]
      },
      {
        id: "subservice-1-2",
        name: "Wash & Iron",
        pricePerUnit: "79",
        unit: "per Kg",
        isExpanded: false,
        items: [
          { id: "item-1-2-1", name: "Shirt", price: 15, expressPrice: 20 },
          { id: "item-1-2-2", name: "Pant", price: 25, expressPrice: 35 },
          { id: "item-1-2-3", name: "Shorts", price: 35, expressPrice: 50 },
        ]
      }
    ]
  },
  {
    id: "service-2",
    name: "Dry Cleaning",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-2-1",
        name: "Upper Wear",
        isExpanded: false,
        items: [
          { id: "item-2-1-1", name: "Shirt", price: 99, expressPrice: 149 },
          { id: "item-2-1-2", name: "T-shirt", price: 89, expressPrice: 139 },
          { id: "item-2-1-3", name: "Sweater", price: 149, expressPrice: 229 },
        ]
      },
      {
        id: "subservice-2-2",
        name: "Lower Wear",
        isExpanded: false,
        items: [
          { id: "item-2-2-1", name: "Jeans", price: 120, expressPrice: 180 },
          { id: "item-2-2-2", name: "Trousers", price: 110, expressPrice: 165 },
        ]
      }
    ]
  },
  {
    id: "service-3",
    name: "Shoe Laundry",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-3-1",
        name: "Sports Shoes",
        isExpanded: false,
        items: [
          { id: "item-3-1-1", name: "Casual Shoes", price: 149, expressPrice: 224 },
          { id: "item-3-1-2", name: "Running Shoes", price: 179, expressPrice: 269 },
        ]
      },
      {
        id: "subservice-3-2",
        name: "Formal Shoes",
        isExpanded: false,
        items: [
          { id: "item-3-2-1", name: "Leather Shoes", price: 199, expressPrice: 299 },
          { id: "item-3-2-2", name: "Boots", price: 249, expressPrice: 374 },
        ]
      }
    ]
  },
  {
    id: "service-4",
    name: "Premium Services",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-4-1",
        name: "Winter Wear",
        isExpanded: false,
        items: [
          { id: "item-4-1-1", name: "Coat", price: 299, expressPrice: 449 },
          { id: "item-4-1-2", name: "Jacket", price: 249, expressPrice: 374 },
          { id: "item-4-1-3", name: "Blanket", price: 399, expressPrice: 599 },
        ]
      },
      {
        id: "subservice-4-2",
        name: "Accessories",
        isExpanded: false,
        items: [
          { id: "item-4-2-1", name: "Bag", price: 199, expressPrice: 299 },
          { id: "item-4-2-2", name: "Cap", price: 79, expressPrice: 119 },
        ]
      }
    ]
  }
];
