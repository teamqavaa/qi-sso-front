@AGENTS.md

# Qavaa SSO Front — repères

Page de connexion du SSO (`DJANGO_API_URL` = API Django `qavaa-innovate-sso`, voir son `CLAUDE.md`).

| Route | Rôle | Fichiers |
|---|---|---|
| `/` | connexion / inscription ; avec les paramètres OAuth d'une app cliente (`client_id`, `redirect_uri`, PKCE, `state`), renvoie vers son callback | `components/AuthHome.tsx`, `components/auth/Login.tsx` |
| `/password` | **visiteur** : mot de passe oublié en 3 étapes (email → code à 6 chiffres reçu par email → nouveau mot de passe), puis connexion automatique et retour vers l'app cliente si les paramètres OAuth étaient présents. **Connecté** : changement avec le mot de passe actuel | `app/password/page.tsx`, `components/auth/PasswordFlow.tsx`, actions `requestPasswordResetAction`, `verifyPasswordResetCodeAction`, `confirmPasswordResetAction`, `changePasswordAction` (`actions/auth.ts`) |
| `/dashboard` | profil SSO, changement de mot de passe, déconnexion globale | `app/dashboard/page.tsx` |

- `proxy.ts` : `/` et `/password` sont publiques ; seul `/` redirige un utilisateur connecté vers `/dashboard`.
- Le lien « Forgot password? » de la page de connexion conserve les paramètres OAuth.
- API utilisées : `POST /api/auth/password/reset/`, `…/verify/`, `…/confirm/`, `POST /api/users/me/change-password/`.
- Boutons : rayon unique de 4 px (`components/ui/button.tsx`), comme sur contents-lab.
- Test local : `DJANGO_API_URL=http://localhost:8000 npx next dev -p 3000` ; sans SMTP configuré
  côté SSO, le code s'affiche dans `docker compose logs app` du SSO.
