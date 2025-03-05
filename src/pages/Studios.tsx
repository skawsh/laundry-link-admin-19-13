
import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search, Filter, Star, MoreHorizontal, X, ArrowUpDown, CreditCard, Settings, Package, Trash2, Frown, AlertCircle, CheckCircle, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { useToast } from "@/hooks/use-toast";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Studio {
  id: number;
  studioId: string; 
  name: string;
  ownerName: string;
  contactNumber: string;
  services: number;
  rating: number;
  status: 'active' | 'inactive';
  email?: string;
  address?: string;
  joinedDate?: string;
  totalOrders?: number;
  revenue?: number;
  avgSackValue?: number;
  serviceTimes?: {
    type: string;
    time: string;
  }[];
}

const initialStudios: Studio[] = [
  {
    id: 1,
    studioId: "STU10001",
    name: 'Saiteja Laundry',
    ownerName: 'Saiteja',
    contactNumber: '8099830308',
    services: 56,
    rating: 4.5,
    status: 'active',
    email: 'saiteja@example.com',
    address: '123 Main St, Mumbai, India',
    joinedDate: '2022-04-15',
    totalOrders: 325,
    revenue: 125800,
    avgSackValue: 387, // 125800/325
    serviceTimes: [
      { type: 'Standard Wash', time: '2h 30min' },
      { type: 'Express Wash', time: '1h 15min' },
      { type: 'Dry Clean', time: '24h' }
    ]
  },
  {
    id: 2,
    studioId: "STU10002",
    name: 'Sparkle Clean Laundry',
    ownerName: 'Ravi Kumar',
    contactNumber: '9876543210',
    services: 48,
    rating: 4.7,
    status: 'active',
    email: 'ravi@sparkle.com',
    address: '456 Park Avenue, Delhi, India',
    joinedDate: '2022-05-20',
    totalOrders: 287,
    revenue: 109500,
    avgSackValue: 381, // 109500/287
    serviceTimes: [
      { type: 'Standard Wash', time: '3h' },
      { type: 'Express Wash', time: '1h 30min' },
      { type: 'Dry Clean', time: '24h' }
    ]
  },
  {
    id: 3,
    studioId: "STU10003",
    name: 'Fresh Fold Services',
    ownerName: 'Anjali Patel',
    contactNumber: '7654321890',
    services: 42,
    rating: 4.2,
    status: 'inactive',
    email: 'anjali@freshfold.com',
    address: '789 Central Road, Bangalore, India',
    joinedDate: '2022-03-10',
    totalOrders: 216,
    revenue: 85600,
    avgSackValue: 396, // 85600/216
    serviceTimes: [
      { type: 'Standard Wash', time: '2h' },
      { type: 'Express Wash', time: '1h' },
      { type: 'Dry Clean', time: '36h' }
    ]
  },
  {
    id: 4,
    studioId: "STU10004",
    name: 'Royal Wash',
    ownerName: 'Vikram Singh',
    contactNumber: '9988776655',
    services: 52,
    rating: 4.8,
    status: 'active',
    email: 'vikram@royalwash.com',
    address: '321 Queen Street, Hyderabad, India',
    joinedDate: '2022-06-05',
    totalOrders: 298,
    revenue: 118200,
    avgSackValue: 397, // 118200/298
    serviceTimes: [
      { type: 'Standard Wash', time: '2h 45min' },
      { type: 'Express Wash', time: '1h 15min' },
      { type: 'Dry Clean', time: '24h' }
    ]
  },
  {
    id: 5,
    studioId: "STU10005",
    name: 'Urban Laundromat',
    ownerName: 'Dheeraj Mehta',
    contactNumber: '8765432109',
    services: 38,
    rating: 3.9,
    status: 'inactive',
    email: 'dheeraj@urban.com',
    address: '987 Urban Complex, Chennai, India',
    joinedDate: '2022-02-15',
    totalOrders: 176,
    revenue: 68900,
    avgSackValue: 392, // 68900/176
    serviceTimes: [
      { type: 'Standard Wash', time: '3h' },
      { type: 'Express Wash', time: '1h 30min' },
      { type: 'Dry Clean', time: '48h' }
    ]
  },
  {
    id: 6,
    studioId: "STU10006",
    name: 'Quick & Clean',
    ownerName: 'Priya Sharma',
    contactNumber: '9123456780',
    services: 45,
    rating: 4.3,
    status: 'active',
    email: 'priya@quickclean.com',
    address: '234 Fast Lane, Pune, India',
    joinedDate: '2022-07-10',
    totalOrders: 210,
    revenue: 89300,
    avgSackValue: 425, // 89300/210
    serviceTimes: [
      { type: 'Standard Wash', time: '2h' },
      { type: 'Express Wash', time: '45min' },
      { type: 'Dry Clean', time: '24h' }
    ]
  },
  {
    id: 7,
    studioId: "STU10007",
    name: 'Wash Masters',
    ownerName: 'Ajay Verma',
    contactNumber: '8877665544',
    services: 51,
    rating: 4.6,
    status: 'active',
    email: 'ajay@washmasters.com',
    address: '567 Clean Street, Kolkata, India',
    joinedDate: '2022-08-20',
    totalOrders: 265,
    revenue: 103200,
    avgSackValue: 390, // 103200/265
    serviceTimes: [
      { type: 'Standard Wash', time: '2h 15min' },
      { type: 'Express Wash', time: '1h' },
      { type: 'Dry Clean', time: '36h' }
    ]
  },
  {
    id: 8,
    studioId: "STU10008",
    name: 'Pristine Garments',
    ownerName: 'Meena Shah',
    contactNumber: '9876123450',
    services: 36,
    rating: 4.0,
    status: 'inactive',
    email: 'meena@pristine.com',
    address: '876 Garment Ave, Ahmedabad, India',
    joinedDate: '2022-01-05',
    totalOrders: 154,
    revenue: 61800,
    avgSackValue: 401, // 61800/154
    serviceTimes: [
      { type: 'Standard Wash', time: '3h 30min' },
      { type: 'Express Wash', time: '1h 45min' },
      { type: 'Dry Clean', time: '48h' }
    ]
  }
];

