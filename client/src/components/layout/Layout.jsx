import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import FloatingBottomBar from './FloatingBottomBar.jsx';

/**
 * Shared layout component wrapping all storefront pages.
 * Includes top Header, responsive main content area, Footer, and mobile bottom bar.
 */
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-canvas text-brand-charcoal antialiased pb-16 md:pb-0">
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4">
        {children}
      </main>
      <Footer />
      <FloatingBottomBar />
    </div>
  );
}
