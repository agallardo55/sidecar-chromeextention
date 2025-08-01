import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Car, Search, Grid, List as ListIcon } from 'lucide-react';
import { BidRequestSkeleton } from '@/components/ui/loading-skeleton';
import { BidRequestDetailsDrawer } from './BidRequestDetailsDrawer';

interface BuyerOffer {
  id: string;
  buyerName: string;
  buyerCompany: string;
  buyerLocation: string;
  buyerRating: number;
  offerAmount: number;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  buyerAvatar?: string;
}

interface BidRequest {
  id: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    trim: string;
    vin: string;
    mileage: number;
    condition: 'New' | 'Used' | 'Certified Pre-Owned';
    exteriorColor: string;
    interiorColor: string;
    transmission: string;
    fuelType: string;
    images: string[];
  };
  status: 'pending' | 'submitted' | 'responded' | 'expired';
  createdAt: string;
  submittedAt?: string;
  estimatedValue: number;
  responseCount: number;
  offers: BuyerOffer[];
  description?: string;
}

const mockBidRequests: BidRequest[] = [{
  id: '1',
  vehicle: {
    year: 2021,
    make: 'Honda',
    model: 'Civic',
    trim: 'Sport Hatchback',
    vin: '1HGBH41JXMN109186',
    mileage: 32000,
    condition: 'Used',
    exteriorColor: 'Crystal Black Pearl',
    interiorColor: 'Black Cloth',
    transmission: 'CVT Automatic',
    fuelType: 'Gasoline',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg']
  },
  status: 'responded',
  createdAt: '2024-01-15T10:30:00Z',
  submittedAt: '2024-01-15T11:00:00Z',
  estimatedValue: 22500,
  responseCount: 3,
  description: 'Well-maintained vehicle with regular service history. Non-smoker, garage kept.',
  offers: [
    {
      id: 'o1',
      buyerName: 'Mike Johnson',
      buyerCompany: 'AutoMax Dealers',
      buyerLocation: 'Los Angeles, CA',
      buyerRating: 4.8,
      offerAmount: 23500,
      submittedAt: '2024-01-15T14:30:00Z',
      status: 'pending',
      message: 'Great condition vehicle. Ready to close immediately with cash payment.'
    },
    {
      id: 'o2',
      buyerName: 'Sarah Chen',
      buyerCompany: 'Pacific Auto Group',
      buyerLocation: 'San Diego, CA',
      buyerRating: 4.9,
      offerAmount: 22800,
      submittedAt: '2024-01-15T15:45:00Z',
      status: 'pending',
      message: 'Interested in this Honda. Can arrange pickup within 24 hours.'
    },
    {
      id: 'o3',
      buyerName: 'David Rodriguez',
      buyerCompany: 'Elite Motors',
      buyerLocation: 'Orange County, CA',
      buyerRating: 4.7,
      offerAmount: 22200,
      submittedAt: '2024-01-15T16:20:00Z',
      status: 'pending'
    }
  ]
}, {
  id: '2',
  vehicle: {
    year: 2020,
    make: 'Toyota',
    model: 'Camry',
    trim: 'LE',
    vin: '4T1BF1FK5LU123456',
    mileage: 45000,
    condition: 'Used',
    exteriorColor: 'Midnight Black Metallic',
    interiorColor: 'Ash Fabric',
    transmission: '8-Speed Automatic',
    fuelType: 'Gasoline',
    images: ['/placeholder.svg', '/placeholder.svg']
  },
  status: 'submitted',
  createdAt: '2024-01-14T14:20:00Z',
  submittedAt: '2024-01-14T15:00:00Z',
  estimatedValue: 24800,
  responseCount: 1,
  offers: [
    {
      id: 'o4',
      buyerName: 'Jennifer Kim',
      buyerCompany: 'Westside Auto',
      buyerLocation: 'Santa Monica, CA',
      buyerRating: 4.6,
      offerAmount: 24200,
      submittedAt: '2024-01-14T18:30:00Z',
      status: 'pending',
      message: 'Solid Toyota with good maintenance records. Competitive offer.'
    }
  ]
}, {
  id: '3',
  vehicle: {
    year: 2019,
    make: 'Ford',
    model: 'F-150',
    trim: 'XLT SuperCrew',
    vin: '1FTFW1ET5KFA12345',
    mileage: 58000,
    condition: 'Used',
    exteriorColor: 'Oxford White',
    interiorColor: 'Medium Earth Gray',
    transmission: '10-Speed Automatic',
    fuelType: 'Gasoline',
    images: ['/placeholder.svg']
  },
  status: 'pending',
  createdAt: '2024-01-13T09:15:00Z',
  estimatedValue: 28900,
  responseCount: 0,
  offers: []
}];

