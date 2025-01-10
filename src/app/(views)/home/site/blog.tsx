"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BlogType } from "../../admin/blog/types";

import { get as getBlog } from "@/utils/home/blog";
import { get as getCategory } from "@/utils/home/category";
import { CategoryType } from "../../admin/category/types";

export const Blog = () => {
  // const [loading, setLoading] = useState(false);
  const [dataBlog, setDataBlog] = useState<BlogType[]>([]);
  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseBlog = await getBlog();
        const responseCategory = await getCategory();
        const paginationBlog = responseBlog.data.slice(0, 3);

        // setLoading(true);
        setDataBlog(paginationBlog);
        setDataCategory(responseCategory.data);
      } catch (err) {
        console.log("message error : ", err);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section
      id="blog"
      className="container mx-auto px-4 lg:px-24 py-20 flex flex-col justify-center items-center gap-4 lg:gap-8 text-center box-border"
    >
      <div
        data-aos="fade-up"
        data-aos-offset="200"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Blog</h3>

          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center items-center">
        {dataBlog.map((item, index) => (
          <Card
            className="w-[350px] p-4 flex flex-col gap-2  text-start"
            key={index}
            data-aos="fade-left"
            data-aos-duration="700"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
          >
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">
                {item.created_at ? (
                  new Date(item.created_at).toLocaleDateString()
                ) : (
                  <></>
                )}
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

            <p className="text-base text-muted-foreground">
              {item.description}
            </p>

            <Link href={`/blog/${item.slug}`}>
              <Button variant="secondary" size="sm">
                Learn More
                <FiArrowRight />
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <Link
        href="/blog"
        data-aos="fade-up"
        data-aos-offset="0"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        <Button size="lg" variant="outline" className="bg-opacity-0">
          View More Projects <FiArrowRight />
        </Button>
      </Link>
    </section>
  );
};
