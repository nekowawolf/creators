import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { creatorsMetadata } from "@/constants/metadataTemplates";

export const metadata = creatorsMetadata("Home", "Welcome to Nww Creators");

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <Hero />
      </main>
      <Footer />
    </>
  );
}