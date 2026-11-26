import type {Metadata} from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cruz Empire Coaching | Turn Your Service Business Into an Empire',
  description: 'Coaching for service business owners. Real data from the BLS, U.S. Bank, and IBISWorld shows why half of businesses never make year five — and the six systems that flip the odds in your favor.',
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
