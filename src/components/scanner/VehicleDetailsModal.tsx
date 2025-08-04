
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface VehicleDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: VehicleData | null;
}

export const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({
  open,
  onOpenChange,
  vehicle
}) => {
  // Don't render if vehicle is null
  if (!vehicle) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {vehicle.year} {vehicle.make} {vehicle.model} - Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">

          {/* History Card */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg">Carfax</h4>
                  <p className="text-2xl font-bold text-primary">9.2/10</p>
                  <p className="text-sm text-muted-foreground">Clean Report</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg">AutoCheck</h4>
                  <p className="text-2xl font-bold text-primary">8.8/10</p>
                  <p className="text-sm text-muted-foreground">Clean Report</p>
                </div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h4 className="font-semibold text-lg">Previous Owners</h4>
                <p className="text-2xl font-bold text-primary">2</p>
                <p className="text-sm text-muted-foreground">Low ownership count</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
