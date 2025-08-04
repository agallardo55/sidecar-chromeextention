import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Car, Calendar, Gauge, Hash, CheckCircle, Eye } from 'lucide-react';
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
interface CompactVehicleCardProps {
  vehicle: VehicleData | null;
  onViewDetails?: () => void;
}
export const CompactVehicleCard: React.FC<CompactVehicleCardProps> = ({
  vehicle,
  onViewDetails
}) => {
  // Don't render if vehicle is null
  if (!vehicle) {
    return null;
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-success text-success-foreground';
      case 'Certified Pre-Owned':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };
  return <Card className="w-80 h-auto shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 animate-float bid-card">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Vehicle</span>
            </div>
            
          </div>
          <h3 className="text-base font-semibold mt-2 leading-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-xs opacity-90 mt-1">{vehicle.trim}</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Vehicle Image */}
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
        </div>
        
        {/* Vehicle Details */}
        <div className="bg-slate-50 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-slate-600 uppercase tracking-wide font-medium">Year</span>
            </div>
            <div className="text-right font-semibold text-slate-800">{vehicle.year}</div>
            
            <div className="flex items-center space-x-1">
              <Gauge className="h-3 w-3 text-muted-foreground" />
              <span className="text-slate-600 uppercase tracking-wide font-medium">Mileage</span>
            </div>
            <div className="text-right font-semibold text-slate-800">{vehicle.mileage.toLocaleString()} mi</div>
            
            <div className="flex items-center space-x-1">
              <Hash className="h-3 w-3 text-muted-foreground" />
              <span className="text-slate-600 uppercase tracking-wide font-medium">VIN</span>
            </div>
            <div className="text-right font-mono text-xs text-slate-800">{vehicle.vin.slice(-8)}</div>
          </div>
          
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3 text-success" />
                <span className="text-xs text-slate-600">Clean History</span>
              </div>
              <Button size="sm" variant="outline" onClick={onViewDetails} className="h-6 px-2 text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};