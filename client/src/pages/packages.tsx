import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  ArrowRight, 
  Star,
  Camera,
  Cloud,
  Shield,
  Zap,
  Users,
  Crown
} from "lucide-react";

const packages = [
  {
    id: "standard",
    name: "Standard",
    price: 50,
    popular: false,
    description: "Perfect for small gatherings and intimate events",
    features: [
      "Up to 100 photos per event",
      "Basic photo filters",
      "Cloud storage backup",
      "QR code event access",
      "Email support",
      "7-day photo retention"
    ],
    ideal: ["Birthday parties", "Small gatherings", "Family events", "Casual meetups"],
    icon: Camera
  },
  {
    id: "premium", 
    name: "Premium",
    price: 75,
    popular: true,
    description: "Ideal for weddings, corporate events, and large celebrations",
    features: [
      "Unlimited photos per event",
      "Professional photo filters & effects",
      "Multi-cloud storage (Google Drive, Dropbox)",
      "AI-powered content moderation",
      "Priority support & live chat",
      "30-day photo retention",
      "Custom branding options",
      "Advanced analytics dashboard"
    ],
    ideal: ["Weddings", "Corporate events", "Conferences", "Large celebrations"],
    icon: Crown
  }
];

export default function Packages() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    // Navigate to registration page with package pre-selected
    window.location.href = `/register?package=${packageId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100">
      {/* Header */}
      <div className="pt-20 pb-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Event Package
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect package for your event. Both include QR code access, 
            cloud storage, and professional photo sharing capabilities.
          </p>
        </div>
      </div>

      {/* Package Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {packages.map((pkg) => {
            const IconComponent = pkg.icon;
            return (
              <Card 
                key={pkg.id} 
                className={`relative transition-all duration-300 hover:shadow-xl ${
                  pkg.popular 
                    ? "border-2 border-purple-500 shadow-lg scale-105" 
                    : "border border-gray-200 hover:border-purple-300"
                }`}
              >
                {pkg.popular && (
                  <Badge 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {pkg.name}
                  </CardTitle>
                  
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-gray-900">${pkg.price}</span>
                    <span className="text-gray-500 ml-2">per event</span>
                  </div>
                  
                  <p className="text-gray-600 mt-2">
                    {pkg.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal For */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Ideal For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.ideal.map((item, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-gray-100 text-gray-700"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`w-full py-3 text-lg font-medium ${
                      pkg.popular 
                        ? "bg-purple-600 hover:bg-purple-700 text-white" 
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Get Started with {pkg.name}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Choose Package</h4>
                <p className="text-gray-600 text-sm">Select the package that fits your event size and needs</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Create Event</h4>
                <p className="text-gray-600 text-sm">Set up your event and get a unique QR code for guests</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Share & Capture</h4>
                <p className="text-gray-600 text-sm">Guests scan QR code and start taking amazing photos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" className="px-6">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}