import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/signin");
  }
  else {
    redirect("/dashboard")
  }
}
