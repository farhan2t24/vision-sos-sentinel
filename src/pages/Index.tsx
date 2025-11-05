import { useState, useCallback, useEffect } from "react";
import { WebcamFeed } from "@/components/WebcamFeed";
import { EmotionDisplay } from "@/components/EmotionDisplay";
import { GestureDisplay } from "@/components/GestureDisplay";
import { DistressGauge } from "@/components/DistressGauge";
import { EventLog } from "@/components/EventLog";
import { Button } from "@/components/ui/button";
import { Shield, Settings, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Emotion {
  label: string;
  confidence: number;
  isDistress: boolean;
}

interface LogEvent {
  id: string;
  timestamp: Date;
  type: "emotion" | "gesture" | "alert" | "status";
  message: string;
  severity: "info" | "warning" | "critical";
}

const Index = () => {
  const [isActive, setIsActive] = useState(false);
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [gesture, setGesture] = useState<string | null>(null);
  const [distressScore, setDistressScore] = useState(0);
  const [isAlertTriggered, setIsAlertTriggered] = useState(false);
  const [events, setEvents] = useState<LogEvent[]>([]);
  const [location, setLocation] = useState<{lat: number, lon: number} | null>(null);

  const DISTRESS_THRESHOLD = 10;

  const addEvent = useCallback((type: LogEvent["type"], message: string, severity: LogEvent["severity"]) => {
    const newEvent: LogEvent = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      type,
      message,
      severity,
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    if (isActive && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          addEvent("status", `Location acquired: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`, "info");
        },
        (error) => {
          console.error("Location error:", error);
          addEvent("status", "Location access denied", "warning");
        }
      );
    }
  }, [isActive, addEvent]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const mockEmotions = [
        { label: "happy", confidence: 0.85, isDistress: false },
        { label: "neutral", confidence: 0.75, isDistress: false },
        { label: "fear", confidence: 0.92, isDistress: true },
        { label: "sad", confidence: 0.68, isDistress: false },
      ];
      
      const mockGestures = ["none", "wave", "help", "stop"];
      
      const randomEmotion = mockEmotions[Math.floor(Math.random() * mockEmotions.length)];
      const randomGesture = mockGestures[Math.floor(Math.random() * mockGestures.length)];
      
      setEmotion(randomEmotion);
      setGesture(randomGesture);

      const isSOSGesture = randomGesture === "help" || randomGesture === "stop";
      
      setDistressScore(prev => {
        let newScore = prev;
        if (randomEmotion.isDistress || isSOSGesture) {
          newScore = Math.min(prev + 2, 20);
          if (newScore > prev) {
            addEvent("emotion", `Distress signal: ${randomEmotion.label} (${(randomEmotion.confidence * 100).toFixed(0)}%)`, "warning");
          }
        } else {
          newScore = Math.max(prev - 1, 0);
        }
        
        if (newScore >= DISTRESS_THRESHOLD && !isAlertTriggered) {
          setIsAlertTriggered(true);
          addEvent("alert", "🚨 SOS ALERT TRIGGERED - Emergency behavior detected!", "critical");
          toast.error("Emergency Alert Triggered!", {
            description: location 
              ? `Location: ${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
              : "Location unavailable",
          });
        }
        
        return newScore;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive, addEvent, isAlertTriggered, location]);

  const handleToggle = () => {
    setIsActive(!isActive);
    if (!isActive) {
      addEvent("status", "Monitoring started", "info");
      setDistressScore(0);
      setIsAlertTriggered(false);
    } else {
      addEvent("status", "Monitoring stopped", "info");
    }
  };

  const handleStream = useCallback((stream: MediaStream) => {
    console.log("Stream received:", stream);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Vision SOS Sentinel</h1>
                <p className="text-sm text-muted-foreground">AI Safety Monitoring System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {location && (
                <Button variant="outline" size="sm" className="gap-2">
                  <MapPin className="w-4 h-4" />
                  {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                </Button>
              )}
              <Button variant="outline" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WebcamFeed isActive={isActive} onToggle={handleToggle} onStream={handleStream} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EmotionDisplay emotion={emotion} />
              <GestureDisplay gesture={gesture} isSOSGesture={gesture === "help" || gesture === "stop"} />
            </div>
          </div>

          <div className="space-y-6">
            <DistressGauge 
              score={distressScore} 
              threshold={DISTRESS_THRESHOLD}
              isAlertTriggered={isAlertTriggered}
            />
            <div className="h-[500px]">
              <EventLog events={events} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
