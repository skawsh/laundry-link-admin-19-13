
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { Subservice } from "@/types/serviceTypes";
import { useToast } from "@/hooks/use-toast";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (serviceName: string, subservices: Omit<Subservice, "id">[]) => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ 
  isOpen, 
  onClose,
  onAddService 
}) => {
  const [serviceName, setServiceName] = useState("");
  const [subservices, setSubservices] = useState<Array<Omit<Subservice, "id">>>(
    [{ name: "", basePrice: 0, priceUnit: "per piece", items: [], enabled: true }]
  );
  const { toast } = useToast();

  const handleAddSubservice = () => {
    setSubservices([...subservices, { name: "", basePrice: 0, priceUnit: "per piece", items: [], enabled: true }]);
  };

  const handleRemoveSubservice = (index: number) => {
    if (subservices.length === 1) {
      toast({
        title: "Cannot remove",
        description: "You need at least one subservice",
        variant: "destructive"
      });
      return;
    }
    const newSubservices = [...subservices];
    newSubservices.splice(index, 1);
    setSubservices(newSubservices);
  };

  const handleSubserviceChange = (index: number, field: "name" | "basePrice" | "priceUnit", value: string | number) => {
    const newSubservices = [...subservices];
    newSubservices[index] = {
      ...newSubservices[index],
      [field]: value
    };
    setSubservices(newSubservices);
  };

  const handleSave = () => {
    if (!serviceName.trim()) {
      toast({
        title: "Invalid input",
        description: "Service name is required",
        variant: "destructive"
      });
      return;
    }

    const invalidSubservice = subservices.find(sub => !sub.name.trim());
    if (invalidSubservice) {
      toast({
        title: "Invalid input",
        description: "All subservice names are required",
        variant: "destructive"
      });
      return;
    }

    onAddService(serviceName, subservices);
    resetForm();
  };

  const resetForm = () => {
    setServiceName("");
    setSubservices([{ name: "", basePrice: 0, priceUnit: "per piece", items: [], enabled: true }]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-blue-600">
            Add Service
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="service-name">Service Name</Label>
            <Input
              id="service-name"
              placeholder="Service Name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Sub Services</Label>
            <div className="space-y-4 mt-2">
              {subservices.map((subservice, index) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="space-y-3">
                    <Label htmlFor={`subservice-name-${index}`}>Sub Service Name</Label>
                    <Input
                      id={`subservice-name-${index}`}
                      placeholder="Sub service name"
                      value={subservice.name}
                      onChange={(e) => handleSubserviceChange(index, "name", e.target.value)}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`subservice-price-${index}`}>Base Price</Label>
                        <Input
                          id={`subservice-price-${index}`}
                          type="number"
                          placeholder="Base Price"
                          value={subservice.basePrice}
                          onChange={(e) => handleSubserviceChange(index, "basePrice", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`subservice-unit-${index}`}>Price Unit</Label>
                        <Input
                          id={`subservice-unit-${index}`}
                          placeholder="e.g. per kg, per piece"
                          value={subservice.priceUnit}
                          onChange={(e) => handleSubserviceChange(index, "priceUnit", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    onClick={() => handleRemoveSubservice(index)}
                    variant="outline"
                    className="mt-3 w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Remove Sub Service
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={handleAddSubservice}
              variant="outline"
              className="mt-4 text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sub Service
            </Button>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceModal;
