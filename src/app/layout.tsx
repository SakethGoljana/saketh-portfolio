import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";
import CommandPalette from "@/components/CommandPalette";
import JsonLd from "@/components/JsonLd";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";

// Plus Jakarta Sans - Modern, clean, geometric sans designed for premium digital products
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// JetBrains Mono fallback for code & technical data elements
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sakethgoljana.tech"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Saketh Goljana · Lead Architect & Mobile Software Engineer",
    template: "%s · Saketh Goljana",
  },
  description:
    "Lead Architect & Mobile Software Engineer building production mobile apps (React Native 0.88, Expo SDK 58), modern web systems (Next.js), and intelligent automation with obsessive craft.",
  keywords: [
    "Saketh Goljana",
    "Lead Architect",
    "Mobile Software Engineer",
    "React Native",
    "Expo SDK 58",
    "Next.js",
    "TypeScript",
    "Dispatch App",
    "Bulk WhatsApp Automation",
    "Design Engineer",
    "Full-Stack Developer",
    "Systems Architect",
  ],
  authors: [{ name: "Saketh Goljana", url: "https://sakethgoljana.tech" }],
  creator: "Saketh Goljana",
  publisher: "Saketh Goljana",
  openGraph: {
    title: "Saketh Goljana · Lead Architect & Mobile Software Engineer",
    description:
      "Building high-performance mobile apps, modern web platforms, and intelligent automation systems.",
    url: "https://sakethgoljana.tech",
    siteName: "Saketh Goljana Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Saketh Goljana — Lead Architect & Mobile Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saketh Goljana · Lead Architect & Mobile Software Engineer",
    description:
      "Building high-performance mobile apps, modern web platforms, and intelligent automation systems.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const THEME_SCRIPT = `
  (function() {
    try {
      var theme = localStorage.getItem('portfolio-theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
      }
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-[var(--foreground)] selection:text-[var(--background)] flex flex-col transition-colors duration-200">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <JsonLd />
        {children}
        <CommandPalette />
        <FeedbackWidget />
        <CookieConsent />
      </body>
    </html>
  );
}
