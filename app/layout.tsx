import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-parsona.vercel.app"),
  title: {
    default: "Persona AI — Learn from AI Versions of Your Favorite Mentors",
    template: "%s | Persona AI",
  },
  description:
    "Chat with AI mentors modeled on the public teaching styles of Hitesh Choudhary and Piyush Garg. Streaming answers, code help, and career guidance.",
  keywords: [
    "Persona AI",
    "Hitesh Choudhary AI",
    "Piyush Garg AI",
    "AI mentor",
    "learn coding with AI",
  ],
  openGraph: {
    title: "Persona AI — Learn from AI Versions of Your Favorite Mentors",
    description:
      "Chat with AI mentors modeled on the public teaching styles of Hitesh Choudhary and Piyush Garg.",
    url: "https://ai-parsona.vercel.app",
    siteName: "Persona AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Persona AI",
    description:
      "Chat with AI mentors modeled on the public teaching styles of Hitesh Choudhary and Piyush Garg.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#8B5CF6",
          colorBackground: "#18181B",
          colorText: "#F4F4F5",
          colorInputBackground: "#09090B",
          colorInputText: "#F4F4F5",
          borderRadius: "0.75rem",
        },
        elements: {
          card: "bg-zinc-900 border border-zinc-800 shadow-2xl",

          headerTitle: "text-white",
          headerSubtitle: "text-zinc-400",

          formFieldLabel: "text-zinc-300",
          formFieldInput:
            "bg-zinc-950 border-zinc-700 text-white focus:border-purple-500",

          formButtonPrimary:
            "bg-purple-600 hover:bg-purple-700 text-white rounded-lg",

          socialButtonsBlockButton:
            "bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded-lg",

          socialButtonsBlockButtonText: "text-white font-medium",

          footerActionText: "text-zinc-400",
          footerActionLink: "text-purple-400 hover:text-purple-300",

          socialButtonsProviderIcon: "brightness-0 invert",
          userButtonPopoverCard:
            "bg-zinc-900 border border-zinc-800 shadow-2xl rounded-xl",
          userButtonPopoverMain: "bg-zinc-900",
          userButtonPopoverActions: "bg-zinc-900",
          userButtonPopoverActionButton:
            "text-zinc-200 hover:bg-white/10 data-[hovered]:bg-white/10",
          userButtonPopoverActionButtonText: "text-zinc-200 font-medium",
          userButtonPopoverActionButtonIcon: "text-zinc-300",
          userButtonPopoverFooter: "bg-zinc-900 border-t border-zinc-800",
          userPreviewMainIdentifier: "text-white font-medium",
          userPreviewSecondaryIdentifier: "text-zinc-400",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className="bg-background text-zinc-100 antialiased">
          {children}
          <Toaster theme="dark" position="top-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
