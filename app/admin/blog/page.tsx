import { Metadata } from "next";
import { getBlogs } from "@/app/lib/storage";
import AdminBlogClient from "./AdminBlogClient";

export const metadata: Metadata = {
  title: "Admin Blog | G-Tech CCTV Purwakarta",
  description: "Panel pengelolaan konten artikel dan blog G-Tech Purwakarta",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminBlogPage() {
  const blogs = await getBlogs();

  return <AdminBlogClient initialBlogs={blogs} />;
}

