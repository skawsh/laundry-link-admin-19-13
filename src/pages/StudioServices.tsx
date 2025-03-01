
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import PageHeader from "../components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getStudioServices } from "@/lib/api";
import { StudioServiceData, StudioService } from "@/types";

const StudioServices = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const navigate = useNavigate();
  const [studioData, setStudioData] = useState<StudioServiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!studioId) return;
      
      try {
        setLoading(true);
        const data = await getStudioServices(studioId);
        setStudioData(data);
      } catch (error) {
        console.error("Error fetching studio services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [studioId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1>Loading...</h1>
        </div>
      </AdminLayout>
    );
  }

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
          subtitle="View and manage all services offered by this studio"
          backButton={
            <Button variant="outline" className="mr-2" onClick={() => navigate("/studios")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          }
        />

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
