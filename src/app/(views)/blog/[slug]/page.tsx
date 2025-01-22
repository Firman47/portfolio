"use client";

import React, { useEffect, useState } from "react";
import { BlogType } from "../../admin/blog/types";
import { get, getBySlug } from "@/utils/home/blog";
import { CategoryType } from "../../admin/category/types";
import { Badge } from "@/components/ui/badge";
import { get as getCategory } from "@/utils/home/category";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareSection } from "./action/share";
import { LikeSection } from "./action/like";
import { CommentSection } from "./action/comment";
import { PageSkeleton } from "./skeleton";

interface BlogProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetail({ params }: BlogProps) {
  const [data, setData] = useState<BlogType | null>(null);
  const [newBlog, setNewBlog] = useState<BlogType[]>([]);

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await get();
        if (response) {
          const topBlogs = response.data.slice(0, 5);

          setNewBlog(topBlogs);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className=" container px-4 lg:px-24 mx-auto flex flex-col lg:flex-row gap-4">
      <div className="space-y-6 w-full ">
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

        <div className="flex justify-center gap-4">
          <LikeSection content_id={data?.id as string} content_type="blog" />

          <CommentSection content_id={data?.id as string} />

          <ShareSection
            title={data?.title as string}
            url={url && data ? url + "/blog/" + data?.slug : ("" as string)}
          />
        </div>

        <div
          className="tiptap w-full "
          dangerouslySetInnerHTML={{
            __html: data?.content || "",
          }}
        />
      </div>

      <Tabs defaultValue="latest" className="w-full lg:w-1/2">
        <TabsList>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="latest" className="flex flex-wrap gap-2">
          {newBlog.map((item: BlogType, index: number) => (
            <Card
              className="w-full sm:w-[300px] p-4 flex flex-col gap-2 text-start"
              key={index}
            >
              <div className="flex gap-2">
                <p className="text-sm text-muted-foreground">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString()
                    : "N/A"}
                </p>

                {item.category_id.map((category_id) => {
                  const category = dataCategory.find(
                    (cat) => cat.id === category_id
                  );
                  return (
                    <Badge variant="outline" key={category_id}>
                      {category?.name}
                    </Badge>
                  );
                })}
              </div>

              <h1 className="text-xl font-semibold">{item.title}</h1>

              <Link href={`/blog/${item.slug}`}>
                <Button variant="secondary" size="sm">
                  Learn More
                  <FiArrowRight />
                </Button>
              </Link>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="popular">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
