import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleScannerWithChat } from "./scanner/VehicleScannerWithChat";
import { useToast } from "@/hooks/use-toast";

// Lazy load components - Fixed syntax
const BidRequestsList = lazy(() => import("./bid-requests/BidRequestsList"));
const BuyersList = lazy(() => import("./buyers/BuyersList"));
const ProfileSettings = lazy(() => import("./profile/ProfileSettings"));

// Loading component
const TabLoading = () => (
  <div className="flex items-center justify-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

export function Layout() {
  const [activeTab, setActiveTab] = useState("scanner");
  const [vehicleData, setVehicleData] = useState(null);
  const { toast } = useToast();

  // Listen for messages from content script
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'VEHICLE_DATA_EXTRACTED') {
        setVehicleData(event.data.data);
        toast({
          title: "Vehicle Data Received",
          description: "New vehicle data has been extracted from the current page.",
        });
      }
    };

    // Listen for messages from popup/content script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'VEHICLE_DATA_EXTRACTED') {
        setVehicleData(request.data);
        toast({
          title: "Vehicle Data Received",
          description: "New vehicle data has been extracted from the current page.",
        });
      }
    });

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [toast]);

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
                <Suspense fallback={<TabLoading />}>
                  <BidRequestsList />
                </Suspense>
              </TabsContent>

              <TabsContent value="buyers" className="h-full">
                <Suspense fallback={<TabLoading />}>
                  <BuyersList />
                </Suspense>
              </TabsContent>

              <TabsContent value="profile" className="h-full">
                <Suspense fallback={<TabLoading />}>
                  <ProfileSettings />
                </Suspense>
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