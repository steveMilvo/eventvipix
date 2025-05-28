import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Shield, 
  Cloud, 
  Zap, 
  Star, 
  Check, 
  ArrowRight,
  Users,
  Clock,
  Crown,
  Package
} from "lucide-react";

// Hero images for auto-rolling gallery - Beautiful wedding photography
const heroImages = [
  {
    id: 1,
    url: "/Steve&Xerxieedited_.JPG",
    alt: "Bridal Hair Styling",
    title: "Getting Ready Moments"
  },
  {
    id: 2,
    url: "/Steve&Xerxieedited_-34.JPG",
    alt: "Wedding Day Transportation",
    title: "Classic Wedding Style"
  },
  {
    id: 3,
    url: "/Steve&Xerxieedited_-31.JPG",
    alt: "Bridal Portrait",
    title: "Elegant Bridal Portraits"
  },
  {
    id: 4,
    url: "/Steve&Xerxieedited_-33.JPG",
    alt: "Wedding Day Joy",
    title: "Capturing Pure Joy"
  }
];

const features = [
  {
    icon: Camera,
    title: "Live Photo Capture",
    description: "Real-time photo sharing with advanced camera filters and effects",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Shield,
    title: "AI Content Moderation",
    description: "Automatic content filtering ensures family-friendly photo sharing",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Cloud,
    title: "Multi-Cloud Storage",
    description: "Secure backup across Firebase, Google Drive, and Dropbox",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Zap,
    title: "Instant Processing",
    description: "Fast upload and processing with real-time photo availability",
    color: "bg-yellow-100 text-yellow-600"
  }
];

const packages = [
  {
    id: "standard",
    name: "Standard",
    price: 50,
    description: "Ideal for small gatherings and parties",
    features: [
      "Unlimited photo uploads",
      "1 QR code",
      "7 days gallery access",
      "Google Drive integration",
      "Custom branding"
    ],
    icon: Package,
    color: "border-gray-200"
  },
  {
    id: "premium",
    name: "Premium",
    price: 75,
    description: "Ideal for weddings and corporate events",
    features: [
      "Unlimited photo uploads",
      "1 QR code",
      "14 days gallery access",
      "30 days gallery viewing",
      "Custom branding with event title/date",
      "Google Drive integration",
      "Priority support"
    ],
    icon: Crown,
    color: "border-primary-500",
    popular: true
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Wedding Photographer",
    content: "VIPix transformed our wedding photo sharing. Guests love the instant access and filters!",
    rating: 5
  },
  {
    name: "Mike Chen",
    role: "Event Coordinator",
    content: "The AI moderation gives us peace of mind, and the multi-cloud backup is fantastic.",
    rating: 5
  },
  {
    name: "Emma Davis",
    role: "Corporate Events",
    content: "Professional, reliable, and easy to use. Our clients are always impressed.",
    rating: 5
  }
];

export default function Landing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rolling hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = (packageType: string) => {
    // This would navigate to the registration/events page with pre-selected package
    window.location.href = `/events?package=${packageType}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">VIPix</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-600 hover:text-primary-600 transition-colors">Home</a>
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition-colors">Contact</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/admin-login">
                <Button variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full px-4">
                  Admin
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Capture, Store, Share
                </h1>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  with <span className="text-purple-600">VIPix</span>
                </h1>
              </div>
              
              <p className="text-xl text-gray-600 max-w-lg">
                The ultimate cloud storage solution for your event photos. 
                Connect directly to Google Drive, Dropbox, or use our secure 
                cloud storage.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/packages">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium">
                    Get Started
                  </Button>
                </Link>
                <Link href="/camera">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full text-lg font-medium"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>
              
              {/* Cloud Storage Badges */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Cloud className="h-5 w-5 text-blue-500" />
                  <span>Google Drive</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <span>Dropbox</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Cloud className="h-5 w-5 text-orange-500" />
                  <span>Firebase</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Photo/Card */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={heroImages[currentImageIndex].url}
                  alt={heroImages[currentImageIndex].alt}
                  className="w-full h-80 object-cover transition-all duration-500"
                />
                
                {/* Instant Upload Badge */}
                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  Instant Upload
                </div>
                
                {/* Easy Sharing Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium flex items-center shadow-lg">
                  <Users className="h-4 w-4 mr-1" />
                  Easy Sharing
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-200 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Event
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From intimate gatherings to large celebrations, VIPix provides 
              everything you need for seamless photo sharing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Get Started with Premium Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get Started with Premium
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Unlock unlimited storage, AI moderation, and professional-grade features for your events
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Unlimited Storage</h3>
                <p className="text-purple-100">Store thousands of photos across multiple cloud providers</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Moderation</h3>
                <p className="text-purple-100">Automatic content filtering and quality enhancement</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Priority Support</h3>
                <p className="text-purple-100">24/7 dedicated support for your events</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium">
                  Start Premium Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium"
              >
                View All Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options designed to fit events of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {packages.map((pkg) => (
              <Card 
                key={pkg.id} 
                className={`relative ${pkg.color} hover:shadow-xl transition-shadow ${
                  pkg.popular ? "scale-105 shadow-lg" : ""
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="flex items-center justify-center mb-4">
                    <pkg.icon className={`h-8 w-8 mr-2 ${pkg.popular ? "text-primary-600" : "text-gray-600"}`} />
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    ${pkg.price}
                    <span className="text-lg font-normal text-gray-600">/event</span>
                  </div>
                  <p className="text-gray-600">{pkg.description}</p>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handleGetStarted(pkg.id)}
                    className={`w-full py-3 ${
                      pkg.popular 
                        ? "bg-primary-600 hover:bg-primary-700 text-white" 
                        : "bg-gray-900 hover:bg-gray-800 text-white"
                    }`}
                  >
                    Get Started with {pkg.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Event Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about VIPix
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Event Photography?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of event organizers who trust VIPix for their photo sharing needs
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/events">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4">
                Start Your Event Now
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">VIPix</h3>
              <p className="text-gray-400">
                Professional event photo sharing platform with AI moderation and multi-cloud storage.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/dashboard"><a className="hover:text-white transition-colors">Dashboard</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VIPix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}