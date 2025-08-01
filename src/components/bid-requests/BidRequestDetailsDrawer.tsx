import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose,
  DrawerOverlay 
} from '@/components/ui/drawer';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';
import { Car, Calendar, Eye, CheckCircle, DollarSign, Clock, User, X, Image } from 'lucide-react';
import { BidRequestDetailsModal } from './BidRequestDetailsModal';

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

interface DetailedBidRequest {
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

interface BidRequestDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bidRequest: DetailedBidRequest | null;
}

export const BidRequestDetailsDrawer: React.FC<BidRequestDetailsDrawerProps> = ({
  isOpen,
  onClose,
  bidRequest
}) => {
  const isMobile = useIsMobile();
  
  if (!bidRequest) return null;

  // Use modal for desktop, drawer for mobile
  if (!isMobile) {
    return (
      <BidRequestDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        bidRequest={bidRequest}
      />
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] animate-slide-in-right">
        <DrawerHeader className="p-4 pb-2 border-b bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center space-x-2 text-left">
              <Car className="h-5 w-5" />
              <span className="text-lg font-bold">
                {bidRequest.vehicle.year} {bidRequest.vehicle.make} {bidRequest.vehicle.model} {bidRequest.vehicle.trim}
              </span>
            </DrawerTitle>
            <DrawerClose asChild>
              <button className="text-white/80 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <Tabs defaultValue="vehicle-details" className="flex flex-col h-full">
          <TabsList className="flex mx-4 mt-2 h-auto min-h-[40px] p-1 bg-muted rounded-md">
            <TabsTrigger value="vehicle-details" className="flex items-center justify-center gap-2 text-sm flex-1 px-3 py-1.5 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Car className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center justify-center gap-2 text-sm flex-1 px-3 py-1.5 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <DollarSign className="h-4 w-4" />
              <span>Offers ({bidRequest.offers.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle-details" className="flex-1 mt-0">
            <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <div className="p-4 animate-fade-in">
                <div className="space-y-4">
                  {/* Vehicle Images Carousel Card */}
                  <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Image className="h-4 w-4" />
                        <span>Vehicle Images</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {bidRequest.vehicle.images.length === 0 ? (
                        <div className="bg-slate-50 p-6 text-center text-slate-600">
                          <Image className="h-10 w-10 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No images available</p>
                          <p className="text-xs">Images will be displayed here when uploaded</p>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-3">
                          <Carousel className="w-full max-w-xs mx-auto">
                            <CarouselContent>
                              {bidRequest.vehicle.images.map((image, index) => (
                                <CarouselItem key={index}>
                                  <div className="p-1">
                                    <img
                                      src={image}
                                      alt={`Vehicle image ${index + 1}`}
                                      className="w-full h-48 object-cover rounded-lg shadow-sm"
                                      onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                      }}
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2" />
                            <CarouselNext className="right-2" />
                          </Carousel>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vehicle Details Card */}
                  <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Car className="h-4 w-4" />
                        <span>Vehicle Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-slate-50 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex flex-col">
                            <span className="text-slate-600 uppercase tracking-wide font-medium">VIN</span>
                            <div className="font-mono text-slate-800 mt-1 break-all">{bidRequest.vehicle.vin}</div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-600 uppercase tracking-wide font-medium">Mileage</span>
                            <div className="font-semibold text-slate-800 mt-1">{bidRequest.vehicle.mileage.toLocaleString()} mi</div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-600 uppercase tracking-wide font-medium">Condition</span>
                            <div className="font-semibold text-slate-800 mt-1">{bidRequest.vehicle.condition}</div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-600 uppercase tracking-wide font-medium">Exterior</span>
                            <div className="font-semibold text-slate-800 mt-1">{bidRequest.vehicle.exteriorColor}</div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-600 uppercase tracking-wide font-medium">Interior</span>
                            <div className="font-semibold text-slate-800 mt-1">{bidRequest.vehicle.interiorColor}</div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-slate-600 uppercase tracking-wide font-medium">Transmission</span>
                            <div className="font-semibold text-slate-800 mt-1">{bidRequest.vehicle.transmission}</div>
                          </div>
                        </div>
                        
                        {bidRequest.description && (
                          <div className="pt-2 border-t border-slate-200">
                            <span className="text-slate-600 uppercase tracking-wide font-medium text-xs">Description</span>
                            <p className="mt-1 text-slate-800 text-sm">{bidRequest.description}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline Card */}
                  <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-slate-50 p-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-600 flex-shrink-0" />
                          <div className="text-xs min-w-0">
                            <span className="font-medium text-slate-600 uppercase tracking-wide">Created:</span>
                            <span className="ml-1 text-slate-800">{formatDate(bidRequest.createdAt)}</span>
                          </div>
                        </div>
                        {bidRequest.submittedAt && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <div className="text-xs min-w-0">
                              <span className="font-medium text-slate-600 uppercase tracking-wide">Submitted:</span>
                              <span className="ml-1 text-slate-800">{formatDate(bidRequest.submittedAt)}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <div className="text-xs min-w-0">
                            <span className="font-medium text-slate-600 uppercase tracking-wide">Responses:</span>
                            <span className="ml-1 text-slate-800">{bidRequest.responseCount} offers received</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="offers" className="flex-1 mt-0">
            <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-y-auto">
              <div className="p-4 animate-fade-in">
                <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                  <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                    <CardTitle className="text-base flex items-center space-x-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Offers ({bidRequest.offers.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {bidRequest.offers.length === 0 ? (
                      <div className="bg-slate-50 p-6 text-center text-slate-600">
                        <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No offers received yet</p>
                        <p className="text-xs">Buyers will see your request soon</p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-3 space-y-2">
                        {(() => {
                          const highestOffer = Math.max(...bidRequest.offers.map(o => o.offerAmount));
                          return bidRequest.offers.map(offer => {
                            const isHighest = offer.offerAmount === highestOffer;
                            return (
                              <div key={offer.id} className={`bg-white rounded-lg p-3 border ${isHighest ? 'border-green-500 bg-green-50' : 'border-slate-200'} hover:shadow-sm transition-shadow duration-200`}>
                                {/* Offer Header */}
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center">
                                      <User className="h-3 w-3 text-white" />
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-sm text-slate-800 truncate">{offer.buyerName}</h3>
                                      <p className="text-slate-600 text-xs truncate">{offer.buyerCompany}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-lg font-bold ${isHighest ? 'text-green-600' : 'text-slate-800'}`}>
                                      ${offer.offerAmount.toLocaleString()}
                                    </span>
                                    {isHighest && (
                                      <p className="text-green-600 text-xs font-medium">Highest Offer</p>
                                    )}
                                  </div>
                                </div>

                                 {/* Offer Details */}
                                <div className="text-xs">
                                  <div className="flex flex-col">
                                    <span className="text-slate-600 uppercase tracking-wide font-medium">Submitted</span>
                                    <div className="font-semibold text-slate-800 mt-1">{formatDate(offer.submittedAt)}</div>
                                  </div>
                                </div>

                                {offer.message && (
                                  <div className="pt-2 border-t border-slate-200 mt-2">
                                    <span className="text-slate-600 uppercase tracking-wide font-medium text-xs">Message</span>
                                    <p className="mt-1 text-slate-800 text-sm">{offer.message}</p>
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};