interface NewStudioFormData {
  name: string;
  ownerName: string;
  contactNumber: string;
  email: string;
  address: string;
  services: number;
}

// Define a type for our table columns to match what DataTable expects
interface TableColumn<T> {
  header: string;
  accessor: ((row: T, index: number) => React.ReactNode) | keyof T;
  width?: string;
}

const Studios: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>(initialStudios);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>(initialStudios);
  const [isViewStudioModalOpen, setIsViewStudioModalOpen] = useState(false);
  const [isEditStudioModalOpen, setIsEditStudioModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Studio[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
  const [sortField, setSortField] = useState<keyof Studio | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState<{id: number, name: string} | null>(null);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [studioToDeactivate, setStudioToDeactivate] = useState<{id: number, name: string} | null>(null);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successDialogInfo, setSuccessDialogInfo] = useState<{title: string, message: string}>({
    title: '',
    message: ''
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const ratingFilterRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (statusFilterRef.current && !statusFilterRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
      if (ratingFilterRef.current && !ratingFilterRef.current.contains(event.target as Node)) {
        setShowRatingFilter(false);
      }
      
      if (activeDropdownId !== null) {
        const activeDropdownRef = dropdownRefs.current[activeDropdownId];
        if (activeDropdownRef && !activeDropdownRef.contains(event.target as Node)) {
          setActiveDropdownId(null);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdownId]);

  const toggleDropdown = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  useEffect(() => {
    let result = [...studios];

    if (filterStatus !== 'all') {
      result = result.filter(studio => studio.status === filterStatus);
    }

    if (filterRating !== null) {
      result = result.filter(studio => Math.floor(studio.rating) >= filterRating);
    }

    if (searchQuery.trim() !== '') {
      result = result.filter(
        studio =>
          studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          studio.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          studio.contactNumber.includes(searchQuery) ||
          studio.studioId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortField) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredStudios(result);
  }, [studios, filterStatus, filterRating, searchQuery, sortField, sortDirection]);

  const toggleStudioStatus = (id: number) => {
    const studio = studios.find(s => s.id === id);
    if (!studio) return;
    
    const newStatus = studio.status === 'active' ? 'inactive' : 'active';
    
    if (newStatus === 'inactive') {
      setStudioToDeactivate({ id, name: studio.name });
      setIsDeactivateDialogOpen(true);
    } else {
      updateStudioStatus(id, newStatus);
      toast({
        title: "Studio Activated",
        description: `${studio.name} has been successfully enabled.`,
        duration: 3000,
      });
    }
  };

  const updateStudioStatus = (id: number, newStatus: 'active' | 'inactive') => {
    setStudios(prevStudios =>
      prevStudios.map(studio => {
        if (studio.id === id) {
          return {
            ...studio,
            status: newStatus
          };
        }
        return studio;
      })
    );
  };

  const confirmDeactivation = () => {
    if (!studioToDeactivate) return;
    
    updateStudioStatus(studioToDeactivate.id, 'inactive');
    
    // Show success dialog instead of toast
    setSuccessDialogInfo({
      title: "Studio Disabled",
      message: `${studioToDeactivate.name} has been successfully disabled.`
    });
    setIsSuccessDialogOpen(true);
    
    setStudioToDeactivate(null);
    setIsDeactivateDialogOpen(false);
  };

  const viewStudioDetails = (studio: Studio) => {
    setSelectedStudio(studio);
    setIsViewStudioModalOpen(true);
  };

  const openStudioAnalytics = (studioId: number) => {
    navigate(`/studios/analytics/${studioId}`);
    toast({
      title: "Analytics",
      description: `Viewing analytics for studio #${studioId}`,
      duration: 3000,
    });
  };

  const navigateToStudioPayments = (studioId: number, studioName: string) => {
    navigate(`/studios/payments/${studioId}`);
    toast({
      title: "Payments",
      description: `Viewing payment history for ${studioName}`,
      duration: 3000,
    });
  };

  const navigateToStudioDetails = (studioId: number) => {
    navigate(`/studios/details/${studioId}`);
    toast({
      title: "Studio Details",
      description: "View and edit studio details",
      duration: 3000,
    });
  };

  const navigateToStudioServices = (studioId: number) => {
    navigate(`/studios/services/${studioId}`);
    toast({
      title: "Services",
      description: "Manage studio services",
      duration: 3000,
    });
  };

  const editStudio = (studio: Studio) => {
    setSelectedStudio(studio);
    setIsEditStudioModalOpen(true);
  };

  const saveEditedStudio = () => {
    if (!selectedStudio) return;
    
    setStudios(prevStudios =>
      prevStudios.map(studio => 
        studio.id === selectedStudio.id ? selectedStudio : studio
      )
    );
    
    setIsEditStudioModalOpen(false);
    
    toast({
      title: "Studio updated",
      description: `${selectedStudio.name} has been updated successfully`,
      duration: 3000,
    });
  };

  const openAddStudioPage = () => {
    navigate('/studios/add');
  };

  const confirmDeleteStudio = (studioId: number, studioName: string) => {
    setStudioToDelete({ id: studioId, name: studioName });
    setIsDeleteDialogOpen(true);
  };

  const executeDeleteStudio = () => {
    if (!studioToDelete) return;
    
    setStudios(studios.filter(s => s.id !== studioToDelete.id));
    
    toast({
      title: "Studio Deleted",
      description: `${studioToDelete.name} has been successfully deleted.`,
      duration: 3000,
    });
    
    setStudioToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setShowSearchDropdown(false);
      return;
    }
    
    const results = studios.filter(
      studio =>
        studio.name.toLowerCase().includes(query.toLowerCase()) ||
        studio.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        studio.contactNumber.includes(query) ||
        studio.studioId.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    
    setSearchResults(results);
    setShowSearchDropdown(results.length > 0);
  };

  const selectSearchResult = (studio: Studio) => {
    setSearchQuery(studio.name);
    setShowSearchDropdown(false);
    
    setFilteredStudios([studio]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  const handleSort = (field: keyof Studio) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    
    toast({
      title: "Sorting applied",
      description: `Sorting by ${field} (${sortDirection === 'asc' ? 'ascending' : 'descending'})`,
      duration: 2000,
    });
  };

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterRating(null);
    setSearchQuery('');
    setSortField(null);
    
    toast({
      title: "Filters reset",
      description: "All filters have been cleared",
      duration: 2000,
    });
  };

  const calculateAvgSackValue = () => {
    const totalSackValue = studios.reduce((sum, studio) => sum + (studio.avgSackValue || 0), 0);
    return (totalSackValue / studios.length).toFixed(0);
  };

  const getWashTypeLabel = (type: string) => {
    if (type === 'combined') return 'Both';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const columns: TableColumn<Studio>[] = [
    {
      header: 'S.NO',
      accessor: (row: Studio) => row.id,
      width: '70px'
    },
    {
      header: 'Studio ID',
      accessor: (row: Studio) => row.studioId,
      width: '120px'
    },
    {
      header: 'Studio Name',
      accessor: (row: Studio) => row.name
    },
    {
      header: 'Owner Name',
      accessor: (row: Studio) => row.ownerName
    },
    {
      header: 'Primary Contact',
      accessor: (row: Studio) => row.contactNumber
    },
    {
      header: 'Services',
      accessor: (row: Studio) => row.services,
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
        <div className="flex justify-center">
          <div 
            className="relative"
            ref={el => dropdownRefs.current[row.id] = el}
          >
            <button
              className="p-2 rounded-full text-gray-500 hover:text-admin-primary hover:bg-gray-100 transition-colors"
              aria-label="More options"
              onClick={(e) => toggleDropdown(row.id, e)}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            {activeDropdownId === row.id && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-52 z-10">
                <button 
                  onClick={() => navigateToStudioPayments(row.id, row.name)}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Payments</span>
                </button>
                
                <button 
                  onClick={() => navigateToStudioDetails(row.id)}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4 mr-2 text-gray-500" />
                  <span>View/Edit Studio Details</span>
                </button>
                
                <button 
                  onClick={() => navigateToStudioServices(row.id)}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  <span>View/Edit Services</span>
                </button>
                
                <button 
                  onClick={() => openStudioAnalytics(row.id)}
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <BarChart className="h-4 w-4 mr-2 text-gray-500" />
                  <span>View Analytics</span>
                </button>
                
                <button 
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => confirmDeleteStudio(row.id, row.name)}
                >
                  <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                  <span>Delete Studio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ),
      width: '80px'
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title="Laundry Studios" 
        subtitle="Manage all laundry studios on your platform"
      >
        <div className="flex items-center space-x-3">
          <Button
            onClick={resetFilters}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Reset Filters</span>
          </Button>
          <Button
            onClick={() => navigate("/studios/overall-analytics")}
            variant="secondary"
            size="sm"
            className="flex items-center"
          >
            <BarChart className="h-4 w-4 mr-2" />
            <span>Overall Analytics</span>
          </Button>
          <Button
            onClick={openAddStudioPage}
            variant="default"
            size="sm"
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add New Studio</span>
          </Button>
        </div>
      </PageHeader>
      
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
          <p className="text-sm text-gray-500">Avg. Sack Value</p>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-semibold">₹{calculateAvgSackValue()}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">Filter by:</span>
          
          <div className="relative inline-block text-left" ref={statusFilterRef}>
            <button 
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white min-w-[100px]"
            >
              <span>{filterStatus === 'all' ? 'Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {showStatusFilter && (
              <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 min-w-[120px]">
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterStatus === 'all' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterStatus('all');
                    setShowStatusFilter(false);
                  }}
                >
                  All
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterStatus === 'active' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterStatus('active');
                    setShowStatusFilter(false);
                  }}
                >
                  Active
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    filterStatus === 'inactive' ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setFilterStatus('inactive');
                    setShowStatusFilter(false);
                  }}
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
          
          <div className="relative inline-block text-left" ref={ratingFilterRef}>
            <button 
              onClick={() => setShowRatingFilter(!showRatingFilter)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white min-w-[100px]"
            >
              <span>{filterRating ? `${filterRating}+ Stars` : 'Rating'}</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            {showRatingFilter && (
              <div className="absolute left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10 min-w-[120px]">
                {[null, 5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating === null ? 'all' : rating}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      filterRating === rating ? 'bg-gray-100 text-admin-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setFilterRating(rating);
                      setShowRatingFilter(false);
                    }}
                  >
                    {rating === null ? 'All Ratings' : (
                      <div className="flex items-center">
                        <span>{rating}+</span>
                        <Star className="h-3 w-3 ml-1 text-yellow-500 inline" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative inline-block text-left">
            <button 
              onClick={() => handleSort('name')}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-md flex items-center bg-white"
            >
              <span>Sort</span>
              <ArrowUpDown className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="relative w-full sm:w-auto" ref={searchRef}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by studio ID, name, owner or contact..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full sm:w-64 bg-white border border-gray-200 rounded-md py-2 pl-10 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {showSearchDropdown && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
              {searchResults.length > 0 ? (
                searchResults.map((studio) => (
                  <button
                    key={studio.id}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => selectSearchResult(studio)}
                  >
                    <div>
                      <span className="font-medium">{studio.name}</span>
                      <span className="text-gray-500 ml-2">({studio.studioId})</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {studio.ownerName} • {studio.contactNumber}
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={filteredStudios}
        recordsPerPage={10}
        className="bg-white border-none shadow-subtle rounded-lg"
      />
      
      {/* Deactivate Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeactivateDialogOpen}
        title="Disable Studio?"
        description={`Are you sure you want to disable ${studioToDeactivate?.name}? The studio will no longer be shown to customers.`}
        onCancel={() => {
          setIsDeactivateDialogOpen(false);
          setStudioToDeactivate(null);
        }}
        onConfirm={confirmDeactivation}
        confirmText="Disable"
        cancelText="Cancel"
        icon={<AlertCircle className="h-6 w-6 text-yellow-500" />}
        variant="warning"
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Studio?"
        description={`Are you sure you want to delete ${studioToDelete?.name}? This action cannot be undone.`}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setStudioToDelete(null);
        }}
        onConfirm={executeDeleteStudio}
        confirmText="Delete"
        cancelText="Cancel"
        icon={<Trash2 className="h-6 w-6 text-red-500" />}
        variant="destructive"
      />
      
      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {successDialogInfo.title}
            </DialogTitle>
            <DialogDescription>
              {successDialogInfo.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Studios;
