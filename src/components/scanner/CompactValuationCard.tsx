
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react';

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

interface CompactValuationCardProps {
  valuation: ValuationData;
  onViewDetails?: () => void;
}

export const CompactValuationCard: React.FC<CompactValuationCardProps> = ({
  valuation,
  onViewDetails
}) => {
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-success" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const averageValue = Math.round(
    (valuation.kbb.retail + valuation.kbb.auction + valuation.jdPower.retail + valuation.jdPower.auction + valuation.mmr.value) / 5
  );

  return (
    <Card className="w-80 h-auto shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 animate-float bid-card">
      <CardHeader className="p-0">
        <div className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Valuation</span>
            </div>
            <div className="flex items-center space-x-1">
              {getTrendIcon(valuation.mmr.trend)}
              <span className="text-xs">
                {valuation.mmr.change > 0 ? '+' : ''}{valuation.mmr.change}%
              </span>
            </div>
          </div>
          <h3 className="text-base font-semibold mt-2 leading-tight">
            Market Analysis
          </h3>
          <p className="text-xs opacity-90 mt-1">Multi-source valuation data</p>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="bg-slate-50 p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-600 uppercase tracking-wide font-medium">KBB Retail</span>
              <div className="font-semibold text-slate-800 mt-1">{formatPrice(valuation.kbb.retail)}</div>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-600 uppercase tracking-wide font-medium">KBB Auction</span>
              <div className="font-semibold text-slate-800 mt-1">{formatPrice(valuation.kbb.auction)}</div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-slate-600 uppercase tracking-wide font-medium">JD Power</span>
              <div className="font-semibold text-slate-800 mt-1">{formatPrice(valuation.jdPower.retail)}</div>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-600 uppercase tracking-wide font-medium">MMR Value</span>
              <div className="font-semibold text-primary mt-1">{formatPrice(valuation.mmr.value)}</div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 uppercase tracking-wide font-medium">Average</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-800">{formatPrice(averageValue)}</span>
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
        </div>
      </CardContent>
    </Card>
  );
};
