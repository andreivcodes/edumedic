import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lucia } from "@/lib/auth";
import prisma from "@/server/prisma/db"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SignIn() {

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Bun venit!</CardTitle>
        <CardDescription>Introdu emailul tau pentru a crea un cont</CardDescription>
      </CardHeader>
      <form action={signin}>
        <CardContent>

          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" placeholder="bob@edumedic.ro" />
            </div>

          </div>

        </CardContent>
        <CardFooter >
          <Button type="submit" className="w-full">Creeaza cont</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

async function signin(formData: FormData) {
  'use server'
  const rawFormData = {
    email: formData.get('email'),
  }

  if (
    typeof rawFormData.email !== "string" ||
    rawFormData.email.length < 3
  ) {
    return {
      error: "Invalid username"
    };
  }

  const user = await prisma.user.upsert({
    where: { email: rawFormData.email },
    create: { email: rawFormData.email },
    update: {}
  })

  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

  return redirect("/");
}
