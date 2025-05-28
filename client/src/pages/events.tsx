import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Camera, Crown, Package, Share, QrCode, Plus, Download } from "lucide-react";
import CreateEventModal from "@/components/modals/create-event-modal";
import QRModal from "@/components/modals/qr-modal";
import { Link } from "wouter";

interface Event {
  id: number;
  name: string;
  description: string;
  eventDate: string;
  packageType: string;
  status: string;
  photoCount: number;
  price: string;
  loginCode: string;
  qrCode?: string;
  accessLink?: string;
}

// Sample QR code data (base64 encoded QR codes)
const sampleQRCode = "data:image/png;base64,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";

export default function Events() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock events with QR codes
  const events: Event[] = [
    {
      id: 1,
      name: "Wedding: Sarah & John",
      description: "A beautiful wedding ceremony and reception at Sunset Gardens",
      eventDate: "2025-06-15T18:00:00.000Z",
      packageType: "premium",
      status: "active",
      photoCount: 0,
      price: "75",
      loginCode: "WEDDING1",
      qrCode: sampleQRCode,
      accessLink: "/camera/WEDDING1"
    },
    {
      id: 2,
      name: "Corporate Conference 2025",
      description: "Annual tech conference with keynote speakers and networking",
      eventDate: "2025-07-10T09:00:00.000Z",
      packageType: "premium",
      status: "active",
      photoCount: 0,
      price: "75",
      loginCode: "CONF2025",
      qrCode: sampleQRCode,
      accessLink: "/camera/CONF2025"
    },
    {
      id: 3,
      name: "Birthday Party: Mike's 30th",
      description: "Celebration of Mike's 30th birthday at Downtown Lounge",
      eventDate: "2025-05-30T20:00:00.000Z",
      packageType: "standard",
      status: "active",
      photoCount: 0,
      price: "50",
      loginCode: "BDAY30",
      qrCode: sampleQRCode,
      accessLink: "/camera/BDAY30"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPackageIcon = (packageType: string) => {
    return packageType === 'premium' ? (
      <Crown className="h-4 w-4 mr-1" />
    ) : (
      <Package className="h-4 w-4 mr-1" />
    );
  };

  const handleShowQR = (event: Event) => {
    setSelectedEvent(event);
    setQrModalOpen(true);
  };

  const downloadQRCode = (event: Event) => {
    if (event.qrCode) {
      const link = document.createElement('a');
      link.href = event.qrCode;
      link.download = `${event.name}-QR-Code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
        <Button onClick={() => setCreateModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.name}</CardTitle>
                {getStatusBadge(event.status)}
              </div>
              <p className="text-sm text-gray-600">{event.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                {new Date(event.eventDate).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                {getPackageIcon(event.packageType)}
                <span className="capitalize font-medium">{event.packageType}</span>
                <span className="text-gray-600">• ${event.price}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Camera className="h-4 w-4" />
                {event.photoCount} photos uploaded
              </div>

              {/* QR Code Display Section */}
              {event.qrCode && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <QrCode className="h-4 w-4" />
                    QR Code
                  </h4>
                  <div className="flex items-center gap-3">
                    <img 
                      src={event.qrCode} 
                      alt={`QR Code for ${event.name}`}
                      className="w-16 h-16 border rounded"
                    />
                    <div className="flex flex-col gap-2 flex-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadQRCode(event)}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleShowQR(event)}
                        className="flex items-center gap-1"
                      >
                        <QrCode className="h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Code: {event.loginCode}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Link href={`/camera/${event.loginCode}`}>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Camera className="h-4 w-4 mr-1" />
                    Camera
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateEventModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen} 
      />
      
      <QRModal 
        open={qrModalOpen} 
        onOpenChange={setQrModalOpen}
        event={selectedEvent}
      />
    </div>
  );
}