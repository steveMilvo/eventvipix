import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Navigation from "@/components/layout/navigation";
import Landing from "@/pages/landing";
import Packages from "@/pages/packages";
import Register from "@/pages/register";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Camera from "@/pages/camera";
import CameraAccess from "@/pages/camera-access";
import EventCamera from "@/pages/event-camera";
import Events from "@/pages/events";
import StorageSettings from "@/pages/storage-settings";
import FeatureTest from "./pages/feature-test";
import StripeTest from "./pages/stripe-test";
import Admin from "@/pages/admin-working";
import AdminQRGallery from "@/pages/admin-qr-gallery";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/packages" component={Packages} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard">
          <Navigation />
          <main className="pt-16">
            <Dashboard />
          </main>
        </Route>
        <Route path="/camera">
          <Navigation />
          <main className="pt-16">
            <Camera />
          </main>
        </Route>
        <Route path="/event-camera" component={CameraAccess} />
        <Route path="/camera/:loginCode">
          <EventCamera />
        </Route>
        <Route path="/events">
          <Navigation />
          <main className="pt-16">
            <Events />
          </main>
        </Route>
        <Route path="/storage">
          <Navigation />
          <main className="pt-16">
            <StorageSettings />
          </main>
        </Route>
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin">
          <Navigation />
          <main className="pt-16">
            <Admin />
          </main>
        </Route>
        <Route path="/admin/qr-gallery">
          <Navigation />
          <main className="pt-16">
            <AdminQRGallery />
          </main>
        </Route>
        <Route path="/event/:id">
          <Camera />
        </Route>
        <Route path="/feature-test" component={FeatureTest} />
            <Route path="/stripe-test" component={StripeTest} />
            <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;