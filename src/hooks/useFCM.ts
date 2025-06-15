
import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";

export const useFCM = () => {
  const [permission, setPermission] = useState<NotificationPermission>();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [message, setMessage] = useState<any>(null);

  useEffect(() => {
    if (!("Notification" in window) || !messaging) return;
    setPermission(Notification.permission);

    // Request notification permission and get FCM token
    const askPermissionAndGetToken = async () => {
      if (Notification.permission === "granted") {
        try {
          const token = await getToken(messaging, {
            vapidKey: "BKU2vhvWUKZW9b5DqfbRbZjSt-nGXvTe1gGDD1vdftiEUukF2EF_gfSVRGBTOzC1kPk0gNxnmxQspcgI5w2xI6E"
          });
          setFcmToken(token || null);
          if (token) console.log("FCM Token:", token);
        } catch (err) {
          setFcmToken(null);
          console.error("FCM token error:", err);
        }
      }
    };

    askPermissionAndGetToken();

    // Foreground message handler
    const unsubscribe = onMessage(messaging, (payload) => {
      setMessage(payload);
      if (payload.notification?.title) {
        // Show an in-app notification (native)
        window.alert(`[Notification] ${payload.notification.title}\n${payload.notification.body || ""}`);
      }
    });

    return () => unsubscribe();
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      try {
        const token = await getToken(messaging, {
          vapidKey: "BKU2vhvWUKZW9b5DqfbRbZjSt-nGXvTe1gGDD1vdftiEUukF2EF_gfSVRGBTOzC1kPk0gNxnmxQspcgI5w2xI6E"
        });
        setFcmToken(token || null);
        if (token) console.log("FCM Token:", token);
      } catch (err) {
        setFcmToken(null);
        console.error("FCM token error:", err);
      }
    }
  };

  return { permission, fcmToken, message, requestPermission };
};
