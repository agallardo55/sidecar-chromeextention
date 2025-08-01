import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Car, Image, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
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
interface VehicleDataCardProps {
  vehicle: VehicleData;
}
export const VehicleDataCard: React.FC<VehicleDataCardProps> = ({
  vehicle
}) => {
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
  return <div className="space-y-4">
      {/* Primary Info Card with Images */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5 text-primary" />
            <span>Vehicle Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Carousel */}
          <Carousel className="w-full max-w-xs mx-auto sm:max-w-sm md:max-w-md">
            <CarouselContent>
              {vehicle.images.map((img, index) => <CarouselItem key={index}>
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img src={img} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                  </div>
                </CarouselItem>)}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
          
          {/* Image indicators */}
          <div className="flex justify-center space-x-1">
            {vehicle.images.map((_, index) => <div key={index} className="w-2 h-2 rounded-full bg-muted-foreground/30" />)}
          </div>
          
          <Separator />
          
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            <Badge className={getConditionColor(vehicle.condition)}>
              {vehicle.condition}
            </Badge>
            <p className="text-xs text-muted-foreground">Data scanned from: autotrader.com</p>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">VIN</span>
              <span className="font-mono text-xs break-all">{vehicle.vin}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Year</span>
              <span className="font-medium">{vehicle.year}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Make</span>
              <span className="font-medium">{vehicle.make}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Model</span>
              <span className="font-medium">{vehicle.model}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Trim</span>
              <span className="font-medium">{vehicle.trim}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Mileage</span>
              <span className="font-medium">{vehicle.mileage.toLocaleString()} mi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Features & Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {vehicle.features.map((feature, index) => <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>)}
          </div>
        </CardContent>
      </Card>

      {/* History Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Vehicle History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Carfax Report</span>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm text-success">Clean History</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AutoCheck Report</span>
              <div className="flex items-center space-x-1">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Not Available</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Previous Owners</span>
              <span className="text-sm font-medium">2</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};