"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type User = {
    id: string
    email: string
    password: string
    profileImgUrl?: string
    name: string
    createdAt: string
    updatedAt: string
  }
  
  export const columns: ColumnDef<User>[] = [
{
    accessorKey: "profileImgUrl",
    header: "Profile",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center">
        <Avatar>
          <AvatarImage src={user.profileImgUrl} />
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        </div>
      );
    }
},
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
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
        const user = row.original;
  
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
                onClick={() => navigator.clipboard.writeText(user.id)}
              >
                Copy user ID
              </DropdownMenuItem>
        
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  