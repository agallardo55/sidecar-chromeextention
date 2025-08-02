
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Scan, CheckCircle, DollarSign, History, Wrench } from 'lucide-react';
import { CompactVehicleCard } from './CompactVehicleCard';
import { CompactValuationCard } from './CompactValuationCard';
import { CompactConditionCard } from './CompactConditionCard';
import { VehicleDetailsModal } from './VehicleDetailsModal';
import { ValuationDetailsModal } from './ValuationDetailsModal';
import { ConditionDetailsModal } from './ConditionDetailsModal';
import { BuyerSelectionModal } from './BuyerSelectionModal';
import { useToast } from '@/hooks/use-toast';

interface VehicleData {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
  images: string[];
  features: string[];
}

interface ValuationData {
  kbb: {
    retail: number;
    lending: number;
    auction: number;
  };
  jdPower: {
    retail: number;
    auction: number;
  };
  mmr: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
}

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  lastContact: string;
}

export const VehicleScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showValuationDetails, setShowValuationDetails] = useState(false);
  const [showConditionDetails, setShowConditionDetails] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsScanning(true);
    toast({
      title: "Scanning page...",
      description: "Looking for vehicle data on this page."
    });

    // Simulate DOM scanning
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock vehicle data
    const mockVehicle: VehicleData = {
      vin: '1HGBH41JXMN109186',
      year: 2021,
      make: 'Honda',
      model: 'Civic',
      trim: 'Sport',
      mileage: 32450,
      condition: 'Used',
      images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop'],
      features: ['Navigation System', 'Backup Camera', 'Bluetooth', 'Alloy Wheels', 'Keyless Entry']
    };

    const mockValuation: ValuationData = {
      kbb: {
        retail: 22500,
        lending: 20800,
        auction: 19200
      },
      jdPower: {
        retail: 22200,
        auction: 19500
      },
      mmr: {
        value: 19800,
        trend: 'up',
        change: 2.3
      }
    };

    setVehicleData(mockVehicle);
    setValuationData(mockValuation);
    setIsScanning(false);
    toast({
      title: "Vehicle data found!",
      description: "Successfully extracted vehicle information."
    });
  };

  const handleBidRequestSubmit = (selectedBuyers: Buyer[]) => {
    const buyerNames = selectedBuyers.map(buyer => buyer.name);
    toast({
      title: "Bid request prepared!",
      description: `Ready to send to ${buyerNames.length} buyer${buyerNames.length !== 1 ? 's' : ''}. Connect messaging service to send.`
    });
    console.log('Bid request would be sent to:', buyerNames);
  };

  if (!vehicleData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-4 text-center space-y-4">
        {/* Header Section */}
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-2">
            <Scan className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Vehicle Page Scanner</h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Navigate to any vehicle listing page and click below to extract vehicle data
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <Button 
            onClick={handleScan} 
            disabled={isScanning} 
            size="lg" 
            className="w-full max-w-sm mx-auto h-12 text-base font-medium bg-primary hover:bg-primary/90 rounded-xl"
          >
            {isScanning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Scanning Page...
              </>
            ) : (
              <>
                <Scan className="h-4 w-4 mr-2" />
                Start Page Scan
              </>
            )}
          </Button>

          {/* Website Data Section */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Scan any site:</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              <Badge variant="secondary" className="px-2 py-1 text-xs rounded-full">vAuto</Badge>
              <Badge variant="secondary" className="px-2 py-1 text-xs rounded-full">VINcue</Badge>
              <Badge variant="secondary" className="px-2 py-1 text-xs rounded-full">Autotrader</Badge>
              <Badge variant="secondary" className="px-2 py-1 text-xs rounded-full">Cars.com</Badge>
            </div>
          </div>
        </div>

        {/* Compact Features Section - 2x2 Grid */}
        <div className="pt-3 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Key Features</h2>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <div className="text-left p-3 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <h4 className="text-sm font-medium text-foreground">Auto Extract</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                VIN, specs & pricing
              </p>
            </div>
            
            <div className="text-left p-3 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-2 mb-1">
                <DollarSign className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <h4 className="text-sm font-medium text-foreground">Valuations</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                KBB, JD Power, MMR
              </p>
            </div>
            
            <div className="text-left p-3 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-2 mb-1">
                <History className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <h4 className="text-sm font-medium text-foreground">History</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Carfax & AutoCheck
              </p>
            </div>
            
            <div className="text-left p-3 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-2 mb-1">
                <Wrench className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <h4 className="text-sm font-medium text-foreground">Assessment</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Condition evaluation
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl md:text-2xl font-bold">Vehicle Scan Results</h2>
      </div>

      {/* Compact Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
        <CompactVehicleCard 
          vehicle={vehicleData} 
          onViewDetails={() => setShowVehicleDetails(true)}
        />
        
        {valuationData && (
          <CompactValuationCard 
            valuation={valuationData} 
            onViewDetails={() => setShowValuationDetails(true)}
          />
        )}
        
        <CompactConditionCard 
          onViewDetails={() => setShowConditionDetails(true)}
        />
      </div>

      <Separator />

      {/* Bid Request Section */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Create Bid Request</CardTitle>
          <CardDescription className="text-sm">
            Review the extracted data and submit your bid request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowBuyerModal(true)} 
            className="w-full bg-gradient-primary hover:opacity-90" 
            size="lg"
          >
            Submit Bid Request
          </Button>
        </CardContent>
      </Card>

      {/* Modals */}
      <VehicleDetailsModal
        open={showVehicleDetails}
        onOpenChange={setShowVehicleDetails}
        vehicle={vehicleData}
      />

      {valuationData && (
        <ValuationDetailsModal
          open={showValuationDetails}
          onOpenChange={setShowValuationDetails}
          valuation={valuationData}
        />
      )}

      <ConditionDetailsModal
        open={showConditionDetails}
        onOpenChange={setShowConditionDetails}
      />

      <BuyerSelectionModal 
        open={showBuyerModal} 
        onOpenChange={setShowBuyerModal} 
        vehicle={vehicleData} 
        onSubmit={handleBidRequestSubmit} 
      />
    </div>
  );
};
