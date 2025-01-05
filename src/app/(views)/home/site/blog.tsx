import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";

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
];
export const Blog = () => {
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
        {Blogs.map((item, index) => (
          <Card
            className="w-[350px] p-4 space-y-2  text-start"
            key={index}
            data-aos="fade-left"
            data-aos-duration="700"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
          >
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
