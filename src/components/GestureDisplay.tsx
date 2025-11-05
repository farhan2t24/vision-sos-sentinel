import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hand, AlertTriangle, CheckCircle } from "lucide-react";

interface GestureDisplayProps {
  gesture: string | null;
  isSOSGesture: boolean;
}

const getGestureInfo = (gesture: string | null, isSOSGesture: boolean) => {
  if (!gesture || gesture === "none") {
    return {
      label: "No gesture",
      description: "Monitoring hand movements",
      icon: Hand,
      variant: "secondary" as const,
    };
  }

  if (isSOSGesture) {
    return {
      label: gesture.toUpperCase(),
      description: "SOS gesture detected",
      icon: AlertTriangle,
      variant: "destructive" as const,
    };
  }

  return {
    label: gesture.charAt(0).toUpperCase() + gesture.slice(1),
    description: "Normal gesture",
    icon: CheckCircle,
    variant: "secondary" as const,
  };
};

export const GestureDisplay = ({ gesture, isSOSGesture }: GestureDisplayProps) => {
  const info = getGestureInfo(gesture, isSOSGesture);
  const Icon = info.icon;

  return (
    <Card className="p-6 bg-card shadow-card">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        Hand Gesture
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${isSOSGesture ? 'bg-destructive/10' : 'bg-accent/10'}`}>
              <Icon className={`w-6 h-6 ${isSOSGesture ? 'text-destructive' : 'text-accent'}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{info.label}</p>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </div>
          </div>
          <Badge variant={info.variant} className="text-sm px-3 py-1">
            {isSOSGesture ? "ALERT" : "OK"}
          </Badge>
        </div>

        {isSOSGesture && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Emergency gesture pattern detected
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
