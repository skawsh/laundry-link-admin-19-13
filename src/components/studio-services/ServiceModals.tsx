
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { ItemToDelete } from './types';

interface ServiceModalsProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  itemToDelete: ItemToDelete;
  executeDelete: () => void;
  isAddServiceModalOpen: boolean;
  setIsAddServiceModalOpen: (isOpen: boolean) => void;
  newServiceName: string;
  setNewServiceName: (name: string) => void;
  handleAddService: () => void;
  isAddSubserviceModalOpen: boolean;
  setIsAddSubserviceModalOpen: (isOpen: boolean) => void;
  newSubserviceName: string;
  setNewSubserviceName: (name: string) => void;
  newSubservicePricePerUnit: string;
  setNewSubservicePricePerUnit: (price: string) => void;
  newSubserviceUnit: string;
  setNewSubserviceUnit: (unit: string) => void;
  handleAddSubservice: () => void;
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: (isOpen: boolean) => void;
  newItemName: string;
  setNewItemName: (name: string) => void;
  newItemPrice: string;
  setNewItemPrice: (price: string) => void;
  handleAddItem: () => void;
  isSuccessDialogOpen: boolean;
  setIsSuccessDialogOpen: (isOpen: boolean) => void;
  successMessage: { title: string; message: string };
}

const ServiceModals: React.FC<ServiceModalsProps> = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  itemToDelete,
  executeDelete,
  isAddServiceModalOpen,
  setIsAddServiceModalOpen,
  newServiceName,
  setNewServiceName,
  handleAddService,
  isAddSubserviceModalOpen,
  setIsAddSubserviceModalOpen,
  newSubserviceName,
  setNewSubserviceName,
  newSubservicePricePerUnit,
  setNewSubservicePricePerUnit,
  newSubserviceUnit,
  setNewSubserviceUnit,
  handleAddSubservice,
  isAddItemModalOpen,
  setIsAddItemModalOpen,
  newItemName,
  setNewItemName,
  newItemPrice,
  setNewItemPrice,
  handleAddItem,
  isSuccessDialogOpen,
  setIsSuccessDialogOpen,
  successMessage
}) => {
  return (
    <>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={`Delete ${itemToDelete?.type === 'service' ? 'Service' : itemToDelete?.type === 'subservice' ? 'Subservice' : 'Item'}`}
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        onConfirm={executeDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Dialog open={isAddServiceModalOpen} onOpenChange={setIsAddServiceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service category for your laundry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <FormLabel htmlFor="service-name">Service Name</FormLabel>
              <Input
                id="service-name"
                placeholder="e.g., Dry Cleaning"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddServiceModalOpen(false)}>Cancel</Button>
            <Button variant="service" onClick={handleAddService}>Add Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddSubserviceModalOpen} onOpenChange={setIsAddSubserviceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subservice</DialogTitle>
            <DialogDescription>
              Add a new subservice to the selected service.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <FormLabel htmlFor="subservice-name">Subservice Name</FormLabel>
              <Input
                id="subservice-name"
                placeholder="e.g., Upper Wear"
                value={newSubserviceName}
                onChange={(e) => setNewSubserviceName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="price-per-unit">Price Per Unit (Optional)</FormLabel>
              <Input
                id="price-per-unit"
                placeholder="e.g., 59"
                prefix="₹"
                value={newSubservicePricePerUnit}
                onChange={(e) => setNewSubservicePricePerUnit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="unit">Unit (Optional)</FormLabel>
              <Input
                id="unit"
                placeholder="e.g., per Kg"
                value={newSubserviceUnit}
                onChange={(e) => setNewSubserviceUnit(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSubserviceModalOpen(false)}>Cancel</Button>
            <Button variant="subservice" onClick={handleAddSubservice}>Add Subservice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new clothing item to the selected subservice.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <FormLabel htmlFor="item-name">Item Name</FormLabel>
              <Input
                id="item-name"
                placeholder="e.g., Shirt"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <FormLabel htmlFor="item-price">Standard Price</FormLabel>
              <Input
                id="item-price"
                placeholder="e.g., 99"
                prefix="₹"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
              />
              <p className="text-xs text-gray-500">Express price will be automatically set to 1.5x the standard price.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemModalOpen(false)}>Cancel</Button>
            <Button variant="item" onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{successMessage.title}</DialogTitle>
            <DialogDescription>
              {successMessage.message}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServiceModals;
