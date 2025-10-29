import { useEffect, useState, useMemo } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { getLocalNotifications, markNotificationRead, LocalNotification } from "@/services/fcmService";

const formatTime = (iso?: string) => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

export default function Notifications() {
  const [items, setItems] = useState<LocalNotification[]>([]);

  useEffect(() => {
    try { setItems(getLocalNotifications() || []); } catch {}
    const onUpdate = () => {
      try { setItems(getLocalNotifications() || []); } catch {}
    };
    window.addEventListener('bhada24:notifications-updated', onUpdate as EventListener);
    return () => window.removeEventListener('bhada24:notifications-updated', onUpdate as EventListener);
  }, []);

  const unreadCount = useMemo(() => items.filter(i => !i.read).length, [items]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <section className="container py-6 md:py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" /> Notifications
          </h1>
          <div className="text-sm text-muted-foreground">Unread: {unreadCount}</div>
        </div>

        {items.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No notifications yet.
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((n) => (
              <Card key={n.id} className={`p-4 flex items-start justify-between ${n.read ? 'opacity-70' : ''}`}>
                <div className="flex items-start gap-3">
                  {n.read ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  ) : (
                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold">{n.title || 'Notification'}</div>
                    {n.body && <div className="text-sm text-muted-foreground">{n.body}</div>}
                    <div className="text-xs text-muted-foreground mt-1">{formatTime(n.ts)}</div>
                  </div>
                </div>
                {!n.read && (
                  <Button size="sm" variant="outline" onClick={() => markNotificationRead(n.id)}>
                    Mark as read
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
