import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import CameraInterface from "@/components/camera/camera-interface";
import FilterControls from "@/components/camera/filter-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Image } from "lucide-react";

interface EventAccess {
  eventId: number;
  eventName: string;
  accessGranted: boolean;
  remainingPhotos: number | null;
}

export default function EventCamera() {
  const { loginCode } = useParams<{ loginCode: string }>();
  const [selectedFilter, setSelectedFilter] = useState("none");

  const { data: eventAccess, isLoading, error } = useQuery<EventAccess>({
    queryKey: [`/api/camera/${loginCode}`],
    enabled: !!loginCode,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Accessing event...</p>
        </div>
      </div>
    );
  }

  if (error || !eventAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h2>
              <p className="text-gray-600 mb-4">
                Please check your access code and try again.
              </p>
              <p className="text-sm text-gray-500">
                Access Code: <span className="font-mono">{loginCode}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{eventAccess.eventName}</h1>
              <p className="text-gray-600">Capture and share your memories</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Users className="h-3 w-3 mr-1" />
                Event Active
              </Badge>
              {eventAccess.remainingPhotos !== null && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Image className="h-3 w-3 mr-1" />
                  {eventAccess.remainingPhotos} photos left
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Camera Interface */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Camera */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Camera
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CameraInterface 
                  eventId={eventAccess.eventId} 
                  selectedFilter={selectedFilter} 
                />
              </CardContent>
            </Card>
          </div>

          {/* Filters & Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Photo Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <FilterControls
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                />
              </CardContent>
            </Card>

            {/* Event Info */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Event Name</p>
                  <p className="text-sm text-gray-900">{eventAccess.eventName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Access Code</p>
                  <p className="text-sm font-mono text-gray-900">{loginCode}</p>
                </div>
                {eventAccess.remainingPhotos !== null && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Photos Remaining</p>
                    <p className="text-sm text-gray-900">{eventAccess.remainingPhotos}</p>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-500">
                    All photos are automatically saved to the event gallery and go through content moderation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}