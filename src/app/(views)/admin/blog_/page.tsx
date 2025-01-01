// import Editor from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

export default function Page() {
  const OPTIONS: Option[] = [
    { label: "nextjs", value: "Nextjs" },
    { label: "Vite", value: "vite" },
    { label: "Nuxt", value: "nuxt" },
    { label: "Vue", value: "vue, " },
    { label: "Remix", value: "remix" },
    { label: "Svelte", value: "svelte" },
    { label: "Angular", value: "angular", disable: true },
    { label: "Ember", value: "ember", disable: true },
    { label: "React", value: "react" },
    { label: "Gatsby", value: "gatsby", disable: true },
    { label: "Astro", value: "astro", disable: true },
  ];

  return (
    <div>
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="min-w-[60vw]">
          <DialogHeader>
            <DialogTitle>Create Blog</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex w-full gap-4">
              <div className="w-full">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Project Name"
                  type="text"
                  className="w-full"
                  required
                />
              </div>

              <div className="w-full">
                <Label htmlFor="name">Category</Label>
                <MultipleSelector
                  defaultOptions={OPTIONS}
                  placeholder={"Select Category"}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                      no results found.
                    </p>
                  }
                />
              </div>
            </div>

            {/* <Editor /> */}
          </div>

          <DialogFooter>
            <Button variant={"secondary"}>Draft</Button>
            <Button>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
