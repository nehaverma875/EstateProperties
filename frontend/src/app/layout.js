import './globals.css';
import Providers from '../store/Providers';
import Header from '../components/Header';
import WebVitals from '../components/WebVitals';

export const metadata = {
  // Default SEO metadata for pages that do not define their own metadata.
  title: {
    default: 'EstateFlow | Verified Real Estate Listings',
    template: '%s | EstateFlow'
  },
  description: 'Search, list, and inquire on verified real estate properties with fast filters and SEO-friendly property pages.'
};

export default function RootLayout({ children }) {
  // Providers gives Redux/RTK Query to the entire app; Header appears on every page.
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <WebVitals />
          <Header />
          <main className="h-[calc(100dvh-4rem)] overflow-hidden">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
