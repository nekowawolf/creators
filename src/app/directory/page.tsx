import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreatorsContent from "./CreatorsContent";
import { dashboardMetadata } from "@/constants/metadataTemplates";

export const metadata = dashboardMetadata("Creators", "Creators Directory");

export default function CreatorsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow pt-24">
        <CreatorsContent />
      </main>
      <Footer />
    </>
  );
}