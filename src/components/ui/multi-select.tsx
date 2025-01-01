"use client";

import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const frameworks = [
  { value: "next.js", label: "Next.js" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt.js", label: "Nuxt.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
];

export function MultiSelect() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string[]>([]);

  const handleSetValue = (val: string) => {
    if (value.includes(val)) {
      setValue(value.filter((item) => item !== val));
    } else {
      setValue([...value, val]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          <div className="flex gap-2 justify-start">
            {value.length
              ? value.map((val, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-1 rounded-xl border bg-slate-200 text-xs font-medium"
                  >
                    {frameworks.find((fw) => fw.value === val)?.label}
                  </div>
                ))
              : "Select framework..."}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[480px] p-0">
        <Command>
          <CommandInput placeholder="Cari framework..." />
          <CommandEmpty>Framework tidak ditemukan.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {frameworks.map((fw) => (
                <CommandItem
                  key={fw.value}
                  value={fw.value}
                  onSelect={() => handleSetValue(fw.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(fw.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {fw.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
