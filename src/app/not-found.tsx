import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4 text-center">
      <h1 className="text-6xl font-bold text-emerald-400 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page introuvable</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        href="/tunnel/precommande-fiche-google" 
        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 font-semibold rounded-lg transition-colors"
      >
        Retourner au tunnel de vente
      </Link>
    </div>
  );
}
