import Profile from "@/components/dashboard/profile";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Dashboard
      </h1>
      <p className="text-slate-500">Bienvenue sur votre espace sécurisé.</p>

      {/* Affichage des informations du profil connecté */}
      <Profile />

    </div>
  );
}
