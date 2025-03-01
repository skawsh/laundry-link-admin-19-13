
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import PageHeader from "../components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for services - in a real app, this would come from an API
const mockStudioServices = {
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
      // ... similar structure for another studio
    }
  }
};

const StudioServices = () => {
  const { studioId } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you would fetch this data from an API
  const studioData = studioId ? mockStudioServices[Number(studioId)] : null;

  if (!studioData) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1>Studio not found</h1>
          <Button variant="outline" onClick={() => navigate("/studios")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Studios
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <PageHeader
          title={`${studioData.studioName} - Services`}
          description="View and manage all services offered by this studio"
          actions={
            <Button variant="outline" onClick={() => navigate("/studios")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Studios
            </Button>
          }
        />

        {/* Core Laundry Services */}
        {Object.entries(studioData.services).map(([serviceKey, serviceData]) => (
          <Card key={serviceKey} className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">{serviceData.title}</h2>
              
              {serviceData.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{section.name}</h3>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Wash Category</TableHead>
                          <TableHead className="text-right">Price ({section.categories[0]?.unit || ""})</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {section.categories.map((cat, catIndex) => (
                          <TableRow key={catIndex}>
                            <TableCell>{cat.category}</TableCell>
                            <TableCell className="text-right">{cat.price}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {section.clothingCategories && (
                    <div className="mt-4">
                      <h4 className="text-md font-medium mb-2">Clothing Categories</h4>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/50">
                              <TableHead>Category</TableHead>
                              <TableHead className="text-right">Standard Price</TableHead>
                              <TableHead className="text-right">Express Price</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {section.clothingCategories.map((item, itemIndex) => (
                              <TableRow key={itemIndex}>
                                <TableCell>{item.category}</TableCell>
                                <TableCell className="text-right">{item.standardPrice}</TableCell>
                                <TableCell className="text-right">{item.expressPrice}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                  
                  {sectionIndex < serviceData.sections.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
};

export default StudioServices;
