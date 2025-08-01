
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConditionAssessment } from './ConditionAssessment';

interface ConditionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConditionDetailsModal: React.FC<ConditionDetailsModalProps> = ({
  open,
  onOpenChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Condition Assessment Details</DialogTitle>
        </DialogHeader>
        <ConditionAssessment />
      </DialogContent>
    </Dialog>
  );
};
