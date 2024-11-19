import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const token = await cookies().get("token")?.value;
  if (token) redirect("/dashboard/books");
}
