"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/dark";
import { BrainCog } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="h-[80px] w-full px-3 py-2">
      <div className="h-full rounded-lg flex justify-between items-center gap-2 px-4">
        <BrainCog onClick={() => router.push("/")} className="cursor-pointer" />

        <div className="flex item-center gap-2">
          <Button onClick={() => router.push("/search")} variant={"ghost"}>
            Search
          </Button>
          <Button onClick={() => router.push("/")} variant={"ghost"}>
            Upload
          </Button>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
