// app/password/page.tsx — mot de passe oublié (code par email) ou changement si l'utilisateur est connecté
import { Suspense } from "react";

import { getMeAction } from "@/actions/auth";
import PasswordFlow from "@/components/auth/PasswordFlow";
import SidePanel from "@/components/auth/SidePanel";

export const dynamic = "force-dynamic";

export default async function PasswordPage() {
  const { user } = await getMeAction();

  return (
    <div className="flex gap-5 w-full min-h-screen bg-slate-50">
      <SidePanel />
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 sm:p-12 lg:p-16">
        <Suspense fallback={null}>
          <PasswordFlow signedInEmail={user?.email ?? null} />
        </Suspense>
      </div>
    </div>
  );
}
