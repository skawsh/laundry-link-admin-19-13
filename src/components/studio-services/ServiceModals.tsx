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
  handleAddService: (e?: React.FormEvent) => void;
  isAddSubserviceModalOpen: boolean;
  setIsAddSubserviceModalOpen: (isOpen: boolean) => void;
  newSubserviceName: string;
  setNewSubserviceName: (name: string) => void;
  newSubservicePricePerUnit: string;
  setNewSubservicePricePerUnit: (price: string) => void;
  newSubserviceUnit: string;
  setNewSubserviceUnit: (unit: string) => void;
  handleAddSubservice: (e?: React.FormEvent) => void;
  isAddItemModalOpen: boolean;
  setIsAddItemModalOpen: (isOpen: boolean) => void;
  newItemName: string;
  setNewItemName: (name: string) => void;
  newItemPrice: string;
  setNewItemPrice: (price: string) => void;
  handleAddItem: (e?: React.FormEvent) => void;
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
          <form onSubmit={handleAddService}>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>
                Create a new service category for your laundry.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="service-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Service Name</label>
                <Input
                  id="service-name"
                  placeholder="e.g., Dry Cleaning"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddServiceModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="service">
                Add Service
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddSubserviceModalOpen} onOpenChange={setIsAddSubserviceModalOpen}>
        <DialogContent>
          <form onSubmit={handleAddSubservice}>
            <DialogHeader>
              <DialogTitle>Add New Subservice</DialogTitle>
              <DialogDescription>
                Add a new subservice to the selected service.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="subservice-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Subservice Name</label>
                <Input
                  id="subservice-name"
                  placeholder="e.g., Upper Wear"
                  value={newSubserviceName}
                  onChange={(e) => setNewSubserviceName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price-per-unit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Price Per Unit (Optional)</label>
                <Input
                  id="price-per-unit"
                  placeholder="e.g., 59"
                  prefix="₹"
                  value={newSubservicePricePerUnit}
                  onChange={(e) => setNewSubservicePricePerUnit(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="unit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Unit (Optional)</label>
                <Input
                  id="unit"
                  placeholder="e.g., per Kg"
                  value={newSubserviceUnit}
                  onChange={(e) => setNewSubserviceUnit(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddSubserviceModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="subservice">
                Add Subservice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent>
          <form onSubmit={handleAddItem}>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                Add a new clothing item to the selected subservice.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label htmlFor="item-name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Item Name</label>
                <Input
                  id="item-name"
                  placeholder="e.g., Shirt"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="item-price" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Standard Price</label>
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
            <DialogFooter className="mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddItemModalOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="item">
                Add Item
              </Button>
            </DialogFooter>
          </form>
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
