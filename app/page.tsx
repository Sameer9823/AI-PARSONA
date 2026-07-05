import { LandingNavbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { PersonaCard } from "@/components/landing/PersonaCard";
import { Footer } from "@/components/landing/Footer";
import { PERSONAS } from "@/lib/personas";
import { Persona } from "@/types";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNavbar />
      <Hero />

      <Footer />
    </main>
  );
}
