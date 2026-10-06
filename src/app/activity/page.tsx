import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { creatorsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";

export const metadata = creatorsMetadata("Activity", "Latest Creators, supporters, and project commits.");

export default function ActivityPage() {
  return (
    <>
      <Header />
      <DetailClient />
      <Footer />
    </>
  );
}
