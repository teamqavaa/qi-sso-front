import React from "react";
import { getMeAction } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Profile() {
  // Appel direct de la Server Action au moment du rendu du composant
  const { user, error } = await getMeAction();

  if (error || !user) {
    return (
      <div className="p-4 text-sm text-red-500 bg-red-50 rounded-lg">
        Erreur : Vous devez être connecté pour voir cette page.
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
          Mon Profil Utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Nom Complet</span>
          <p className="text-base text-slate-800 dark:text-slate-200 font-medium">{user.name}</p>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email</span>
          <p className="text-base text-slate-800 dark:text-slate-200">{user.email}</p>
        </div>

        {user.phone && (
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Téléphone</span>
            <p className="text-base text-slate-800 dark:text-slate-200">{user.phone}</p>
          </div>
        )}

        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 block">Mes Rôles SSO</span>
          <div className="flex flex-wrap gap-2">
            {user.roles && user.roles.length > 0 ? (
              user.roles.map((role: string) => (
                <Badge key={role} variant="secondary" className="capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {role}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-slate-500">Aucun rôle attribué</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}