import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, QrCode } from "lucide-react";
import { useLocation } from "wouter";

export default function CameraAccess() {
  const [, setLocation] = useLocation();
  const [eventCode, setEventCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventCode.trim()) {
      setError("Please enter an event code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Verify the event code exists
      const response = await fetch(`/api/camera/${eventCode.toUpperCase()}`);
      const result = await response.json();

      if (response.ok && result.accessGranted) {
        // Redirect to camera interface with the event code
        setLocation(`/camera/${eventCode.toUpperCase()}`);
      } else {
        setError(result.message || "Event not found. Please check your code.");
      }
    } catch (error) {
      setError("Unable to verify event code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Camera className="h-6 w-6" />
            VIPix Event Camera
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your event code to access the camera
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter event code (e.g., WEDDING1)"
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.toUpperCase())}
                className="text-center text-lg font-mono"
                maxLength={10}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Access Camera"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <QrCode className="h-4 w-4" />
              Have a QR code?
            </div>
            <p className="text-xs text-muted-foreground">
              Scan the QR code provided by the event organizer for instant access
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700 text-center">
              Available demo events: WEDDING1, CONF2025, BDAY30
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}