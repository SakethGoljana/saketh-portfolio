import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FeedbackWidget from "@/components/FeedbackWidget";
import CommandPalette from "@/components/CommandPalette";

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
  title: "Saketh Goljana · Product Developer & Design Engineer",
  description:
    "Full-stack product developer & design engineer building mobile apps, web applications, and intelligent systems with obsessive craft.",
  keywords: [
    "Design Engineer",
    "Full-Stack Developer",
    "React Native",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Dispatch App",
    "Portfolio",
  ],
  authors: [{ name: "Saketh Goljana" }],
  openGraph: {
    title: "Saketh Goljana · Product Developer & Design Engineer",
    description: "Building production mobile apps, modern web platforms, and intelligent automation systems.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
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
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {children}
        <CommandPalette />
        <FeedbackWidget />
      </body>
    </html>
  );
}
