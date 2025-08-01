import { Car } from 'lucide-react';

export const LoadingView = () => {
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
};