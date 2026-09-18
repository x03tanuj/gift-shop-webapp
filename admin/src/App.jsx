import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import ProductForm from './pages/ProductForm.jsx';
import Categories from './pages/Categories.jsx';
import CategoryForm from './pages/CategoryForm.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="admin-app" style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Administrative Dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Product Catalog Listing */}
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Products />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Create Product */}
          <Route
            path="/products/new"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Edit Product */}
          <Route
            path="/products/:id/edit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <ProductForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Categories Listing */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Categories />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Create Category */}
          <Route
            path="/categories/new"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CategoryForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Edit Category */}
          <Route
            path="/categories/:id/edit"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <CategoryForm />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div
                style={{
                  maxWidth: '480px',
                  margin: '4rem auto',
                  padding: '2rem',
                  background: '#fff',
                  borderRadius: '12px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                <h2 style={{ color: '#0f172a', margin: '0 0 0.5rem 0' }}>
                  404 - Admin Page Not Found
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                  The requested administrative section does not exist.
                </p>
                <Link
                  to="/"
                  style={{
                    display: 'inline-block',
                    background: '#0f172a',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  Return to Dashboard
                </Link>
              </div>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
