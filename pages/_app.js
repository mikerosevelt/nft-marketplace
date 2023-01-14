import Link from 'next/link';
import '../styles/globals.css';

function KryptoBirdzMarketplace({ Component, pageProps }) {
  return (
    <div className="w-full bg-zinc-50">
      <nav className="border-b w-full bg-indigo-600">
        <p className="text-lg p-2 font-bold text-white hover:text-gray-200 hover:cursor-pointer">
          KyptoBirdz Marketplace
        </p>
        <div className="flex pb-4 justify-center w-full">
          <Link href="/" className="mr-6 hover:text-slate-100">
            Main Marketplace
          </Link>
          <Link href="/mint-item" className="mr-6 hover:text-slate-100">
            Mint Tokens
          </Link>
          <Link href="/my-nfts" className="mr-6 hover:text-slate-100">
            My NFTs
          </Link>
          <Link href="/account-dashboard" className="mr-6 hover:text-slate-100">
            Account Dashboard
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default KryptoBirdzMarketplace;
