import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-gold text-sm font-bold tracking-widest uppercase mb-3">404</p>
      <h1 className="font-display text-4xl font-black text-cream mb-4">Page not found</h1>
      <p className="text-muted mb-8">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="bg-gold text-charcoal font-bold px-6 py-3 text-sm hover:bg-gold-light transition-colors">
        Back to home
      </Link>
    </div>
  );
}