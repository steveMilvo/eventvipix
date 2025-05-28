import { useState } from "react";
import FeatureEnabledGallery from "@/components/feature-enabled-gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function FeatureTest() {
  // Sample photos for testing
  const samplePhotos = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1542038784456-1ea8e732c8e8?w=400",
      filename: "wedding-photo-1.jpg",
      uploadedAt: "2025-01-25T10:00:00Z"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
      filename: "wedding-photo-2.jpg",
      uploadedAt: "2025-01-25T10:15:00Z"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      filename: "wedding-photo-3.jpg",
      uploadedAt: "2025-01-25T10:30:00Z"
    }
  ];

  // Feature control state
  const [features, setFeatures] = useState<string[]>([
    "Basic Gallery",
    "Download",
    "Favorites"
  ]);
  const [premiumFiltering, setPremiumFiltering] = useState(true);
  const [socialSharing, setSocialSharing] = useState(true);
  const [galleryType, setGalleryType] = useState<"private" | "public">("private");

  const allFeatures = [
    "Basic Gallery",
    "HD Photos", 
    "Download",
    "Guest Upload",
    "Guest Comments",
    "Photo Ratings",
    "Favorites",
    "Video Messages",
    "Photo Booth Effects",
    "Live Slideshow", 
    "Print Orders",
    "AI Photo Enhancement",
    "Social Media Sharing",
    "Email Gallery Link",
    "QR Code Access",
    "Bulk Download"
  ];

  const toggleFeature = (feature: string) => {
    setFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Feature Functionality Test</h1>
        <p className="text-gray-600">
          Toggle features below and see them work in real-time in the gallery
        </p>
      </div>

      {/* Feature Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gallery Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Premium Filtering</Label>
              <Switch 
                checked={premiumFiltering} 
                onCheckedChange={setPremiumFiltering}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Social Sharing</Label>
              <Switch 
                checked={socialSharing} 
                onCheckedChange={setSocialSharing}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Gallery Type</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setGalleryType(galleryType === "private" ? "public" : "private")}
              >
                {galleryType === "private" ? "🔒 Private" : "🌐 Public"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Feature Toggle Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allFeatures.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={feature}
                    checked={features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    className="rounded"
                  />
                  <Label htmlFor={feature} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Status */}
      <Card>
        <CardHeader>
          <CardTitle>Currently Active Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {features.map(feature => (
              <span key={feature} className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                ✅ {feature}
              </span>
            ))}
            {premiumFiltering && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                ✨ Premium Filtering
              </span>
            )}
            {socialSharing && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                📱 Social Sharing
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Instructions */}
      <Card className="bg-yellow-50">
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>1. Toggle features above</strong> and watch them appear/disappear in the gallery below</p>
            <p><strong>2. Try these tests:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Enable "Favorites" → Heart icons appear on photos</li>
              <li>Enable "Download" → Download buttons appear</li>
              <li>Enable "Photo Ratings" → Star rating system appears</li>
              <li>Enable "Guest Comments" → Comment input boxes appear</li>
              <li>Enable "Premium Filtering" → Filter dropdown appears</li>
              <li>Enable "Social Media Sharing" → Share buttons appear</li>
              <li>Disable features → Buttons disappear and show "not enabled" alerts</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Functional Gallery */}
      <FeatureEnabledGallery
        photos={samplePhotos}
        eventFeatures={features}
        premiumFiltering={premiumFiltering}
        socialSharing={socialSharing}
        galleryType={galleryType}
      />
    </div>
  );
}