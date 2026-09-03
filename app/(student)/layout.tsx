import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMeAction } from "@/actions/auth";
import { getCartAction } from "@/actions/cart";
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

  // Hydrate the profile server-side so the home page can greet by name, and
  // read the cart item count so the pill-bar badge renders for signed-in users.
  const [{ user }, cart] = await Promise.all([
    getMeAction(),
    getCartAction(),
  ]);

  return (
    <StudentHomeShell initialUser={user} initialCartItemCount={cart.cart?.items_count ?? 0}>
      {children}
    </StudentHomeShell>
  );
}