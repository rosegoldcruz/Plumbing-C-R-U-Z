import type {Metadata} from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cruz Plumbing | Inland Empire',
  description: 'The Plumbing Team You Call When It Has To Be Done Right. Serving the Inland Empire. Licensed #1050063.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${archivo.variable}`}>
      <body className="font-sans bg-black text-white antialiased selection:bg-[#FFD700] selection:text-black" suppressHydrationWarning>
        <div className="fixed inset-0 z-50 pointer-events-none opacity-5 mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        {children}
      </body>
    </html>
  );
}
