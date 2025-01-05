import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { FiArrowRight } from "react-icons/fi";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const projects = [
  {
    title: "Lorem ipsum dolor sit .",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum hic srecusandae est aut magnam!",
    img: "/image.png",
    link: "",
  },
  {
    title: "Lorem ipsum dolor sit .",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum hic srecusandae est aut magnam!",
    img: "/image.png",
    link: "",
  },
  {
    title: "Lorem ipsum dolor sit .",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum hic srecusandae est aut magnam!",
    img: "/image.png",
    link: "",
  },
];

export default function Project() {
  return (
    <section
      id="project"
      className="container mx-auto px-4 lg:px-24 py-16 flex flex-col justify-center items-center gap-4 lg:gap-8 text-center box-border"
    >
      <div
        data-aos="fade-up"
        data-aos-offset="200"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        <h3 className="text-2xl font-semibold">Project</h3>

        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center items-center">
        {projects.map((item, index) => (
          <Card
            className="w-[350px] p-2 space-y-2  text-start"
            key={index}
            data-aos="fade-right"
            data-aos-duration="700"
            data-aos-easing="ease-in-out"
            data-aos-once="false"
          >
            <AspectRatio ratio={16 / 9}>
              <Image
                src={item.img}
                alt="Image"
                fill
                className="rounded-md object-cover"
              />
            </AspectRatio>

            <div className="p-2 space-y-1">
              <CardTitle className="line-clamp-1">{item.title}</CardTitle>

              <CardDescription className="line-clamp-3">
                {item.description}
              </CardDescription>

              <div className="space-x-2 pt-3">
                <Button size="sm">Learn More</Button>
                <Button size="sm" variant="outline">
                  View Project
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button
        size="lg"
        variant="outline"
        className="bg-opacity-0"
        data-aos="fade-up"
        data-aos-offset="0"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        View More Projects <FiArrowRight />
      </Button>
    </section>
  );
}
