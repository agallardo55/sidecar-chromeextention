import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleScannerWithChat } from "./scanner/VehicleScannerWithChat";
import { BidRequestsList } from "./bid-requests/BidRequestsList";
import { BuyersList } from "./buyers/BuyersList";
import { ProfileSettings } from "./profile/ProfileSettings";
import { LoginForm } from "./auth/LoginForm";
import { Scan, CheckCircle, DollarSign, History, Wrench, Send, Mic, Bot, User, Plus, Search, X, Car, Image, Clock, Calendar, Eye } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "./auth/AuthContext";

export function Layout() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("scanner");
  const [vehicleData, setVehicleData] = useState(null);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-surface">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Car className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold text-foreground">SidecarAI</h1>
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show login form if no user is authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show main layout if user is authenticated
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold">SidecarAI</h1>
                <p className="text-xs text-muted-foreground">Bid Scanner</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="border-b px-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="scanner">Scanner</TabsTrigger>
                <TabsTrigger value="bids">Bids</TabsTrigger>
                <TabsTrigger value="buyers">Buyers</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <TabsContent value="scanner" className="h-full m-0">
                <VehicleScannerWithChat vehicleData={vehicleData} />
              </TabsContent>

              <TabsContent value="bids" className="h-full">
                <BidRequestsList />
              </TabsContent>

              <TabsContent value="buyers" className="h-full">
                <BuyersList />
              </TabsContent>

              <TabsContent value="profile" className="h-full">
                <ProfileSettings />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Status Bar */}
        <div className="border-t bg-card px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Extension Active</span>
            <Badge variant="secondary" className="text-xs">
              v1.0.0
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}