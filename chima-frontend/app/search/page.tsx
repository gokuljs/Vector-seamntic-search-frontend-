"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import axios from "axios";
import Image from "next/image";

interface DataProps {
  description: string;
  image_url: string;
  score: number;
}

const Page = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [data, setData] = useState<DataProps[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const onSubmit = useCallback(async () => {
    if (currentQuestion.length === 0) return;
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:2000/search", {
        params: { query: currentQuestion },
      });
      setData(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentQuestion]);

  //   console.log(data, "ssss");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      } else if (event.key === "Enter" && currentQuestion.length !== 0) {
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentQuestion, onSubmit]);

  console.log(data, "ssss");
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto gap-2 items-center">
      <div className="h-[50px] w-full md:w-[50%] flex mt-40 items-center gap-2">
        <Input
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          ref={inputRef}
          placeholder="Enter you query for search"
        />
        <Search className="cursor-pointer" onClick={onSubmit} />
      </div>

      <div className="flex w-full flex-wrap items-center gap-2  justify-stretch px-6">
        {data.map((item, index) => (
          <div
            key={item?.image_url}
            className="border rounded-md h-[150px] w-[150px] overflow-hidden"
          >
            <Image
              src={item?.image_url as string}
              width={150}
              height={150}
              className="w-full h-full object-cover"
              alt="images"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
