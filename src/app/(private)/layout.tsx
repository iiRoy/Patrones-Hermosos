'use client';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { NotificationProvider } from "@/components/buttons_inputs/Notification";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
    if (!storedUserId) {
      router.replace('/login'); // Redirige a login si no está logueado
    }
  }, [router]);

  if (!userId) {
    // Loader opcional para evitar flicker en client
    return null;
  }

  return (
    <NotificationProvider userId={userId}>
      {children}
    </NotificationProvider>
  );
}
