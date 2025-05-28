import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function Admin() {
  const { data: eventsData = [] } = useQuery({
    queryKey: ["/api/admin/events"],
  });

  const { data: statsData = {} } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">System analytics, event management, and subscription monitoring</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(statsData as any)?.totalUsers || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData?.totalEvents || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${statsData?.totalRevenue || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData?.activeSubscriptions || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Event Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(eventsData as any[])?.length > 0 ? (
                (eventsData as any[]).map((event: any) => (
                  <div key={event.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">{event.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{event.loginCode}</span>
                        </p>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-gray-600">Package:</span>
                          <Badge variant={event.packageType === "premium" ? "default" : "secondary"}>
                            {event.packageType === "premium" ? "Premium ($75)" : "Standard ($50)"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm text-gray-600">Gallery:</span>
                          <Badge variant={event.galleryType === "public" ? "outline" : "secondary"}>
                            {event.galleryType === "public" ? "🌐 Public" : "🔒 Private"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Photos: {event.photoCount}</span>
                          <Badge variant={event.status === "active" ? "default" : "secondary"}>
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No events created yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}