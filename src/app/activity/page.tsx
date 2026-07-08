import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { creatorsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = creatorsMetadata("Activity", "Web activity.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
