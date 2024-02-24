export default async function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      {children}
    </div>
  );
}
