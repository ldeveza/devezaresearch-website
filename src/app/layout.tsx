import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Devezaresearch Lab",
  description: "Innovating Orthopaedic Research through Bench Science, AI, and Health Equity",
  icons: {
    icon: '/images/logo/logo_v2.png',
    apple: '/images/logo/logo_v2.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Add Netlify Identity script for CMS authentication */}
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js" async></script>
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        {/* Script to redirect to admin after login */}
        <script dangerouslySetInnerHTML={{ __html: `
          if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", user => {
              if (!user) {
                window.netlifyIdentity.on("login", () => {
                  document.location.href = "/admin/";
                });
              }
            });
          }
        `}} />
      </body>
    </html>
  );
}
