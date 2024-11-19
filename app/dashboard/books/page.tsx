"use client"
import { Book, columns } from "@/components/tables/books/columns"
import { DataTable } from "@/components/tables/data-table"
import useFetchData from "@/hooks/use-fetch-data";




export default  function BlockPage() {
  const {data: books, isSuccess, isPending} = useFetchData({tags: "books", endpointOptions: "/books"});
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} isPending={isPending} isSuccess={isSuccess} data={books?.data as Book[] || []} />
    </div>
  )
}