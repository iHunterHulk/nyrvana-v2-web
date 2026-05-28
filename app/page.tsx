import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-text-primary flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Nyrvana V2</h1>
      <Link href="/auth/login" className="text-blue-vibrant hover:underline">
        Go to Login
      </Link>
    </div>
  );
}