import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function hero() {
  return (
    <section
      className="container max-w-4xl  mx-auto px-4 lg:px-24 py-24 flex flex-col justify-center items-center gap-4 text-center "
      id="home"
      data-aos="zoom-in"
      data-aos-offset="200"
      data-aos-duration="500"
      data-aos-easing="ease-in-out"
      data-aos-once="false"
    >
      <Badge
        variant={"outline"}
        className="space-x-2 py-1"
        data-aos="zoom-in"
        data-aos-delay="50"
        data-aos-offset="200"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        <span className="relative flex h-[10px] w-[10px]">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-[10px] w-[10px] bg-primary"></span>
        </span>

        <span>Lorem ipsum dolor sit amet.</span>
      </Badge>

      <h1
        className="scroll-m-20 text-4xl font-extrabold tracking-tight"
        data-aos="zoom-in"
        data-aos-delay="100"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        I’m <span className="text-primary">Firman</span>, a Web Developer
        Crafting Unique and Engaging Digital Experiences.
      </h1>

      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque
        dolorem aperiam dolore asperiores accusamus nisi deleniti soluta
        mollitia, sapiente sit reprehenderit quibusdam culpa quae possimus
        praesentium sunt aliquam porro, perferendis expedita quod minus repellat
        exercitationem?
      </p>

      <div
        className="flex gap-4"
        data-aos="zoom-in"
        data-aos-delay="150"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        <Button>See My Work</Button>
        <Button variant={"outline"}>Contact Me</Button>
      </div>
    </section>
  );
}
