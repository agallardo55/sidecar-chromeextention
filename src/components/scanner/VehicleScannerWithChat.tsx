import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Scan, CheckCircle, DollarSign, History, Wrench, Send, Bot, User } from 'lucide-react';
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

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VehicleScannerWithChatProps {
  vehicleData?: VehicleData | null;
}

export const VehicleScannerWithChat = ({ vehicleData: externalVehicleData }: VehicleScannerWithChatProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [showValuationDetails, setShowValuationDetails] = useState(false);
  const [showConditionDetails, setShowConditionDetails] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your car buying and selling copilot. I can help you analyze vehicle data, provide valuations, and give you insights to make better decisions. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update vehicle data when external data is received
  useEffect(() => {
    if (externalVehicleData) {
      setVehicleData(externalVehicleData);
    }
  }, [externalVehicleData]);

  const handleScan = async () => {
    setIsScanning(true);
    toast({
      title: "Scanning page...",
      description: "Looking for vehicle data on this page."
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

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
      description: "I've extracted vehicle information from this page."
    });

    const aiMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'assistant',
      content: `I found a ${mockVehicle.year} ${mockVehicle.make} ${mockVehicle.model} ${mockVehicle.trim} with ${mockVehicle.mileage.toLocaleString()} miles. The KBB retail value is $${mockValuation.kbb.retail.toLocaleString()}. Would you like me to analyze this vehicle for you?`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, vehicleData, valuationData);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string, vehicle: VehicleData | null, valuation: ValuationData | null): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('value') || input.includes('worth') || input.includes('price')) {
      if (vehicle && valuation) {
        return `Based on the ${vehicle.year} ${vehicle.make} ${vehicle.model} data I found, here's the valuation breakdown:\n\n• KBB Retail: $${valuation.kbb.retail.toLocaleString()}\n• KBB Lending: $${valuation.kbb.lending.toLocaleString()}\n• MMR Value: $${valuation.mmr.value.toLocaleString()} (${valuation.mmr.trend === 'up' ? '+' : ''}${valuation.mmr.change}%)\n\nThis vehicle appears to be priced competitively in the current market.`;
      }
      return "I don't see any vehicle data yet. Try scanning the page first to get valuation information.";
    }
    
    if (input.includes('condition') || input.includes('quality')) {
      if (vehicle) {
        return `The ${vehicle.year} ${vehicle.make} ${vehicle.model} shows as ${vehicle.condition} with ${vehicle.mileage.toLocaleString()} miles. Key features include: ${vehicle.features.slice(0, 3).join(', ')}. Would you like me to analyze the condition further?`;
      }
      return "I need to scan the page first to analyze the vehicle condition.";
    }
    
    if (input.includes('market') || input.includes('trend')) {
      return "Based on current market trends, used vehicle prices are stabilizing after the recent supply chain issues. This is generally a good time to buy, but always negotiate based on the specific vehicle's condition and history.";
    }
    
    if (input.includes('negotiate') || input.includes('offer')) {
      if (valuation) {
        const suggestedOffer = Math.round(valuation.kbb.retail * 0.95);
        return `For negotiation, I'd suggest starting around $${suggestedOffer.toLocaleString()} (about 5% below KBB retail). Focus on any issues you find during inspection and use comparable sales data to support your offer.`;
      }
      return "I can help you with negotiation strategies once I have vehicle data. Try scanning the page first.";
    }
    
    return "I'm here to help with your car buying and selling decisions! I can analyze vehicle data, provide valuations, market insights, and negotiation advice. What specific information would you like?";
  };

  const handleBidRequestSubmit = (selectedBuyers: string[]) => {
    toast({
      title: "Bid request sent!",
      description: `Sent to ${selectedBuyers.length} buyers.`
    });
    setShowBuyerModal(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Scanner Section - Top portion */}
      <div className="flex-1 min-h-0 overflow-auto p-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5" />
              Vehicle Page Scanner
            </CardTitle>
            <CardDescription>
              Navigate to any vehicle listing page and click below to extract vehicle data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleScan} 
              disabled={isScanning}
              className="w-full"
              size="lg"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="h-4 w-4 mr-2" />
                  Start Page Scan
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">vAuto</Button>
              <Button variant="outline" size="sm">VINcue</Button>
              <Button variant="outline" size="sm">Autotrader</Button>
              <Button variant="outline" size="sm">Cars.com</Button>
            </div>
          </CardContent>
        </Card>

        {vehicleData && (
          <>
            <CompactVehicleCard 
              vehicle={vehicleData} 
              onViewDetails={() => setShowVehicleDetails(true)}
            />
            <CompactValuationCard 
              valuation={valuationData!} 
              onViewDetails={() => setShowValuationDetails(true)}
            />
            <CompactConditionCard 
              onViewDetails={() => setShowConditionDetails(true)}
            />
            
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={() => setShowBuyerModal(true)}
                  className="w-full"
                >
                  Send Bid Request
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Auto Extract VIN, specs & pricing
                </div>
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-500" />
                  History Carfax & AutoCheck
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  $ Valuations KBB, JD Power, MMR
                </div>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-purple-500" />
                  Assessment Condition evaluation
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Section - Bottom portion */}
      <div className="border-t bg-background flex-shrink-0">
        <div className="flex flex-col" style={{ height: '280px' }}>
          {/* Chat Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Chat Input */}
          <div className="border-t p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me about this vehicle, market trends, or negotiation advice..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VehicleDetailsModal
        vehicle={vehicleData}
        open={showVehicleDetails}
        onOpenChange={setShowVehicleDetails}
      />
      <ValuationDetailsModal
        valuation={valuationData}
        open={showValuationDetails}
        onOpenChange={setShowValuationDetails}
      />
      <ConditionDetailsModal
        open={showConditionDetails}
        onOpenChange={setShowConditionDetails}
      />
      <BuyerSelectionModal
        open={showBuyerModal}
        onOpenChange={setShowBuyerModal}
        onSubmit={handleBidRequestSubmit}
      />
    </div>
  );
};

