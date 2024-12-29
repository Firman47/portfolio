import { Blog } from "./site/blog";
import Hero from "./site/hero";
import Project from "./site/project";
import Skill from "./site/skill";
import "reflect-metadata";

export default function Home() {
  return (
    <main>
      <Hero />
      <Skill />
      <Project />
      <Blog />
    </main>
  );
}
