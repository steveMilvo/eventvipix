import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Users, Calendar, DollarSign, Settings, Edit3, RefreshCw, Save, Plus, X, AlertTriangle, Shield, FileText, Copy, Download, Printer, Database, Search, FolderOpen, ExternalLink, Camera, Crown, Package } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Admin() {
  const { toast } = useToast();
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Wedding Reception",
      loginCode: "WEDDING1",
      packageType: "Premium",
      status: "Active",
      photoCount: 45,
      galleryType: "private",
      storageProvider: "firebase",
      folderName: "wedding-smith-2025",
      customFeatures: ["HD Photos", "Video Messages", "Guest Comments"],
      premiumFiltering: true,
      socialSharing: true,
      additionalCodes: ["GUEST123", "FAMILY456"],
      storageUrl: ""
    },
    {
      id: 2,
      name: "Corporate Conference",
      loginCode: "CONF2025",
      packageType: "Standard",
      status: "Active", 
      photoCount: 23,
      galleryType: "public",
      storageProvider: "googledrive",
      folderName: "conference-tech-summit",
      customFeatures: ["Basic Gallery", "Download"],
      premiumFiltering: false,
      socialSharing: false,
      additionalCodes: ["SPEAKER789"],
      storageUrl: "https://drive.google.com/drive/folders/1A2B3C4D5E6F7G8H9I0J"
    },
    {
      id: 3,
      name: "Birthday Party",
      loginCode: "BDAY30",
      packageType: "Premium",
      status: "Active",
      photoCount: 18,
      galleryType: "private",
      storageProvider: "dropbox",
      folderName: "birthday-celebration-30th",
      customFeatures: ["Photo Booth Effects", "Live Slideshow", "Print Orders"],
      premiumFiltering: true,
      socialSharing: true,
      additionalCodes: ["FRIENDS321", "FAMILY654"],
      storageUrl: "https://www.dropbox.com/scl/fo/xyz123/h?rlkey=abc456&dl=0"
    }
  ]);

  const [editingEvent, setEditingEvent] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [resolvingIssue, setResolvingIssue] = useState(null);
  const [heroPhotos, setHeroPhotos] = useState([
    {
      id: 1,
      url: "/attached_assets/Steve&Xerxieedited_.JPG",
      title: "Steve & Xerxie Wedding",
      event: "Steve & Xerxie Wedding 2025",
      status: "active"
    },
    {
      id: 2, 
      url: "/attached_assets/Steve&Xerxieedited_-31.JPG",
      title: "Wedding Portrait",
      event: "Steve & Xerxie Wedding 2025",
      status: "active"
    },
    {
      id: 3,
      url: "/attached_assets/Steve&Xerxieedited_-33.JPG",
      title: "Wedding Ceremony",
      event: "Steve & Xerxie Wedding 2025",
      status: "active"
    },
    {
      id: 4,
      url: "/attached_assets/Steve&Xerxieedited_-34.JPG",
      title: "Wedding Reception", 
      event: "Steve & Xerxie Wedding 2025",
      status: "active"
    }
  ]);
  const [isHeroEditDialogOpen, setIsHeroEditDialogOpen] = useState(false);
  const [editingHeroPhoto, setEditingHeroPhoto] = useState(null);
  const [showTrackingLog, setShowTrackingLog] = useState(false);
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [isQRViewDialogOpen, setIsQRViewDialogOpen] = useState(false);
  const [selectedEventForQR, setSelectedEventForQR] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    eventDate: '',
    packageType: 'standard',
    galleryType: 'private',
    storageProvider: 'firebase',
    folderName: '',
    customFeatures: [],
    premiumFiltering: false,
    socialSharing: false
  });

  const handleEditEvent = (event) => {
    setEditingEvent({...event});
    setIsEditDialogOpen(true);
  };

  const handleSaveEvent = () => {
    setEvents(events.map(e => e.id === editingEvent.id ? editingEvent : e));
    setIsEditDialogOpen(false);
    setEditingEvent(null);
  };

  const handleResolveIssue = (issue) => {
    setResolvingIssue(issue);
    setIsResolveDialogOpen(true);
  };

  const handleSaveResolution = () => {
    // In a real app, you would send this to your backend API
    console.log('Issue resolved:', resolvingIssue);
    setIsResolveDialogOpen(false);
    setResolvingIssue(null);
  };

  const handleEditHeroPhoto = (photo) => {
    setEditingHeroPhoto({...photo});
    setIsHeroEditDialogOpen(true);
  };

  const handleRemoveHeroPhoto = (photoId) => {
    setHeroPhotos(heroPhotos.filter(photo => photo.id !== photoId));
  };

  const handleAddNewHeroPhoto = () => {
    const newPhoto = {
      id: Math.max(...heroPhotos.map(p => p.id)) + 1,
      url: "/attached_assets/Steve&Xerxieedited_.JPG",
      title: "New Hero Photo",
      event: "New Event",
      status: "active"
    };
    setEditingHeroPhoto(newPhoto);
    setIsHeroEditDialogOpen(true);
  };

  const handleSaveHeroPhoto = () => {
    if (editingHeroPhoto.id && heroPhotos.find(p => p.id === editingHeroPhoto.id)) {
      // Editing existing photo
      setHeroPhotos(heroPhotos.map(p => p.id === editingHeroPhoto.id ? editingHeroPhoto : p));
    } else {
      // Adding new photo
      const newId = Math.max(...heroPhotos.map(p => p.id)) + 1;
      setHeroPhotos([...heroPhotos, {...editingHeroPhoto, id: newId}]);
    }
    setIsHeroEditDialogOpen(false);
    setEditingHeroPhoto(null);
  };

  const generateNewCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const regenerateMainCode = () => {
    const newCode = generateNewCode();
    setEditingEvent({...editingEvent, loginCode: newCode});
  };

  const addAdditionalCode = () => {
    const newCode = generateNewCode();
    setEditingEvent({
      ...editingEvent, 
      additionalCodes: [...editingEvent.additionalCodes, newCode]
    });
  };

  const removeAdditionalCode = (index) => {
    const updatedCodes = editingEvent.additionalCodes.filter((_, i) => i !== index);
    setEditingEvent({...editingEvent, additionalCodes: updatedCodes});
  };

  const addCustomFeature = () => {
    const newFeature = prompt("Enter new feature:");
    if (newFeature) {
      setEditingEvent({
        ...editingEvent,
        customFeatures: [...editingEvent.customFeatures, newFeature]
      });
    }
  };

  const removeCustomFeature = (index) => {
    const updatedFeatures = editingEvent.customFeatures.filter((_, i) => i !== index);
    setEditingEvent({...editingEvent, customFeatures: updatedFeatures});
  };

  const handleRegenerateQR = async (event: any) => {
    try {
      const response = await fetch(`/api/events/${event.id}/regenerate-qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        // Update the events list with the new QR code
        setEvents(events.map(e => e.id === event.id ? {...e, qrCode: updatedEvent.qrCode, accessLink: updatedEvent.accessLink} : e));
        
        toast({
          title: "QR Code Regenerated",
          description: "Event QR code has been successfully regenerated!",
        });
      } else {
        throw new Error('Failed to regenerate QR code');
      }
    } catch (error) {
      console.error('QR regeneration error:', error);
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShowQR = (event: any) => {
    setSelectedEventForQR(event);
    setIsQRViewDialogOpen(true);
  };

  const handleCreateEvent = () => {
    // Generate a unique login code
    const loginCode = `EVENT${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const eventToCreate = {
      ...newEvent,
      id: events.length + 1,
      loginCode,
      status: 'Active',
      photoCount: 0,
      additionalCodes: [],
      storageUrl: '',
      folderName: newEvent.folderName || newEvent.name.toLowerCase().replace(/\s+/g, '-'),
      qrCode: null // Will be generated on the server
    };

    setEvents([...events, eventToCreate]);
    setNewEvent({
      name: '',
      description: '',
      eventDate: '',
      packageType: 'standard',
      galleryType: 'private',
      storageProvider: 'firebase',
      folderName: '',
      customFeatures: [],
      premiumFiltering: false,
      socialSharing: false
    });
    setIsCreateEventDialogOpen(false);
    
    toast({
      title: "Event Created",
      description: `Event "${eventToCreate.name}" has been created successfully!`,
    });
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">VIPix Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage events, monitor activity, and track performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$225</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Photos Uploaded</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86</div>
            </CardContent>
          </Card>
        </div>

        {/* AI Issue Monitor */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              AI Issue Monitor
            </CardTitle>
            <p className="text-sm text-gray-600">Real-time AI monitoring and flagged content requiring attention</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  title: "Content Moderation Alert",
                  description: "3 photos from 'Wedding Reception' flagged for manual review",
                  severity: "high",
                  timestamp: "15 minutes ago",
                  aiAnalysis: "AI detected potential inappropriate content with 87% confidence. Photos contain unexpected objects in background.",
                  recommendation: "Review flagged photos and adjust AI sensitivity if needed."
                },
                {
                  id: 2,
                  title: "Storage Usage Warning", 
                  description: "Event 'Corporate Conference' approaching storage limit (92% used)",
                  severity: "warning",
                  timestamp: "1 hour ago",
                  aiAnalysis: "Current upload rate indicates storage will be full within 6 hours based on historical patterns.",
                  recommendation: "Enable cloud backup or upgrade storage plan to prevent service interruption."
                },
                {
                  id: 3,
                  title: "Payment Processing Issue",
                  description: "Failed payment verification for Premium upgrade",
                  severity: "medium",
                  timestamp: "2 hours ago", 
                  aiAnalysis: "Transaction timeout detected. Gateway response indicates temporary connectivity issue.",
                  recommendation: "Retry payment processing or contact payment provider support."
                }
              ].map((issue) => (
                <div 
                  key={issue.id}
                  className={`p-4 border rounded-lg transition-colors cursor-pointer hover:bg-gray-50 ${
                    issue.severity === 'high' ? 'border-red-200 bg-red-50' :
                    issue.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{issue.title}</h4>
                        <Badge variant={
                          issue.severity === 'high' ? 'destructive' :
                          issue.severity === 'warning' ? 'secondary' : 
                          'default'
                        }>
                          {issue.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      <p className="text-xs text-gray-500 mb-3">Detected {issue.timestamp}</p>
                      
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="font-medium text-gray-700">AI Analysis:</span>
                          <p className="text-gray-600 mt-1">{issue.aiAnalysis}</p>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium text-gray-700">Recommendation:</span>
                          <p className="text-gray-600 mt-1">{issue.recommendation}</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-4"
                      onClick={() => handleResolveIssue(issue)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Hero Photo Gallery Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Hero Photo Gallery
            </CardTitle>
            <p className="text-sm text-gray-600">Manage featured photos displayed on the landing page</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {heroPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img 
                    src={photo.url} 
                    alt={photo.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <h4 className="font-medium">{photo.title}</h4>
                      <p className="text-sm opacity-90">{photo.event}</p>
                      <div className="mt-2 space-x-2">
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleEditHeroPhoto(photo)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRemoveHeroPhoto(photo.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      photo.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  >
                    {photo.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              className="w-full"
              onClick={handleAddNewHeroPhoto}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Hero Photo
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Gallery Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Gallery
            </CardTitle>
            <p className="text-sm text-gray-600">Manage all event QR codes from one central location</p>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by event name or access code..."
                className="pl-10"
              />
            </div>

            {/* QR Code Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm line-clamp-2">{event.name}</CardTitle>
                      <Badge className={event.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* QR Code Display */}
                    <div className="flex justify-center">
                      <div className="bg-white p-3 rounded-lg border-2 border-dashed border-gray-200">
                        <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                          <QrCode className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Access Code:</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {event.loginCode}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Package:</span>
                        <div className="flex items-center">
                          {event.packageType === 'Premium' ? (
                            <Crown className="h-3 w-3 mr-1" />
                          ) : (
                            <Package className="h-3 w-3 mr-1" />
                          )}
                          <span className="text-xs">{event.packageType}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Photos:</span>
                        <div className="flex items-center gap-1">
                          <Camera className="h-3 w-3" />
                          <span className="text-xs">{event.photoCount}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-medium">Storage:</span>
                        <span className="text-xs capitalize">{event.storageProvider}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        className="flex items-center gap-1 text-xs"
                        onClick={() => {
                          setSelectedEventForQR(event);
                          setIsQRViewDialogOpen(true);
                        }}
                      >
                        <QrCode className="h-3 w-3" />
                        View QR
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1 text-xs"
                      >
                        <FolderOpen className="h-3 w-3" />
                        Folder
                      </Button>
                    </div>

                    {/* Quick Info */}
                    <div className="text-xs text-gray-500 space-y-1">
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate">/camera/{event.loginCode}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bulk Operations */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Bulk QR Code Operations</h4>
                  <p className="text-sm text-gray-600">Generate or regenerate QR codes for all events</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download All
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Regenerate All
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Storage Settings
            </CardTitle>
            <p className="text-sm text-gray-600">Configure cloud storage providers and settings</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link href="/storage">
                <Button variant="outline" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Manage Storage Providers
                </Button>
              </Link>
              <Button variant="outline" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Storage Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Management */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Event Management</CardTitle>
              <p className="text-sm text-gray-600">Create and manage photo sharing events</p>
            </div>
            <Button 
              onClick={() => setIsCreateEventDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Event
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event: any) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{event.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{event.loginCode}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        Folder: <span className="font-mono bg-blue-50 px-2 py-1 rounded text-blue-700">{event.folderName}</span>
                      </p>
                      
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant={event.packageType === "Premium" ? "default" : "secondary"}>
                          {event.packageType}
                        </Badge>
                        <Badge variant={event.status === "Active" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                        <Badge variant={event.galleryType === "private" ? "destructive" : "outline"}>
                          {event.galleryType === "private" ? "🔒 Private" : "🌐 Public"}
                        </Badge>
                        <Badge variant="outline">
                          📁 {event.storageProvider}
                        </Badge>
                        {event.premiumFiltering && (
                          <Badge variant="default">✨ Premium Filters</Badge>
                        )}
                        {event.socialSharing && (
                          <Badge variant="default">📱 Social Sharing</Badge>
                        )}
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <p>📸 {event.photoCount} photos uploaded</p>
                        <p>🎯 Features: {event.customFeatures.join(", ")}</p>
                        {event.additionalCodes.length > 0 && (
                          <p>🔑 Extra codes: {event.additionalCodes.join(", ")}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleShowQR(event)}>
                        <QrCode className="h-4 w-4 mr-1" />
                        Show QR
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleRegenerateQR(event)}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Edit Event Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Event: {editingEvent?.name}</DialogTitle>
            </DialogHeader>
            
            {editingEvent && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Event Name</Label>
                    <Input 
                      id="name"
                      value={editingEvent.name} 
                      onChange={(e) => setEditingEvent({...editingEvent, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="packageType">Package Type</Label>
                    <Select value={editingEvent.packageType} onValueChange={(value) => setEditingEvent({...editingEvent, packageType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard ($50)</SelectItem>
                        <SelectItem value="Premium">Premium ($75)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Folder and Storage */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="folderName">Storage Folder Name</Label>
                      <Input 
                        id="folderName"
                        value={editingEvent.folderName} 
                        onChange={(e) => setEditingEvent({...editingEvent, folderName: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="storageProvider">Storage Provider</Label>
                      <Select value={editingEvent.storageProvider} onValueChange={(value) => setEditingEvent({...editingEvent, storageProvider: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="firebase">🔥 Firebase Storage</SelectItem>
                          <SelectItem value="googledrive">📁 Google Drive</SelectItem>
                          <SelectItem value="dropbox">📦 Dropbox</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* External Storage URL for non-Firebase providers */}
                  {editingEvent.storageProvider !== 'firebase' && (
                    <div>
                      <Label htmlFor="storageUrl">
                        {editingEvent.storageProvider === 'googledrive' ? 'Google Drive Shared Folder URL' : 'Dropbox Shared Folder URL'}
                      </Label>
                      <Input 
                        id="storageUrl"
                        placeholder={
                          editingEvent.storageProvider === 'googledrive' 
                            ? "https://drive.google.com/drive/folders/..." 
                            : "https://www.dropbox.com/scl/fo/..."
                        }
                        value={editingEvent.storageUrl || ''} 
                        onChange={(e) => setEditingEvent({...editingEvent, storageUrl: e.target.value})}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {editingEvent.storageProvider === 'googledrive' 
                          ? "Enter the shared Google Drive folder URL with edit permissions"
                          : "Enter the shared Dropbox folder URL with edit permissions"
                        }
                      </p>
                    </div>
                  )}
                </div>

                {/* Access Codes */}
                <div className="space-y-4">
                  <Label>Access Codes</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium">Main Login Code:</Label>
                      <Input 
                        value={editingEvent.loginCode} 
                        onChange={(e) => setEditingEvent({...editingEvent, loginCode: e.target.value})}
                        className="w-32"
                      />
                      <Button variant="outline" size="sm" onClick={regenerateMainCode}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium">Additional Access Codes:</Label>
                        <Button variant="outline" size="sm" onClick={addAdditionalCode}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Code
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingEvent.additionalCodes.map((code, index) => (
                          <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <span className="font-mono text-sm">{code}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeAdditionalCode(index)}
                              className="h-4 w-4 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label>Gallery Privacy</Label>
                    <Select value={editingEvent.galleryType} onValueChange={(value) => setEditingEvent({...editingEvent, galleryType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">🔒 Private Gallery</SelectItem>
                        <SelectItem value="public">🌐 Public Gallery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="status">Event Status</Label>
                    <Select value={editingEvent.status} onValueChange={(value) => setEditingEvent({...editingEvent, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Paused">Paused</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Premium Features */}
                <div className="space-y-4">
                  <Label>Premium Features</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Premium Filtering</Label>
                        <p className="text-xs text-gray-500">Advanced photo filters and effects</p>
                      </div>
                      <Switch 
                        checked={editingEvent.premiumFiltering} 
                        onCheckedChange={(checked) => setEditingEvent({...editingEvent, premiumFiltering: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Social Sharing</Label>
                        <p className="text-xs text-gray-500">Allow sharing to social media platforms</p>
                      </div>
                      <Switch 
                        checked={editingEvent.socialSharing} 
                        onCheckedChange={(checked) => setEditingEvent({...editingEvent, socialSharing: checked})}
                      />
                    </div>
                  </div>
                </div>

                {/* Feature Selection with Checkboxes */}
                <div className="space-y-4">
                  <Label>Event Features</Label>
                  <div className="border rounded-lg p-4 space-y-3">
                    
                    {/* Core Features */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Core Features</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'Basic Gallery', label: '📸 Basic Gallery' },
                          { key: 'HD Photos', label: '🎨 HD Photos' },
                          { key: 'Download', label: '⬇️ Download Photos' },
                          { key: 'Guest Upload', label: '📤 Guest Upload' }
                        ].map((feature) => (
                          <div key={feature.key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature.key}
                              checked={editingEvent.customFeatures?.includes(feature.key) || false}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentFeatures = editingEvent.customFeatures || [];
                                if (isChecked) {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: [...currentFeatures, feature.key]
                                  });
                                } else {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: currentFeatures.filter(f => f !== feature.key)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={feature.key} className="text-sm">{feature.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Features */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Interactive Features</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'Guest Comments', label: '💬 Guest Comments' },
                          { key: 'Photo Ratings', label: '⭐ Photo Ratings' },
                          { key: 'Favorites', label: '❤️ Favorites' },
                          { key: 'Video Messages', label: '🎥 Video Messages' }
                        ].map((feature) => (
                          <div key={feature.key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature.key}
                              checked={editingEvent.customFeatures?.includes(feature.key) || false}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentFeatures = editingEvent.customFeatures || [];
                                if (isChecked) {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: [...currentFeatures, feature.key]
                                  });
                                } else {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: currentFeatures.filter(f => f !== feature.key)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={feature.key} className="text-sm">{feature.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Premium Features */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Premium Features</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'Photo Booth Effects', label: '📷 Photo Booth Effects' },
                          { key: 'Live Slideshow', label: '🎞️ Live Slideshow' },
                          { key: 'Print Orders', label: '🖨️ Print Orders' },
                          { key: 'AI Photo Enhancement', label: '🤖 AI Photo Enhancement' }
                        ].map((feature) => (
                          <div key={feature.key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature.key}
                              checked={editingEvent.customFeatures?.includes(feature.key) || false}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentFeatures = editingEvent.customFeatures || [];
                                if (isChecked) {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: [...currentFeatures, feature.key]
                                  });
                                } else {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: currentFeatures.filter(f => f !== feature.key)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={feature.key} className="text-sm">{feature.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sharing & Export Features */}
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Sharing & Export</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: 'Social Media Sharing', label: '📱 Social Media Sharing' },
                          { key: 'Email Gallery Link', label: '📧 Email Gallery Link' },
                          { key: 'QR Code Access', label: '📱 QR Code Access' },
                          { key: 'Bulk Download', label: '📦 Bulk Download' }
                        ].map((feature) => (
                          <div key={feature.key} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={feature.key}
                              checked={editingEvent.customFeatures?.includes(feature.key) || false}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const currentFeatures = editingEvent.customFeatures || [];
                                if (isChecked) {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: [...currentFeatures, feature.key]
                                  });
                                } else {
                                  setEditingEvent({
                                    ...editingEvent,
                                    customFeatures: currentFeatures.filter(f => f !== feature.key)
                                  });
                                }
                              }}
                            />
                            <Label htmlFor={feature.key} className="text-sm">{feature.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Custom Feature Input */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold">Custom Features</Label>
                        <Button variant="outline" size="sm" onClick={addCustomFeature}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Custom
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {editingEvent.customFeatures?.filter(feature => ![
                          'Basic Gallery', 'HD Photos', 'Download', 'Guest Upload',
                          'Guest Comments', 'Photo Ratings', 'Favorites', 'Video Messages',
                          'Photo Booth Effects', 'Live Slideshow', 'Print Orders', 'AI Photo Enhancement',
                          'Social Media Sharing', 'Email Gallery Link', 'QR Code Access', 'Bulk Download'
                        ].includes(feature)).map((feature, index) => (
                          <div key={index} className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full">
                            <span className="text-sm">{feature}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                const updatedFeatures = editingEvent.customFeatures.filter(f => f !== feature);
                                setEditingEvent({...editingEvent, customFeatures: updatedFeatures});
                              }}
                              className="h-4 w-4 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="space-y-4 pt-6 border-t">
                  <Label className="text-lg font-semibold">Event QR Code</Label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* QR Code Display */}
                      <div className="flex-shrink-0">
                        {editingEvent?.qrCode ? (
                          <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg border shadow-sm">
                              <img 
                                src={editingEvent.qrCode} 
                                alt={`QR Code for ${editingEvent.name}`}
                                className="w-32 h-32"
                              />
                            </div>
                            <div className="text-center">
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                ✓ Generated
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                            <div className="text-center">
                              <QrCode className="h-8 w-8 mx-auto text-gray-400 mb-1" />
                              <span className="text-xs text-gray-500">No QR Code</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* QR Code Info and Actions */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label className="text-sm font-medium">Camera Access Link</Label>
                          <div className="mt-1">
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingEvent?.accessLink || `${window.location.origin}/camera/${editingEvent?.loginCode}`}
                                readOnly
                                className="text-xs bg-white"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const link = editingEvent?.accessLink || `${window.location.origin}/camera/${editingEvent?.loginCode}`;
                                  navigator.clipboard.writeText(link);
                                  toast({
                                    title: "Link Copied",
                                    description: "Camera access link copied to clipboard!",
                                  });
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Event Login Code</Label>
                          <div className="mt-1">
                            <div className="flex items-center gap-2">
                              <Input
                                value={editingEvent?.loginCode || ''}
                                readOnly
                                className="text-sm font-mono bg-white font-bold"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={regenerateMainCode}
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                New Code
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* QR Code Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegenerateQR(editingEvent)}
                            className="flex items-center gap-1"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Regenerate QR
                          </Button>
                          
                          {editingEvent?.qrCode && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.download = `${editingEvent.name}-qr-code.png`;
                                  link.href = editingEvent.qrCode;
                                  link.click();
                                  toast({
                                    title: "QR Code Downloaded",
                                    description: "QR code saved to your device!",
                                  });
                                }}
                                className="flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Open QR code in new window for printing
                                  const printWindow = window.open('', '_blank');
                                  if (printWindow) {
                                    printWindow.document.write(`
                                      <html>
                                        <head>
                                          <title>QR Code - ${editingEvent.name}</title>
                                          <style>
                                            body { 
                                              margin: 0; 
                                              padding: 20px; 
                                              text-align: center; 
                                              font-family: Arial, sans-serif; 
                                            }
                                            .qr-container { 
                                              border: 2px solid #000; 
                                              padding: 20px; 
                                              display: inline-block; 
                                              margin: 20px; 
                                            }
                                            img { 
                                              display: block; 
                                              margin: 0 auto; 
                                            }
                                            h1 { 
                                              margin: 10px 0; 
                                              font-size: 24px; 
                                            }
                                            .code { 
                                              font-family: monospace; 
                                              font-size: 18px; 
                                              font-weight: bold; 
                                              margin: 10px 0; 
                                            }
                                          </style>
                                        </head>
                                        <body>
                                          <div class="qr-container">
                                            <h1>${editingEvent.name}</h1>
                                            <img src="${editingEvent.qrCode}" alt="QR Code" />
                                            <div class="code">Code: ${editingEvent.loginCode}</div>
                                            <p>Scan to access event camera</p>
                                          </div>
                                        </body>
                                      </html>
                                    `);
                                    printWindow.document.close();
                                    printWindow.focus();
                                    printWindow.print();
                                  }
                                }}
                                className="flex items-center gap-1"
                              >
                                <Printer className="h-3 w-3" />
                                Print
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEvent}>
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Resolve Issue Dialog */}
        <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Resolve Issue: {resolvingIssue?.title}
              </DialogTitle>
            </DialogHeader>
            
            {resolvingIssue && (
              <div className="space-y-6">
                {/* Issue Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Issue Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="font-medium">Description</Label>
                      <p className="text-gray-600 mt-1">{resolvingIssue.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-medium">Severity Level</Label>
                        <Badge className="mt-1" variant={
                          resolvingIssue.severity === 'high' ? 'destructive' :
                          resolvingIssue.severity === 'warning' ? 'secondary' :
                          'default'
                        }>
                          {resolvingIssue.severity}
                        </Badge>
                      </div>
                      <div>
                        <Label className="font-medium">Detected</Label>
                        <p className="text-gray-600 mt-1">{resolvingIssue.timestamp}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{resolvingIssue.aiAnalysis}</p>
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{resolvingIssue.recommendation}</p>
                    
                    <div className="space-y-3">
                      {resolvingIssue.severity === 'high' && resolvingIssue.title.includes('Content Moderation') && (
                        <div className="space-y-4">
                          <Label>Flagged Images Management</Label>
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="font-medium text-yellow-800">3 Images Flagged</span>
                            </div>
                            <p className="text-sm text-yellow-700 mb-3">
                              AI has automatically moved flagged images to: 
                              <code className="bg-yellow-100 px-2 py-1 rounded ml-1">
                                /events/{resolvingIssue.eventId || 'WEDDING1'}/flagged/
                              </code>
                            </p>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {[
                                { id: 1, name: "IMG_0042.jpg", reason: "Inappropriate content detected" },
                                { id: 2, name: "IMG_0089.jpg", reason: "Low quality/blurry" },
                                { id: 3, name: "IMG_0156.jpg", reason: "Inappropriate content detected" }
                              ].map((flaggedImg) => (
                                <div key={flaggedImg.id} className="border rounded p-2 bg-white">
                                  <div className="aspect-square bg-gray-200 rounded mb-1 flex items-center justify-center">
                                    <AlertTriangle className="h-8 w-8 text-gray-400" />
                                  </div>
                                  <p className="text-xs font-medium truncate">{flaggedImg.name}</p>
                                  <p className="text-xs text-gray-600 truncate">{flaggedImg.reason}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Label>Quick Actions</Label>
                          <div className="flex gap-2 flex-wrap">
                            <Button size="sm" variant="outline">
                              Review All Flagged Photos
                            </Button>
                            <Button size="sm" variant="outline">
                              Restore Selected Images
                            </Button>
                            <Button size="sm" variant="outline">
                              Permanently Delete Flagged
                            </Button>
                            <Button size="sm" variant="outline">
                              Adjust AI Sensitivity
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact Event Organizer
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Resolution Tracking Log</Label>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setShowTrackingLog(true)}
                          className="w-full"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Detailed Tracking Log
                        </Button>
                      </div>
                      
                      {resolvingIssue.title.includes('Storage') && (
                        <div className="space-y-2">
                          <Label>Storage Actions</Label>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Enable Cloud Backup
                            </Button>
                            <Button size="sm" variant="outline">
                              Upgrade Storage Plan
                            </Button>
                            <Button size="sm" variant="outline">
                              Archive Old Events
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {resolvingIssue.title.includes('Payment') && (
                        <div className="space-y-2">
                          <Label>Payment Actions</Label>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Retry Payment
                            </Button>
                            <Button size="sm" variant="outline">
                              Check Gateway Status
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Resolution Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resolution Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Label>Add your resolution notes</Label>
                    <Textarea 
                      placeholder="Describe the actions taken to resolve this issue..."
                      className="mt-2"
                      rows={4}
                    />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveResolution} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-1" />
                    Mark as Resolved
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Hero Photo Edit Dialog */}
        <Dialog open={isHeroEditDialogOpen} onOpenChange={setIsHeroEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingHeroPhoto?.id && heroPhotos.find(p => p.id === editingHeroPhoto.id) ? 'Edit Hero Photo' : 'Add New Hero Photo'}
              </DialogTitle>
            </DialogHeader>
            
            {editingHeroPhoto && (
              <div className="space-y-4">
                <div>
                  <Label>Photo Title</Label>
                  <Input
                    value={editingHeroPhoto.title}
                    onChange={(e) => setEditingHeroPhoto({...editingHeroPhoto, title: e.target.value})}
                    placeholder="Enter photo title"
                  />
                </div>

                <div>
                  <Label>Event Name</Label>
                  <Input
                    value={editingHeroPhoto.event}
                    onChange={(e) => setEditingHeroPhoto({...editingHeroPhoto, event: e.target.value})}
                    placeholder="Enter event name"
                  />
                </div>

                <div>
                  <Label>Photo Upload</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setEditingHeroPhoto({...editingHeroPhoto, url: event.target?.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="cursor-pointer"
                    />
                    <div className="text-sm text-gray-500">Or enter photo URL below:</div>
                    <Input
                      value={editingHeroPhoto.url}
                      onChange={(e) => setEditingHeroPhoto({...editingHeroPhoto, url: e.target.value})}
                      placeholder="Enter photo URL"
                    />
                  </div>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingHeroPhoto.status}
                    onValueChange={(value) => setEditingHeroPhoto({...editingHeroPhoto, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editingHeroPhoto.url && (
                  <div>
                    <Label>Preview</Label>
                    <div className="mt-2">
                      <img 
                        src={editingHeroPhoto.url} 
                        alt={editingHeroPhoto.title}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsHeroEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveHeroPhoto}>
                    Save Photo
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Detailed Tracking Log Modal */}
        <Dialog open={showTrackingLog} onOpenChange={setShowTrackingLog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detailed Flagging & Resolution Tracking Log
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Complete audit trail of AI moderation actions and admin resolutions
              </div>
              
              <div className="space-y-3">
                {[
                  {
                    id: 1,
                    timestamp: "2025-01-26 14:32:15",
                    action: "flagged",
                    performedBy: "ai",
                    reason: "Inappropriate content detected",
                    photoId: "IMG_0042.jpg",
                    eventId: "WEDDING1",
                    aiConfidence: 0.95,
                    aiCategories: ["inappropriate_content"],
                    flaggedPath: "/events/WEDDING1/flagged/IMG_0042.jpg"
                  },
                  {
                    id: 2,
                    timestamp: "2025-01-26 14:28:03",
                    action: "approved",
                    performedBy: "ai",
                    reason: "Content approved by AI moderation",
                    photoId: "IMG_0041.jpg",
                    eventId: "WEDDING1",
                    aiConfidence: 0.98,
                    aiCategories: ["safe_content"]
                  },
                  {
                    id: 3,
                    timestamp: "2025-01-26 14:25:47",
                    action: "restored",
                    performedBy: "admin",
                    reason: "Manual resolution: restored",
                    photoId: "IMG_0040.jpg",
                    eventId: "WEDDING1",
                    resolutionNotes: "False positive - family photo acceptable for event"
                  },
                  {
                    id: 4,
                    timestamp: "2025-01-26 14:20:12",
                    action: "flagged",
                    performedBy: "ai",
                    reason: "Low quality/blurry image detected",
                    photoId: "IMG_0089.jpg",
                    eventId: "WEDDING1",
                    aiConfidence: 0.87,
                    aiCategories: ["quality_issues"],
                    flaggedPath: "/events/WEDDING1/flagged/IMG_0089.jpg"
                  }
                ].map((logEntry) => (
                  <div key={logEntry.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            logEntry.action === 'flagged' ? 'destructive' : 
                            logEntry.action === 'approved' ? 'default' : 
                            'secondary'
                          }
                        >
                          {logEntry.action.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600">{logEntry.timestamp}</span>
                      </div>
                      <Badge variant="outline">
                        {logEntry.performedBy === 'ai' ? 'AI System' : 'Admin User'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Photo:</strong> {logEntry.photoId}
                      </div>
                      <div>
                        <strong>Event:</strong> {logEntry.eventId}
                      </div>
                      <div className="col-span-2">
                        <strong>Reason:</strong> {logEntry.reason}
                      </div>
                      
                      {logEntry.aiConfidence && (
                        <div>
                          <strong>AI Confidence:</strong> {(logEntry.aiConfidence * 100).toFixed(1)}%
                        </div>
                      )}
                      
                      {logEntry.aiCategories && (
                        <div>
                          <strong>AI Categories:</strong> {logEntry.aiCategories.join(', ')}
                        </div>
                      )}
                      
                      {logEntry.flaggedPath && (
                        <div className="col-span-2">
                          <strong>Flagged Path:</strong> 
                          <code className="ml-2 bg-yellow-100 px-2 py-1 rounded text-xs">
                            {logEntry.flaggedPath}
                          </code>
                        </div>
                      )}
                      
                      {logEntry.resolutionNotes && (
                        <div className="col-span-2">
                          <strong>Resolution Notes:</strong> {logEntry.resolutionNotes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing last 50 entries • Total tracked actions: 247
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Export Log
                  </Button>
                  <Button variant="outline" size="sm">
                    Filter by Event
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* QR Code Viewing Modal */}
        <Dialog open={isQRViewDialogOpen} onOpenChange={setIsQRViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Event QR Code
              </DialogTitle>
            </DialogHeader>
            
            {selectedEventForQR && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{selectedEventForQR.name}</h3>
                  <p className="text-sm text-gray-600">Login Code: {selectedEventForQR.loginCode}</p>
                </div>
                
                {selectedEventForQR.qrCode ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                      <img 
                        src={selectedEventForQR.qrCode} 
                        alt={`QR Code for ${selectedEventForQR.name}`}
                        className="w-48 h-48"
                      />
                    </div>
                    
                    <div className="text-center text-sm text-gray-600">
                      <p>Scan this QR code to access the camera interface</p>
                      <p className="text-xs mt-1">Or visit: {selectedEventForQR.accessLink || `${window.location.origin}/camera/${selectedEventForQR.loginCode}`}</p>
                    </div>
                    
                    <div className="flex gap-2 w-full">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.download = `qr-code-${selectedEventForQR.loginCode}.png`;
                          link.href = selectedEventForQR.qrCode;
                          link.click();
                        }}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedEventForQR.accessLink || `${window.location.origin}/camera/${selectedEventForQR.loginCode}`);
                          toast({
                            title: "Link Copied",
                            description: "Camera access link copied to clipboard!",
                          });
                        }}
                        className="flex-1"
                      >
                        <Link className="h-4 w-4 mr-1" />
                        Copy Link
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <QrCode className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">No QR code available</p>
                    <p className="text-sm text-gray-400">Generate one in the event editor</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Event Dialog */}
        <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Name</Label>
                  <Input
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                    placeholder="Enter event name"
                  />
                </div>
                <div>
                  <Label>Event Date</Label>
                  <Input
                    type="date"
                    value={newEvent.eventDate}
                    onChange={(e) => setNewEvent({...newEvent, eventDate: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Package Type</Label>
                  <Select value={newEvent.packageType} onValueChange={(value) => setNewEvent({...newEvent, packageType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard ($50)</SelectItem>
                      <SelectItem value="premium">Premium ($75)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Gallery Privacy</Label>
                  <Select value={newEvent.galleryType} onValueChange={(value) => setNewEvent({...newEvent, galleryType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">🔒 Private</SelectItem>
                      <SelectItem value="public">🌐 Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Storage Provider</Label>
                  <Select value={newEvent.storageProvider} onValueChange={(value) => setNewEvent({...newEvent, storageProvider: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="firebase">🔥 Firebase</SelectItem>
                      <SelectItem value="googledrive">📁 Google Drive</SelectItem>
                      <SelectItem value="dropbox">📦 Dropbox</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Folder Name</Label>
                  <Input
                    value={newEvent.folderName}
                    onChange={(e) => setNewEvent({...newEvent, folderName: e.target.value})}
                    placeholder="Auto-generated from event name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Features</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newEvent.premiumFiltering}
                      onCheckedChange={(checked) => setNewEvent({...newEvent, premiumFiltering: checked})}
                    />
                    <Label className="text-sm">Premium Filtering</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newEvent.socialSharing}
                      onCheckedChange={(checked) => setNewEvent({...newEvent, socialSharing: checked})}
                    />
                    <Label className="text-sm">Social Sharing</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateEventDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} disabled={!newEvent.name}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}