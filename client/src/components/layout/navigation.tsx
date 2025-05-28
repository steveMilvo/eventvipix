import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Camera, Calendar, Settings, BarChart3, Shield } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/camera", label: "Camera", icon: Camera },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/storage", label: "Storage", icon: Settings },
    { href: "/admin-login", label: "Admin", icon: Shield },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard" && (location === "/" || location === "/dashboard")) {
      return true;
    }
    return location === href;
  };

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "flex flex-col space-y-1" : "flex items-baseline space-x-4"}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setMobileMenuOpen(false)}
          >
            <a
              className={`${
                isActive(item.href)
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-500 hover:text-primary-600 hover:bg-gray-50"
              } ${
                mobile
                  ? "flex items-center px-3 py-2 rounded-md text-base font-medium"
                  : "px-3 py-2 rounded-md text-sm font-medium"
              } transition-colors`}
            >
              {mobile && <Icon className="mr-3 h-5 w-5" />}
              {item.label}
            </a>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <a className="text-2xl font-bold text-primary-600">VIPix</a>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <NavContent />
            </div>
          </div>

          <div className="hidden md:block">
            <Link href="/events">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                Create Event
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between pb-6">
                    <span className="text-2xl font-bold text-primary-600">VIPix</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <NavContent mobile />
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <Link href="/events">
                      <Button
                        className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Create Event
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
