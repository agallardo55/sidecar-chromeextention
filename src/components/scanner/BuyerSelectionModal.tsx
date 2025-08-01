import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Phone, Mail, MessageSquare, Send, MapPin, Check, Search } from 'lucide-react';
interface Buyer {
  id: string;
  name: string;
  company: string;
  location: string;
  phone: string;
  email: string;
  specialties: string[];
  rating: number;
}
interface VehicleData {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
}
interface BuyerSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: VehicleData;
  onSubmit: (selectedBuyers: Buyer[]) => void;
}
const mockBuyers: Buyer[] = [{
  id: '1',
  name: 'Mike Johnson',
  company: 'Johnson Auto Sales',
  location: 'Los Angeles, CA',
  phone: '(555) 123-4567',
  email: 'mike@johnsonaut.com',
  specialties: ['Honda', 'Toyota', 'Nissan'],
  rating: 4.8
}, {
  id: '2',
  name: 'Sarah Martinez',
  company: 'Elite Auto Group',
  location: 'Miami, FL',
  phone: '(555) 987-6543',
  email: 'sarah@eliteauto.com',
  specialties: ['BMW', 'Mercedes', 'Audi'],
  rating: 4.9
}, {
  id: '3',
  name: 'David Chen',
  company: 'Pacific Motors',
  location: 'Seattle, WA',
  phone: '(555) 456-7890',
  email: 'david@pacificmotors.com',
  specialties: ['Ford', 'Chevrolet', 'RAM'],
  rating: 4.7
}];
export const BuyerSelectionModal = ({
  open,
  onOpenChange,
  vehicle,
  onSubmit
}: BuyerSelectionModalProps) => {
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };
  const toggleBuyer = (buyerId: string) => {
    setSelectedBuyers(prev => prev.includes(buyerId) ? prev.filter(id => id !== buyerId) : [...prev, buyerId]);
  };
  const filteredBuyers = mockBuyers.filter(buyer => 
    buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    buyer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selectedBuyerData = mockBuyers.filter(buyer => selectedBuyers.includes(buyer.id));
  const handleSubmit = () => {
    onSubmit(selectedBuyerData);
    setSelectedBuyers([]);
    setShowPreview(false);
    onOpenChange(false);
  };
  const smsMessage = `New bid request: ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} - ${vehicle.mileage.toLocaleString()} miles. VIN: ${vehicle.vin}. Interested? Reply for details.`;
  const emailSubject = `Bid Request: ${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const emailBody = `Hello,\n\nWe have a bid request for the following vehicle:\n\n• ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}\n• Mileage: ${vehicle.mileage.toLocaleString()} miles\n• Condition: ${vehicle.condition}\n• VIN: ${vehicle.vin}\n\nPlease let us know if you're interested in submitting a bid.\n\nBest regards`;
  if (showPreview) {
    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Bid Request</DialogTitle>
            <DialogDescription>
              Preview of messages to be sent to {selectedBuyers.length} selected buyer{selectedBuyers.length !== 1 ? 's' : ''}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Selected Buyers:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedBuyerData.map(buyer => <Badge key={buyer.id} variant="outline">
                    {buyer.name} - {buyer.company}
                  </Badge>)}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <h4 className="font-medium">SMS Message Preview</h4>
                </div>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-sm">{smsMessage}</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4" />
                  <h4 className="font-medium">Email Preview</h4>
                </div>
                <Card>
                  <CardContent className="p-3 space-y-2">
                    <p className="text-sm font-medium">Subject: {emailSubject}</p>
                    <Separator />
                    <p className="text-sm whitespace-pre-line">{emailBody}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <DialogFooter className="space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Back to Selection
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-primary hover:opacity-90">
              <Send className="h-4 w-4 mr-2" />
              Send Bid Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>;
  }
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Buyers</DialogTitle>
        </DialogHeader>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search buyers by name, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-2 border-blue-500 rounded-full py-3 px-4 focus:border-blue-600 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-3">
          {filteredBuyers.map((buyer, index) => {
          const isSelected = selectedBuyers.includes(buyer.id);
          const avatarColors = ['bg-gradient-to-br from-purple-500 to-purple-600', 'bg-gradient-to-br from-orange-500 to-orange-600', 'bg-gradient-to-br from-green-500 to-green-600', 'bg-gradient-to-br from-blue-500 to-blue-600'];
          return <div key={buyer.id} 
                className={`
                  relative cursor-pointer transition-all duration-300 rounded-2xl p-4
                  ${isSelected 
                    ? 'bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border-2 border-indigo-500/30' 
                    : 'bg-white/95 backdrop-blur-xl border border-white/20 hover:shadow-lg hover:shadow-slate-900/10'
                  }
                  shadow-md hover:-translate-y-0.5
                `} 
                onClick={() => toggleBuyer(buyer.id)}>
                
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-white font-semibold text-lg shadow-lg`}>
                      {getInitials(buyer.name)}
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg text-slate-900">{buyer.name}</h4>
                      <p className="text-sm text-indigo-600 font-medium">{buyer.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md" 
                      onClick={e => {
                        e.stopPropagation();
                        // Handle phone action
                      }}
                    >
                      <Phone className="h-4 w-4 text-white" />
                    </button>
                    <button 
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md" 
                      onClick={e => {
                        e.stopPropagation();
                        // Handle email action
                      }}
                    >
                      <Mail className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>;
        })}
        </div>

        <DialogFooter className="space-x-2 pt-4">
          <Button onClick={() => setShowPreview(true)} disabled={selectedBuyers.length === 0} className="bg-gradient-primary hover:opacity-90">
            Preview & Send ({selectedBuyers.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
};