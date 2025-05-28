import { useRef, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Camera, RotateCcw, Image, Zap, Monitor, Video, Square, Play } from "lucide-react";

interface CameraInterfaceProps {
  eventId?: number;
  selectedFilter: string;
}

export default function CameraInterface({ eventId, selectedFilter }: CameraInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [captureFlash, setCaptureFlash] = useState(false);
  const [isHDMode, setIsHDMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mode, setMode] = useState<"photo" | "video">("photo");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!eventId) {
        // Demo mode - just simulate success
        return new Promise(resolve => setTimeout(resolve, 1000));
      }
      return await apiRequest("POST", `/api/events/${eventId}/photos`, formData);
    },
    onSuccess: () => {
      toast({
        title: eventId ? "Photo uploaded successfully" : "Demo photo captured!",
        description: eventId ? "Your photo has been uploaded and is being processed." : "In a real event, this photo would be uploaded and processed.",
      });
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: [`/api/events/${eventId}/photos`] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    initCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    applyFilter();
  }, [selectedFilter]);

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Reinitialize camera when mode changes
  useEffect(() => {
    if (stream) {
      initCamera();
    }
  }, [mode]);

  const initCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: isHDMode ? 1920 : 1280 },
          height: { ideal: isHDMode ? 1080 : 720 },
        },
        audio: mode === "video",
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        setStream(newStream);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to take photos.",
        variant: "destructive",
      });
    }
  };

  const applyFilter = () => {
    if (!videoRef.current) return;

    let filterStyle = "";
    switch (selectedFilter) {
      case "vintage":
        filterStyle = "sepia(0.5) contrast(1.2) brightness(0.9)";
        break;
      case "bw":
        filterStyle = "grayscale(1) contrast(1.1)";
        break;
      case "bright":
        filterStyle = "brightness(1.3) saturate(1.2)";
        break;
      case "none":
      default:
        filterStyle = "none";
        break;
    }
    
    videoRef.current.style.filter = filterStyle;
  };

  const startVideoRecording = () => {
    if (!stream) return;

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append("video", videoBlob, "video.webm");
        formData.append("quality", isHDMode ? "hd" : "standard");
        
        // Upload video to server
        if (eventId) {
          fetch(`/api/events/${eventId}/videos`, {
            method: 'POST',
            body: formData,
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              toast({
                title: "Video uploaded successfully!",
                description: `Video duration: ${formatTime(recordingTime)}`,
              });
            } else {
              toast({
                title: "Upload failed",
                description: data.message || "Failed to upload video",
                variant: "destructive",
              });
            }
          })
          .catch(error => {
            toast({
              title: "Upload error",
              description: "Network error while uploading video",
              variant: "destructive",
            });
          });
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // Record in 1-second chunks
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Video recording in progress...",
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Unable to start video recording",
        variant: "destructive",
      });
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      toast({
        title: "Recording stopped",
        description: "Processing video...",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply flash effect
    setCaptureFlash(true);
    setTimeout(() => setCaptureFlash(false), 200);

    // Draw video frame to canvas with filter
    context.filter = video.style.filter;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob with quality based on HD mode
    const quality = isHDMode ? 0.95 : 0.8;
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("photo", blob, "photo.jpg");
      if (selectedFilter !== "none") {
        formData.append("filter", selectedFilter);
      }
      formData.append("quality", isHDMode ? "hd" : "standard");

      uploadMutation.mutate(formData);
    }, "image/jpeg", quality);
  };

  const flipCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
  };

  const toggleFlash = () => {
    setFlashEnabled(prev => !prev);
    // Note: Flash control would require advanced camera API
    toast({
      title: flashEnabled ? "Flash disabled" : "Flash enabled",
      description: "Flash setting updated",
    });
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Flash overlay */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-200 pointer-events-none ${
          captureFlash ? "opacity-80" : "opacity-0"
        }`}
      />

      {/* Recording Timer */}
      {isRecording && (
        <div className="absolute top-6 left-6 pointer-events-none">
          <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-mono font-bold">{formatTime(recordingTime)}</span>
          </div>
        </div>
      )}



      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-auto">
        <div className="flex justify-center items-center space-x-8">
          {/* Gallery Preview - placeholder */}
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30"
          >
            <Image className="h-6 w-6 text-white" />
          </Button>

          {/* Main Action Button */}
          {mode === "photo" ? (
            <Button
              onClick={capturePhoto}
              disabled={uploadMutation.isPending || !eventId}
              className="w-20 h-20 bg-white rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              {uploadMutation.isPending ? (
                <div className="w-16 h-16 border-4 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-gray-600" />
                </div>
              )}
            </Button>
          ) : (
            <Button
              onClick={isRecording ? stopVideoRecording : startVideoRecording}
              disabled={!eventId}
              className={`w-20 h-20 rounded-full hover:scale-105 transition-transform shadow-lg ${
                isRecording ? "bg-red-600 hover:bg-red-700" : "bg-white"
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                isRecording ? "bg-red-500" : "bg-gray-200"
              }`}>
                {isRecording ? (
                  <Square className="h-8 w-8 text-white" />
                ) : (
                  <Video className="h-8 w-8 text-gray-600" />
                )}
              </div>
            </Button>
          )}

          {/* Mode Switcher */}
          <div className="flex bg-black/40 backdrop-blur-sm rounded-full p-1">
            <Button
              variant={mode === "photo" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("photo")}
              className={`rounded-full px-3 py-1 ${mode === "photo" ? "bg-white text-black" : "text-white hover:bg-white/20"}`}
            >
              <Camera className="h-4 w-4" />
            </Button>
            <Button
              variant={mode === "video" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("video")}
              className={`rounded-full px-3 py-1 ${mode === "video" ? "bg-white text-black" : "text-white hover:bg-white/20"}`}
            >
              <Video className="h-4 w-4" />
            </Button>
          </div>

          {/* Flash Button */}
          <Button
            onClick={toggleFlash}
            variant="ghost"
            size="icon"
            className={`w-12 h-12 rounded-xl bg-black/40 backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-colors ${
              flashEnabled 
                ? "text-yellow-400 hover:bg-yellow-400/20" 
                : "text-white"
            }`}
          >
            <Zap className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-6 right-6 pointer-events-auto">
        <div className="flex gap-2">
          {/* Camera Flip */}
          <Button
            onClick={flipCamera}
            variant="ghost"
            size="icon"
            className="glassmorphism text-white hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 pointer-events-auto flex space-x-3">
        {/* HD/Standard Toggle */}
        <div className="glassmorphism px-3 py-2 rounded-lg flex items-center space-x-2">
          <Monitor className="h-4 w-4 text-white" />
          <span className="text-white text-sm font-medium">{isHDMode ? 'HD' : 'STD'}</span>
          <button
            onClick={() => setIsHDMode(!isHDMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isHDMode ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isHDMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>


      </div>
    </div>
  );
}
