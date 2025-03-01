
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataTable from '@/components/ui/DataTable';
import { ArrowRight, Package, Calendar, MapPin, User } from "lucide-react";
import { initialUnpaidOrders } from '@/data/mockPaymentData';
import { UnpaidOrder } from '@/types/paymentTypes';

// Mock data for assigned orders to a driver
const mockDriverId = "D001"; // Assuming this would come from auth or context in a real app

// Assign some orders to this driver from the mock data
const assignedOrders = initialUnpaidOrders.map(order => ({
  ...order,
  assigned: true,
  assignedTo: order.id.includes("3") || order.id.includes("5") ? mockDriverId : `D00${Math.floor(Math.random() * 5) + 2}`
}));

const DriverOrders: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Filter orders assigned to this driver
  const myOrders = assignedOrders.filter(order => order.assignedTo === mockDriverId);

  // Group orders by wash type
  const expressOrders = myOrders.filter(order => order.washType === 'express');
  const standardOrders = myOrders.filter(order => order.washType === 'standard');
  const combinedOrders = myOrders.filter(order => order.washType === 'combined');

  // Function to handle clicking on an order
  const handleOrderClick = (orderId: string) => {
    navigate(`/order-details/${orderId}`);
  };

  // Define columns for the DataTable component
  const orderColumns = [
    {
      header: "Order ID",
      accessor: (order: UnpaidOrder) => (
        <div className="flex items-center">
          <Package className="mr-2 h-4 w-4 text-gray-500" />
          <span>{order.id}</span>
        </div>
      ),
      width: "20%"
    },
    {
      header: "Customer",
      accessor: (order: UnpaidOrder) => (
        <div className="flex items-center">
          <User className="mr-2 h-4 w-4 text-gray-500" />
          <span>{order.customerName}</span>
        </div>
      ),
      width: "25%"
    },
    {
      header: "Service Time",
      accessor: (order: UnpaidOrder) => {
        // Format date as DD/MM/YYYY
        const date = new Date(order.date);
        const formatted = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        
        return (
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <span>{formatted}</span>
          </div>
        );
      },
      width: "20%"
    },
    {
      header: "Address",
      accessor: (order: UnpaidOrder) => (
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-gray-500" />
          <span className="truncate max-w-[200px]">
            {order.address || "123 Customer St, Hyderabad"}
          </span>
        </div>
      ),
      width: "25%"
    },
    {
      header: "",
      accessor: (order: UnpaidOrder) => (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => handleOrderClick(order.id)}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      ),
      width: "10%"
    },
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title="My Orders" 
        subtitle="View and manage your assigned orders"
      />

      <div className="container mx-auto p-6">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <Tabs 
              defaultValue="all" 
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-4 h-auto p-1">
                <TabsTrigger value="all" className="py-2">All ({myOrders.length})</TabsTrigger>
                <TabsTrigger value="express" className="py-2">Express ({expressOrders.length})</TabsTrigger>
                <TabsTrigger value="standard" className="py-2">Standard ({standardOrders.length})</TabsTrigger>
                <TabsTrigger value="combined" className="py-2">Both ({combinedOrders.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <DataTable
                  columns={orderColumns}
                  data={myOrders}
                  keyField="id"
                  emptyMessage="No orders assigned to you yet"
                />
              </TabsContent>

              <TabsContent value="express" className="space-y-4">
                <DataTable
                  columns={orderColumns}
                  data={expressOrders}
                  keyField="id"
                  emptyMessage="No express orders assigned to you yet"
                />
              </TabsContent>

              <TabsContent value="standard" className="space-y-4">
                <DataTable
                  columns={orderColumns}
                  data={standardOrders}
                  keyField="id"
                  emptyMessage="No standard orders assigned to you yet"
                />
              </TabsContent>

              <TabsContent value="combined" className="space-y-4">
                <DataTable
                  columns={orderColumns}
                  data={combinedOrders}
                  keyField="id"
                  emptyMessage="No combined orders assigned to you yet"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DriverOrders;
