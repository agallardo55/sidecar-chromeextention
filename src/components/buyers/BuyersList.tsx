import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Mail, Search, Star, MapPin, Grid, List as ListIcon, Filter } from 'lucide-react';
import { BuyerSkeleton } from '@/components/ui/loading-skeleton';
import { BuyerEditModal } from './BuyerEditModal';

interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  lastActive: string;
  avgResponseTime: string;
  status?: 'active' | 'inactive';
  lastContact?: string;
}

const mockBuyers: Buyer[] = [
  {
    id: '1',
    name: 'Mike Johnson',
    company: 'Johnson Auto Sales',
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviewCount: 127,
    phone: '(555) 123-4567',
    email: 'mike@johnsonaut.com',
    specialties: ['Honda', 'Toyota', 'Nissan'],
    lastActive: '2 hours ago',
    avgResponseTime: '15 mins'
  },
  {
    id: '2',
    name: 'Sarah Martinez',
    company: 'Elite Auto Group',
    location: 'Miami, FL',
    rating: 4.9,
    reviewCount: 89,
    phone: '(555) 987-6543',
    email: 'sarah@eliteauto.com',
    specialties: ['BMW', 'Mercedes', 'Audi'],
    lastActive: '1 hour ago',
    avgResponseTime: '8 mins'
  },
  {
    id: '3',
    name: 'David Chen',
    company: 'Pacific Motors',
    location: 'Seattle, WA',
    rating: 4.7,
    reviewCount: 156,
    phone: '(555) 456-7890',
    email: 'david@pacificmotors.com',
    specialties: ['Ford', 'Chevrolet', 'RAM'],
    lastActive: '30 minutes ago',
    avgResponseTime: '12 mins'
  }
];

interface BuyersListProps {
  onAddBuyer?: (buyer: Buyer) => void;
}

export const BuyersList = ({ onAddBuyer }: BuyersListProps) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [sortBy, setSortBy] = useState<'rating' | 'responseTime' | 'lastActive'>('rating');
  
  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('edit');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setBuyers(mockBuyers);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle adding new buyer from external trigger (FAB button)
  useEffect(() => {
    if (onAddBuyer) {
      // This effect will be triggered when parent wants to add a buyer
      // We'll handle this through the openAddModal function instead
    }
  }, [onAddBuyer]);

  const openAddModal = () => {
    setSelectedBuyer(null);
    setModalMode('add');
    setIsEditModalOpen(true);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };
  
  const getAvatarColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const handleBuyerClick = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setModalMode('edit');
    setIsEditModalOpen(true);
  };

  const handleSaveBuyer = (buyer: Buyer) => {
    if (modalMode === 'add') {
      // Add new buyer with default values for missing fields
      const newBuyer = {
        ...buyer,
        location: 'Location TBD',
        rating: 5.0,
        reviewCount: 0,
        specialties: [],
        lastActive: 'Just now',
        avgResponseTime: 'N/A'
      };
      setBuyers(prev => [newBuyer, ...prev]);
      if (onAddBuyer) {
        onAddBuyer(newBuyer);
      }
    } else {
      // Update existing buyer
      setBuyers(prev => prev.map(b => 
        b.id === buyer.id ? buyer : b
      ));
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: 'phone' | 'email', buyer: Buyer) => {
    e.stopPropagation(); // Prevent card click
    
    if (action === 'phone') {
      window.open(`tel:${buyer.phone}`, '_self');
    } else if (action === 'email') {
      window.open(`mailto:${buyer.email}`, '_self');
    }
  };

  const filteredBuyers = buyers.filter(buyer => 
    buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    buyer.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    buyer.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
    buyer.specialties.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'responseTime':
        return parseInt(a.avgResponseTime) - parseInt(b.avgResponseTime);
      case 'lastActive':
        return a.lastActive.localeCompare(b.lastActive);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-bold">Verified Buyers</h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search buyers..." 
              className="pl-12 h-12 border-2 border-primary/20 rounded-xl bg-white shadow-sm" 
              disabled 
            />
          </div>
        </div>
        <div className="grid gap-4 md:gap-6">
          {[1, 2, 3].map(i => <BuyerSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (buyers.length === 0) {
    return (
      <Card className="shadow-medium">
        <CardHeader className="text-center">
          <CardTitle>No Buyers Available</CardTitle>
          <CardDescription>
            Buyers will appear here once they join the network
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-xl md:text-2xl font-bold">Buyers</h2>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-muted rounded-md p-1">
              <Button 
                variant={viewMode === 'card' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('card')} 
                className="h-8 w-8 p-0"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')} 
                className="h-8 w-8 p-0"
              >
                <ListIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search buyers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-2 border-primary/20 rounded-xl bg-white shadow-sm focus:border-primary transition-colors" 
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {filteredBuyers.map((buyer, index) => (
            <div 
              key={buyer.id} 
              onClick={() => handleBuyerClick(buyer)}
              className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-lg shadow-slate-900/5 border border-white/20 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl ${getAvatarColor(index)} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-lg">
                      {getInitials(buyer.name)}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-slate-900">{buyer.name}</h3>
                    <p className="text-indigo-600 font-medium">{buyer.company}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={(e) => handleActionClick(e, 'phone', buyer)}
                    className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                  >
                    <Phone className="h-4 w-4 text-white" />
                  </button>
                  <button 
                    onClick={(e) => handleActionClick(e, 'email', buyer)}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                  >
                    <Mail className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BuyerEditModal
        buyer={selectedBuyer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveBuyer}
        mode={modalMode}
      />
    </>
  );
};
