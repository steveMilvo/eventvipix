import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface StorageProvider {
  id: number;
  provider: string;
  isEnabled: boolean;
  isDefault: boolean;
  storageUsed: string;
  fileCount: number;
  status: string;
}

export default function StorageSettings() {
  const { toast } = useToast();
  const [autoBackup, setAutoBackup] = useState(true);
  const [compressImages, setCompressImages] = useState(false);
  const [defaultProvider, setDefaultProvider] = useState("firebase");

  const { data: storageProviders = [], isLoading } = useQuery<StorageProvider[]>({
    queryKey: ["/api/storage-settings"],
  });

  const providers = [
    {
      id: "firebase",
      name: "Firebase Storage",
      description: "Google's cloud storage solution",
      icon: "🔥",
      color: "orange",
      connected: true,
      storageUsed: "2.4 GB",
      fileCount: 1234,
      status: "Active",
    },
    {
      id: "google_drive",
      name: "Google Drive",
      description: "Backup to your Google Drive account",
      icon: "📁",
      color: "blue",
      connected: false,
      storageUsed: "0 GB",
      fileCount: 0,
      status: "Setup Required",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Sync photos to Dropbox",
      icon: "📦",
      color: "blue",
      connected: false,
      storageUsed: "0 GB",
      fileCount: 0,
      status: "Not Connected",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'Setup Required':
        return <Badge className="bg-yellow-100 text-yellow-800">Setup Required</Badge>;
      case 'Not Connected':
        return <Badge variant="outline">Not Connected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleConnect = (providerId: string) => {
    toast({
      title: "Connection initiated",
      description: `Connecting to ${providerId}...`,
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your storage preferences have been updated.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Storage Settings</h1>
          <p className="mt-2 text-gray-600">Configure your cloud storage providers and preferences</p>
        </div>

        {/* Storage Providers */}
        <div className="space-y-6 mb-8">
          {providers.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 text-2xl">
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-500">{provider.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(provider.status)}
                    <Switch
                      checked={provider.connected}
                      onCheckedChange={() => {}}
                      disabled={!provider.connected}
                    />
                  </div>
                </div>

                {provider.connected ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Storage Used:</span>
                      <span className="ml-1 font-medium">{provider.storageUsed}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Files:</span>
                      <span className="ml-1 font-medium">{provider.fileCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <span className="ml-1 font-medium text-green-600">{provider.status}</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <Button
                      onClick={() => handleConnect(provider.id)}
                      className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      Connect {provider.name}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Storage Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Storage Provider
              </label>
              <Select value={defaultProvider} onValueChange={setDefaultProvider}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select default provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firebase">Firebase Storage (Recommended)</SelectItem>
                  <SelectItem value="google_drive">Google Drive</SelectItem>
                  <SelectItem value="dropbox">Dropbox</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="auto-backup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
              <label
                htmlFor="auto-backup"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Enable automatic backup to multiple providers
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="compress-images"
                checked={compressImages}
                onCheckedChange={setCompressImages}
              />
              <label
                htmlFor="compress-images"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Compress images before upload to save storage
              </label>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSaveSettings}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
