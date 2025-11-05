import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Shield, Activity } from "lucide-react";

interface DistressGaugeProps {
  score: number;
  threshold: number;
  isAlertTriggered: boolean;
}

export const DistressGauge = ({ score, threshold, isAlertTriggered }: DistressGaugeProps) => {
  const percentage = Math.min((score / 20) * 100, 100);
  const level = score < 5 ? "low" : score < 10 ? "medium" : "high";
  
  const getLevelColor = () => {
    if (isAlertTriggered) return "text-destructive";
    if (level === "high") return "text-warning";
    if (level === "medium") return "text-accent";
    return "text-success";
  };

  const getLevelBg = () => {
    if (isAlertTriggered) return "bg-destructive/10";
    if (level === "high") return "bg-warning/10";
    if (level === "medium") return "bg-accent/10";
    return "bg-success/10";
  };

  const getProgressColor = () => {
    if (isAlertTriggered) return "[&>div]:bg-gradient-alert";
    if (level === "high") return "[&>div]:bg-gradient-to-r [&>div]:from-warning [&>div]:to-destructive";
    if (level === "medium") return "[&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-warning";
    return "[&>div]:bg-gradient-safe";
  };

  return (
    <Card className={`p-6 shadow-card transition-all duration-300 ${isAlertTriggered ? 'shadow-alert ring-2 ring-destructive/50' : 'bg-card'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Distress Analysis
        </h3>
        {isAlertTriggered ? (
          <AlertTriangle className="w-5 h-5 text-destructive animate-pulse" />
        ) : (
          <Activity className="w-5 h-5 text-primary" />
        )}
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getLevelBg()} mb-3`}>
            {isAlertTriggered ? (
              <AlertTriangle className="w-12 h-12 text-destructive" />
            ) : (
              <Shield className={`w-12 h-12 ${getLevelColor()}`} />
            )}
          </div>
          <p className={`text-4xl font-bold ${getLevelColor()}`}>{score}</p>
          <p className="text-sm text-muted-foreground mt-1">Distress Score</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-semibold ${getLevelColor()} uppercase`}>
              {isAlertTriggered ? "ALERT TRIGGERED" : level}
            </span>
          </div>
          <Progress value={percentage} className={`h-3 ${getProgressColor()}`} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Safe: 0</span>
            <span>Threshold: {threshold}</span>
            <span>Max: 20</span>
          </div>
        </div>

        {score >= threshold && !isAlertTriggered && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-3">
            <p className="text-sm text-warning font-medium text-center">
              ⚠️ Approaching alert threshold
            </p>
          </div>
        )}

        {isAlertTriggered && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 animate-pulse">
            <p className="text-sm text-destructive font-bold text-center">
              🚨 SOS ALERT ACTIVE
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
