import { Header } from "@/components/header";
import SideNav from "@/components/side-nav";

export default async function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="flex flex-col">
    <Header />
    <div className="flex flex-row">
      <SideNav />
      {children}
    </div>
  </main>
}
