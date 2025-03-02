
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
      },
      {
        id: "subservice-1-3",
        name: "Steam Press",
        pricePerUnit: "39",
        unit: "per Item",
        isExpanded: false,
        items: [
          { id: "item-1-3-1", name: "Suit", price: 40, expressPrice: 60 },
          { id: "item-1-3-2", name: "Dress", price: 35, expressPrice: 55 },
          { id: "item-1-3-3", name: "Blazer", price: 45, expressPrice: 65 },
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
          { id: "item-2-1-4", name: "Suit Top", price: 169, expressPrice: 249 },
        ]
      },
      {
        id: "subservice-2-2",
        name: "Lower Wear",
        isExpanded: false,
        items: [
          { id: "item-2-2-1", name: "Jeans", price: 120, expressPrice: 180 },
          { id: "item-2-2-2", name: "Trousers", price: 110, expressPrice: 165 },
          { id: "item-2-2-3", name: "Skirt", price: 115, expressPrice: 170 },
        ]
      },
      {
        id: "subservice-2-3",
        name: "Formal Wear",
        isExpanded: false,
        items: [
          { id: "item-2-3-1", name: "Suit (2 piece)", price: 280, expressPrice: 420 },
          { id: "item-2-3-2", name: "Tuxedo", price: 320, expressPrice: 480 },
          { id: "item-2-3-3", name: "Evening Gown", price: 350, expressPrice: 525 },
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
          { id: "item-3-1-3", name: "Sneakers", price: 159, expressPrice: 239 },
        ]
      },
      {
        id: "subservice-3-2",
        name: "Formal Shoes",
        isExpanded: false,
        items: [
          { id: "item-3-2-1", name: "Leather Shoes", price: 199, expressPrice: 299 },
          { id: "item-3-2-2", name: "Boots", price: 249, expressPrice: 374 },
          { id: "item-3-2-3", name: "Oxford Shoes", price: 229, expressPrice: 345 },
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
          { id: "item-4-1-4", name: "Comforter", price: 449, expressPrice: 675 },
        ]
      },
      {
        id: "subservice-4-2",
        name: "Accessories",
        isExpanded: false,
        items: [
          { id: "item-4-2-1", name: "Bag", price: 199, expressPrice: 299 },
          { id: "item-4-2-2", name: "Cap", price: 79, expressPrice: 119 },
          { id: "item-4-2-3", name: "Scarf", price: 89, expressPrice: 135 },
        ]
      }
    ]
  },
  {
    id: "service-5",
    name: "Home Linens",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-5-1",
        name: "Bedding",
        isExpanded: false,
        items: [
          { id: "item-5-1-1", name: "Bed Sheet (Single)", price: 129, expressPrice: 195 },
          { id: "item-5-1-2", name: "Bed Sheet (Double)", price: 159, expressPrice: 239 },
          { id: "item-5-1-3", name: "Pillow Case", price: 49, expressPrice: 75 },
          { id: "item-5-1-4", name: "Duvet Cover", price: 219, expressPrice: 329 },
        ]
      },
      {
        id: "subservice-5-2",
        name: "Bath Linens",
        isExpanded: false,
        items: [
          { id: "item-5-2-1", name: "Bath Towel", price: 89, expressPrice: 135 },
          { id: "item-5-2-2", name: "Hand Towel", price: 39, expressPrice: 59 },
          { id: "item-5-2-3", name: "Bath Mat", price: 69, expressPrice: 105 },
        ]
      },
      {
        id: "subservice-5-3",
        name: "Kitchen Linens",
        isExpanded: false,
        items: [
          { id: "item-5-3-1", name: "Table Cloth", price: 119, expressPrice: 179 },
          { id: "item-5-3-2", name: "Kitchen Towel", price: 29, expressPrice: 45 },
          { id: "item-5-3-3", name: "Napkins (set of 4)", price: 79, expressPrice: 119 },
        ]
      }
    ]
  },
  {
    id: "service-6",
    name: "Special Garments",
    isExpanded: false,
    subservices: [
      {
        id: "subservice-6-1",
        name: "Ethnic Wear",
        isExpanded: false,
        items: [
          { id: "item-6-1-1", name: "Saree", price: 349, expressPrice: 525 },
          { id: "item-6-1-2", name: "Sherwani", price: 399, expressPrice: 599 },
          { id: "item-6-1-3", name: "Lehenga", price: 499, expressPrice: 749 },
        ]
      },
      {
        id: "subservice-6-2",
        name: "Delicate Fabrics",
        isExpanded: false,
        items: [
          { id: "item-6-2-1", name: "Silk Garment", price: 299, expressPrice: 449 },
          { id: "item-6-2-2", name: "Cashmere Sweater", price: 349, expressPrice: 525 },
          { id: "item-6-2-3", name: "Lace Dress", price: 279, expressPrice: 419 },
        ]
      }
    ]
  }
];
