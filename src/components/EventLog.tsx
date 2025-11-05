import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Activity } from "lucide-react";

interface LogEvent {
  id: string;
  timestamp: Date;
  type: "emotion" | "gesture" | "alert" | "status";
  message: string;
  severity: "info" | "warning" | "critical";
}

interface EventLogProps {
  events: LogEvent[];
}

const getSeverityColor = (severity: string): "destructive" | "secondary" | "outline" | "default" => {
  switch (severity) {
    case "critical":
      return "destructive";
    case "warning":
      return "destructive";
    default:
      return "secondary";
  }
};

const getEventIcon = (type: string) => {
  switch (type) {
    case "alert":
      return AlertTriangle;
    default:
      return Activity;
  }
};

export const EventLog = ({ events }: EventLogProps) => {
  return (
    <Card className="p-6 bg-card shadow-card h-full flex flex-col">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
        Event Log
      </h3>

      <ScrollArea className="flex-1 pr-4">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No events recorded yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Events will appear here as monitoring begins
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => {
              const Icon = getEventIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className={`p-2 rounded-full ${
                    event.severity === "critical" ? "bg-destructive/10" : 
                    event.severity === "warning" ? "bg-warning/10" : "bg-primary/10"
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      event.severity === "critical" ? "text-destructive" : 
                      event.severity === "warning" ? "text-warning" : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                        {event.type}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{event.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};
