import { Button } from "@/components/ui/button";
import {
  FaHtml5,
  FaCss3,
  FaPython,
  FaJava,
  FaPhp,
  FaNodeJs,
  FaReact,
  FaAngular,
  FaVuejs,
  FaGit,
  FaGithub,
  FaLinux,
} from "react-icons/fa";
import { IoLogoJavascript, IoLogoSass } from "react-icons/io5";
import {
  SiTypescript,
  SiNextdotjs,
  SiNestjs,
  SiDjango,
  SiSpring,
  SiMysql,
  SiMongodb,
  SiGraphql,
  SiDocker,
  SiKubernetes,
} from "react-icons/si";

const icons = [
  { icon: <FaHtml5 />, label: "HTML" },
  { icon: <FaCss3 />, label: "CSS" },
  { icon: <IoLogoJavascript />, label: "JavaScript" },
  { icon: <SiTypescript />, label: "TypeScript" },
  { icon: <FaPython />, label: "Python" },
  { icon: <FaJava />, label: "Java" },
  { icon: <FaPhp />, label: "PHP" },
  { icon: <FaNodeJs />, label: "Node.js" },
  { icon: <FaReact />, label: "React" },
  { icon: <SiNextdotjs />, label: "Next.js" },
  { icon: <FaAngular />, label: "Angular" },
  { icon: <FaVuejs />, label: "Vue.js" },
  { icon: <SiNestjs />, label: "NestJS" },
  { icon: <SiDjango />, label: "Django" },
  { icon: <SiSpring />, label: "Spring" },
  { icon: <FaGit />, label: "Git" },
  { icon: <FaGithub />, label: "GitHub" },
  { icon: <FaLinux />, label: "Linux" },
  { icon: <SiMysql />, label: "MySQL" },
  { icon: <SiMongodb />, label: "MongoDB" },
  { icon: <SiGraphql />, label: "GraphQL" },
  { icon: <IoLogoSass />, label: "Sass" },
  { icon: <SiDocker />, label: "Docker" },
  { icon: <SiKubernetes />, label: "Kubernetes" },
];
// Tambahkan icon lainnya di sini jika diperlukan
export default function Skill() {
  return (
    <section
      id="skill"
      className="container max-w-4xl  mx-auto px-4 lg:px-24 py-20 flex flex-col justify-center items-center gap-4 lg:gap-8 text-center"
    >
      <div
        data-aos="fade-up"
        data-aos-offset="200"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Skill
        </h3>
        <p className="text-sm text-muted-foreground">
          Lorem ipsum dolor sit amet.
        </p>
      </div>

      <div
        className=" inline-flex flex-wrap w-full justify-center items-center gap-2 "
        data-aos="fade-up"
        data-aos-offset="200"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        data-aos-once="false"
      >
        {icons.map((item, index) => (
          <Button key={index} variant="default" className="py-4 px-6">
            {item.icon} {item.label}
          </Button>
        ))}
      </div>
    </section>
  );
}