export const BidRequestsList = () => {
  const [bidRequests, setBidRequests] = useState<BidRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [selectedBidRequest, setSelectedBidRequest] = useState<BidRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setBidRequests(mockBidRequests);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredRequests = bidRequests.filter(request => 
    `${request.vehicle.year} ${request.vehicle.make} ${request.vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
    request.vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHighestOfferDisplay = (status: string, responseCount: number, estimatedValue: number) => {
    if (status === 'responded' && responseCount > 0) {
      const highestPrice = Math.round(estimatedValue * (0.95 + Math.random() * 0.1));
      return {
        amount: highestPrice,
        hasOffer: true
      };
    }
    return {
      amount: 0,
      hasOffer: false
    };
  };

  const getSubmittedDate = (submittedAt?: string) => {
    if (!submittedAt) return 'N/A';
    const submitted = new Date(submittedAt);
    return submitted.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatMileage = (mileage: number) => {
    return `${Math.round(mileage / 1000)}K`;
  };

  const handleCardClick = (request: BidRequest) => {
    setSelectedBidRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBidRequest(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-bold">Bid Requests</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search vehicles..."
              className="pl-10"
              disabled
            />
          </div>
        </div>
        <ScrollArea className="flex-1 w-full rounded-md border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {[1, 2, 3].map(i => <BidRequestSkeleton key={i} />)}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (bidRequests.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardHeader className="text-center">
          <CardTitle>No Bid Requests Yet</CardTitle>
          <CardDescription>
            Start by scanning a vehicle page to create your first bid request
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline">
            <Car className="h-4 w-4 mr-2" />
            Go to Scanner
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 h-full flex flex-col">
      {/* Fixed Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold">Bid Requests</h2>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 bg-muted rounded-md p-1">
            <Button
              variant={viewMode === 'card' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search vehicles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <ScrollArea className="flex-1 w-full rounded-md bg-muted/20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-3 justify-items-center">
          {filteredRequests.map(request => {
            const offerDisplay = getHighestOfferDisplay(request.status, request.responseCount, request.estimatedValue);
            
            return (
              <div 
                key={request.id} 
                className="bid-card w-[320px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-float cursor-pointer"
                onClick={() => handleCardClick(request)}
              >
                {/* Header Section */}
                <div className="relative bg-gradient-to-br from-[#667eea] to-[#764ba2] p-3 text-white">
                  <div className="relative z-10">
                    <h3 className="text-[15px] font-bold leading-tight text-left">
                      {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}
                    </h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-2.5">
                  {/* VIN/Miles Row */}
                  <div className="bg-slate-50 px-1.5 py-2 rounded-md mb-2 flex justify-between items-center">
                    <div>
                      <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-wide mb-0.5">VIN</div>
                      <div className="text-[10px] font-mono text-slate-800 leading-none">
                        {request.vehicle.vin}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-slate-800 leading-none">
                        {formatMileage(request.vehicle.mileage)}
                      </div>
                      <div className="text-[8px] font-semibold text-slate-500 uppercase tracking-wide">
                        MILES
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-slate-50 py-1.5 px-0.5 rounded-md text-center">
                      <div className="text-[13px] font-bold text-slate-800 leading-none mb-0.5">
                        {getSubmittedDate(request.submittedAt)}
                      </div>
                      <div className="text-[9px] font-medium text-slate-500 uppercase tracking-wide">
                        Submitted
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 py-1.5 px-0.5 rounded-md text-center">
                      <div className="text-[13px] font-bold text-slate-800 leading-none mb-0.5">
                        {request.responseCount}
                      </div>
                      <div className="text-[9px] font-medium text-slate-500 uppercase tracking-wide">
                        Offers
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 py-1.5 px-0.5 rounded-md text-center">
                      <div className="text-[13px] font-bold text-slate-800 leading-none mb-0.5">
                        {offerDisplay.hasOffer 
                          ? `$${(offerDisplay.amount / 1000).toFixed(1)}K`
                          : '--'
                        }
                      </div>
                      <div className="text-[9px] font-medium text-slate-500 uppercase tracking-wide">
                        Highest Offer
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <BidRequestDetailsDrawer
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        bidRequest={selectedBidRequest}
      />
    </div>
  );
};
