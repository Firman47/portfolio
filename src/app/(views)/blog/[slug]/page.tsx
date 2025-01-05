"use client";

import React, { use, useEffect, useState } from "react";
import { BlogType } from "../../admin/blog/types";
import { getBySlug } from "@/utils/home/blog";
import { CategoryType } from "../../admin/category/types";
import { Badge } from "@/components/ui/badge";
import { get as getCategory } from "@/utils/home/category";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaShare } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import SkeletonBlogDetail from "./skeleton";
import ShareBlogButton from "./share";

interface BlogProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetail({ params }: BlogProps) {
  const [data, setData] = useState<BlogType | null>(null);
  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;

  const [slug, setSlug] = useState<string>("");
  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug); // Simpan slug ketika resolved
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getBySlug(slug); // Ambil data blog
        const responseCategory = await getCategory(); // Ambil kategori

        console.log("Data blog:", response.data);
        setData(response.data[0]); // Update state dengan data blog
        setDataCategory(responseCategory.data); // Update state dengan kategori
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]); // Hanya jalankan fetchData jika slug berubah

  if (loading) {
    return <SkeletonBlogDetail />;
  }

  return (
    <div className="container flex justify-center gap-6 px-4 lg:px-24  w-full ">
      <div className=" w-[60%] space-y-4">
        <div className="w-full flex justify-between">
          <Link href="/blog">
            <Button variant={"ghost"} className="flex items-center">
              <ChevronLeftIcon className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </Link>

          <ShareBlogButton
            title={data?.title as string}
            url={url && data ? url + "/blog/" + data?.slug : ("" as string)}
          />
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-extrabold ">{data?.title}</h1>
          <div className="flex gap-2 items-center justify">
            <p className=" text-sm text-muted-foreground">
              {data?.created_at?.toLocaleString()}
            </p>

            {data?.category_id?.length ? (
              data.category_id.map((category_id) => {
                const category = dataCategory.find(
                  (cat) => cat.id === category_id
                );
                console.log("category_id:", category_id);
                console.log("category:", category);
                return (
                  <Badge variant="outline" key={category_id}>
                    {category ? category.name : "Kategori Tidak Ditemukan"}
                  </Badge>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>

        <div
          className="tiptap"
          dangerouslySetInnerHTML={{ __html: data?.content || "" }}
        />
      </div>
    </div>
  );
}
