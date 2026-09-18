import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminApi } from '../services/adminApi.js';

/**
 * Shared Add / Edit Product Form
 * Manages product metadata, pricing, category reference, repeatable specs,
 * catalog flags, and image upload / preview / removal.
 */
export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // Reference categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [badge, setBadge] = useState('');
  const [personalizable, setPersonalizable] = useState(false);
  const [personalizationNote, setPersonalizationNote] = useState('');
  
  // Specifications (repeatable key-value pairs)
  const [specs, setSpecs] = useState([{ id: '1', key: '', value: '' }]);

  // Images state (Maximum 3 images total)
  const MAX_IMAGES = 3;
  const [existingImages, setExistingImages] = useState([]);
  const [queuedFiles, setQueuedFiles] = useState([]); // array of { id, file, preview, name, size }
  const [directImageUrl, setDirectImageUrl] = useState('');

  // Status & Feedback state
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDirectly, setUploadingDirectly] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const data = await adminApi.getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setServerError('Could not fetch categories list. Check connection.');
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // Load Product Data if in Edit Mode
  useEffect(() => {
    if (!isEdit) return;

    async function loadProduct() {
      try {
        setLoadingProduct(true);
        setServerError(null);
        const data = await adminApi.getProductById(id);
        const p = data.product;

        setName(p.name || '');
        setPrice(p.price !== undefined ? p.price.toString() : '');
        setCategory(p.category?._id || p.category?.id || p.category || '');
        setDescription(p.description || '');
        setAvailable(p.available !== false && p.available !== 'Sold Out');
        setFeatured(Boolean(p.featured));
        setBadge(p.badge || '');
        setPersonalizable(Boolean(p.personalizable));
        setPersonalizationNote(p.personalizationNote || '');

        // Images (Max 3)
        const imgs = Array.isArray(p.images) && p.images.length > 0 
          ? p.images 
          : (p.image ? [p.image] : []);
        setExistingImages(imgs.slice(0, MAX_IMAGES));

        // Details / Specs
        if (p.details && typeof p.details === 'object' && Object.keys(p.details).length > 0) {
          const specList = Object.entries(p.details).map(([k, v], idx) => ({
            id: `${idx}-${Date.now()}`,
            key: k,
            value: typeof v === 'object' ? JSON.stringify(v) : String(v),
          }));
          setSpecs(specList);
        } else {
          setSpecs([{ id: '1', key: '', value: '' }]);
        }
      } catch (err) {
        console.error('Failed to load product for editing:', err);
        setServerError(err.message || 'Unable to retrieve product details.');
      } finally {
        setLoadingProduct(false);
      }
    }

    loadProduct();
  }, [id, isEdit]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      queuedFiles.forEach((q) => {
        if (q.preview && q.preview.startsWith('blob:')) {
          URL.revokeObjectURL(q.preview);
        }
      });
    };
  }, [queuedFiles]);

  // Specification helpers
  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { id: Date.now().toString(), key: '', value: '' }]);
  };

  const handleSpecChange = (index, field, val) => {
    setSpecs((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleRemoveSpec = (index) => {
    setSpecs((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [{ id: Date.now().toString(), key: '', value: '' }];
    });
  };

  // Image helpers (Max 3 total)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const currentTotal = existingImages.length + queuedFiles.length;
    const availableSlots = Math.max(0, MAX_IMAGES - currentTotal);

    if (availableSlots === 0) {
      setErrors((prev) => ({
        ...prev,
        image: `Maximum ${MAX_IMAGES} photos reached. Remove a photo to add a different one.`,
      }));
      e.target.value = '';
      return;
    }

    const newFilesToAdd = [];
    for (const file of files) {
      if (newFilesToAdd.length >= availableSlots) break;

      // Validate size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: `File "${file.name}" exceeds the 5MB limit.`,
        }));
        continue;
      }

      // Validate type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          image: `File "${file.name}" is not a valid image format.`,
        }));
        continue;
      }

      newFilesToAdd.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: (file.size / 1024).toFixed(1),
      });
    }

    if (newFilesToAdd.length > 0) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.image;
        return updated;
      });
      setQueuedFiles((prev) => [...prev, ...newFilesToAdd]);
    }

    e.target.value = '';
  };

  const handleRemoveQueuedFile = (fileId) => {
    setQueuedFiles((prev) => {
      const target = prev.find((f) => f.id === fileId);
      if (target?.preview && target.preview.startsWith('blob:')) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const handleRemoveExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDirectImageUrl = () => {
    const trimmed = directImageUrl.trim();
    if (!trimmed) return;

    const currentTotal = existingImages.length + queuedFiles.length;
    if (currentTotal >= MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        image: `Maximum ${MAX_IMAGES} photos reached. Remove a photo first.`,
      }));
      return;
    }

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.image;
      return updated;
    });

    setExistingImages((prev) => [...prev, trimmed]);
    setDirectImageUrl('');
  };

  // Instant image upload in edit mode
  const handleInstantUpload = async () => {
    if (!isEdit || queuedFiles.length === 0) return;

    try {
      setUploadingDirectly(true);
      setServerError(null);
      const res = await adminApi.uploadProductImage(
        id,
        queuedFiles.map((q) => q.file)
      );
      if (res.images) {
        setExistingImages(res.images.slice(0, MAX_IMAGES));
        queuedFiles.forEach((q) => {
          if (q.preview && q.preview.startsWith('blob:')) {
            URL.revokeObjectURL(q.preview);
          }
        });
        setQueuedFiles([]);
      }
    } catch (err) {
      console.error('Instant upload error:', err);
      setServerError(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingDirectly(false);
    }
  };

  // Client Validation
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Product name is required.';
    }

    const parsedPrice = parseFloat(price);
    if (price === '' || isNaN(parsedPrice) || parsedPrice < 0) {
      newErrors.price = 'Please enter a valid positive price (e.g. 450).';
    }

    if (!category.trim()) {
      newErrors.category = 'Please select a product category.';
    }

    if (!description.trim()) {
      newErrors.description = 'Product description is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      // Scroll to top or first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      // Convert specs array to object
      const details = specs.reduce((acc, curr) => {
        const k = curr.key.trim();
        const v = curr.value.trim();
        if (k) {
          acc[k] = v;
        }
        return acc;
      }, {});

      const payload = {
        name: name.trim(),
        price: parseFloat(price),
        category,
        description: description.trim(),
        details,
        available,
        featured,
        badge: badge.trim() || null,
        personalizable,
        personalizationNote: personalizable ? personalizationNote.trim() : null,
        images: existingImages,
      };

      let productId = id;

      if (isEdit) {
        await adminApi.updateProduct(id, payload);
      } else {
        const createRes = await adminApi.createProduct(payload);
        productId = createRes.product?.id || createRes.product?._id;
      }

      // If new image files were queued, upload them now
      if (queuedFiles.length > 0 && productId) {
        try {
          await adminApi.uploadProductImage(
            productId,
            queuedFiles.map((q) => q.file)
          );
        } catch (uploadErr) {
          console.warn('Product saved, but image upload encountered an error:', uploadErr);
          // Don't fail the whole operation if product was created, just warn
        }
      }

      navigate('/products', {
        state: {
          message: `Product '${payload.name}' was successfully ${isEdit ? 'updated' : 'created'}!`,
        },
      });
    } catch (err) {
      console.error('Submit error:', err);
      if (err.fields) {
        setErrors(err.fields);
      }
      setServerError(err.message || 'An unexpected error occurred while saving.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '3rem',
          textAlign: 'center',
          color: '#64748b',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e2e8f0',
            borderTopColor: '#0f172a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto',
          }}
        ></div>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Loading product details...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '860px', margin: '0 auto' }}>
      {/* Navigation & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <Link
            to="/products"
            style={{
              textDecoration: 'none',
              fontSize: '0.8rem',
              color: '#64748b',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              marginBottom: '0.4rem',
              fontWeight: 500,
            }}
          >
            ← Back to Catalog
          </Link>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
            {isEdit
              ? `Updating catalog record for product ID: ${id}`
              : 'Add a new handcrafted piece or gift hamper to the live catalog.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/products')}
          style={{
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            padding: '0.5rem 0.9rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>

      {/* Global Server Error Banner */}
      {serverError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.875rem 1.25rem',
            color: '#991b1b',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Basic Information */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04)',
          }}
        >
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
            1. Basic Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* Product Name */}
            <div style={{ gridColumn: 'span 2' }}>
              <label
                htmlFor="product-name"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}
              >
                Product Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="e.g. Royal Brass Diya Stand"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${errors.name ? '#ef4444' : '#cbd5e1'}`,
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {errors.name && (
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: '#ef4444' }}>{errors.name}</p>
              )}
            </div>

            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="product-category"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}
              >
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                id="product-category"
                value={category}
                disabled={loadingCategories}
                onChange={(e) => {
                  setCategory(e.target.value);
                  if (errors.category) setErrors((prev) => ({ ...prev, category: null }));
                }}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${errors.category ? '#ef4444' : '#cbd5e1'}`,
                  fontSize: '0.85rem',
                  outline: 'none',
                  background: '#ffffff',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: '#ef4444' }}>{errors.category}</p>
              )}
            </div>

            {/* Price (INR) */}
            <div>
              <label
                htmlFor="product-price"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}
              >
                Price (₹) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '0.85rem',
                  }}
                >
                  ₹
                </span>
                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((prev) => ({ ...prev, price: null }));
                  }}
                  placeholder="499"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem 0.55rem 1.75rem',
                    borderRadius: '6px',
                    border: `1px solid ${errors.price ? '#ef4444' : '#cbd5e1'}`,
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {errors.price && (
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: '#ef4444' }}>{errors.price}</p>
              )}
            </div>

            {/* Badge (Optional e.g. "Bestseller", "New") */}
            <div>
              <label
                htmlFor="product-badge"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}
              >
                Badge / Tag <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                id="product-badge"
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, Handcrafted, Festive"
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: 'span 2' }}>
              <label
                htmlFor="product-description"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}
              >
                Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                id="product-description"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: null }));
                }}
                placeholder="Provide details about the craftsmanship, materials, aesthetic appeal, and ideal gifting moments..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${errors.description ? '#ef4444' : '#cbd5e1'}`,
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
              {errors.description && (
                <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.75rem', color: '#ef4444' }}>{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Product Images (Max 3) */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
                2. Product Images
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                Add up to 3 photos (Photo 1 is storefront Cover; Photos 2 & 3 are gallery angles).
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.25rem 0.65rem',
                  borderRadius: '9999px',
                  background: existingImages.length + queuedFiles.length >= MAX_IMAGES ? '#f1f5f9' : '#e0e7ff',
                  color: existingImages.length + queuedFiles.length >= MAX_IMAGES ? '#475569' : '#4338ca',
                }}
              >
                {existingImages.length + queuedFiles.length} / {MAX_IMAGES} Photos
              </span>
            </div>
          </div>

          {/* Current Saved Images Gallery */}
          {existingImages.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Saved Photos ({existingImages.length})
                </label>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Order: 1st = Primary Cover, 2nd & 3rd = Gallery Views
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                {existingImages.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    style={{
                      position: 'relative',
                      width: '120px',
                      height: '120px',
                      borderRadius: '8px',
                      border: idx === 0 ? '2px solid #6366f1' : '1px solid #cbd5e1',
                      overflow: 'hidden',
                      background: '#f8fafc',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Product photo ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/120x120/f1f5f9/64748b?text=Preview';
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        background: idx === 0 ? 'rgba(79, 70, 229, 0.92)' : 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        fontSize: '0.625rem',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        fontWeight: 600,
                      }}
                    >
                      {idx === 0 ? '★ Cover (Photo 1)' : `Photo ${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      title="Remove image"
                      aria-label={`Remove photo ${idx + 1}`}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(239, 68, 68, 0.95)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        width: '28px',
                        height: '28px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Queued Photos Ready for Upload */}
          {queuedFiles.length > 0 && (
            <div
              style={{
                marginBottom: '1.25rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Selected for Upload ({queuedFiles.length})
                </span>
                {isEdit && (
                  <button
                    type="button"
                    disabled={uploadingDirectly}
                    onClick={handleInstantUpload}
                    style={{
                      background: '#4f46e5',
                      color: '#fff',
                      border: 'none',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '5px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {uploadingDirectly ? 'Uploading...' : '⚡ Upload Now'}
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                {queuedFiles.map((q, qIdx) => {
                  const roleIdx = existingImages.length + qIdx;
                  return (
                    <div
                      key={q.id}
                      style={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        borderRadius: '8px',
                        border: '1px dashed #6366f1',
                        overflow: 'hidden',
                        background: '#ffffff',
                      }}
                    >
                      <img
                        src={q.preview}
                        alt={`Queued ${q.name}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '4px',
                          left: '4px',
                          background: roleIdx === 0 ? 'rgba(79, 70, 229, 0.92)' : 'rgba(30, 41, 59, 0.85)',
                          color: '#ffffff',
                          fontSize: '0.625rem',
                          padding: '0.15rem 0.4rem',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        {roleIdx === 0 ? '★ Cover' : `Photo ${roleIdx + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQueuedFile(q.id)}
                        title="Remove photo"
                        aria-label={`Remove photo ${q.name}`}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(239, 68, 68, 0.95)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Dropzone / Picker if slots available */}
          {existingImages.length + queuedFiles.length < MAX_IMAGES ? (
            <div
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '1.25rem',
                textAlign: 'center',
                background: '#f8fafc',
                marginBottom: '1rem',
              }}
            >
              <input
                id="image-file-input"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="image-file-input"
                style={{
                  display: 'inline-block',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                }}
              >
                📷 Add Photos ({MAX_IMAGES - (existingImages.length + queuedFiles.length)} slots left)
              </label>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                Select up to {MAX_IMAGES - (existingImages.length + queuedFiles.length)} photo file(s) (JPG, PNG, WebP up to 5MB).
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#166534',
                fontSize: '0.8rem',
                fontWeight: 500,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>✓</span>
              <span>
                Maximum 3 photos reached (1 Cover photo + 2 Gallery angles). Remove a photo above if you want to replace it.
              </span>
            </div>
          )}

          {errors.image && (
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.75rem', color: '#ef4444' }}>{errors.image}</p>
          )}

          {/* Optional: Direct Image URL entry (only when slots available) */}
          {existingImages.length + queuedFiles.length < MAX_IMAGES && (
            <div>
              <label
                htmlFor="direct-image-url"
                style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem' }}
              >
                Or add image by URL:
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  id="direct-image-url"
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={directImageUrl}
                  onChange={(e) => setDirectImageUrl(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddDirectImageUrl}
                  style={{
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '0.45rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#334155',
                  }}
                >
                  + Add URL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Repeatable Specifications */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
                3. Specifications &amp; Craft Details
              </h2>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                Repeatable key-value pairs shown on the product details sheet (e.g. Material, Dimensions, Origin).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSpec}
              style={{
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '0.35rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.775rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              + Add Row
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {specs.map((spec, index) => (
              <div key={spec.id || index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Key (e.g. Material)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                  style={{
                    width: '35%',
                    padding: '0.45rem 0.7rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. Pure Brass, 12cm height)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.45rem 0.7rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(index)}
                  title="Remove spec"
                  aria-label={`Remove specification ${spec.key || index + 1}`}
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    borderRadius: '6px',
                    minWidth: '40px',
                    minHeight: '40px',
                    padding: '0.5rem',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Catalog Visibility & Toggles */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.04)',
          }}
        >
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
            4. Catalog Visibility &amp; Settings
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Availability Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <label
                  htmlFor="toggle-available"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}
                >
                  In Stock &amp; Available
                </label>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                  When disabled, customers will see this item marked as Sold Out.
                </p>
              </div>
              <input
                id="toggle-available"
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />

            {/* Featured Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <label
                  htmlFor="toggle-featured"
                  style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}
                >
                  Featured on Homepage
                </label>
                <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                  Highlights this creation on the storefront's curated hero carousel or featured collection.
                </p>
              </div>
              <input
                id="toggle-featured"
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: 0 }} />

            {/* Personalizable Toggle & Note */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <label
                    htmlFor="toggle-personalizable"
                    style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a', cursor: 'pointer' }}
                  >
                    Allow Custom Personalization
                  </label>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                    Enables name engravings, monogramming, or custom gift notes.
                  </p>
                </div>
                <input
                  id="toggle-personalizable"
                  type="checkbox"
                  checked={personalizable}
                  onChange={(e) => setPersonalizable(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
              </div>

              {personalizable && (
                <div style={{ marginTop: '0.75rem', paddingLeft: '0.5rem', borderLeft: '3px solid #cbd5e1' }}>
                  <label
                    htmlFor="personalization-note"
                    style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}
                  >
                    Personalization Note / Instructions for Buyer
                  </label>
                  <input
                    id="personalization-note"
                    type="text"
                    value={personalizationNote}
                    onChange={(e) => setPersonalizationNote(e.target.value)}
                    placeholder="e.g. Free laser engraving: enter up to 15 characters upon WhatsApp order."
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Submission Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '1rem 0',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/products')}
            disabled={submitting}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '0.6rem 1.2rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#475569',
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            }}
          >
            {submitting ? (
              <>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#ffffff',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }}
                ></span>
                <span>Saving Product...</span>
              </>
            ) : (
              <span>{isEdit ? 'Save Changes' : 'Create Product'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
