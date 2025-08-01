
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Star, Eye } from 'lucide-react';

interface CompactConditionCardProps {
  onViewDetails?: () => void;
}

export const CompactConditionCard: React.FC<CompactConditionCardProps> = ({
  onViewDetails
}) => {
  const categories = [
    { label: 'Exterior', rating: 5 },
    { label: 'Interior', rating: 5 },
    { label: 'Engine', rating: 5 },
    { label: 'Electronics', rating: 5 },
  ];

  const averageRating = categories.reduce((sum, cat) => sum + cat.rating, 0) / categories.length;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-success';
    if (rating >= 3.5) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="w-80 h-auto shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 animate-float bid-card">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wrench className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Condition</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 fill-current" />
              <span className="text-xs font-semibold">{averageRating.toFixed(1)}/5</span>
            </div>
          </div>
          <h3 className="text-base font-semibold mt-2 leading-tight">
            Assessment
          </h3>
          <p className="text-xs opacity-90 mt-1">Professional evaluation</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-slate-50 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {categories.map((category, index) => (
              <div key={category.label} className="flex items-center justify-between">
                <span className="text-slate-600 uppercase tracking-wide font-medium">{category.label}</span>
                <div className="flex items-center space-x-1">
                  <span className={`font-semibold ${getRatingColor(category.rating)}`}>
                    {category.rating}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <Badge className="bg-success text-success-foreground">Excellent</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={onViewDetails}
                className="h-6 px-2 text-xs"
              >
                <Eye className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
