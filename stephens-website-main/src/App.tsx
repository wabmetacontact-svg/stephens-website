import { lazy, Suspense } from "react";
import CustomCursor from "./components/CustomCursor";
import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";

const AboutSection = lazy(() => import("./components/AboutSection"));
const WorkSection = lazy(() => import("./components/WorkSection"));
const ServicesSection = lazy(() => import("./components/ServicesSection"));
const BlogSection = lazy(() => import("./components/BlogSection"));
const ContactSection = lazy(() => import("./components/ContactSection"));

function SectionLoader() {
  return (
    <div style={{
      minHeight: "50vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div style={{
        width: "36px", height: "36px",
        border: "2px solid var(--border)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
        animation: "spinSlow 1s linear infinite",
      }} />
    </div>
  );
}

export function App() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", position: "relative" }}>
      <GrainOverlay />
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeSection />
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
          <WorkSection />
          <ServicesSection />
          <BlogSection />
          <ContactSection />
        </Suspense>
      </main>
    </div>
  );
}