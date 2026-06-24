import Link from "next/link";
import { Leaf } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <Link href="/" className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-moss">
          <Leaf className="h-5 w-5 text-sage-light" />
        </Link>
        <h1 className="font-display text-2xl font-medium text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      </div>
      <div className="rounded-xl border border-border-soft bg-white/60 p-6">{children}</div>
      {footer && <div className="mt-5 text-center text-sm text-ink-soft">{footer}</div>}
    </div>
  );
}
