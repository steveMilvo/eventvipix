import { useEffect, useRef, useState } from "react";
import { cameraService, type CameraConstraints } from "@/lib/camera";

export interface UseCameraOptions {
  facingMode?: "user" | "environment";
  autoStart?: boolean;
}

export function useCamera(options: UseCameraOptions = {}) {
  const { facingMode = "environment", autoStart = true } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startCamera = async (newFacingMode?: "user" | "environment") => {
    setIsLoading(true);
    setError(null);

    try {
      const constraints: CameraConstraints = {
        video: {
          facingMode: newFacingMode || facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const newStream = await cameraService.startCamera(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      
      setStream(newStream);
      setHasPermission(true);
    } catch (err: any) {
      setError(err.message);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    cameraService.stopCamera();
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current) {
        resolve(null);
        return;
      }

      const canvas = document.createElement("canvas");
      const blob = cameraService.captureFrame(videoRef.current, canvas);
      resolve(blob);
    });
  };

  const switchCamera = () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    startCamera(newFacingMode);
  };

  useEffect(() => {
    if (autoStart && cameraService.isSupported()) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    // Check camera permission on mount
    cameraService.requestPermissions().then(setHasPermission);
  }, []);

  return {
    videoRef,
    stream,
    isLoading,
    error,
    hasPermission,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    isSupported: cameraService.isSupported(),
  };
}
