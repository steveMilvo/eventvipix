import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import CheckoutForm from "@/components/payment/checkout-form";

interface CreateEventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const eventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  description: z.string().optional(),
  eventDate: z.string().min(1, "Event date is required"),
  expectedGuests: z.string().min(1, "Expected guests is required"),
  packageType: z.enum(["standard", "premium"]),
  loginCode: z.string().optional(),
  folderName: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

const packages = {
  standard: {
    name: "Standard",
    price: 50,
    features: [
      "Up to 100 photos",
      "Basic filters",
      "AI content moderation",
      "7-day storage",
      "QR code access",
    ],
  },
  premium: {
    name: "Premium",
    price: 75,
    features: [
      "Unlimited photos",
      "Advanced filters & effects",
      "AI content moderation",
      "30-day storage",
      "QR code + custom link",
      "Download ZIP archive",
    ],
    popular: true,
  },
};

export default function CreateEventModal({ open, onOpenChange }: CreateEventModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      packageType: "premium",
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await apiRequest("POST", "/api/create-payment-intent", {
        packageType: data.packageType,
        eventData: data,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
      setCurrentStep(3);
    },
    onError: (error: any) => {
      toast({
        title: "Payment setup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const response = await apiRequest("POST", "/api/events", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Event created successfully",
        description: "Your event has been created and is ready for photos!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      onOpenChange(false);
      resetModal();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create event",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetModal = () => {
    setCurrentStep(1);
    setClientSecret("");
    form.reset();
  };

  const onSubmit = (data: EventFormData) => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      createPaymentMutation.mutate(data);
    }
  };

  const onPaymentSuccess = () => {
    const formData = form.getValues();
    createEventMutation.mutate(formData);
  };

  const selectedPackage = form.watch("packageType");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Event Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Event Information</h4>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sarah & John's Wedding" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of your event"
                          className="h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="expectedGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Guests</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select guest count" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-25">1-25 guests</SelectItem>
                            <SelectItem value="26-50">26-50 guests</SelectItem>
                            <SelectItem value="51-100">51-100 guests</SelectItem>
                            <SelectItem value="100+">100+ guests</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Camera Access Section */}
                <div className="border-t pt-4 mt-6">
                  <h5 className="text-md font-medium text-gray-900 mb-4">Camera Access Settings</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loginCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Login Code (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., WEDDING2024" 
                              {...field}
                              className="uppercase"
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            Guests can use this code to access the camera interface
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="folderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Folder</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., sarah-john-wedding"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                            />
                          </FormControl>
                          <p className="text-xs text-gray-500">
                            Photos will be organized in this folder
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Camera Link:</strong> Guests will access the camera at{" "}
                      <code className="bg-blue-100 px-1 rounded">
                        /camera/{form.watch("loginCode") || "[code]"}
                      </code>
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Next: Choose Package</Button>
                </div>
              </div>
            )}

            {/* Step 2: Package Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Choose Your Package</h4>
                
                <FormField
                  control={form.control}
                  name="packageType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {Object.entries(packages).map(([key, pkg]) => (
                            <Card
                              key={key}
                              className={`cursor-pointer transition-colors relative ${
                                field.value === key
                                  ? "border-2 border-primary-500"
                                  : "border border-gray-200 hover:border-primary-300"
                              }`}
                              onClick={() => field.onChange(key)}
                            >
                              {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                  <Badge className="bg-primary-500 text-white">Most Popular</Badge>
                                </div>
                              )}
                              <CardContent className="p-6 text-center">
                                <div className="flex items-center justify-center mb-2">
                                  {key === "premium" ? (
                                    <Crown className="h-6 w-6 text-primary-600 mr-2" />
                                  ) : (
                                    <Package className="h-6 w-6 text-gray-600 mr-2" />
                                  )}
                                  <h5 className="text-xl font-semibold text-gray-900">{pkg.name}</h5>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-4">${pkg.price}</div>
                                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                                  {pkg.features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={createPaymentMutation.isPending}>
                    {createPaymentMutation.isPending ? "Processing..." : "Proceed to Payment"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && clientSecret && (
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Payment Information</h4>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h5 className="font-medium text-gray-900 mb-2">Order Summary</h5>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{packages[selectedPackage].name} Package</span>
                    <span className="font-medium text-gray-900">${packages[selectedPackage].price}.00</span>
                  </div>
                </div>

                <CheckoutForm
                  clientSecret={clientSecret}
                  onSuccess={onPaymentSuccess}
                />

                <div className="flex justify-start">
                  <Button type="button" variant="outline" onClick={() => setCurrentStep(2)}>
                    Back
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
