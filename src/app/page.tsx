import {
  Navbar,
  Hero,
  Problem,
  Features,
  HowItWorks,
  ProductPreview,
  Pricing,
  Testimonials,
  Faq,
  CTA,
  Footer,
} from "@/components/landing";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <ProductPreview />
        <Testimonials />
        <Pricing />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
