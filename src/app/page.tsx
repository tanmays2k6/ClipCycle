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
      </main>
      <Footer />
    </>
  );
}
