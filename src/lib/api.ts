
// Mock API functions for studios
import { Studio } from '@/types';

// Mock data for studios
const mockStudios: Studio[] = [
  {
    id: '1',
    name: 'Clean Wash Studio',
    email: 'contact@cleanwash.com',
    phone: '+1 (555) 123-4567',
    isActive: true
  },
  {
    id: '2',
    name: 'Fresh & Clean',
    email: 'info@freshandclean.com',
    phone: '+1 (555) 987-6543',
    isActive: true
  },
  {
    id: '3',
    name: 'Laundry Express',
    email: 'support@laundryexpress.com',
    phone: '+1 (555) 456-7890',
    isActive: false
  }
];

export const getAllStudios = async (): Promise<Studio[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockStudios;
};

// Mock data for services - in a real app, this would come from an API
export const getStudioServices = async (studioId: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const serviceData = {
    1: {
      studioName: "Clean Wash Studio",
      services: {
        coreLaundry: {
          title: "Core laundry services",
          sections: [
            {
              name: "Wash & Iron",
              categories: [
                { category: "Standard", price: 59, unit: "Per Kg" },
                { category: "Express", price: 129, unit: "Per Kg" }
              ],
              clothingCategories: [
                { category: "T-Shirt", standardPrice: 29, expressPrice: 40 },
                { category: "Trousers", standardPrice: 39, expressPrice: 59 },
                { category: "Shorts", standardPrice: 29, expressPrice: 59 },
                { category: "Shirt", standardPrice: 29, expressPrice: 59 }
              ]
            }
          ]
        },
        shoeLaundry: {
          title: "Shoe Laundry",
          sections: [
            {
              name: "Regular Shoe",
              categories: [
                { category: "Standard", price: 149, unit: "Per Kg" },
                { category: "Express", price: 199, unit: "Per Kg" }
              ]
            },
            {
              name: "Sandles",
              categories: [
                { category: "Standard", price: 139, unit: "Per Kg" },
                { category: "Express", price: 199, unit: "Per Kg" }
              ]
            }
          ]
        },
        curtain: {
          title: "Curtain (Price per SFT )",
          sections: [
            {
              name: "Single Layer Curtain",
              categories: [
                { category: "Standard", price: 199, unit: "Per Kg" },
                { category: "Express", price: 299, unit: "Per Kg" }
              ]
            }
          ]
        },
        dryCleaning: {
          title: "Dry cleaning",
          sections: [
            {
              name: "Indian Ethnic Wear",
              categories: [
                { category: "Standard", price: 199, unit: "Per Kg" },
                { category: "Express", price: 279, unit: "Per Kg" }
              ],
              clothingCategories: [
                { category: "T-Shirt", standardPrice: 39, expressPrice: 49 },
                { category: "Trousers", standardPrice: 49, expressPrice: 69 },
                { category: "Shorts", standardPrice: 39, expressPrice: 59 },
                { category: "Coat", standardPrice: 99, expressPrice: 149 }
              ]
            }
          ]
        }
      }
    },
    2: {
      studioName: "Fresh & Clean",
      services: {
        coreLaundry: {
          title: "Core laundry services",
          sections: [
            {
              name: "Wash & Iron",
              categories: [
                { category: "Standard", price: 49, unit: "Per Kg" },
                { category: "Express", price: 99, unit: "Per Kg" }
              ]
            }
          ]
        }
      }
    }
  };
  
  return serviceData[studioId] || null;
};

export const deleteStudio = async (id: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};
