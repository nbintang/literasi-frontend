"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios-instances";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import BookSchema, { BookSchemaValues } from "@/schemas/create-book-schema";
import { LoaderCircleIcon, Paperclip, Trash2Icon } from "lucide-react";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { cn } from "@/lib/utils";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
} from "../extension/file-upload";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import useFetchData from "@/hooks/use-fetch-data";
import { useEffect, useState } from "react";
import { Editor } from "@tiptap/react";
import useCreateData from "@/hooks/use-create-data";
import useUpdateData from "@/hooks/use-update-data";
const mandatoryIndicatorClassName = cn(
  "after:content-['*'] after:ml-0.5 after:text-red-500"
);

export default function UpdateBookForm({ id }: { id: string }) {
  const { data: book, isLoading } = useFetchData({
    tags: "books",
    endpointOptions: `/books/${id}`,
  });

  const router = useRouter();

  // Handle defaultValues with conditional rendering
  const form = useForm<BookSchemaValues>({
    resolver: zodResolver(BookSchema),
    values: {
      title: book?.data?.title,
      description: book?.data?.description,
      content: book?.data?.content,
      author: book?.data?.author,
      category: book?.data?.category,
      image: book?.data?.imageUrl,
    },
  });

  const result = useUpdateData({
    endpointOptions: `/books/${id}`,
    tag: "books",
  });

  function onSubmit(values: BookSchemaValues) {
    result.mutate(values);

    result.isPending && toast.loading("Uploading...");
    result.isSuccess && form.reset();
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={mandatoryIndicatorClassName}>
                  Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={mandatoryIndicatorClassName}>
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Book description"
                    className="min-h-52"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={mandatoryIndicatorClassName}>
                  Author
                </FormLabel>
                <FormControl>
                  <Input placeholder="Author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={mandatoryIndicatorClassName}>
                  Category
                </FormLabel>
                <FormControl>
                  <Input placeholder="Book category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* File Upload Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={mandatoryIndicatorClassName}>
                  Book Cover
                </FormLabel>
                <FileUploader
                  value={field.value ? [field.value] : []}
                  onValueChange={(files) => files && field.onChange(files[0])}
                  dropzoneOptions={{
                    maxFiles: 1,
                    maxSize: 1024 * 1024 * 4,
                    accept: {
                      "image/*": [".png", ".jpeg", ".jpg"],
                    },
                  }}
                  className="relative rounded-lg p-2 bg-secondary min-w-0"
                >
                  {field.value ? (
                    <FileUploaderContent>
                      <div className="flex relative items-center justify-center flex-col pt-3 pb-4 w-full">
                        {field.value instanceof File ? (
                          <Image
                            src={URL.createObjectURL(field.value)}
                            alt="Book Cover"
                            width={200}
                            height={400}
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <Image
                            src={field.value} // Use the pre-existing image URL
                            alt="Book Cover"
                            width={200}
                            height={400}
                            className="object-cover rounded-lg"
                          />
                        )}
                        <Trash2Icon
                          onClick={() => field.onChange("")}
                          className="mt-2 w-5 h-5 text-red-500 hover:text-red-600 cursor-pointer"
                        />
                      </div>
                    </FileUploaderContent>
                  ) : (
                    <FileInput className="outline-dashed outline-1 outline-black h-96">
                      <div className="flex items-center justify-center flex-col pt-3 pb-4 h-full w-full">
                        <Paperclip className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG, JPEG, or JPG images only, max size 3MB
                        </p>
                      </div>
                    </FileInput>
                  )}
                </FileUploader>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => {
              const [editorContent, setEditorContent] = useState("");
              const [loading, setLoading] = useState(true);
              useEffect(() => {
                if (field.value) {
                  setEditorContent(field.value);
                  setLoading(false);
                }
              }, [field.value]);

              return (
                <FormItem>
                  <FormLabel className={mandatoryIndicatorClassName}>
                    Content
                  </FormLabel>
                  {loading ? (
                    <FormControl>
                      <MinimalTiptapEditor
                        className={cn(
                          "h-full min-h-96 w-full max-w-xs min-w-0 sm:max-w-none rounded-xl "
                        )}
                        editorContentClassName="overflow-auto h-full p-2"
                        output="html"
                        placeholder={"Book content"}
                        // content={field.value}
                        value={editorContent}
                        onChange={(content) => {
                          setEditorContent(content as string);
                          field.onChange(content);
                        }}
                      />
                    </FormControl>
                  ) : (
                    <div className="grid place-items-center">
                      <div className="flex items-center gap-3 ">
                        <p>This May take a few Minutes to Load...</p>
                        <LoaderCircleIcon className="h-7 w-7 animate-spin" />
                      </div>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-3">
                <p className="text-base text-white">Loading...</p>
                <LoaderCircleIcon className="text-white animate-spin duration-1000 w- h-5" />
              </div>
            ) : (
              "Update Book"
            )}
          </Button>
        </form>
      </Form>
    </>
  );
}
