import type { ReactNode } from "react";
import { Loader2, Lock } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { isOwnerEmail } from "@/lib/owner";

type OwnerOnlyProps = {
  children: ReactNode;
};

const OwnerOnly = ({ children }: OwnerOnlyProps) => {
  const { data: session, isLoading } = useSession();
  const isOwner = isOwnerEmail(session?.user?.email);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 p-6" role="status" aria-live="polite">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden="true" />
          <span className="text-sm font-medium text-muted-foreground">Verifierar åtkomst…</span>
        </div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
            <Lock className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Begränsat innehåll</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Det här visas bara när du är inloggad med ägarkontot.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OwnerOnly;
