export interface CameraConstraints {
  video: {
    facingMode: "user" | "environment";
    width?: { ideal: number };
    height?: { ideal: number };
  };
  audio: false;
}

export class CameraService {
  private stream: MediaStream | null = null;

  async requestPermissions(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error("Camera permission denied:", error);
      return false;
    }
  }

  async startCamera(constraints: CameraConstraints): Promise<MediaStream> {
    try {
      if (this.stream) {
        this.stopCamera();
      }

      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (error) {
      console.error("Failed to start camera:", error);
      throw new Error("Failed to access camera. Please check permissions.");
    }
  }

  stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  captureFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): Blob | null {
    const context = canvas.getContext("2d");
    if (!context) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return new Promise(resolve => {
      canvas.toBlob(resolve, "image/jpeg", 0.9);
    });
  }

  applyFilter(context: CanvasRenderingContext2D, filter: string): void {
    switch (filter) {
      case "vintage":
        context.filter = "sepia(0.5) contrast(1.2) brightness(0.9)";
        break;
      case "bw":
        context.filter = "grayscale(1) contrast(1.1)";
        break;
      case "bright":
        context.filter = "brightness(1.3) saturate(1.2)";
        break;
      default:
        context.filter = "none";
        break;
    }
  }

  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

export const cameraService = new CameraService();
