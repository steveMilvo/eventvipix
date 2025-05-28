import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CameraInterface from "@/components/camera/camera-interface";
import FilterControls from "@/components/camera/filter-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera as CameraIcon } from "lucide-react";
import { Link } from "wouter";

interface Event {
  id: number;
  name: string;
  folderName: string;
  packageType: string;
  maxPhotos?: number;
  photoCount: number;
}

export default function Camera() {
  const { loginCode } = useParams();
  const [location, setLocation] = useLocation();
  const [selectedFilter, setSelectedFilter] = useState<string>("none");
  const [inputCode, setInputCode] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Check URL for QR code access
  const urlParams = new URLSearchParams(window.location.search);
  const qrCodeParam = urlParams.get('code');
  const activeCode = loginCode || qrCodeParam;

  // Query for event by login code if provided
  const { data: event, isLoading, error } = useQuery<Event>({
    queryKey: [`/api/events/access/${activeCode}`],
    enabled: !!activeCode,
  });

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      setIsConnecting(true);
      setLocation(`/camera/${inputCode.toUpperCase()}`);
    }
  };

  useEffect(() => {
    // Request camera permissions on mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          console.log('Camera permission granted');
        })
        .catch((error) => {
          console.error('Camera permission denied:', error);
        });
    }
  }, []);

  // Show loading state when connecting via login code
  if (isLoading && loginCode) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" />
          <p>Connecting to event...</p>
        </div>
      </div>
    );
  }

  // Show login code input if no code provided
  if (!loginCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CameraIcon className="mx-auto h-12 w-12 text-blue-600 mb-4" />
            <CardTitle className="text-2xl">Enter Event Code</CardTitle>
            <p className="text-gray-600">Enter your event login code to access the camera</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter event code (e.g., WEDDING2024)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="text-center text-lg tracking-wider uppercase"
                autoFocus
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!inputCode.trim() || isConnecting}
              >
                {isConnecting ? "Connecting..." : "Access Camera"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if event not found
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Event Not Found</CardTitle>
            <p className="text-gray-600">The login code you entered was not found or has expired</p>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setLocation('/camera')}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show camera interface when connected to event
  return (
    <div className="relative bg-black min-h-screen overflow-hidden">
      {/* Event Info Banner */}
      {event && (
        <div className="absolute top-4 left-4 right-4 z-20 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-center">
            <h2 className="font-semibold">{event.name}</h2>
            <p className="text-sm opacity-80">
              {event.maxPhotos ? `${event.photoCount}/${event.maxPhotos} photos` : `${event.photoCount} photos`}
            </p>
          </div>
        </div>
      )}

      {/* Camera Video Container */}
      <div className="absolute inset-0">
        <CameraInterface
          eventId={event?.id}
          selectedFilter={selectedFilter}
        />
      </div>

      {/* Top Controls */}
      <div className="absolute top-20 left-4 right-4 z-10 pointer-events-none">
        <div className="flex justify-between items-center">
          <Link href="/camera">
            <Button
              variant="ghost"
              size="icon"
              className="glassmorphism text-white hover:bg-white/20 transition-colors pointer-events-auto"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>

          {event && (
            <div className="glassmorphism px-4 py-2 rounded-full pointer-events-auto">
              <span className="text-white text-sm font-medium">{event.name}</span>
            </div>
          )}

          <div className="w-10 h-10" /> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* Filter Controls */}
      <FilterControls
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />
    </div>
  );
}
