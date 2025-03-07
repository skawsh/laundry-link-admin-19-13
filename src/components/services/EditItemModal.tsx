
import React, { useState, useEffect } from "react";
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
import { ClothingItem } from "@/types/serviceTypes";
import { useToast } from "@/hooks/use-toast";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ClothingItem;
  onEditItem: (itemId: string, updatedItem: Partial<ClothingItem>) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ 
  isOpen, 
  onClose,
  item,
  onEditItem
}) => {
  const [itemName, setItemName] = useState("");
  const [standardPrice, setStandardPrice] = useState<number>(0);
  const [expressPrice, setExpressPrice] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setItemName(item.name);
      setStandardPrice(item.standardPrice);
      setExpressPrice(item.expressPrice);
    }
  }, [item]);

  const handleSave = () => {
    if (!itemName.trim()) {
      toast({
        title: "Invalid input",
        description: "Item name is required",
        variant: "destructive"
      });
      return;
    }

    if (standardPrice <= 0) {
      toast({
        title: "Invalid input",
        description: "Standard price must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (expressPrice <= 0) {
      toast({
        title: "Invalid input",
        description: "Express price must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    onEditItem(item.id, {
      name: itemName,
      standardPrice,
      expressPrice
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-blue-600">
            Edit Clothing category
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="clothing-name">Clothing Category Name</Label>
            <Input
              id="clothing-name"
              placeholder="Clothing Category Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="standard-price">Standard Price (₹)</Label>
              <Input
                id="standard-price"
                type="number"
                placeholder="0"
                value={standardPrice}
                onChange={(e) => setStandardPrice(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="express-price">Express Price (₹)</Label>
              <Input
                id="express-price"
                type="number"
                placeholder="0"
                value={expressPrice}
                onChange={(e) => setExpressPrice(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemModal;
