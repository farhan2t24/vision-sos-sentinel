import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface WebcamFeedProps {
  onStream?: (stream: MediaStream) => void;
  isActive: boolean;
  onToggle: () => void;
}

export const WebcamFeed = ({ onStream, isActive, onToggle }: WebcamFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          onStream?.(stream);
        }
        setError("");
      } catch (err) {
        const errorMessage = "Camera access denied. Please allow camera permissions.";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("Webcam error:", err);
      }
    };

    if (isActive) {
      startWebcam();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isActive, onStream]);

  return (
    <Card className="relative overflow-hidden bg-card shadow-card">
      <div className="aspect-video bg-muted relative">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <AlertCircle className="w-16 h-16 text-destructive" />
            <p className="text-lg font-medium text-foreground">{error}</p>
            <Button onClick={onToggle} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="text-center space-y-4">
                  <VideoOff className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="text-lg font-medium text-foreground">Camera Inactive</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="absolute bottom-4 right-4 z-10">
        <Button
          onClick={onToggle}
          size="lg"
          className={isActive ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"}
        >
          {isActive ? (
            <>
              <VideoOff className="w-5 h-5 mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Video className="w-5 h-5 mr-2" />
              Start Camera
            </>
          )}
        </Button>
      </div>

      {isActive && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-2 bg-destructive/90 text-destructive-foreground px-3 py-1.5 rounded-full backdrop-blur-sm">
            <div className="w-2 h-2 bg-destructive-foreground rounded-full animate-pulse" />
            <span className="text-sm font-medium">LIVE</span>
          </div>
        </div>
      )}
    </Card>
  );
};
