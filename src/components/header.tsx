import { lucia, validateRequest } from "@/lib/auth";
import { Avatar, AvatarFallback, } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export async function Header() {
  const { user } = await validateRequest();

  return (
    <div className="w-full flex flex-row justify-between border px-4 py-4">
      <Link href="/" className="font-bold  text-3xl">
        Bun venit!
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarFallback className="cursor-pointer">{user?.email.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Contul meu</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <form action={signOut}>
            <button type="submit" className="w-full">
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  )
}


async function signOut() {
  "use server";
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized"
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  redirect("/");
}
