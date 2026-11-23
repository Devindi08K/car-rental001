import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow mb-3">404</p>
      <h1 className="font-display text-4xl text-ink mb-4">Page not found</h1>
      <p className="text-ink/75 mb-8">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="button-editorial">Back to home</Link>
    </div>
  );
}