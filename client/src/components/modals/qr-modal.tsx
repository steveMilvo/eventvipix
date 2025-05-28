import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, Folder, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  eventName: string;
  loginCode: string;
}

export default function QRModal({ isOpen, onClose, eventId, eventName, loginCode }: QRModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [accessLink, setAccessLink] = useState<string>("");
  const { toast } = useToast();

  // Load existing QR code when modal opens
  useEffect(() => {
    if (isOpen && eventId) {
      loadEventQRCode();
    }
  }, [isOpen, eventId]);

  const loadEventQRCode = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const event = await response.json();
        if (event.qrCode) {
          setQrCodeUrl(event.qrCode);
          setAccessLink(event.accessLink || `${window.location.origin}/camera/${loginCode}`);
        }
      }
    } catch (error) {
      console.error('Error loading QR code:', error);
    }
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/events/${eventId}/regenerate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const event = await response.json();
        setQrCodeUrl(event.qrCode || "");
        setAccessLink(event.accessLink || `${window.location.origin}/camera/${loginCode}`);
        toast({
          title: "Success",
          description: "QR code generated successfully",
        });
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const regenerateAllQRCodes = async () => {
    setIsRegeneratingAll(true);
    try {
      const response = await fetch('/api/admin/generate-qr-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: result.message,
        });
        // Reload current QR code
        await loadEventQRCode();
      } else {
        throw new Error('Failed to regenerate all QR codes');
      }
    } catch (error) {
      console.error('Error regenerating all QR codes:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate all QR codes",
        variant: "destructive",
      });
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) {
      toast({
        title: "Error",
        description: "No QR code to download",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${eventName.replace(/[^a-z0-9]/gi, '-')}-qr-code.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "QR code downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  const downloadAllQRCodes = async () => {
    setIsDownloadingAll(true);
    try {
      // Get all events with QR codes
      const eventsResponse = await fetch('/api/admin/events');
      if (!eventsResponse.ok) {
        throw new Error('Failed to fetch events');
      }

      const events = await eventsResponse.json();
      const eventsWithQR = events.filter((event: any) => event.qrCode);

      if (eventsWithQR.length === 0) {
        toast({
          title: "Info",
          description: "No QR codes found to download",
        });
        return;
      }

      // Download each QR code
      for (const event of eventsWithQR) {
        try {
          const response = await fetch(event.qrCode);
          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${event.name.replace(/[^a-z0-9]/gi, '-')}-qr-code.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Error downloading QR code for ${event.name}:`, error);
        }
      }

      toast({
        title: "Success",
        description: `Downloaded ${eventsWithQR.length} QR codes`,
      });
    } catch (error) {
      console.error('Error downloading all QR codes:', error);
      toast({
        title: "Error",
        description: "Failed to download all QR codes",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const copyLink = async () => {
    const linkToCopy = accessLink || `${window.location.origin}/camera/${loginCode}`;

    try {
      await navigator.clipboard.writeText(linkToCopy);
      toast({
        title: "Success",
        description: "Access link copied to clipboard",
      });
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const saveToFolder = () => {
    // This would typically open a file system dialog
    // For now, we'll just trigger a download
    downloadQRCode();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Event QR Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Event Name</Label>
            <Input value={eventName} readOnly />
          </div>

          <div className="space-y-2">
            <Label>Login Code</Label>
            <Input value={loginCode} readOnly />
          </div>

          <div className="space-y-2">
            <Label>Camera Access Link</Label>
            <Input value={accessLink || `${window.location.origin}/camera/${loginCode}`} readOnly />
          </div>

          <div className="text-center">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="Event QR Code" 
                className="mx-auto border rounded-lg max-w-[200px]"
              />
            ) : (
              <div className="border rounded-lg p-8 text-gray-500">
                <div className="text-sm">No QR Code Generated</div>
                <div className="text-xs mt-1">Click "Generate QR" to create one</div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={generateQRCode} 
              disabled={isGenerating}
              className="flex-1"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate QR"}
            </Button>
          </div>

          {qrCodeUrl && (
            <div className="flex gap-2">
              <Button onClick={downloadQRCode} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={copyLink} variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button onClick={saveToFolder} variant="outline" className="flex-1">
                <Folder className="mr-2 h-4 w-4" />
                Folder
              </Button>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="text-sm font-medium mb-2">Bulk Actions</div>
            <div className="flex gap-2">
              <Button 
                onClick={downloadAllQRCodes} 
                variant="outline" 
                className="flex-1"
                disabled={isDownloadingAll}
              >
                <Download className="mr-2 h-4 w-4" />
                {isDownloadingAll ? "Downloading..." : "Download All"}
              </Button>
              <Button 
                onClick={regenerateAllQRCodes} 
                variant="outline" 
                className="flex-1"
                disabled={isRegeneratingAll}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {isRegeneratingAll ? "Regenerating..." : "Regenerate All"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}