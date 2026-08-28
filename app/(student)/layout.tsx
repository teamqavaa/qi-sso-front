import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import StudentHomeShell from "@/components/dashboard/StudentHomeShell";

export default async function StudentHomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Same cheap gate as the dashboard group: cookie presence only; the shell
  // and API actions handle expired tokens.
  const cookieStore = await cookies();
  if (!cookieStore.get("access_token")?.value) {
    redirect("/");
  }

  return <StudentHomeShell>{children}</StudentHomeShell>;
}