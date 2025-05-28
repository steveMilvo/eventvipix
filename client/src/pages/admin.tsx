import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  DollarSign,
  LogOut, 
  AlertTriangle, 
  Settings, 
  Eye,
  Edit2,
  Shield,
  Camera,
  TrendingUp,
  Activity,
  QrCode,
  Copy,
  Upload,
  Image,
  Edit,
  Trash2,
  Save
} from "lucide-react";
import * as z from "zod";
import QRModal from "@/components/modals/qr-modal";

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalPayments: number;
  totalRevenue: number;
  activeSubscriptions: number;
  flaggedIssues: number;
  photosModerated: number;
  storageUsed: string;
}

interface EventAdmin {
  id: number;
  name: string;
  loginCode: string;
  folderName: string;
  packageType: string;
  status: string;
  photoCount: number;
  userId: number;
  userEmail: string;
  createdAt: string;
  galleryType?: string;
  galleryFeatures?: string[];
  allowGuestUploads?: boolean;
  moderationEnabled?: boolean;
  qrCode?: string | null;
  accessLink?: string;
}

interface PaymentRecord {
  id: number;
  amount: number;
  status: string;
  eventName: string;
  userEmail: string;
  createdAt: string;
}

interface UserAccount {
  id: number;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
  eventCount: number;
  photoCount: number;
}

const eventFormSchema = insertEventSchema.extend({
  eventDate: z.string(),
});

type EventFormData = z.infer<typeof eventFormSchema>;

// EventEditor component to handle event specific actions
interface EventEditorProps {
  event: EventAdmin & { qrCode?: string | null; accessLink?: string };
  onEdit: (eventId: number, currentCode: string) => void;
  onShowQR: (event: EventAdmin) => void;
}

