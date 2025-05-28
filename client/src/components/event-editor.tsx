import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Edit2, Save, X, Eye } from "lucide-react";

interface EventEditorProps {
  event: {
    id: number;
    name: string;
    loginCode: string;
    packageType: string;
    status: string;
    photoCount: number;
    galleryType?: string;
    galleryFeatures?: string[];
    allowGuestUploads?: boolean;
    moderationEnabled?: boolean;
    qrCode?: string;
    accessLink?: string;
  };
  onEdit: (eventId: number, updates: any) => void;
  onShowQR: (event: any) => void;
}

export default function EventEditor({ event, onEdit, onShowQR }: EventEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    packageType: event.packageType,
    galleryType: event.galleryType || "private",
    galleryFeatures: event.galleryFeatures || ["download"],
    allowGuestUploads: event.allowGuestUploads || false,
    moderationEnabled: event.moderationEnabled !== false,
  });

  const handleSave = () => {
    onEdit(event.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      packageType: event.packageType,
      galleryType: event.galleryType || "private",
      galleryFeatures: event.galleryFeatures || ["download"],
      allowGuestUploads: event.allowGuestUploads || false,
      moderationEnabled: event.moderationEnabled !== false,
    });
    setIsEditing(false);
  };

  const toggleFeature = (feature: string) => {
    setEditData(prev => ({
      ...prev,
      galleryFeatures: prev.galleryFeatures.includes(feature)
        ? prev.galleryFeatures.filter(f => f !== feature)
        : [...prev.galleryFeatures, feature]
    }));
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-medium text-lg">{event.name}</h4>
            <Badge variant="outline" className="font-mono">
              {event.loginCode}
            </Badge>
          </div>

          {!isEditing ? (
            // View Mode
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Package:</span>
                <Badge variant={event.packageType === "premium" ? "default" : "secondary"}>
                  {event.packageType === "premium" ? "Premium ($75)" : "Standard ($50)"}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Gallery:</span>
                <Badge variant={event.galleryType === "public" ? "outline" : "secondary"}>
                  {event.galleryType === "public" ? "🌐 Public" : "🔒 Private"}
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Features:</span>
                <div className="flex gap-1">
                  {(event.galleryFeatures || ["download"]).map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Photos: {event.photoCount}</span>
                <Badge variant={event.status === "active" ? "default" : "secondary"}>
                  {event.status}
                </Badge>
              </div>

              {/* QR Code Section */}
              {event.qrCode && (
                <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-800">Event QR Code</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = event.qrCode;
                          link.download = `${event.name}-qr-code.png`;
                          link.click();
                        }}
                        className="text-xs"
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onShowQR(event)}
                        className="text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View Full
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded border shadow-inner">
                      <img 
                        src={event.qrCode} 
                        alt={`QR Code for ${event.name}`}
                        className="w-20 h-20"
                      />
                    </div>
                    <div className="flex-1 text-xs text-gray-600 space-y-1">
                      <p><span className="font-medium">Login Code:</span> <span className="font-mono font-bold text-gray-800">{event.loginCode}</span></p>
                      <p><span className="font-medium">Camera Access:</span> Share this QR code with guests</p>
                      <p><span className="font-medium">Gallery Type:</span> {event.galleryType === "public" ? "Public" : "Private"}</p>
                      <div className="mt-2 p-2 bg-blue-50 rounded text-blue-700">
                        <p className="text-xs">💡 Guests scan this code to access the camera interface and upload photos to your event.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              {/* Package Type */}
              <div>
                <label className="text-sm font-medium block mb-2">Package Type</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={editData.packageType}
                  onChange={(e) => setEditData(prev => ({ ...prev, packageType: e.target.value }))}
                >
                  <option value="standard">Standard ($50) - Basic features</option>
                  <option value="premium">Premium ($75) - All features</option>
                </select>
              </div>

              {/* Gallery Privacy */}
              <div>
                <label className="text-sm font-medium block mb-2">Gallery Privacy</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={editData.galleryType}
                  onChange={(e) => setEditData(prev => ({ ...prev, galleryType: e.target.value }))}
                >
                  <option value="private">🔒 Private - Only accessible with QR code or login code</option>
                  <option value="public">🌐 Public - Shareable link available</option>
                </select>
              </div>

              {/* Gallery Features */}
              <div>
                <label className="text-sm font-medium block mb-2">Gallery Features</label>
                <div className="grid grid-cols-2 gap-2">
                  {["download", "share", "comments", "favorites"].map(feature => (
                    <label key={feature} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={editData.galleryFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="rounded"
                      />
                      <span className="capitalize">{feature}</span>
                      {editData.packageType === "standard" && ["comments", "favorites"].includes(feature) && (
                        <Badge variant="outline" className="text-xs">Premium</Badge>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Settings */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editData.allowGuestUploads}
                    onChange={(e) => setEditData(prev => ({ ...prev, allowGuestUploads: e.target.checked }))}
                    className="rounded"
                  />
                  Allow guest uploads
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editData.moderationEnabled}
                    onChange={(e) => setEditData(prev => ({ ...prev, moderationEnabled: e.target.checked }))}
                    className="rounded"
                  />
                  Enable AI moderation
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShowQR(event)}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
              >
                <Save className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}