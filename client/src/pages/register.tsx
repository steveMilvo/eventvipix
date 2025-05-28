import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  User, 
  Mail, 
  Lock, 
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Check,
  Crown,
  Camera,
  CheckCircle
} from "lucide-react";
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import CheckoutForm from '@/components/payment/checkout-form';

const registrationSchema = z.object({
  // User Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  
  // Event Information
  eventName: z.string().min(3, "Event name must be at least 3 characters"),
  eventDescription: z.string().optional(),
  eventDate: z.string().min(1, "Please select an event date"),
  guestCount: z.string().min(1, "Please estimate guest count"),
  folderName: z.string().optional(),
  
  // Gallery Privacy Settings
  galleryType: z.enum(["private", "public"]).default("private"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const packages = {
  standard: {
    name: "Standard",
    price: 50,
    features: [
      "Up to 100 photos per event",
      "Basic photo filters",
      "Cloud storage backup",
      "QR code event access",
      "Email support"
    ],
    icon: Camera
  },
  premium: {
    name: "Premium", 
    price: 75,
    features: [
      "Unlimited photos per event",
      "Professional photo filters",
      "Multi-cloud storage",
      "AI content moderation",
      "Priority support"
    ],
    icon: Crown
  }
};

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<string>("standard");
  const [step, setStep] = useState<"registration" | "payment" | "success">("registration");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);
  const [errorOptions, setErrorOptions] = useState<any[]>([]);

  // Get package from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const packageParam = urlParams.get('package');
    if (packageParam && (packageParam === 'standard' || packageParam === 'premium')) {
      setSelectedPackage(packageParam);
    }
  }, []);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      eventName: "",
      eventDescription: "",
      eventDate: "",
      guestCount: "",
      folderName: "",
      galleryType: "private",
    },
  });

  // Create user and event
  const registerMutation = useMutation({
    mutationFn: async (data: RegistrationFormData) => {
      // Create user first
      const userResponse = await apiRequest("POST", "/api/auth/register", {
        username: data.email,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        
        // Check if this is a duplicate email error with options
        if (errorData.type === 'duplicate_email' && errorData.options) {
          // Create a special error with the options data
          const error = new Error(errorData.message || "Failed to create user account");
          (error as any).type = 'duplicate_email';
          (error as any).options = errorData.options;
          throw error;
        }
        
        throw new Error(errorData.message || "Failed to create user account");
      }
      
      const user = await userResponse.json();
      setUserId(user.id);

      // Create event for the user
      try {
        const eventResponse = await apiRequest("POST", "/api/events/direct", {
          name: data.eventName,
          description: data.eventDescription || null,
          eventDate: data.eventDate,
          packageType: selectedPackage,
          folderName: data.folderName || data.eventName.toLowerCase().replace(/\s+/g, '-'),
          userId: user.id,
          galleryType: data.galleryType,
        });

        if (!eventResponse.ok) {
          const errorData = await eventResponse.json();
          throw new Error(errorData.message || "Failed to create event");
        }

        const event = await eventResponse.json();
        
        // Verify event data before proceeding
        if (!event || !event.event || !event.event.id) {
          throw new Error("Invalid event data received");
        }

        // Store the created event for later use
        setCreatedEvent(event.event);

        return { user, event: event.event };
      } catch (error: any) {
        console.error("Event creation error:", error);
        throw new Error(`Event creation failed: ${error.message}`);
      }
    },
    onSuccess: async (data) => {
      toast({
        title: "Account Created Successfully!",
        description: `Welcome ${data.user.firstName}! Your event "${data.event.name}" is ready.`,
      });

      // Create payment intent for the package
      try {
        const paymentResponse = await apiRequest("POST", "/api/create-payment-intent", {
          amount: packages[selectedPackage as keyof typeof packages].price,
          eventId: data.event.id,
          userId: data.user.id,
        });
        
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          setClientSecret(paymentData.clientSecret);
          setStep("payment");
        } else {
          throw new Error("Failed to create payment");
        }
      } catch (error) {
        toast({
          title: "Payment Setup Error",
          description: "There was an issue setting up payment. Please contact support.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      // Check if this is a duplicate email error with options
      if (error.type === 'duplicate_email' && error.options) {
        // Handle this as a special case - show options to user
        toast({
          title: "Account Already Exists",
          description: "This email is already registered. Choose an option below:",
          variant: "destructive",
        });
        
        // Set the error state and options
        setDuplicateEmailError(true);
        setErrorOptions(error.options);
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "An error occurred during registration",
          variant: "destructive",
        });
      }
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    registerMutation.mutate(data);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your event is ready! Your QR code is being prepared...",
    });
    
    setStep("success");
  };

  const currentPackage = packages[selectedPackage as keyof typeof packages];
  const IconComponent = currentPackage.icon;

  if (step === "payment" && clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Your Payment
            </h1>
            <p className="text-gray-600">
              Secure payment for your {currentPackage.name} package (${currentPackage.price})
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">
                {currentPackage.name} Package - ${currentPackage.price}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success step - Display QR code immediately after payment
  if (step === "success" && createdEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Your {currentPackage.name} package is ready
            </p>
            <p className="text-gray-500">
              Event: {createdEvent.name}
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl mb-4">Your Event QR Code</CardTitle>
              <p className="text-gray-600">
                Share this QR code with your guests to access the photo gallery
              </p>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              {/* QR Code Display */}
              {createdEvent.qrCode && (
                <div className="bg-white p-6 rounded-lg shadow-inner inline-block">
                  <img 
                    src={createdEvent.qrCode} 
                    alt="Event QR Code" 
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              )}
              
              {/* Event Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Event Name:</span> {createdEvent.name}</p>
                  <p><span className="font-medium">Login Code:</span> {createdEvent.loginCode}</p>
                  <p><span className="font-medium">Package:</span> {currentPackage.name}</p>
                  <p><span className="font-medium">Max Photos:</span> {createdEvent.maxPhotos}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={() => setLocation("/events")}
                  className="w-full"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = createdEvent.qrCode;
                    link.download = `${createdEvent.name}-qr-code.png`;
                    link.click();
                  }}
                  className="w-full"
                >
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Account & Event
          </h1>
          <p className="text-xl text-gray-600">
            Get started with your {currentPackage.name} package
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Package Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">
                  {currentPackage.name} Package
                </CardTitle>
                <div className="text-3xl font-bold text-purple-600">
                  ${currentPackage.price}
                </div>
              </CardHeader>
              
              <CardContent>
                <h4 className="font-semibold text-gray-900 mb-3">Included Features:</h4>
                <ul className="space-y-2">
                  {currentPackage.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account & Event Details
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Min. 6 characters" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Event Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Event Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="eventName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Sarah's Wedding" {...field} />
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="guestCount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expected Guest Count</FormLabel>
                              <FormControl>
                                <Input placeholder="50-100 guests" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="folderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom Folder Name (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="sarah-wedding-2024" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Gallery Privacy Settings */}
                      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Gallery Privacy Settings
                        </h3>
                        <FormField
                          control={form.control}
                          name="galleryType"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="space-y-3">
                                  <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="radio"
                                      value="private"
                                      checked={field.value === "private"}
                                      onChange={() => field.onChange("private")}
                                      className="text-blue-600"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-gray-600" />
                                        <span className="font-medium">Private Gallery</span>
                                        <Badge variant="secondary">Recommended</Badge>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Only people with QR code or login code can view photos
                                      </p>
                                    </div>
                                  </label>
                                  
                                  <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                      type="radio"
                                      value="public"
                                      checked={field.value === "public"}
                                      onChange={() => field.onChange("public")}
                                      className="text-blue-600"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-gray-600" />
                                        <span className="font-medium">Public Gallery</span>
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">
                                        Anyone with the shareable link can view photos
                                      </p>
                                    </div>
                                  </label>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="eventDescription"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Event Description (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your special event..."
                                rows={3}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-medium"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}