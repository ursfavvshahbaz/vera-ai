// src/app/layout.tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 'light' class aur style ko direct body mein add kar diya hai */}
      <body className="light" style={{ backgroundColor: '#F0EDEE', color: '#2C666E' }}>
        {children}
      </body>
    </html>
  );
}