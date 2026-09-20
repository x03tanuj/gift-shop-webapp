import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetails from './pages/ProductDetails.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetails />} />
        <Route
          path="*"
          element={
            <div className="py-12 text-center bg-white rounded-2xl border border-brand-gold/25 p-8 my-6">
              <h2 className="font-serif text-2xl font-bold text-brand-burgundy mb-2">
                404 - Page Not Found
              </h2>
              <p className="text-sm text-brand-muted mb-4">
                The product or page you requested is not available.
              </p>
              <Link
                to="/"
                className="inline-block text-xs font-semibold uppercase tracking-wider text-brand-burgundy underline"
              >
                Return to Products Catalog
              </Link>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
