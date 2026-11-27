import { JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import SiteFooter from '@/components/organisms/SiteFooter/SiteFooter';
import SiteHeader from '@/components/organisms/SiteHeader/SiteHeader';
import { meta, site } from '@/content/copy';
import { siteUrl } from '@/lib/site-url';
import './globals.css';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-space-grotesk' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-jetbrains-mono' });

export const metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: meta.homeTitle, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  appleWebApp: { capable: true, title: site.shortName, statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false },
};

export const viewport = {
  themeColor: '#0c0c0c',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        <span id="top" />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
