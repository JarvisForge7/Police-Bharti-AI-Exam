import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "Police Bharti AI Exam",
  description: "Real Exam Simulation Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <head>
        {/* 🚨 तात्पुरता Tailwind चा कडक सपोर्ट जेणेकरून लेआऊट फुटणार नाही */}
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}