import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AutoResizeInput } from '@/components/ui/auto-resize-input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose,
  DrawerOverlay 
} from '@/components/ui/drawer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Scan, CheckCircle, DollarSign, History, Wrench, Send, Mic, Bot, User, Plus, Search, X, Car, Image, Clock, Calendar, Eye } from 'lucide-react';
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

interface Buyer {
  id: string;
  name: string;
  company: string;
  location: string;
  phone: string;
  email: string;
  specialties: string[];
  rating: number;
}

interface VehicleScannerWithChatProps {
  vehicleData?: VehicleData | null;
}

// Add new interface for scan results
interface ScanVehicleData {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  mileage: number;
  condition: 'New' | 'Used' | 'Certified Pre-Owned';
  exteriorColor?: string;
  interiorColor?: string;
  transmission?: string;
  fuelType?: string;
  price?: number;
  images: string[];
  features: string[];
  description?: string;
}

export const VehicleScannerWithChat = ({ vehicleData: externalVehicleData }: VehicleScannerWithChatProps) => {
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
  const [isScanning, setIsScanning] = useState(false);
  const [showScanPopup, setShowScanPopup] = useState(false);
  const [scanResults, setScanResults] = useState<ScanVehicleData | null>(null);
  const [showBuyerSelection, setShowBuyerSelection] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Stop recognition on unmount (safety)
  useEffect(() => {
    return () => {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
      } catch (e) {
        // no-op
      }
    };
  }, []);

  const handleMicClick = () => {
    try {
      // Stop any existing recognition first
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
        setIsRecording(false);
        return;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          title: 'Voice input unavailable',
          description: 'Your browser does not support speech recognition.',
        });
        return;
      }

      if (!recognitionRef.current) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';
        rec.onresult = (e: any) => {
          let text = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            text += e.results[i][0].transcript;
          }
          setInputMessage(text);
        };
        rec.onend = () => setIsRecording(false);
        rec.onerror = () => setIsRecording(false);
        recognitionRef.current = rec;
      }

      if (!isRecording) {
        setIsRecording(true);
        recognitionRef.current.start();
      }
    } catch {
      setIsRecording(false);
    }
  };

  const handleScan = async () => {
    setShowScanPopup(true);
    setIsScanning(true);
    
    try {
      // Simulate scanning process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock scan results with full vehicle data
      const mockResults: ScanVehicleData = {
        vin: '1HGBH41JXMN109186',
        year: 2021,
        make: 'Honda',
        model: 'Civic',
        trim: 'EX',
        mileage: 45000,
        condition: 'Used',
        exteriorColor: 'Crystal Black Pearl',
        interiorColor: 'Black',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        price: 25000,
        features: ['Bluetooth', 'Backup Camera', 'Lane Assist', 'Apple CarPlay', 'Android Auto'],
        images: [
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop',
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop'
        ],
        description: 'Well-maintained Honda Civic with low mileage and excellent features. Perfect for daily commuting.'
      };
      
      setScanResults(mockResults);
      setVehicleData(mockResults);
      
      // Add scan completion message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `✅ Scan complete! Found vehicle: ${mockResults.year} ${mockResults.make} ${mockResults.model} ${mockResults.trim}`,
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Scan failed:', error);
      toast({
        title: "Scan Failed",
        description: "Unable to scan the current page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
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

    // Focus back to input after sending
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

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

  const handleBidRequestSubmit = (selectedBuyers: Buyer[]) => {
    const buyerNames = selectedBuyers.map(buyer => buyer.name);
    toast({
      title: "Bid request sent!",
      description: `Sent to ${buyerNames.length} buyers: ${buyerNames.join(', ')}`
    });
    setShowBuyerModal(false);
  };

  const handleBidRequest = (selectedBuyers: Buyer[]) => {
    // Handle bid request submission
    toast({
      title: "Bid Request Sent",
      description: `Sent bid request to ${selectedBuyers.length} buyer(s)`,
    });
    setShowBuyerSelection(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Section - Full height */}
      <div className="flex-1 flex flex-col">
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
          <div className="bg-gray-100 rounded-lg p-3">
            <AutoResizeInput
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => {
                e.stopPropagation();
                setInputMessage(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Choose a function or ask me anything..."
              className="border-0 bg-transparent px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
              minRows={1}
              maxRows={4}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full border-gray-300 bg-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-3 rounded-full border-gray-300 bg-white flex items-center gap-2"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="text-sm">Scan</span>
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleMicClick}
                  size="icon"
                  variant="outline"
                  className={`h-8 w-8 rounded-full border-gray-300 bg-white ${isRecording ? 'border-red-500 text-red-600' : ''}`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                  className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Drawer */}
      <Drawer open={showScanPopup} onOpenChange={setShowScanPopup}>
        <DrawerContent className="h-[90vh] animate-slide-in-right">
          <DrawerHeader className="p-4 pb-2 border-b bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white">
            <div className="flex items-center justify-between">
              <DrawerTitle className="flex items-center space-x-2 text-left">
                <Search className="h-5 w-5" />
                <span className="text-lg font-bold">
                  {scanResults ? `${scanResults.year} ${scanResults.make} ${scanResults.model} ${scanResults.trim}` : 'Page Scanner'}
                </span>
              </DrawerTitle>
              <DrawerClose asChild>
                <button className="text-white/80 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          {isScanning ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-6"></div>
              <h4 className="text-xl font-semibold mb-2">Scanning Page</h4>
              <p className="text-gray-600 text-center max-w-md">
                Analyzing the current page for vehicle data, VIN numbers, pricing information, and other relevant details...
              </p>
            </div>
          ) : scanResults ? (
            <Tabs defaultValue="vehicle-details" className="flex flex-col h-full">
              <TabsList className="flex mx-4 mt-2 h-auto min-h-[40px] p-1 bg-muted rounded-md">
                <TabsTrigger value="vehicle-details" className="flex items-center justify-center gap-2 text-sm flex-1 px-3 py-1.5 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Car className="h-4 w-4" />
                  <span>Details</span>
                </TabsTrigger>
                <TabsTrigger value="bid-request" className="flex items-center justify-center gap-2 text-sm flex-1 px-3 py-1.5 rounded-sm data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                  <Send className="h-4 w-4" />
                  <span>Send Bid Request</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vehicle-details" className="flex-1 mt-0">
                <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-y-auto">
                  <div className="p-4 animate-fade-in">
                    <div className="space-y-4">
                      {/* Vehicle Images Carousel Card */}
                      <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                        <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Image className="h-4 w-4" />
                            <span>Vehicle Images</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          {scanResults.images.length === 0 ? (
                            <div className="bg-slate-50 p-6 text-center text-slate-600">
                              <Image className="h-10 w-10 mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No images available</p>
                              <p className="text-xs">Images will be displayed here when available</p>
                            </div>
                          ) : (
                            <div className="bg-slate-50 p-3">
                              <Carousel className="w-full max-w-xs mx-auto">
                                <CarouselContent>
                                  {scanResults.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                      <div className="p-1">
                                        <img
                                          src={image}
                                          alt={`Vehicle image ${index + 1}`}
                                          className="w-full h-48 object-cover rounded-lg shadow-sm"
                                          onError={(e) => {
                                            e.currentTarget.src = '/placeholder.svg';
                                          }}
                                        />
                                      </div>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious className="left-2" />
                                <CarouselNext className="right-2" />
                              </Carousel>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Vehicle Details Card */}
                      <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                        <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Car className="h-4 w-4" />
                            <span>Vehicle Information</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="bg-slate-50 p-3 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex flex-col">
                                <span className="text-slate-600 uppercase tracking-wide font-medium">VIN</span>
                                <div className="font-mono text-slate-800 mt-1 break-all">{scanResults.vin}</div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-600 uppercase tracking-wide font-medium">Mileage</span>
                                <div className="font-semibold text-slate-800 mt-1">{scanResults.mileage.toLocaleString()} mi</div>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-slate-600 uppercase tracking-wide font-medium">Condition</span>
                                <div className="font-semibold text-slate-800 mt-1">{scanResults.condition}</div>
                              </div>
                              {scanResults.price && (
                                <div className="flex flex-col">
                                  <span className="text-slate-600 uppercase tracking-wide font-medium">Price</span>
                                  <div className="font-semibold text-green-600 mt-1">${scanResults.price.toLocaleString()}</div>
                                </div>
                              )}
                              {scanResults.exteriorColor && (
                                <div className="flex flex-col">
                                  <span className="text-slate-600 uppercase tracking-wide font-medium">Exterior</span>
                                  <div className="font-semibold text-slate-800 mt-1">{scanResults.exteriorColor}</div>
                                </div>
                              )}
                              {scanResults.interiorColor && (
                                <div className="flex flex-col">
                                  <span className="text-slate-600 uppercase tracking-wide font-medium">Interior</span>
                                  <div className="font-semibold text-slate-800 mt-1">{scanResults.interiorColor}</div>
                                </div>
                              )}
                              {scanResults.transmission && (
                                <div className="flex flex-col">
                                  <span className="text-slate-600 uppercase tracking-wide font-medium">Transmission</span>
                                  <div className="font-semibold text-slate-800 mt-1">{scanResults.transmission}</div>
                                </div>
                              )}
                            </div>
                            
                            {scanResults.features && scanResults.features.length > 0 && (
                              <div className="pt-2 border-t border-slate-200">
                                <span className="text-slate-600 uppercase tracking-wide font-medium text-xs">Features</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {scanResults.features.map((feature, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {scanResults.description && (
                              <div className="pt-2 border-t border-slate-200">
                                <span className="text-slate-600 uppercase tracking-wide font-medium text-xs">Description</span>
                                <p className="mt-1 text-slate-800 text-sm">{scanResults.description}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Scan Timeline Card */}
                      <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                        <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>Scan Information</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="bg-slate-50 p-3 space-y-2">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-slate-600 flex-shrink-0" />
                              <div className="text-xs min-w-0">
                                <span className="font-medium text-slate-600 uppercase tracking-wide">Scanned:</span>
                                <span className="ml-1 text-slate-800">{formatDate(new Date().toISOString())}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <div className="text-xs min-w-0">
                                <span className="font-medium text-slate-600 uppercase tracking-wide">Status:</span>
                                <span className="ml-1 text-slate-800">Vehicle data extracted successfully</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <div className="text-xs min-w-0">
                                <span className="font-medium text-slate-600 uppercase tracking-wide">Data Points:</span>
                                <span className="ml-1 text-slate-800">{Object.keys(scanResults).length} fields extracted</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="bid-request" className="flex-1 mt-0">
                <ScrollArea className="max-h-[calc(90vh-8rem)] overflow-y-auto">
                  <div className="p-4 animate-fade-in">
                    <Card className="overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-200">
                      <CardHeader className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white p-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Send className="h-4 w-4" />
                          <span>Send Bid Request</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="bg-slate-50 p-3 space-y-4">
                          <div className="text-center">
                            <h4 className="font-semibold text-slate-800 mb-2">Ready to send bid request?</h4>
                            <p className="text-sm text-slate-600 mb-4">
                              Send this vehicle to potential buyers to get competitive offers.
                            </p>
                            <Button 
                              onClick={() => setShowBuyerSelection(true)}
                              className="w-full"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Select Buyers & Send Request
                            </Button>
                          </div>
                          
                          <div className="bg-white rounded-lg p-3 border border-slate-200">
                            <h5 className="font-medium text-slate-800 mb-2">Vehicle Summary</h5>
                            <div className="text-sm text-slate-600 space-y-1">
                              <p><span className="font-medium">Vehicle:</span> {scanResults.year} {scanResults.make} {scanResults.model} {scanResults.trim}</p>
                              <p><span className="font-medium">VIN:</span> {scanResults.vin}</p>
                              <p><span className="font-medium">Mileage:</span> {scanResults.mileage.toLocaleString()} miles</p>
                              {scanResults.price && (
                                <p><span className="font-medium">Listed Price:</span> ${scanResults.price.toLocaleString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-100 rounded-full p-6 mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="text-xl font-semibold mb-2">No Vehicle Data Found</h4>
              <p className="text-gray-600 max-w-md mb-6">
                We couldn't find any vehicle information on this page. Make sure you're on a car listing page or try a different website.
              </p>
              <Button 
                variant="outline"
                onClick={() => setShowScanPopup(false)}
              >
                Close Scanner
              </Button>
            </div>
          )}
        </DrawerContent>
      </Drawer>

      {/* Buyer Selection Modal */}
      <BuyerSelectionModal
        open={showBuyerSelection}
        onOpenChange={setShowBuyerSelection}
        vehicle={scanResults}
        onSubmit={handleBidRequest}
      />

      {/* Existing Modals */}
      {showVehicleDetails && vehicleData && (
        <VehicleDetailsModal
          open={showVehicleDetails}
          onOpenChange={setShowVehicleDetails}
          vehicle={vehicleData}
        />
      )}
      {showValuationDetails && valuationData && (
        <ValuationDetailsModal
          open={showValuationDetails}
          onOpenChange={setShowValuationDetails}
          valuation={valuationData}
        />
      )}
      {showConditionDetails && (
        <ConditionDetailsModal
          open={showConditionDetails}
          onOpenChange={setShowConditionDetails}
        />
      )}
      {showBuyerModal && (
        <BuyerSelectionModal
          open={showBuyerModal}
          onOpenChange={setShowBuyerModal}
          vehicle={vehicleData}
          onSubmit={handleBidRequestSubmit}
        />
      )}
    </div>
  );
};

