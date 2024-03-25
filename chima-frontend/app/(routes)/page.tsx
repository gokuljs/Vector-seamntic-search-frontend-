"use client";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const MAX_FILES = 8;
export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDivClick = () => {
    inputRef.current && inputRef.current.click();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files: FileList = event.target.files;
      const imageFiles: File[] = Array.from(files).filter((file) =>
        file.type.startsWith("image/")
      );
      setFile((prev) => {
        const spaceLeft = MAX_FILES - prev.length;
        const filesToAdd = imageFiles.slice(0, spaceLeft);
        if (filesToAdd.length < imageFiles.length) {
          console.log("checked");
          toast(
            `You can only upload a maximum of ${MAX_FILES} files in total.`
          );
        }
        return [...prev, ...filesToAdd];
      });
      event.target.value = ""; // This line clears the selected files
    }
  };

  const onFileUpload = async () => {
    if (file.length === 0) return;
    setIsLoading(true);
    // Create an instance of FormData
    const formData = new FormData();

    // Append each file to the 'images' field (or whatever your backend expects)
    file.forEach((fileItem) => {
      formData.append("images", fileItem); // 'images' should match the field name expected by Multer on the backend
    });

    try {
      const response = await axios.post(
        "http://localhost:2000/upload",
        formData
      );
      console.log("Response:", response.data);
      setFile([]);
      setIsLoading(false);
    } catch (err) {
      console.log("Error:", err);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-full w-full ">
      <div className="w-[80%] border-slate h-[50vh] border rounded-md px-3 flex flex-col items-center justify-center gap-4 py-3">
        <input
          type="file"
          className="hidden"
          multiple
          ref={inputRef}
          onChange={handleFileUpload}
          accept="image/*"
        />
        <div
          onClick={handleDivClick}
          className="w-full h-[80%] border border-dashed rounded-md flex flex-col cursor-pointer items-center justify-center hover:bg-zinc-100 transition-all duration-75 ease-in-out"
        >
          <CloudUpload className="h-[150px] w-[150px] text-zinc-600" />
          <p>Click here to upload your image</p>
        </div>
        <div className="w-full h-[20%] border flex justify-between gap-2 flex-col md:flex-row">
          <div className="flex w-full gap-2 overflow-x-auto py-3 px-3 ">
            {file.map((image, index) => (
              <Image
                width={60}
                height={30}
                key={index}
                objectFit="center"
                className="object-cover"
                src={URL.createObjectURL(image)}
                alt={`Uploaded Image ${index}`}
              />
            ))}
          </div>
          <div className="flex w-full h-full items-center justify-end gap-3 px-3">
            <Button
              disabled={file.length === 0}
              onClick={() => setFile([])}
              variant={"destructive"}
              size={"lg"}
            >
              Clear
            </Button>
            <Button size={"lg"} onClick={onFileUpload} disabled={isLoading}>
              Upload
            </Button>
          </div>
        </div>
        <div className="w-full text-xs text-gray-500">
          Total number of files allowed {MAX_FILES}
        </div>
      </div>
    </main>
  );
}
