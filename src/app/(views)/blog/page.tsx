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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Blogs = [
  {
    itle: "Lorem ipsum dolor sit amet consectetur.",
    description:
      " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa.",
    kategori: "Teknoologi",
    date: "10 November 2024",
  },
  {
    itle: "Lorem ipsum dolor sit amet consectetur.",
    description:
      " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa.",
    kategori: "Teknoologi",
    date: "10 November 2024",
  },
  {
    itle: "Lorem ipsum dolor sit amet consectetur.",
    description:
      " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa.",
    kategori: "Teknoologi",
    date: "10 November 2024",
  },
  {
    itle: "Lorem ipsum dolor sit amet consectetur.",
    description:
      " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa.",
    kategori: "Teknoologi",
    date: "10 November 2024",
  },
  {
    itle: "Lorem ipsum dolor sit amet consectetur.",
    description:
      " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa.",
    kategori: "Teknoologi",
    date: "10 November 2024",
  },
  {
    itle: "Lorem ipsum dolor sit amet consectetur.",
    description:
      " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime, ipsa.",
    kategori: "Teknoologi",
    date: "10 November 2024",
  },
];

export default function Blog() {
  return (
    <section
      id="blog"
      className="container mx-auto px-4 lg:px-24 py-4 flex flex-col justify-center items-center gap-4 lg:gap-8 text-center"
    >
      <div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Blog</h3>

          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap justify-center items-center">
        {Blogs.map((item, index) => (
          <Card className="w-[350px] p-4 space-y-2  text-start" key={index}>
            <div className="flex gap-2">
              <p className="text-sm text-muted-foreground">{item.date}</p>
              <Badge variant="outline">{item.kategori}</Badge>
            </div>

            <h1 className="text-xl font-semibold">{item.itle}</h1>

            <p className="text-base text-muted-foreground">
              {item.description}
            </p>

            <Button variant="default" size="sm">
              Learn More
              <FiArrowRight />
            </Button>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
