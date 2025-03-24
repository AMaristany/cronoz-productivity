
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Statistics from "./pages/Statistics";
import Activities from "./pages/Activities";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

// Create a QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  // Setup effect for mobile app initialization
  useEffect(() => {
    // Check if running in Capacitor environment (will be used when we convert to mobile)
    const isCapacitorApp = window.Capacitor?.isNativePlatform() || false;
    
    if (isCapacitorApp) {
      // Set additional configurations for mobile environment
      document.documentElement.classList.add('capacitor-app');
      
      // Prevent default touch behavior to avoid delays
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      }, { passive: false });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