function EventEditor({ event, onEdit, onShowQR }: EventEditorProps) {
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [newLoginCode, setNewLoginCode] = useState(event.loginCode);

  const handleSaveLoginCode = async (eventId: number) => {
    // TODO: Implement API call to update login code
    console.log("Updating event", eventId, "with new code:", newLoginCode);
    setEditingEvent(null);
    setNewLoginCode("");
  };
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="font-semibold">{event.name}</h3>
          {getStatusBadge(event.status)}
          <Badge variant="outline">{event.packageType}</Badge>
          {event.qrCode && (
            <Badge className="bg-green-100 text-green-800">QR Ready</Badge>
          )}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>User: {event.userEmail}</p>
          <p>Photos: {event.photoCount}</p>
          <p>Folder: {event.folderName || 'Default'}</p>
          {event.accessLink && (
            <p className="text-xs">Access: {event.accessLink}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* QR Code Preview */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 border-2 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-sm">
            {event.qrCode ? (
              <img 
                src={event.qrCode} 
                alt={`QR Code for ${event.name}`}
                className="w-full h-full object-contain p-1"
                onLoad={() => {
                  console.log('QR code loaded for event:', event.name);
                }}
                onError={(e) => {
                  console.error('QR code failed to load for event:', event.name);
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="text-center text-red-400">
                        <svg class="h-8 w-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"></path>
                        </svg>
                        <p class="text-xs">Error</p>
                      </div>
                    `;
                  }
                }}
              />
            ) : (
              <div className="text-center text-gray-400">
                <QrCode className="h-8 w-8 mx-auto mb-1" />
                <p className="text-xs">No QR</p>
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium">Login Code:</p>
          {editingEvent === event.id ? (
            <div className="flex items-center gap-2">
              <Input
                value={newLoginCode}
                onChange={(e) => setNewLoginCode(e.target.value.toUpperCase())}
                className="w-32 text-center"
                placeholder="CODE"
              />
              <Button size="sm" onClick={() => handleSaveLoginCode(event.id)}>
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditingEvent(null)}>
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                {event.loginCode || 'None'}
              </code>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEdit(event.id, event.loginCode)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          {event.qrCode ? (
            <>
              <Button size="sm" onClick={() => onShowQR(event)} className="bg-green-600 hover:bg-green-700">
                <QrCode className="h-3 w-3 mr-1" />
                View QR
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/events/${event.id}/regenerate-qr`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' }
                    });
                    if (response.ok) {
                      const updatedEvent = await response.json();
                      window.location.reload(); // Simple reload to show updated QR
                    }
                  } catch (error) {
                    console.error('Failed to regenerate QR:', error);
                  }
                }}
                className="text-xs"
              >
                Regenerate
              </Button>
            </>
          ) : (
            <Button 
              size="sm" 
              onClick={async () => {
                try {
                  const response = await fetch(`/api/events/${event.id}/regenerate-qr`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                  });
                  if (response.ok) {
                    const updatedEvent = await response.json();
                    window.location.reload(); // Simple reload to show new QR
                  }
                } catch (error) {
                  console.error('Failed to generate QR:', error);
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <QrCode className="h-3 w-3 mr-1" />
              Generate QR
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface Event {
  id: number;
  name: string;
  loginCode: string;
  folderName: string;
  packageType: string;
  status: string;
  photoCount: number;
  userId: number;
  userEmail: string;
  createdAt: string;
  galleryType?: string;
  galleryFeatures?: string[];
  allowGuestUploads?: boolean;
  moderationEnabled?: boolean;
  qrCode?: string | null;
  accessLink?: string;
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const { isLoggedIn, adminUser, logout } = useAdminAuth();
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [newLoginCode, setNewLoginCode] = useState("");
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEventForQR, setSelectedEventForQR] = useState<EventAdmin | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [events, setEvents] = useState<EventAdmin[]>([]);

  const handleEventUpdate = (updatedEvent: EventAdmin) => {
    // Update the event in our local state
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setSelectedEventForQR(updatedEvent);
  };

  // Simple authentication check - if no session, redirect
  useEffect(() => {
    const sessionId = localStorage.getItem("adminSessionId");
    if (!sessionId) {
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    logout();
    setLocation("/admin-login");
  };

  // Allow rendering for development - remove session check temporarily
  const sessionId = localStorage.getItem("adminSessionId");
  // if (!sessionId) {
  //   return null;
  // }

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      eventDate: "",
      packageType: "standard",
      status: "active",
      folderName: "",
      loginCode: "",
      price: "",
      userId: 1, // Admin creates events
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const eventData = {
        name: data.name,
        description: data.description || null,
        eventDate: new Date(data.eventDate),
        packageType: data.packageType,
        status: "active",
        userId: 1,
        folderName: data.folderName || null,
        // Generate unique login code if not provided
        loginCode: data.loginCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
        price: data.packageType === "premium" ? "75" : "50",
      };

      const response = await apiRequest("POST", "/api/events/direct", eventData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }
      return response.json();
    },
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setShowCreateEvent(false);
      form.reset();
      toast({
        title: "Event Created Successfully",
        description: `Event "${newEvent.name}" created with login code: ${newEvent.loginCode}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EventFormData) => {
    createEventMutation.mutate(data);
  };

  const { data: adminStats } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: eventsData = [], refetch } = useQuery<EventAdmin[]>({
    queryKey: ["/api/admin/events"],
	onSuccess: (data) => {
		setEvents(data);
	}
  });

  useEffect(() => {
    if (eventsData) {
      setEvents(eventsData);
    }
  }, [eventsData]);

  const { data: payments = [] } = useQuery<PaymentRecord[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: users = [] } = useQuery<UserAccount[]>({
    queryKey: ["/api/admin/users"],
  });

  const handleEditLoginCode = (eventId: number, currentCode: string) => {
    setEditingEvent(eventId);
    setNewLoginCode(currentCode);
  };

  const handleSaveLoginCode = async (eventId: number) => {
    // TODO: Implement API call to update login code
    console.log("Updating event", eventId, "with new code:", newLoginCode);
    setEditingEvent(null);
    setNewLoginCode("");
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return <Badge className={variants[status as keyof typeof variants] || "bg-gray-100"}>{status}</Badge>;
  };

  const generateQRForEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events/${eventId}/regenerate-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        // Update the events state with the new QR code
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId ? { ...event, qrCode: updatedEvent.qrCode, accessLink: updatedEvent.accessLink } : event
          )
        );
        await refetch();
        toast({
          title: "QR Code Generated",
          description: "QR code has been created successfully.",
        });
      } else {
        throw new Error('Failed to generate QR code');
      }
    } catch (error) {
      console.error('QR generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive",
      });
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    const variants = {
      succeeded: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return <Badge className={variants[status as keyof typeof variants] || "bg-gray-100"}>{status}</Badge>;
  };

  const handleShowQR = (event: any) => {
    setSelectedEventForQR(event);
    setShowQRModal(true);
  };

  const regenerateQRCode = async (eventId: number) => {
    try {
      const response = await fetch(`/api/events/${eventId}/regenerate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        // Refresh events list to show updated QR code
        await refetch();
        toast({
          title: "QR Code Regenerated",
          description: "The QR code has been updated successfully.",
        });
      } else {
        throw new Error('Failed to regenerate QR code');
      }
    } catch (error) {
      console.error('QR regeneration error:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate QR code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">System analytics, event management, and subscription monitoring</p>
            {adminUser && (
              <p className="text-sm text-gray-500">Logged in as: {adminUser.username}</p>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowCreateEvent(true)}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Create Event
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Admin Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Active accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminStats?.totalEvents || 0}</div>
              <p className="text-xs text-muted-foreground">Events created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${adminStats?.totalRevenue || 0}</div>
              <p className="text-xs text-muted-foreground">From {adminStats?.totalPayments || 0} payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{adminStats?.flaggedIssues || 0}</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Event Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Event Management
                </CardTitle>
                <p className="text-sm text-gray-600">Manage login codes, settings, and event configurations</p>
              </div>
              <Button
                onClick={async () => {
                  try {
                    const response = await fetch('/api/admin/generate-qr-codes', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' }
                    });
                    const result = await response.json();
                    if (result.success) {
                      toast({
                        title: "QR Codes Generated",
                        description: result.message,
                      });
                      // Force reload to show updated QR codes
                      window.location.reload();
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to generate QR codes",
                      variant: "destructive",
                    });
                  }
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <QrCode className="h-4 w-4" />
                Generate All QR Codes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <EventEditor
                  key={event.id}
                  event={{
                    ...event,
                    qrCode: event.qrCode || null,
                    accessLink: event.accessLink || `${window.location.origin}/camera/${event.loginCode}`
                  }}
                  onEdit={handleEditLoginCode}
                  onShowQR={handleShowQR}
                />
              ))}
              {events.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No events created yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hero Photo Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Hero Photo Management
            </CardTitle>
            <p className="text-sm text-gray-600">Manage landing page hero images and rotation settings</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Upload New Hero Photo */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload New Hero Photo</h3>
                  <p className="text-sm text-gray-600 mb-4">Add high-quality images for the landing page carousel</p>
                  <div className="flex flex-col items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      id="hero-photo-upload"
                    />
                    <label
                      htmlFor="hero-photo-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Photos
                    </label>
                    <p className="text-xs text-gray-500">Recommended: 1920x1080px, JPG/PNG, Max 5MB</p>
                  </div>
                </div>
              </div>

              {/* Current Hero Photos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Current Hero Photos</h3>
                  <Badge variant="outline">4 Active</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { 
                      id: 1, 
                      name: "Wedding Hair Styling", 
                      src: "/Steve&Xerxieedited_.JPG", 
                      title: "Getting Ready Moments", 
                      active: true,
                      uploadDate: "2025-01-25",
                      size: "2.1 MB",
                      dimensions: "1920x1080"
                    },
                    { 
                      id: 2, 
                      name: "Wedding Transportation", 
                      src: "/Steve&Xerxieedited_-34.JPG", 
                      title: "Classic Wedding Style", 
                      active: true,
                      uploadDate: "2025-01-25",
                      size: "1.8 MB",
                      dimensions: "1920x1080"
                    },
                    { 
                      id: 3, 
                      name: "Bridal Portrait", 
                      src: "/Steve&Xerxieedited_-31.JPG", 
                      title: "Elegant Bridal Portraits", 
                      active: true,
                      uploadDate: "2025-01-25",
                      size: "2.3 MB",
                      dimensions: "1920x1080"
                    },
                    { 
                      id: 4, 
                      name: "Wedding Joy", 
                      src: "/Steve&Xerxieedited_-33.JPG", 
                      title: "Capturing Pure Joy", 
                      active: true,
                      uploadDate: "2025-01-25",
                      size: "1.9 MB",
                      dimensions: "1920x1080"
                    }
                  ].map((photo) => (
                    <div key={photo.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="aspect-video bg-gray-100 relative">
                        <img 
                          src={photo.src} 
                          alt={photo.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden absolute inset-0 bg-gray-200 items-center justify-center">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                        {photo.active && (
                          <Badge className="absolute top-2 right-2 bg-green-600">Active</Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-gray-900 mb-1">{photo.title}</h4>
                        <p className="text-xs text-gray-600 mb-1">{photo.name}</p>
                        <div className="text-xs text-gray-500 mb-3 space-y-1">
                          <p>Uploaded: {photo.uploadDate}</p>
                          <p>Size: {photo.size} • {photo.dimensions}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-xs text-red-600 hover:text-red-700">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photo Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Auto-rotation Speed</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="3000">3 seconds</option>
                      <option value="5000" selected>5 seconds</option>
                      <option value="7000">7 seconds</option>
                      <option value="10000">10 seconds</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transition Effect</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="fade" selected>Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="upload" selected>Upload Order</option>
                      <option value="random">Random</option>
                      <option value="custom">Custom Order</option>
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Enable auto-rotation</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    <span className="text-sm">Show navigation dots</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Show photo captions</span>
                  </label>
                </div>

                <div className="mt-4">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Accounts Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Accounts
            </CardTitle>
            <p className="text-sm text-gray-600">View all registered users and their login credentials</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Admin Users */}
              {users.filter(user => user.isAdmin).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-purple-600">Admin Accounts</h3>
                  <div className="space-y-3">
                    {users.filter(user => user.isAdmin).map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg bg-purple-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Username:</p>
                            <p className="text-sm bg-white px-2 py-1 rounded border font-mono">{user.username}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Email:</p>
                            <p className="text-sm bg-white px-2 py-1 rounded border">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Password:</p>
                            <p className="text-sm bg-white px-2 py-1 rounded border font-mono">{user.password}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge className="bg-purple-100 text-purple-800">Admin</Badge>
                          <div className="text-xs text-gray-500">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Users */}
              {users.filter(user => !user.isAdmin).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 text-blue-600">User Accounts</h3>
                  <div className="space-y-3">
                    {users.filter(user => !user.isAdmin).map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg bg-blue-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Username:</p>
                            <p className="text-sm bg-white px-2 py-1 rounded border font-mono">{user.username}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Email:</p>
                            <p className="text-sm bg-white px-2 py-1 rounded border">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700">Password:</p>
                            <p className="text-sm bg-white px-2 py-1 rounded border font-mono">{user.password}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge className="bg-blue-100 text-blue-800">Regular User</Badge>
                          <div className="text-xs text-gray-500">
                            Events: {user.eventCount} • Photos: {user.photoCount} • Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {users.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  ```tool_code
                  <p>No users found</p>
                </div>
              )}

              {/* Account Statistics */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{users.filter(u => u.isAdmin).length}</div>
                    <div className="text-sm text-gray-600">Admin Accounts</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{users.filter(u => !u.isAdmin).length}</div>
                    <div className="text-sm text-gray-600">Regular Users</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{users.reduce((sum, u) => sum + u.eventCount, 0)}</div>
                    <div className="text-sm text-gray-600">Total Events</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Overview
            </CardTitle>
            <p className="text-sm text-gray-600">Current system status and configuration</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Storage Settings</h3>
                <div className="space-y-2 text-sm">
                  <p>Storage Used: <span className="font-medium">{adminStats?.storageUsed || '0 GB'}</span></p>
                  <p>Default Provider: <span className="font-medium">Firebase</span></p>
                  <p>Backup Enabled: <span className="font-medium text-green-600">Yes</span></p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">AI Moderation</h3>
                <div className="space-y-2 text-sm">
                  <p>Status: <span className="font-medium text-green-600">Active</span></p>
                  <p>Provider: <span className="font-medium">OpenAI Vision</span></p>
                  <p>Auto-approve: <span className="font-medium">Enabled</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Issues
              </CardTitle>
              <p className="text-sm text-gray-600">System issues requiring attention</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Storage limit warning",
                    description: "Event 'Wedding Photos 2025' is approaching storage limit (90% used)",
                    severity: "warning",
                    timestamp: "2 hours ago",
                    aiAnalysis: "High upload frequency detected. Based on current trends, storage limit will be reached in approximately 48 hours.",
                    recommendation: "Consider upgrading to Premium package or enabling automatic cloudbackup to prevent service interruption."
                  },
                  {
                    id: 2,
                    title: "Failed moderation checks",
                    description: "3 photos from 'Corporate Event 2025' failed AI moderation and require manual review",
                    severity: "high",
                    timestamp: "30 minutes ago",
                    aiAnalysis: "Multiple photos flagged for potential inappropriate content. Pattern suggests possible misconfiguration in camera settings.",
                    recommendation: "Review camera brightness settings and verify AI moderation sensitivity thresholds."
                  },
                  {
                    id: 3,
                    title: "Payment verification needed",
                    description: "Pending payment verification for Premium package upgrade",
                    severity: "low",
                    timestamp: "1 hour ago",
                    aiAnalysis: "Payment attempt showed unusual transaction pattern. Gateway timeout detected.",
                    recommendation: "Verify payment gateway connection and retry transaction processing."
                  }
                ].map((issue) => (
                  <div 
                    key={issue.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => {
                      toast({
                        title: issue.title,
                        description: (
                          <div className="mt-2 space-y-2">
                            <p>{issue.description}</p>
                            <p className="text-sm text-gray-500">Reported {issue.timestamp}</p>
                            <div className="mt-2 space-y-2">
                              <p className="text-sm font-medium text-gray-700">
                                Severity: {" "}
                                <span className={
                                  issue.severity === "high" ? "text-red-600" :
                                  issue.severity === "warning" ? "text-yellow-600" :
                                  "text-blue-600"
                                }>
                                  {issue.severity.toUpperCase()}
                                </span>
                              </p>
                              <div className="text-sm">
                                <p className="font-medium text-indigo-600">AI Analysis:</p>
                                <p className="text-gray-600">{issue.aiAnalysis}</p>
                              </div>
                              <div className="text-sm">
                                <p className="font-medium text-green-600">Recommendation:</p>
                                <p className="text-gray-600">{issue.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        ),
                        duration: 5000,
                      });
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{issue.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                      </div>
                      <Badge className={
                        issue.severity === "high" ? "bg-red-100 text-red-800" :
                        issue.severity === "warning" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }>
                        {issue.severity}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">{issue.timestamp}</div>
                  </div>
                ))}
              </div>
        </CardContent>

      {/* Create Event Modal */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Wedding Reception" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Event description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select package" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard - $50</SelectItem>
                          <SelectItem value="premium">Premium - $75</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="folderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Folder</FormLabel>
                      <FormControl>
                        <Input placeholder="event-photos-2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="loginCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Login Code (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Leave empty to auto-generate (e.g., ABC123)" 
                        {...field} 
                        maxLength={10}
                        style={{ textTransform: 'uppercase' }}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <p className="text-sm text-gray-500">
                      If empty, a unique 6-character code will be generated automatically
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateEvent(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createEventMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {createEventMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      Create Event & Generate QR
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* QR Modal */}
      {selectedEventForQR && (
        <QRModal 
          open={showQRModal} 
          onOpenChange={setShowQRModal}
          event={selectedEventForQR}
		  onEventUpdate={handleEventUpdate}
        />
      )}
    </div>
  );
}