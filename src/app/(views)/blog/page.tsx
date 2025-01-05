"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { get } from "@/utils/home/blog";
import { get as getCategory } from "@/utils/home/category";
import { BlogType } from "../admin/blog/types";
import { CategoryType } from "../admin/category/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import SkeletonBLog from "./skeleton";

export default function Blog() {
  const [data, setData] = useState<BlogType[]>([]);
  const [dataCategory, setDataCategory] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dataPerPage] = useState(6);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filteredData, setFilteredData] = useState<BlogType[]>([]);

  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !filterCategory || item.category_id.includes(filterCategory);

      return matchesSearch && matchesCategory;
    });

    setFilteredData(filtered);
  }, [search, filterCategory, data]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await get();
        const responseCategory = await getCategory();

        setData(response.data);
        setDataCategory(responseCategory.data);

        setTotalPages(Math.ceil(response.data.length / dataPerPage));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const indexOfLast = currentPage * dataPerPage;
  const indexOfFirst = indexOfLast - dataPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return <SkeletonBLog />;
  }

  return (
    <section
      id="blog"
      className="container mx-auto px-4 lg:px-24 py-4 flex flex-col justify-center items-center gap-4 lg:gap-8 text-center"
    >
      {/* header */}
      <div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Blog</h3>

          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet.
          </p>
        </div>
      </div>

      {/* filter */}
      <div className="w-full flex flex-col sm:flex-row gap-2 justify-between items-center">
        <div className="flex  items-center gap-2">
          <Input
            type="text"
            className="w-52"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="shearch..."
          />
        </div>

        {dataCategory.length > 0 ? (
          <Tabs
            defaultValue="all"
            onValueChange={(value) => {
              setFilterCategory(value === "all" ? "" : value);
              setCurrentPage(1); // Reset halaman ke 1
            }}
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {dataCategory.map((item: CategoryType, index: number) => (
                <TabsTrigger value={item.id} key={index}>
                  {item.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
      </div>

      {/* content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 ">
        {currentData.map((item: BlogType, index: number) => (
          <Card
            className="w-full p-4  flex flex-col gap-2 text-start"
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

      {/* Pagination */}
      <div className=" w-full flex gap-2 flex-col sm:flex-row justify-between items-center">
        <div className="text-sm text-muted-foreground text-nowrap">
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, data.length)} of{" "}
          {data.length} items
        </div>

        <Pagination className=" w-fit m-0 ">
          <PaginationContent>
            {/* Tombol Previous */}
            <PaginationItem>
              <Button
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="flex items-center justify-between"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            </PaginationItem>

            {/* Halaman Pertama */}
            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink onClick={() => paginate(1)}>1</PaginationLink>
              </PaginationItem>
            )}

            {/* Ellipsis jika halaman lebih dari sama dengan 3 */}
            {currentPage >= 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Halaman Sekarang */}
            <PaginationItem>
              <Button className="font-bold" variant="secondary" disabled>
                {currentPage}
              </Button>
            </PaginationItem>

            {/* Ellipsis lagi */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Halaman Terakhir */}
            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => paginate(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            {/* Tombol Next */}
            <PaginationItem>
              <Button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="ghost"
                className="flex items-center justify-between"
              >
                <span>Next</span>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
