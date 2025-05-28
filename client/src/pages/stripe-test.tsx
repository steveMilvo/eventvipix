
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripe';
import CheckoutForm from '@/components/payment/checkout-form';

export default function StripeTest() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [amount, setAmount] = useState<string>("50");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageType: 'standard',
          eventData: {
            name: 'Test Event',
            description: 'Test payment'
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        toast({
          title: "Payment Intent Created",
          description: "Stripe payment form is ready for testing",
        });
      } else {
        throw new Error('No client secret received');
      }
    } catch (error: any) {
      console.error('Payment intent creation failed:', error);
      toast({
        title: "Payment Setup Failed",
        description: error.message || "Could not initialize payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Test payment completed successfully",
    });
    setClientSecret("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Stripe Payment Test
          </h1>
          <p className="text-gray-600">
            Test the Stripe payment integration
          </p>
        </div>

        <Card className="shadow-xl mb-6">
          <CardHeader>
            <CardTitle>Payment Configuration Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Test Amount (USD)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            
            <Button 
              onClick={createPaymentIntent} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating Payment Intent..." : "Create Test Payment"}
            </Button>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Test Cards:</strong></p>
              <p>• Success: 4242 4242 4242 4242</p>
              <p>• Requires Authentication: 4000 0025 0000 3155</p>
              <p>• Declined: 4000 0000 0000 0002</p>
              <p>• Expiry: Any future date | CVC: Any 3 digits</p>
            </div>
          </CardContent>
        </Card>

        {clientSecret && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Test Payment Form</CardTitle>
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
        )}
      </div>
    </div>
  );
}
