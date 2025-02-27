
import React, { useState } from 'react';
import { Plus, Edit, Eye, ChevronDown } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { useToast } from "@/hooks/use-toast";

// Studio data type
interface Studio {
  id: number;
  name: string;
  ownerName: string;
  contactNumber: string;
  services: number;
  rating: number;
  status: 'active' | 'inactive';
}

// Sample data
const initialStudios: Studio[] = [
  {
    id: 1,
    name: 'Saiteja Laundry',
    ownerName: 'Saiteja',
    contactNumber: '8099830308',
    services: 56,
    rating: 4.5,
    status: 'active'
  },
  {
    id: 2,
    name: 'Sparkle Clean Laundry',
    ownerName: 'Ravi Kumar',
    contactNumber: '9876543210',
    services: 48,
    rating: 4.7,
    status: 'active'
  },
  {
    id: 3,
    name: 'Fresh Fold Services',
    ownerName: 'Anjali Patel',
    contactNumber: '7654321890',
    services: 42,
    rating: 4.2,
    status: 'inactive'
  },
  {
    id: 4,
    name: 'Royal Wash',
    ownerName: 'Vikram Singh',
    contactNumber: '9988776655',
    services: 52,
    rating: 4.8,
    status: 'active'
  },
  {
    id: 5,
    name: 'Urban Laundromat',
    ownerName: 'Dheeraj Mehta',
    contactNumber: '8765432109',
    services: 38,
    rating: 3.9,
    status: 'inactive'
  }
];

const Studios: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>(initialStudios);
  const [isAddStudioModalOpen, setIsAddStudioModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const { toast } = useToast();

  // Toggle studio status
  const toggleStudioStatus = (id: number) => {
    setStudios(prevStudios =>
      prevStudios.map(studio => {
        if (studio.id === id) {
          const newStatus = studio.status === 'active' ? 'inactive' : 'active';
          
          // Show toast notification
          toast({
            title: `Studio status updated`,
            description: `${studio.name} is now ${newStatus}`,
            duration: 3000,
          });
          
          return {
            ...studio,
            status: newStatus
          };
        }
        return studio;
      })
    );
  };

  // View studio details
  const viewStudioDetails = (studio: Studio) => {
    setSelectedStudio(studio);
    // In a real app, you'd navigate to a details page or open a modal
    toast({
      title: "Studio details",
      description: `Viewing details for ${studio.name}`,
      duration: 3000,
    });
  };

  // Edit studio
  const editStudio = (studio: Studio) => {
    setSelectedStudio(studio);
    // In a real app, you'd open an edit form or navigate to an edit page
    toast({
      title: "Edit studio",
      description: `Editing ${studio.name}`,
      duration: 3000,
    });
  };

  // Open add studio modal
  const openAddStudioModal = () => {
    setIsAddStudioModalOpen(true);
    toast({
      title: "Add new studio",
      description: "Opening form to add a new laundry studio",
      duration: 3000,
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // In a real app, you'd implement filtering logic here
  };

  // Table columns configuration
  const columns = [
    {
      header: 'S.NO',
      accessor: 'id',
      width: '70px'
    },
    {
      header: 'Studio Name',
      accessor: 'name',
    },
    {
      header: 'Owner Name',
      accessor: 'ownerName',
    },
    {
      header: 'Primary Contact',
      accessor: 'contactNumber',
    },
    {
      header: 'Services',
      accessor: 'services',
      width: '100px'
    },
    {
      header: 'Rating',
      accessor: (row: Studio) => (
        <div className="flex items-center">
          <span className="font-medium">{row.rating}</span>
          <span className="ml-1 text-yellow-500">★</span>
        </div>
      ),
      width: '100px'
    },
    {
      header: 'Status',
      accessor: (row: Studio) => (
        <ToggleSwitch
          isEnabled={row.status === 'active'}
          onChange={() => toggleStudioStatus(row.id)}
        />
      ),
      width: '100px'
    },
    {
      header: 'Actions',
      accessor: (row: Studio) => (
        <div className="flex space-x-2">
          <button
            onClick={() => viewStudioDetails(row)}
            className="p-1 text-gray-500 hover:text-admin-primary transition-colors"
            aria-label="View studio details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => editStudio(row)}
            className="p-1 text-gray-500 hover:text-admin-primary transition-colors"
            aria-label="Edit studio"
          >
            <Edit className="h-4 w-4" />
          </button>
        </div>
      ),
      width: '100px'
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title="Laundry Studios" 
        subtitle="Manage all laundry studios on your platform"
      >
        <button
          onClick={openAddStudioModal}
          className="flex items-center bg-admin-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span>Add New Studio</span>
        </button>
      </PageHeader>
      
      {/* Studio analytics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Total Studios</p>
          <p className="text-2xl font-semibold mt-1">{studios.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Active Studios</p>
          <p className="text-2xl font-semibold mt-1 text-green-600">
            {studios.filter(s => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Inactive Studios</p>
          <p className="text-2xl font-semibold mt-1 text-gray-600">
            {studios.filter(s => s.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-subtle">
          <p className="text-sm text-gray-500">Avg. Rating</p>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-semibold">{(studios.reduce((sum, studio) => sum + studio.rating, 0) / studios.length).toFixed(1)}</p>
            <span className="ml-1 text-yellow-500 text-xl">★</span>
          </div>
        </div>
      </div>
      
      {/* Filter options */}
      <div className="mb-5 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Filter by:</span>
          <div className="relative inline-block text-left mr-3">
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white">
              <span>Status</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="relative inline-block text-left">
            <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white">
              <span>Rating</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Studios table */}
      <DataTable
        columns={columns}
        data={studios}
        keyField="id"
        searchPlaceholder="Search by studio name, owner or contact..."
        onSearch={handleSearch}
        emptyMessage="No laundry studios found"
      />
    </AdminLayout>
  );
};

export default Studios;
