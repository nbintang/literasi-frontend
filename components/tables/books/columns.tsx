"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircleIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios-instances";
import toast from "react-hot-toast";
import useDeleteData from "@/hooks/use-delete-data";
export type Book = {
  id: string;
  title: string;
  imageUrl?: string;
  author: string;
  content: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <div className="h-40 w-32 rounded-lg overflow-hidden">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl?.toString() || ""}
              alt={book.title}
              width={100}
              height={100}
              className="w-full object-cover h-full"
            />
          ) : (
            <LoaderCircleIcon className="h-7 w-7 animate-spin" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{format(date, "mm/dd/yyyy")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;
   const result  = useDeleteData({endpointOptions: `/books/${book.id}`, tag: "books"});
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(book.id)}
            >
              Copy book ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href={`/dashboard/books/${book.id}`}>
              <DropdownMenuItem>View details</DropdownMenuItem>
            </Link>
            <Link href={`/dashboard/books/edit/${book.id}`}>
              <DropdownMenuItem>Edit Book</DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="text-destructive" onClick={() => {result.mutate();}}>
              Delete Book
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
