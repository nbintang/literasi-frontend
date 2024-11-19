"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileWithPath, useDropzone } from "react-dropzone";
import { ImageCropper } from "../extension/image-cropper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instances";
import toast from "react-hot-toast";

export interface ProfileUser {
  id: string;
  email: string;
  profileImgUrl?: string;
  name: string;
  createdAt: Date;
}

export type FileWithPreview = FileWithPath & {
  preview: string;
};


interface ProfileUserInputProps {
  email: string;
  image?: File; // Use File type instead of base64 string
  name: string;
}

const accept = {
  "image/*": [ ".png", ".jpg", ".jpeg",  ],
};

const profileFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  image: z.instanceof(File).optional(), // Accept File or null
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

const usePatchUser = ({ userId }: { userId: string }) => {
  return useMutation({
    mutationKey: ["users"],
    mutationFn: async (data: ProfileUserInputProps) => {
      const formData = new FormData();
      if (data.image) {
        formData.append("image", data.image);
      }
      formData.append("email", data.email);
      formData.append("name", data.name);

      const res = await axiosInstance.patch(`/users/${userId}`, formData);
      return res.data;
    },
    onMutate: () => {
      toast.loading("Uploading...");
    },
  });
};

export function EditProfileForm({ user }: { user: ProfileUser }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null);

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        alert("Selected image is too large!");
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });

  const router = useRouter();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      email: user.email,
      name: user.name,
    },
    mode: "onChange",
  });

  const { mutate } = usePatchUser({ userId: user.id });

  function onSubmit(data: ProfileFormValues) {
    const profileData: ProfileUserInputProps = {
      email: data.email,
      name: data.name,
      image: selectedFile ?? undefined,
    };

    console.log(profileData)

    mutate(profileData, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        router.push("/dashboard/books");
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                {selectedFile ? (
                  <ImageCropper
                    dialogOpen={isDialogOpen}
                    setDialogOpen={setDialogOpen}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                  />
                ) : (
                  <Avatar
                    {...getRootProps()}
                    className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
                  >
                    <input {...getInputProps()} />
                    <AvatarImage src={user.profileImgUrl} alt={user.name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>This is your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
}
