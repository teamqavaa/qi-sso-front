import Profile from "@/components/dashboard/profile";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Dashboard
        </h1>
        {/* Déconnexion globale : toutes les applications connectées via le SSO */}
        <a
          href="/api/auth/logout"
          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          Se déconnecter
        </a>
      </div>
      <p className="text-slate-500">Bienvenue sur votre espace sécurisé.</p>

      {/* Affichage des informations du profil connecté */}
      <Profile />

    </div>
  );
}
