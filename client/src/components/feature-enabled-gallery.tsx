import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Download, Heart, Star, Share, MessageCircle, Printer, Filter } from "lucide-react";

interface Photo {
  id: number;
  url: string;
  filename: string;
  uploadedAt: string;
}

interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

interface FeatureEnabledGalleryProps {
  photos: Photo[];
  eventFeatures: string[];
  premiumFiltering: boolean;
  socialSharing: boolean;
  galleryType: "private" | "public";
}

export default function FeatureEnabledGallery({ 
  photos, 
  eventFeatures, 
  premiumFiltering, 
  socialSharing,
  galleryType 
}: FeatureEnabledGalleryProps) {
  const [comments, setComments] = useState<{[photoId: number]: Comment[]}>({});
  const [newComment, setNewComment] = useState("");
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [ratings, setRatings] = useState<{[photoId: number]: number}>({});
  const [filter, setFilter] = useState("none");

  const hasFeature = (feature: string) => eventFeatures.includes(feature);

  const handleDownload = (photo: Photo) => {
    if (!hasFeature('Download') && !hasFeature('Bulk Download')) {
      alert('Download feature not enabled for this event');
      return;
    }
    
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.filename;
    link.click();
  };

  const handleFavorite = (photoId: number) => {
    if (!hasFeature('Favorites')) {
      alert('Favorites feature not enabled for this event');
      return;
    }
    
    const newFavorites = new Set(favorites);
    if (newFavorites.has(photoId)) {
      newFavorites.delete(photoId);
    } else {
      newFavorites.add(photoId);
    }
    setFavorites(newFavorites);
  };

  const handleRating = (photoId: number, rating: number) => {
    if (!hasFeature('Photo Ratings')) {
      alert('Photo ratings feature not enabled for this event');
      return;
    }
    
    setRatings(prev => ({
      ...prev,
      [photoId]: rating
    }));
  };

  const handleComment = (photoId: number) => {
    if (!hasFeature('Guest Comments') || !newComment.trim()) {
      if (!hasFeature('Guest Comments')) {
        alert('Guest comments feature not enabled for this event');
      }
      return;
    }
    
    const comment: Comment = {
      id: Date.now(),
      text: newComment,
      author: "Guest User",
      timestamp: new Date().toISOString()
    };
    
    setComments(prev => ({
      ...prev,
      [photoId]: [...(prev[photoId] || []), comment]
    }));
    setNewComment("");
  };

  const handleShare = (photo: Photo) => {
    if (!socialSharing && !hasFeature('Social Media Sharing')) {
      alert('Social sharing feature not enabled for this event');
      return;
    }
    
    if (navigator.share) {
      navigator.share({
        title: 'Check out this photo!',
        url: photo.url,
      });
    } else {
      navigator.clipboard.writeText(photo.url);
      alert('Photo link copied to clipboard!');
    }
  };

  const handlePrint = (photo: Photo) => {
    if (!hasFeature('Print Orders')) {
      alert('Print orders feature not enabled for this event');
      return;
    }
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(`
      <html>
        <head><title>Print Photo</title></head>
        <body style="margin:0;padding:20px;">
          <img src="${photo.url}" style="max-width:100%;height:auto;" onload="window.print();window.close();" />
        </body>
      </html>
    `);
  };

  const getFilterStyle = (imageUrl: string) => {
    if (!premiumFiltering || filter === "none") return {};
    
    const filters = {
      vintage: { filter: 'sepia(0.5) contrast(1.2) brightness(1.1)' },
      'black-white': { filter: 'grayscale(1) contrast(1.1)' },
      warm: { filter: 'hue-rotate(15deg) saturate(1.2)' }
    };
    
    return filters[filter] || {};
  };

  return (
    <div className="space-y-6">
      {/* Gallery Header with Active Features */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Event Gallery</h2>
          <Badge variant={galleryType === "private" ? "destructive" : "outline"}>
            {galleryType === "private" ? "🔒 Private" : "🌐 Public"}
          </Badge>
        </div>
        
        {/* Premium Filter Controls */}
        {premiumFiltering && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border rounded"
            >
              <option value="none">No Filter</option>
              <option value="vintage">Vintage</option>
              <option value="black-white">Black & White</option>
              <option value="warm">Warm Tone</option>
            </select>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {hasFeature('Bulk Download') && (
        <div className="flex justify-end">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Download All Photos
          </Button>
        </div>
      )}

      {/* Gallery Grid with Functional Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative">
              <img 
                src={photo.url} 
                alt={photo.filename}
                className="w-full h-64 object-cover"
                style={getFilterStyle(photo.url)}
              />
              
              {/* Overlay Controls - Only show if features are enabled */}
              <div className="absolute top-2 right-2 flex gap-1">
                {hasFeature('Favorites') && (
                  <Button
                    size="sm"
                    variant={favorites.has(photo.id) ? "default" : "outline"}
                    onClick={() => handleFavorite(photo.id)}
                  >
                    <Heart className="h-3 w-3" />
                  </Button>
                )}
                
                {hasFeature('Download') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(photo)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <CardContent className="p-4 space-y-3">
              {/* Photo Rating - Only if enabled */}
              {hasFeature('Photo Ratings') && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 cursor-pointer ${
                        (ratings[photo.id] || 0) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => handleRating(photo.id, star)}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({ratings[photo.id] || 0}/5)
                  </span>
                </div>
              )}

              {/* Action Buttons - Only if features enabled */}
              <div className="flex gap-2 flex-wrap">
                {(socialSharing || hasFeature('Social Media Sharing')) && (
                  <Button size="sm" variant="outline" onClick={() => handleShare(photo)}>
                    <Share className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                )}
                
                {hasFeature('Print Orders') && (
                  <Button size="sm" variant="outline" onClick={() => handlePrint(photo)}>
                    <Printer className="h-3 w-3 mr-1" />
                    Print
                  </Button>
                )}
              </div>

              {/* Comments - Only if enabled */}
              {hasFeature('Guest Comments') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={() => handleComment(photo.id)}>
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {comments[photo.id]?.map((comment) => (
                    <div key={comment.id} className="text-xs bg-gray-50 p-2 rounded">
                      <strong>{comment.author}:</strong> {comment.text}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Features Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">✅ Active Features:</h3>
        <div className="flex flex-wrap gap-2">
          {eventFeatures.map((feature) => (
            <Badge key={feature} variant="secondary">
              {feature}
            </Badge>
          ))}
          {premiumFiltering && (
            <Badge variant="default">✨ Premium Filtering</Badge>
          )}
          {socialSharing && (
            <Badge variant="default">📱 Social Sharing</Badge>
          )}
        </div>
        
        {eventFeatures.length === 0 && !premiumFiltering && !socialSharing && (
          <p className="text-gray-500 text-sm">No features enabled for this event</p>
        )}
      </div>
    </div>
  );
}