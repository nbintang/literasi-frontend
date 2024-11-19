"use client";
import React, { Fragment } from "react";
import {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
  Breadcrumb,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
export const removeUselessChars = (str: string[]) => {
    const isCuid = (segment: string): boolean => {
      const cuidRegex = /^[a-zA-Z0-9]{25}$/;
      return cuidRegex.test(segment);
    };
  
    return str.filter((path) => !path.startsWith("create") && !isCuid(path));
  };


const DynamicBreadcrumbs = () => {
  const paths: string = usePathname();
  const pathnames: string[] = paths.split("/").filter((path) => path);
  const filteredPathnames = removeUselessChars(pathnames)
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        {filteredPathnames.map((link: string, index: number) => {
          const href: string = `/${filteredPathnames
            .slice(0, index + 1)
            .join("/")}`;
          const linkName: string =
            link[0].toUpperCase() + link.slice(1, link.length);
          const isLastPath: boolean = filteredPathnames.length === index + 1;
          return (
            <Fragment key={index}>
              <BreadcrumbItem key={index} className="cursor-pointer">
                {isLastPath ? (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{linkName}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{linkName}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {filteredPathnames.length !== index + 1 && (
                <BreadcrumbSeparator />
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumbs;