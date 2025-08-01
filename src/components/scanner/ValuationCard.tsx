import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, TrendingUp, TrendingDown, Minus } from 'lucide-react';
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
interface ValuationCardProps {
  valuation: ValuationData;
}
export const ValuationCard: React.FC<ValuationCardProps> = ({
  valuation
}) => {
  const formatPrice = (price: number) => `$${price.toLocaleString()}`;
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };
  return <div className="space-y-4">
      {/* Manheim MMR Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Manheim Market Report</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Retail Value</span>
            <span className="font-bold text-success">{formatPrice(valuation.kbb.retail)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">MMR Value</span>
            <span className="font-bold text-primary">{formatPrice(valuation.mmr.value)}</span>
          </div>
          
        </CardContent>
      </Card>

      {/* Kelly Blue Book Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Kelly Blue Book Values</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Retail Value</span>
            <span className="font-bold text-success">{formatPrice(valuation.kbb.retail)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Lending Value</span>
            <span className="font-bold">{formatPrice(valuation.kbb.lending)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Auction Value</span>
            <span className="font-bold text-primary">{formatPrice(valuation.kbb.auction)}</span>
          </div>
        </CardContent>
      </Card>

      {/* JD Power Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>JD Power Valuations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Retail Value</span>
            <span className="font-bold text-success">{formatPrice(valuation.jdPower.retail)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Auction Value</span>
            <span className="font-bold text-primary">{formatPrice(valuation.jdPower.auction)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Value Summary */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Value Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Highest Value</span>
            <span className="font-bold text-success">
              {formatPrice(Math.max(valuation.kbb.retail, valuation.jdPower.retail))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Lowest Value</span>
            <span className="font-bold text-warning">
              {formatPrice(Math.min(valuation.kbb.auction, valuation.jdPower.auction))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Average</span>
            <span className="font-bold">
              {formatPrice(Math.round((valuation.kbb.retail + valuation.kbb.auction + valuation.jdPower.retail + valuation.jdPower.auction + valuation.mmr.value) / 5))}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">MMR Position</span>
            <span className="font-bold text-primary">{formatPrice(valuation.mmr.value)}</span>
          </div>
        </CardContent>
      </Card>
    </div>;
};