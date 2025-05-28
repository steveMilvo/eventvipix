import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Plus, Eye, Link, Download, Users, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface QRCodeGalleryItem {
  id: number;
  code: string;
  qrCodeUrl: string;
  isAssigned: boolean;
  assignedTo: number | null;
  createdAt: string;
}

interface Event {
  id: number;
  name: string;
  loginCode?: string;
  packageType: string;
  status: string;
}

interface QRGalleryStats {
  total: number;
  assigned: number;
  available: number;
}

export default function AdminQRGallery() {
  const [qrCodes, setQrCodes] = useState<QRCodeGalleryItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<QRGalleryStats>({ total: 0, assigned: 0, available: 0 });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [batchCount, setBatchCount] = useState(10);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCodeGalleryItem | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadQRCodes();
    loadStats();
    loadEvents();
  }, []);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("GET", "/api/admin/qr-gallery/available");
      if (response.ok) {
        const data = await response.json();
        setQrCodes(data.codes || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load QR codes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/qr-gallery/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await apiRequest("GET", "/api/admin/events");
      if (response.ok) {
        const events = await response.json();
        setEvents(events.filter((event: Event) => !event.loginCode)); // Only events without QR codes
      }
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const generateBatch = async () => {
    try {
      setGenerating(true);
      const response = await apiRequest("POST", "/api/admin/qr-gallery/generate-batch", {
        count: batchCount
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Generated ${batchCount} new QR codes`,
        });
        
        // Reload data
        loadQRCodes();
        loadStats();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to generate QR codes",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR codes",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const assignQRCode = async () => {
    if (!selectedQRCode || !selectedEventId) {
      toast({
        title: "Error",
        description: "Please select both a QR code and an event",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/admin/qr-gallery/assign", {
        qrCodeId: selectedQRCode.id,
        eventId: parseInt(selectedEventId)
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `QR code assigned to ${data.event.name}`,
        });
        
        // Reload data
        loadQRCodes();
        loadStats();
        loadEvents();
        setAssignDialogOpen(false);
        setSelectedQRCode(null);
        setSelectedEventId("");
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to assign QR code",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign QR code",
        variant: "destructive",
      });
    }
  };

  const downloadQRCode = (qrCode: QRCodeGalleryItem) => {
    const link = document.createElement('a');
    link.href = qrCode.qrCodeUrl;
    link.download = `qr-code-${qrCode.code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">QR Code Gallery</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your pre-generated QR codes and assign them to events
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
              <QrCode className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                Generated QR codes in gallery
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.available}</div>
              <p className="text-xs text-muted-foreground">
                Ready to assign to events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
              <p className="text-xs text-muted-foreground">
                Currently in use
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Generate New QR Codes */}
        <Card>
          <CardHeader>
            <CardTitle>Generate New QR Codes</CardTitle>
            <CardDescription>
              Create a batch of QR codes to maintain your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="batch-count" className="block text-sm font-medium mb-2">
                  Number of QR Codes to Generate
                </label>
                <Input
                  id="batch-count"
                  type="number"
                  min="1"
                  max="100"
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value) || 10)}
                  className="max-w-xs"
                />
              </div>
              <Button 
                onClick={generateBatch} 
                disabled={generating || batchCount < 1 || batchCount > 100}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                {generating ? "Generating..." : "Generate QR Codes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Available QR Codes ({stats.available})</CardTitle>
            <CardDescription>
              QR codes ready to be assigned to events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Loading QR codes...</p>
              </div>
            ) : qrCodes.length === 0 ? (
              <div className="text-center py-8">
                <QrCode className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300">No available QR codes</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generate some QR codes to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {qrCodes.map((qrCode) => (
                  <Card key={qrCode.id} className="border-2 hover:border-purple-300 transition-colors">
                    <CardContent className="p-4 text-center">
                      <div className="mb-4">
                        <img 
                          src={qrCode.qrCodeUrl} 
                          alt={`QR Code ${qrCode.code}`}
                          className="w-32 h-32 mx-auto border rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="font-mono">
                          {qrCode.code}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode(qrCode)}
                            className="flex-1"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedQRCode(qrCode);
                              setAssignDialogOpen(true);
                            }}
                            className="flex-1"
                          >
                            <Link className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign QR Code to Event</DialogTitle>
              <DialogDescription>
                Select an event to assign this QR code to. The event will receive this QR code for camera access.
              </DialogDescription>
            </DialogHeader>
            
            {selectedQRCode && (
              <div className="space-y-4">
                <div className="text-center">
                  <img 
                    src={selectedQRCode.qrCodeUrl} 
                    alt={`QR Code ${selectedQRCode.code}`}
                    className="w-24 h-24 mx-auto border rounded-lg mb-2"
                  />
                  <Badge variant="outline" className="font-mono">
                    {selectedQRCode.code}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Event</label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event..." />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id.toString()}>
                          {event.name} ({event.packageType})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAssignDialogOpen(false);
                      setSelectedQRCode(null);
                      setSelectedEventId("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={assignQRCode}
                    disabled={!selectedEventId}
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                  >
                    Assign QR Code
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}