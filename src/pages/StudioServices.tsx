
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { useToast } from "@/hooks/use-toast";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Define interfaces for services data
interface WashCategory {
  category: string;
  price: number;
}

interface ClothingCategory {
  category: string;
  standardPrice: number;
  expressPrice: number;
}

interface ServiceSection {
  title: string;
  subtitle?: string;
  type: 'washCategory' | 'clothingCategory';
  items: WashCategory[] | ClothingCategory[];
  priceUnit?: string;
}

interface StudioServices {
  studioId: string;
  studioName: string;
  services: ServiceSection[];
}

// Mock data for services based on the provided images
const mockServicesData: {[key: string]: StudioServices} = {
  "1": {
    studioId: "STU10001",
    studioName: "Saiteja Laundry",
    services: [
      {
        title: "Core laundry services",
        subtitle: "Wash & Iron",
        type: "washCategory",
        items: [
          { category: "Standard", price: 59 },
          { category: "Express", price: 129 }
        ],
        priceUnit: "Per Kg"
      },
      {
        title: "Clothing Categories",
        type: "clothingCategory",
        items: [
          { category: "T-Shirt", standardPrice: 29, expressPrice: 40 },
          { category: "Trousers", standardPrice: 39, expressPrice: 59 },
          { category: "Shorts", standardPrice: 29, expressPrice: 59 },
          { category: "Shirt", standardPrice: 29, expressPrice: 59 }
        ]
      },
      {
        title: "Shoe Laundry",
        subtitle: "Regular Shoe",
        type: "washCategory",
        items: [
          { category: "Standard", price: 149 },
          { category: "Express", price: 199 }
        ],
        priceUnit: "Per Kg"
      },
      {
        title: "Sandles",
        type: "washCategory",
        items: [
          { category: "Standard", price: 139 },
          { category: "Express", price: 199 }
        ],
        priceUnit: "Per Kg"
      },
      {
        title: "Curtain (Price per SFT)",
        subtitle: "Single Layer Curtain",
        type: "washCategory",
        items: [
          { category: "Standard", price: 199 },
          { category: "Express", price: 299 }
        ],
        priceUnit: "Per Kg"
      },
      {
        title: "Dry cleaning",
        subtitle: "Indian Ethnic Wear",
        type: "washCategory",
        items: [
          { category: "Standard", price: 199 },
          { category: "Express", price: 279 }
        ],
        priceUnit: "Per Kg"
      },
      {
        title: "Clothing Categories",
        type: "clothingCategory",
        items: [
          { category: "T-Shirt", standardPrice: 39, expressPrice: 49 },
          { category: "Trousers", standardPrice: 49, expressPrice: 69 },
          { category: "Shorts", standardPrice: 39, expressPrice: 59 },
          { category: "Coat", standardPrice: 99, expressPrice: 149 }
        ]
      }
    ]
  },
  "2": {
    studioId: "STU10002",
    studioName: "Sparkle Clean Laundry",
    services: [
      {
        title: "Core laundry services",
        subtitle: "Wash & Iron",
        type: "washCategory",
        items: [
          { category: "Standard", price: 65 },
          { category: "Express", price: 140 }
        ],
        priceUnit: "Per Kg"
      },
      {
        title: "Clothing Categories",
        type: "clothingCategory",
        items: [
          { category: "T-Shirt", standardPrice: 30, expressPrice: 45 },
          { category: "Trousers", standardPrice: 40, expressPrice: 60 },
          { category: "Shorts", standardPrice: 30, expressPrice: 55 }
        ]
      }
    ]
  }
};

// For other studio IDs, we can provide default mock data
for (let i = 3; i <= 8; i++) {
  mockServicesData[i.toString()] = {
    studioId: `STU1000${i}`,
    studioName: `Studio ${i}`,
    services: [
      {
        title: "Core laundry services",
        subtitle: "Wash & Iron",
        type: "washCategory",
        items: [
          { category: "Standard", price: 60 + i },
          { category: "Express", price: 120 + (i * 5) }
        ],
        priceUnit: "Per Kg"
      },
      {
        title: "Clothing Categories",
        type: "clothingCategory",
        items: [
          { category: "T-Shirt", standardPrice: 25 + i, expressPrice: 40 + i },
          { category: "Trousers", standardPrice: 35 + i, expressPrice: 55 + i }
        ]
      }
    ]
  };
}

const StudioServices: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [loading, setLoading] = useState(true);
  const [studioServices, setStudioServices] = useState<StudioServices | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch studio services
    const fetchStudioServices = () => {
      setLoading(true);
      
      // Artificial delay to simulate API call
      setTimeout(() => {
        if (studioId && mockServicesData[studioId]) {
          setStudioServices(mockServicesData[studioId]);
        } else {
          toast({
            title: "Error",
            description: "Studio services not found",
            variant: "destructive",
          });
        }
        setLoading(false);
      }, 800);
    };

    fetchStudioServices();
  }, [studioId, toast]);

  const handleBackClick = () => {
    navigate('/studios');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-admin-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!studioServices) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Studio services not found</h2>
          <Button onClick={handleBackClick} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Studios
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader 
        title={`${studioServices.studioName} Services`}
        subtitle={`Manage services for ${studioServices.studioName} (ID: ${studioServices.studioId})`}
        backButton={
          <Button variant="outline" size="sm" onClick={handleBackClick} className="mr-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        }
      >
        <Button className="bg-admin-primary text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studioServices.services.map((section, sectionIndex) => (
          <Card key={`${section.title}-${sectionIndex}`} className="shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">{section.title}</CardTitle>
              {section.subtitle && <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>}
            </CardHeader>
            <CardContent>
              {section.type === 'washCategory' && (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-2/3">Wash Category</TableHead>
                      <TableHead className="text-right">Price ({section.priceUnit || ''})</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(section.items as WashCategory[]).map((item, index) => (
                      <TableRow key={`wash-${index}`} className="border-b border-gray-100">
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">{item.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {section.type === 'clothingCategory' && (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-1/3">Category</TableHead>
                      <TableHead className="text-right">Standard Price</TableHead>
                      <TableHead className="text-right">Express Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(section.items as ClothingCategory[]).map((item, index) => (
                      <TableRow key={`clothing-${index}`} className="border-b border-gray-100">
                        <TableCell className="font-medium">{item.category}</TableCell>
                        <TableCell className="text-right">{item.standardPrice}</TableCell>
                        <TableCell className="text-right">{item.expressPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default StudioServices;
