
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ValuationCard } from './ValuationCard';

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

interface ValuationDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valuation: ValuationData;
}

export const ValuationDetailsModal: React.FC<ValuationDetailsModalProps> = ({
  open,
  onOpenChange,
  valuation
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vehicle Valuation Details</DialogTitle>
        </DialogHeader>
        <ValuationCard valuation={valuation} />
      </DialogContent>
    </Dialog>
  );
};
