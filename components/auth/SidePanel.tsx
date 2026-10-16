import Image from "next/image";
import ssoImg from "@/images/ssoimage.jpg";

/** Panneau illustré affiché à gauche des pages de connexion et de mot de passe (desktop). */
export default function SidePanel() {
  return (
    <div className="relative hidden w-1/2 overflow-hidden bg-slate-950 lg:block">
      <Image
        src={ssoImg}
        alt="Home Image"
        className="h-full w-full object-cover opacity-40 select-none pointer-events-none"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
      <div className="absolute bottom-20 left-16 right-16 z-10 text-white">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20 backdrop-blur-sm">
          Ignite Your Future
        </div>
        <p className="mt-4 text-base text-slate-300 leading-relaxed max-w-md">
          Sign in once for seamless, secure access to all your enterprise
          tools and apps.
        </p>
        <div className="mt-8 border-t border-slate-800 pt-6 text-xs text-slate-400">
          Security Advisory: Ensure that the URL in your address bar
          corresponds to your organization&apos;s official domain.
        </div>
      </div>
    </div>
  );
}
