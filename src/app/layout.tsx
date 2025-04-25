import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { NotificationProvider } from "@/components/buttons_inputs/Notification";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Patrones Hermosos',
  description: 'Next.js School Management System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Puedes obtener el userId pero no bloqueas el render
  const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Las notificaciones estarán siempre disponibles */}
        <NotificationProvider userId={userId || ""}>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}