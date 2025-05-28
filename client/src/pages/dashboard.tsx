import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Camera, Shield, DollarSign, Plus, QrCode, Settings } from "lucide-react";
import { Link } from "wouter";
import CreateEventModal from "@/components/modals/create-event-modal";

interface Stats {
  activeEvents: number;
  photosCount: number;
  moderationQueue: number;
  revenue: number;
}

interface Activity {
  id: number;
  description: string;
  timestamp: string;
  type: 'approved' | 'uploaded' | 'payment';
}

export default function Dashboard() {
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  // Mock recent activity for demo
  const recentActivity: Activity[] = [
    {
      id: 1,
      description: "Photo approved for Wedding Event #1234",
      timestamp: "2 minutes ago",
      type: "approved",
    },
    {
      id: 2,
      description: "15 new photos uploaded to Birthday Party",
      timestamp: "5 minutes ago",
      type: "uploaded",
    },
    {
      id: 3,
      description: "Payment received for Premium package",
      timestamp: "10 minutes ago",
      type: "payment",
    },
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'approved':
        return <Shield className="h-4 w-4 text-green-600" />;
      case 'uploaded':
        return <Camera className="h-4 w-4 text-blue-600" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-purple-600" />;
    }
  };

  const getActivityBgColor = (type: Activity['type']) => {
    switch (type) {
      case 'approved':
        return 'bg-green-100';
      case 'uploaded':
        return 'bg-blue-100';
      case 'payment':
        return 'bg-purple-100';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your events and monitor photo sharing activity</p>
          </div>
          <Button 
            onClick={() => setIsCreateEventOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Event
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeEvents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Photos Captured</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.photosCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Moderation Queue</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.moderationQueue || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${stats?.revenue?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/events">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left"
                >
                  <Plus className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Create New Event</p>
                    <p className="text-sm text-gray-500">Set up a new photo sharing event</p>
                  </div>
                </Button>
              </Link>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 text-left"
              >
                <QrCode className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Generate QR Codes</p>
                  <p className="text-sm text-gray-500">Create access codes for events</p>
                </div>
              </Button>

              <Link href="/storage">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4 text-left"
                >
                  <Settings className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Storage Settings</p>
                    <p className="text-sm text-gray-500">Configure cloud storage providers</p>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Create Event Modal */}
      <CreateEventModal 
        open={isCreateEventOpen}
        onOpenChange={setIsCreateEventOpen}
      />
    </div>
  );
}
