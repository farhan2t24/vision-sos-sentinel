import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh, AlertTriangle } from "lucide-react";

interface Emotion {
  label: string;
  confidence: number;
  isDistress: boolean;
}

interface EmotionDisplayProps {
  emotion: Emotion | null;
}

const getEmotionIcon = (label: string) => {
  const icons: Record<string, any> = {
    happy: Smile,
    neutral: Meh,
    sad: Frown,
    fear: AlertTriangle,
    anger: AlertTriangle,
    pain: AlertTriangle,
  };
  return icons[label.toLowerCase()] || Meh;
};

const getEmotionColor = (isDistress: boolean) => {
  return isDistress ? "destructive" : "secondary";
};

export const EmotionDisplay = ({ emotion }: EmotionDisplayProps) => {
  const Icon = emotion ? getEmotionIcon(emotion.label) : Meh;

  return (
    <Card className="p-6 bg-card shadow-card">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        Emotion Detection
      </h3>
      
      {emotion ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${emotion.isDistress ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                <Icon className={`w-6 h-6 ${emotion.isDistress ? 'text-destructive' : 'text-primary'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground capitalize">{emotion.label}</p>
                <p className="text-sm text-muted-foreground">Current emotion</p>
              </div>
            </div>
            <Badge variant={getEmotionColor(emotion.isDistress)} className="text-sm px-3 py-1">
              {(emotion.confidence * 100).toFixed(0)}%
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-medium text-foreground">{(emotion.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  emotion.isDistress ? 'bg-gradient-alert' : 'bg-gradient-primary'
                }`}
                style={{ width: `${emotion.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No emotion detected</p>
        </div>
      )}
    </Card>
  );
};
