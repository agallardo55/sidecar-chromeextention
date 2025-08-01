import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { Car, Calendar, Eye, Phone, Mail, MapPin, Star, Clock, DollarSign, CheckCircle, XCircle, User } from 'lucide-react';

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

interface BidRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bidRequest: DetailedBidRequest | null;
}

export const BidRequestDetailsModal: React.FC<BidRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  bidRequest
}) => {
  const isMobile = useIsMobile();
  
  if (!bidRequest) return null;

  const handleAcceptOffer = (offerId: string) => {
    // TODO: Implement offer acceptance logic
  };

  const handleDeclineOffer = (offerId: string) => {
    // TODO: Implement offer decline logic
  };

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[95vh] p-0">
        <DialogHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4 border-b">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <Car className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
              <span className="text-base sm:text-lg md:text-xl font-bold truncate">
                {bidRequest.vehicle.year} {bidRequest.vehicle.make} {bidRequest.vehicle.model} {bidRequest.vehicle.trim}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="vehicle-details" className="flex flex-col h-full">
          <TabsList className="flex mx-3 sm:mx-4 md:mx-6 mt-2 h-auto min-h-[40px] p-1 bg-muted rounded-md">
            <TabsTrigger value="vehicle-details" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 px-2 sm:px-3 py-1.5 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Car className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                {isMobile ? "Details" : "Vehicle Details"}
              </span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 px-2 sm:px-3 py-1.5 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">
                Offers ({bidRequest.offers.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle-details" className="flex-1 mt-0">
            <ScrollArea className="max-h-[calc(95vh-10rem)] sm:max-h-[calc(95vh-12rem)] md:max-h-[calc(95vh-14rem)] overflow-y-auto">
              <div className="p-3 sm:p-4 md:p-6">
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Vehicle Details Card */}
                  <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3 sm:p-4">
                      <CardTitle className="text-sm sm:text-base md:text-lg flex items-center space-x-2">
                        <Car className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Vehicle Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-slate-50 p-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-[9px] sm:text-[10px] md:text-[11px]">
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
                            <span className="text-slate-600 uppercase tracking-wide font-medium text-[9px] sm:text-[10px] md:text-[11px]">Description</span>
                            <p className="mt-1 text-slate-800 text-[10px] sm:text-[11px] md:text-[12px]">{bidRequest.description}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline Card */}
                  <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                    <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3 sm:p-4">
                      <CardTitle className="text-sm sm:text-base md:text-lg flex items-center space-x-2">
                        <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-slate-50 p-3 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600 flex-shrink-0" />
                          <div className="text-[9px] sm:text-[10px] md:text-[11px] min-w-0">
                            <span className="font-medium text-slate-600 uppercase tracking-wide">Created:</span>
                            <span className="ml-1 text-slate-800">{formatDate(bidRequest.createdAt)}</span>
                          </div>
                        </div>
                        {bidRequest.submittedAt && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                            <div className="text-[9px] sm:text-[10px] md:text-[11px] min-w-0">
                              <span className="font-medium text-slate-600 uppercase tracking-wide">Submitted:</span>
                              <span className="ml-1 text-slate-800">{formatDate(bidRequest.submittedAt)}</span>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                          <div className="text-[9px] sm:text-[10px] md:text-[11px] min-w-0">
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
            <ScrollArea className="max-h-[calc(95vh-10rem)] sm:max-h-[calc(95vh-12rem)] md:max-h-[calc(95vh-14rem)] overflow-y-auto">
              <div className="p-3 sm:p-4 md:p-6">
                <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                  <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3 sm:p-4">
                    <CardTitle className="text-sm sm:text-base md:text-lg flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Offers ({bidRequest.offers.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {bidRequest.offers.length === 0 ? (
                      <div className="bg-slate-50 p-6 text-center text-slate-600">
                        <DollarSign className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                        <p className="text-xs sm:text-sm md:text-base">No offers received yet</p>
                        <p className="text-xs sm:text-sm">Buyers will see your request soon</p>
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
                                      <h3 className="font-bold text-[10px] sm:text-[11px] md:text-[12px] text-slate-800 truncate">{offer.buyerName}</h3>
                                      <p className="text-slate-600 text-[9px] sm:text-[10px] md:text-[11px] truncate">{offer.buyerCompany}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-sm sm:text-base md:text-lg font-bold ${isHighest ? 'text-green-600' : 'text-slate-800'}`}>
                                      ${offer.offerAmount.toLocaleString()}
                                    </span>
                                    {isHighest && (
                                      <p className="text-green-600 text-[9px] font-medium">Highest Offer</p>
                                    )}
                                  </div>
                                </div>

                                {/* Offer Details */}
                                <div className="grid grid-cols-2 gap-2 text-[9px] sm:text-[10px] md:text-[11px]">
                                  <div className="flex flex-col">
                                    <span className="text-slate-600 uppercase tracking-wide font-medium">Status</span>
                                    <Badge className={`mt-1 text-[8px] w-fit ${getStatusColor(offer.status)}`}>
                                      {offer.status}
                                    </Badge>
                                  </div>
                                  <span className="text-slate-600 uppercase tracking-wide font-medium">Submitted</span>
                                  <div className="font-semibold text-slate-800 mt-1">{formatDate(offer.submittedAt)}</div>
                                </div>

                                {offer.message && (
                                  <div className="pt-2 border-t border-slate-200 mt-2">
                                    <span className="text-slate-600 uppercase tracking-wide font-medium text-[9px] sm:text-[10px] md:text-[11px]">Message</span>
                                    <p className="mt-1 text-slate-800 text-[10px] sm:text-[11px] md:text-[12px]">{offer.message}</p>
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
      </DialogContent>
    </Dialog>
  );
};
