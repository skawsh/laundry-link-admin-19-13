import React, { useState, useEffect, useRef } from 'react';
import { Plus, ChevronDown, Search, Filter, Star, MoreHorizontal, X, ArrowUpDown, CreditCard, Settings, Package, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { useToast } from "@/hooks/use-toast";

// Studio data type
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

// Sample data
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

const Studios: React.FC = () => {
  const [studios, setStudios] = useState<Studio[]>(initialStudios);
  const [filteredStudios, setFilteredStudios] = useState<Studio[]>(initialStudios);
  const [isAddStudioModalOpen, setIsAddStudioModalOpen] = useState(false);
  const [isEditStudioModalOpen, setIsEditStudioModalOpen] = useState(false);
  const [isViewStudioModalOpen, setIsViewStudioModalOpen] = useState(false);
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
  const [newStudioForm, setNewStudioForm] = useState<NewStudioFormData>({
    name: '',
    ownerName: '',
    contactNumber: '',
    email: '',
    address: '',
    services: 0
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const statusFilterRef = useRef<HTMLDivElement>(null);
  const ratingFilterRef = useRef<HTMLDivElement>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle outside click to close dropdowns
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
      
      // Handle three dots menu dropdown
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

  // Toggle dropdown menu
  const toggleDropdown = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Apply filters
  useEffect(() => {
    let result = [...studios];

    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(studio => studio.status === filterStatus);
    }

    // Apply rating filter
    if (filterRating !== null) {
      result = result.filter(studio => Math.floor(studio.rating) >= filterRating);
    }

    // Apply search query
    if (searchQuery.trim() !== '') {
      result = result.filter(
        studio =>
          studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          studio.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          studio.contactNumber.includes(searchQuery) ||
          studio.studioId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredStudios(result);
  }, [studios, filterStatus, filterRating, searchQuery, sortField, sortDirection]);

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
    setIsViewStudioModalOpen(true);
  };

  // Open studio analytics
  const openStudioAnalytics = (studioId: number) => {
    navigate(`/studios/analytics/${studioId}`);
    toast({
      title: "Analytics",
      description: `Viewing analytics for studio #${studioId}`,
      duration: 3000,
    });
  };

  // Navigate to studio payments
  const navigateToStudioPayments = (studioId: number, studioName: string) => {
    navigate(`/studios/payments/${studioId}`);
    toast({
      title: "Payments",
      description: `Viewing payment history for ${studioName}`,
      duration: 3000,
    });
  };

  // Navigate to studio details
  const navigateToStudioDetails = (studioId: number) => {
    navigate(`/studios/details/${studioId}`);
    toast({
      title: "Studio Details",
      description: "View and edit studio details",
      duration: 3000,
    });
  };

  // Navigate to studio services
  const navigateToStudioServices = (studioId: number) => {
    navigate(`/studios/services/${studioId}`);
    toast({
      title: "Services",
      description: "Manage studio services",
      duration: 3000,
    });
  };

  // Edit studio
  const editStudio = (studio: Studio) => {
    setSelectedStudio(studio);
    setIsEditStudioModalOpen(true);
  };

  // Save edited studio
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

  // Open add studio modal
  const openAddStudioModal = () => {
    setIsAddStudioModalOpen(true);
  };

  // Add new studio
  const addNewStudio = () => {
    // Validate form
    if (!newStudioForm.name || !newStudioForm.ownerName || !newStudioForm.contactNumber) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Generate a new studio ID
    const studioId = `STU${(10000 + studios.length + 1).toString()}`;
    
    // Create new studio object
    const newStudio: Studio = {
      id: Math.max(...studios.map(s => s.id)) + 1,
      studioId,
      name: newStudioForm.name,
      ownerName: newStudioForm.ownerName,
      contactNumber: newStudioForm.contactNumber,
      email: newStudioForm.email,
      address: newStudioForm.address,
      services: newStudioForm.services || 0,
      rating: 0,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      revenue: 0,
      avgSackValue: 0,
      serviceTimes: [
        { type: 'Standard Wash', time: '3h' },
        { type: 'Express Wash', time: '1h 30min' }
      ]
    };
    
    // Add to studios list
    setStudios([...studios, newStudio]);
    
    // Reset form and close modal
    setNewStudioForm({
      name: '',
      ownerName: '',
      contactNumber: '',
      email: '',
      address: '',
      services: 0
    });
    setIsAddStudioModalOpen(false);
    
    toast({
      title: "Studio added",
      description: `${newStudio.name} has been added successfully`,
      duration: 3000,
    });
  };

  // Delete studio
  const deleteStudio = (studioId: number, studioName: string) => {
    setStudios(studios.filter(s => s.id !== studioId));
    toast({
      title: "Studio deleted",
      description: `${studioName} has been removed`,
      duration: 3000,
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setShowSearchDropdown(false);
      return;
    }
    
    // Filter studios based on query
    const results = studios.filter(
      studio =>
        studio.name.toLowerCase().includes(query.toLowerCase()) ||
        studio.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        studio.contactNumber.includes(query) ||
        studio.studioId.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 results for dropdown
    
    setSearchResults(results);
    setShowSearchDropdown(results.length > 0);
  };

  // Handle search result selection
  const selectSearchResult = (studio: Studio) => {
    setSearchQuery(studio.name);
    setShowSearchDropdown(false);
    
    // Apply filter immediately
    setFilteredStudios([studio]);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  // Handle sorting
  const handleSort = (field: keyof Studio) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set to ascending
      setSortField(field);
      setSortDirection('asc');
    }
    
    toast({
      title: "Sorting applied",
      description: `Sorting by ${field} (${sortDirection === 'asc' ? 'ascending' : 'descending'})`,
      duration: 2000,
    });
  };

  // Reset all filters
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

  // Calculate average sack value across all studios
  const calculateAvgSackValue = () => {
    const totalSackValue = studios.reduce((sum, studio) => sum + (studio.avgSackValue || 0), 0);
    return (totalSackValue / studios.length).toFixed(0);
  };

  // Make sure to rename "Combined Wash" to "Both" in any relevant places
  const getWashTypeLabel = (type: string) => {
    if (type === 'combined') return 'Both';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Table columns configuration
  const columns = [
    {
      header: 'S.NO',
      accessor: 'id' as keyof Studio,
      width: '70px'
    },
    {
      header: 'Studio ID',
      accessor: 'studioId' as keyof Studio,
      width: '120px'
    },
    {
      header: 'Studio Name',
      accessor: 'name' as keyof Studio,
    },
    {
      header: 'Owner Name',
      accessor: 'ownerName' as keyof Studio,
    },
    {
      header: 'Primary Contact',
      accessor: 'contactNumber' as keyof Studio,
    },
    {
      header: 'Services',
      accessor: 'services' as keyof Studio,
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
                  <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                  <span>View Analytics</span>
                </button>
                
                <button 
                  className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-gray-100"
                  onClick={() => deleteStudio(row.id, row.name)}
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
          <button
            onClick={resetFilters}
            className="flex items-center px-3 py-2 text-sm bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>Reset Filters</span>
          </button>
          <button
            onClick={openAddStudioModal}
            className="flex items-center bg-admin-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span>Add New Studio</span>
          </button>
        </div>
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
          <p className="text-sm text-gray-500">Avg. Sack Value</p>
          <div className="flex items-center mt-1">
            <p className="text-2xl font-semibold">₹{calculateAvgSackValue()}</p>
          </div>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 whitespace-nowrap">Filter by:</span>
          
          {/* Status filter */}
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
          
          {/* Rating filter */}
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
          
          {/* Sort button */}
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
        
        {/* Search with dropdown */}
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
          
          {/* Search results dropdown */}
          {showSearchDropdown && (
            <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
              {searchResults.length > 0 ? (
                searchResults.map((studio) => (
                  <button
                    key={studio.id}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => selectSearchResult(studio)}
                  >
                    <div className="font-medium">{studio.name}</div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{studio.studioId}</span>
                      <span>{studio.contactNumber}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">No matching studios found</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Studios table */}
      <DataTable
        columns={columns}
        data={filteredStudios}
        keyField="id"
        searchPlaceholder="Search studios..."
        emptyMessage="No studios found"
      />
      
      {/* Add New Studio Modal */}
      {isAddStudioModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Laundry Studio</h3>
              <button onClick={() => setIsAddStudioModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Studio Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStudioForm.name}
                  onChange={(e) => setNewStudioForm({...newStudioForm, name: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter studio name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStudioForm.ownerName}
                  onChange={(e) => setNewStudioForm({...newStudioForm, ownerName: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter owner name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newStudioForm.contactNumber}
                  onChange={(e) => setNewStudioForm({...newStudioForm, contactNumber: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter contact number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newStudioForm.email}
                  onChange={(e) => setNewStudioForm({...newStudioForm, email: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={newStudioForm.address}
                  onChange={(e) => setNewStudioForm({...newStudioForm, address: e.target.value})}
                  rows={3}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter studio address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Services
                </label>
                <input
                  type="number"
                  value={newStudioForm.services}
                  onChange={(e) => setNewStudioForm({...newStudioForm, services: parseInt(e.target.value) || 0})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter number of services"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsAddStudioModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNewStudio}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Add Studio
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* View Studio Modal */}
      {isViewStudioModalOpen && selectedStudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Studio Details</h3>
              <button onClick={() => setIsViewStudioModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{selectedStudio.name}</h2>
                <StatusBadge status={selectedStudio.status} />
              </div>
              <p className="text-sm text-gray-500 mt-1">ID: {selectedStudio.studioId}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedStudio.address}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium">{selectedStudio.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{selectedStudio.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{selectedStudio.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="font-medium">{selectedStudio.joinedDate ? new Date(selectedStudio.joinedDate).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mb-6">
              <h4 className="font-medium mb-2">Performance Metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-lg font-semibold">{selectedStudio.totalOrders?.toLocaleString() || "0"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-lg font-semibold">₹{selectedStudio.revenue?.toLocaleString() || "0"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Services Offered</p>
                  <p className="text-lg font-semibold">{selectedStudio.services}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">Avg. Sack Value</p>
                  <p className="text-lg font-semibold">₹{selectedStudio.avgSackValue || "0"}</p>
                </div>
              </div>
            </div>
            
            {selectedStudio.serviceTimes && (
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h4 className="font-medium mb-2">Service Timings</h4>
                <div className="space-y-2">
                  {selectedStudio.serviceTimes.map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-2 rounded bg-gray-50">
                      <span className="font-medium">{service.type === 'Combined Wash' ? 'Both' : service.type}</span>
                      <span className="text-sm text-gray-700">{service.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsViewStudioModalOpen(false);
                  editStudio(selectedStudio);
                }}
                className="px-4 py-2 text-sm text-admin-primary border border-admin-primary rounded-md hover:bg-admin-primary hover:text-white transition-colors"
              >
                Edit Studio
              </button>
              <button
                onClick={() => {
                  setIsViewStudioModalOpen(false);
                  openStudioAnalytics(selectedStudio.id);
                }}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Studio Modal */}
      {isEditStudioModalOpen && selectedStudio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Studio</h3>
              <button onClick={() => setIsEditStudioModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Studio ID
                </label>
                <input
                  type="text"
                  value={selectedStudio.studioId}
                  disabled
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Studio Name
                </label>
                <input
                  type="text"
                  value={selectedStudio.name}
                  onChange={(e) => setSelectedStudio({...selectedStudio, name: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={selectedStudio.ownerName}
                  onChange={(e) => setSelectedStudio({...selectedStudio, ownerName: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={selectedStudio.contactNumber}
                  onChange={(e) => setSelectedStudio({...selectedStudio, contactNumber: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={selectedStudio.email || ''}
                  onChange={(e) => setSelectedStudio({...selectedStudio, email: e.target.value})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={selectedStudio.address || ''}
                  onChange={(e) => setSelectedStudio({...selectedStudio, address: e.target.value})}
                  rows={3}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Services
                </label>
                <input
                  type="number"
                  value={selectedStudio.services}
                  onChange={(e) => setSelectedStudio({...selectedStudio, services: parseInt(e.target.value) || 0})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedStudio.status === 'active'}
                      onChange={() => setSelectedStudio({...selectedStudio, status: 'active'})}
                      className="h-4 w-4 text-admin-primary focus:ring-admin-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={selectedStudio.status === 'inactive'}
                      onChange={() => setSelectedStudio({...selectedStudio, status: 'inactive'})}
                      className="h-4 w-4 text-admin-primary focus:ring-admin-primary"
                    />
                    <span className="ml-2 text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Sack Value
                </label>
                <input
                  type="number"
                  value={selectedStudio.avgSackValue || 0}
                  onChange={(e) => setSelectedStudio({...selectedStudio, avgSackValue: parseInt(e.target.value) || 0})}
                  className="block w-full border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min="0"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsEditStudioModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedStudio}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Studios;
