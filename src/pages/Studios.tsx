
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Settings, ArrowUpDown, CreditCard, Trash2, Package } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllStudios, deleteStudio } from '@/lib/api';
import { Studio } from '@/types';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from 'lucide-react';

interface DataTableProps {
  data: Studio[]
}

const Studios = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{ title: string; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const studiosData = await getAllStudios();
        setStudios(studiosData);
      } catch (error) {
        console.error("Error fetching studios:", error);
      }
    };

    fetchStudios();
  }, []);

  const filteredStudios = studios.filter(studio =>
    studio.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (action: string, studio: Studio) => {
    if (action === 'edit') {
      navigate(`/studio-details/${studio.id}`);
    } else if (action === 'analytics') {
      navigate(`/studio-analytics/${studio.id}`);
    } else if (action === 'payments') {
      navigate(`/studio-payments/${studio.id}`);
    } else if (action === 'services') {
      navigate(`/studio-services/${studio.id}`);
    } else if (action === 'delete') {
      setStudioToDelete({id: studio.id, name: studio.name});
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (studioToDelete) {
        await deleteStudio(studioToDelete.id);
        setStudios(studios.filter(studio => studio.id !== studioToDelete.id));
        setSuccessMessage({
          title: "Studio Disabled",
          message: `${studioToDelete.name} has been successfully disabled.`
        });
        setIsSuccessDialogOpen(true);
      }
    } catch (error) {
      console.error("Error deleting studio:", error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setStudioToDelete(null);
  };

  const renderActions = (studio: Studio) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleActionClick('edit', studio)}>
          <Settings className="mr-2 h-4 w-4" />
          <span>View/Edit Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleActionClick('services', studio)}>
          <Package className="mr-2 h-4 w-4" />
          <span>View/Edit Services</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleActionClick('analytics', studio)}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          <span>Analytics</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleActionClick('payments', studio)}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Payments</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleActionClick('delete', studio)}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete Studio</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <AdminLayout>
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Deactivate Studio"
        description={`Are you sure you want to deactivate ${studioToDelete?.name}? This action cannot be undone.`}
      />
      
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{successMessage?.title}</DialogTitle>
            <DialogDescription className="flex items-center pt-2">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              {successMessage?.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="md:px-10 px-3">
        <PageHeader
          title="Studios"
          subtitle="Manage your studios"
        />
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/3">
            <Label htmlFor="search">Search by studio name:</Label>
            <Input
              type="text"
              id="search"
              placeholder="Search studios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-2"
            />
          </div>
          <Button onClick={() => navigate('/studio-details/new')}>Add Studio</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Studio ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudios.map((studio) => (
                <TableRow key={studio.id}>
                  <TableCell className="font-medium">{studio.id}</TableCell>
                  <TableCell>{studio.name}</TableCell>
                  <TableCell>{studio.email}</TableCell>
                  <TableCell>{studio.phone}</TableCell>
                  <TableCell className="text-right">
                    {renderActions(studio)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Studios;
