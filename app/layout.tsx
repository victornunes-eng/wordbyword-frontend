import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Word by Word — pratique seu vocabulário em inglês',
  description: 'Descubra palavras em inglês com explicações em português e exemplos de uso. Uma experiência simples para praticar seu vocabulário.',
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
