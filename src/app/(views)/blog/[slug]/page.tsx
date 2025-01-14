"use client";

import React, { useEffect, useState } from "react";
import { BlogType } from "../../admin/blog/types";
import { getBySlug } from "@/utils/home/blog";
import { CategoryType } from "../../admin/category/types";
import { Badge } from "@/components/ui/badge";
import { get as getCategory } from "@/utils/home/category";
import SkeletonBlogDetail from "./skeleton";
import Action from "./action";

interface BlogProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetail({ params }: BlogProps) {
  const [data, setData] = useState<BlogType | null>(null);
  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);
  const [isSlugInitialized, setIsSlugInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;

  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
      setIsSlugInitialized(true);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        if (!isSlugInitialized || !slug || slug === "") {
          return;
        }
        const response = await getBySlug(slug);
        const responseCategory = await getCategory();

        setData(response.data);
        setDataCategory(responseCategory.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, isSlugInitialized]);

  if (loading) {
    return <SkeletonBlogDetail />;
  }

  return (
    <div className="container space-y-6  w-[600px] mx-auto">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-extrabold ">{data?.title}</h1>

        <div className="flex flex-col sm:flex-row  gap-2 items-center justify">
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

      <Action
        title={data?.title as string}
        url={url && data ? url + "/blog/" + data?.slug : ("" as string)}
        content_id={data?.id as string}
      />

      <div
        className="tiptap w-full "
        dangerouslySetInnerHTML={{
          __html: data?.content || "",
        }}
      />
    </div>
  );
}
