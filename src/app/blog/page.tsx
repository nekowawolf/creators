import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { creatorsMetadata } from "@/constants/metadataTemplates";
import DetailClient from "./DetailClient";
import { fetchBlogPosts } from "@/services/blogService";

export const metadata = creatorsMetadata("Blog", "Articles, reviews, deep dives, and analysis covering content creators.");

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await fetchBlogPosts();
  return (
    <>
      <Header />
      <DetailClient posts={posts} />
      <Footer />
    </>
  );
}
