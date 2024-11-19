"use client"
import { columns } from "@/components/tables/users/columns"
import { DataTable } from "@/components/tables/data-table"
import { User } from "@/components/tables/users/columns";
import useFetchData from "@/hooks/use-fetch-data";




export default  function BlockPage() {
  const {data: users, isSuccess, isPending} = useFetchData({tags: "users", endpointOptions: "/users"});
 console.log(users?.data)
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} isPending={isPending} isSuccess={isSuccess} data={users?.data as User[] || []} />
    </div>
  )
}