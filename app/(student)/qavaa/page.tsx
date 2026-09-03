import { Suspense } from "react";

import QavaaPay from "@/components/qavaa/QavaaPay";

export default function QavaaPage() {
  return (
    <Suspense fallback={<p className="py-16 text-center text-sm text-muted-foreground">Loading…</p>}>
      <QavaaPay />
    </Suspense>
  );
}
