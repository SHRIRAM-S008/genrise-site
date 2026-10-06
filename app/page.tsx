import Cursor from "@/components/ui/Cursor";
import Preloader from "@/components/ui/Preloader";
import SmoothScroll from "@/components/ui/SmoothScroll";
import About from "@/components/sections/About";
import Contact from "@/components/sections/Contact";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Nav from "@/components/sections/Nav";
import OpenSource from "@/components/sections/OpenSource";
import Problem from "@/components/sections/Problem";
import Process from "@/components/sections/Process";
import Product from "@/components/sections/Product";
import FreeFirst from "@/components/sections/FreeFirst";
import Services from "@/components/sections/Services";
import { FAQ } from "@/lib/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Problem />
        <FreeFirst />
        <Product />
        <OpenSource />
        <Services />
        <Process />
        <About />
        <Faq />
        <FinalCta />
        <Contact />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
