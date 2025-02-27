
import React, { useState } from 'react';
import { CheckCircle, XCircle, ExternalLink, Filter } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { useToast } from "@/hooks/use-toast";

// Request data type
interface OnboardingRequest {
  id: number;
  ownerName: string;
  studioName: string;
  contactNumber: string;
  email: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Sample data
const initialRequests: OnboardingRequest[] = [
  {
    id: 1,
    ownerName: 'Rohan Sharma',
    studioName: 'Pristine Laundry',
    contactNumber: '9876543210',
    email: 'rohan.sharma@example.com',
    submittedDate: '2023-06-12',
    status: 'pending'
  },
  {
    id: 2,
    ownerName: 'Priya Patel',
    studioName: 'QuickWash Services',
    contactNumber: '8765432109',
    email: 'priya.patel@example.com',
    submittedDate: '2023-06-14',
    status: 'pending'
  },
  {
    id: 3,
    ownerName: 'Aditya Singh',
    studioName: 'Premium Laundromat',
    contactNumber: '7654321098',
    email: 'aditya.singh@example.com',
    submittedDate: '2023-06-10',
    status: 'approved'
  },
  {
    id: 4,
    ownerName: 'Neha Gupta',
    studioName: 'CleanFold Express',
    contactNumber: '6543210987',
    email: 'neha.gupta@example.com',
    submittedDate: '2023-06-08',
    status: 'rejected'
  },
  {
    id: 5,
    ownerName: 'Rahul Verma',
    studioName: 'Urban Laundry Hub',
    contactNumber: '9876543210',
    email: 'rahul.verma@example.com',
    submittedDate: '2023-06-15',
    status: 'pending'
  }
];

const OnboardingRequests: React.FC = () => {
  const [requests, setRequests] = useState<OnboardingRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<OnboardingRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { toast } = useToast();

  // Filter requests by status
  const filteredRequests = filterStatus
    ? requests.filter(req => req.status === filterStatus)
    : requests;

  // View request details
  const viewRequestDetails = (request: OnboardingRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  // Approve request
  const approveRequest = (id: number) => {
    setRequests(prevRequests =>
      prevRequests.map(req => {
        if (req.id === id) {
          const updatedRequest = {
            ...req,
            status: 'approved' as const
          };
          
          // Show toast
          toast({
            title: "Request Approved",
            description: `${req.studioName} has been approved for onboarding.`,
            duration: 3000,
          });
          
          // Close modal if open
          if (showDetailsModal && selectedRequest?.id === id) {
            setShowDetailsModal(false);
          }
          
          return updatedRequest;
        }
        return req;
      })
    );
  };

  // Reject request
  const rejectRequest = (id: number) => {
    setRequests(prevRequests =>
      prevRequests.map(req => {
        if (req.id === id) {
          const updatedRequest = {
            ...req,
            status: 'rejected' as const
          };
          
          // Show toast
          toast({
            title: "Request Rejected",
            description: `${req.studioName} has been rejected.`,
            duration: 3000,
          });
          
          // Close modal if open
          if (showDetailsModal && selectedRequest?.id === id) {
            setShowDetailsModal(false);
          }
          
          return updatedRequest;
        }
        return req;
      })
    );
  };

  // Handle filter change
  const handleFilterChange = (status: string | null) => {
    setFilterStatus(status);
  };

  // Table columns
  const columns = [
    {
      header: 'ID',
      accessor: 'id' as keyof OnboardingRequest,
      width: '70px'
    },
    {
      header: 'Studio Name',
      accessor: 'studioName' as keyof OnboardingRequest,
    },
    {
      header: 'Owner Name',
      accessor: 'ownerName' as keyof OnboardingRequest,
    },
    {
      header: 'Contact',
      accessor: 'contactNumber' as keyof OnboardingRequest,
    },
    {
      header: 'Email',
      accessor: 'email' as keyof OnboardingRequest,
    },
    {
      header: 'Submitted Date',
      accessor: (row: OnboardingRequest) => new Date(row.submittedDate).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: (row: OnboardingRequest) => (
        <StatusBadge status={row.status} />
      ),
    },
    {
      header: 'Actions',
      accessor: (row: OnboardingRequest) => (
        <div className="flex space-x-2">
          {row.status === 'pending' && (
            <>
              <button
                onClick={() => approveRequest(row.id)}
                className="p-1 text-green-500 hover:text-green-700 transition-colors"
                aria-label="Approve request"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button
                onClick={() => rejectRequest(row.id)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
                aria-label="Reject request"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={() => viewRequestDetails(row)}
            className="p-1 text-gray-500 hover:text-admin-primary transition-colors"
            aria-label="View details"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      ),
      width: '120px'
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title="Onboarding Requests" 
        subtitle="Review and manage new laundry studio requests"
      >
        <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Filter className="h-4 w-4 mr-2" />
          <span>Filters</span>
        </button>
      </PageHeader>
      
      {/* Status summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div 
          className={`bg-white p-4 rounded-lg shadow-subtle cursor-pointer border-l-4 ${
            filterStatus === null ? 'border-admin-primary' : 'border-transparent'
          }`}
          onClick={() => handleFilterChange(null)}
        >
          <p className="text-sm text-gray-500">All Requests</p>
          <p className="text-2xl font-semibold mt-1">{requests.length}</p>
        </div>
        <div 
          className={`bg-white p-4 rounded-lg shadow-subtle cursor-pointer border-l-4 ${
            filterStatus === 'pending' ? 'border-admin-primary' : 'border-transparent'
          }`}
          onClick={() => handleFilterChange('pending')}
        >
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-semibold mt-1 text-yellow-500">
            {requests.filter(req => req.status === 'pending').length}
          </p>
        </div>
        <div 
          className={`bg-white p-4 rounded-lg shadow-subtle cursor-pointer border-l-4 ${
            filterStatus === 'approved' ? 'border-admin-primary' : 'border-transparent'
          }`}
          onClick={() => handleFilterChange('approved')}
        >
          <p className="text-sm text-gray-500">Approved</p>
          <p className="text-2xl font-semibold mt-1 text-green-600">
            {requests.filter(req => req.status === 'approved').length}
          </p>
        </div>
      </div>
      
      {/* Requests table */}
      <DataTable
        columns={columns}
        data={filteredRequests}
        keyField="id"
        searchPlaceholder="Search by studio name, owner or contact..."
        onSearch={(query) => console.log("Searching:", query)}
        emptyMessage="No onboarding requests found"
      />
      
      {/* Request details modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-elevated w-full max-w-md p-6 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">Onboarding Request Details</h3>
              <StatusBadge status={selectedRequest.status} />
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Studio Name</p>
                <p className="text-base font-medium">{selectedRequest.studioName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner Name</p>
                <p className="text-base font-medium">{selectedRequest.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="text-base font-medium">{selectedRequest.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium">{selectedRequest.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Submitted Date</p>
                <p className="text-base font-medium">
                  {new Date(selectedRequest.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Close
              </button>
              
              {selectedRequest.status === 'pending' && (
                <>
                  <button
                    onClick={() => rejectRequest(selectedRequest.id)}
                    className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => approveRequest(selectedRequest.id)}
                    className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OnboardingRequests;
