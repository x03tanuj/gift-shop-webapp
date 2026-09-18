import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminApi } from '../services/adminApi.js';

/**
 * Shared Add / Edit Category Form
 * Manages category name, description, and image upload/preview/removal.
 */
export default function CategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [directImageUrl, setDirectImageUrl] = useState('');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Status & Feedback State
  const [loadingCategory, setLoadingCategory] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDirectly, setUploadingDirectly] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);

  // Load category details if in Edit mode
  useEffect(() => {
    if (!isEdit) return;

    async function loadCategory() {
      try {
        setLoadingCategory(true);
        setServerError(null);
        const data = await adminApi.getCategoryById(id);
        const cat = data.category;

        setName(cat.name || '');
        setDescription(cat.description || '');
        setCurrentImage(cat.image || '');
      } catch (err) {
        console.error('Failed to load category for editing:', err);
        setServerError(err.message || 'Unable to retrieve category details.');
      } finally {
        setLoadingCategory(false);
      }
    }

    loadCategory();
  }, [id, isEdit]);

  // Clean up blob URL
  useEffect(() => {
    return () => {
      if (filePreview && filePreview.startsWith('blob:')) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // File Picker Handling
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image size must be less than 5MB.' }));
      return;
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Only image files (JPG, PNG, WebP, GIF) are allowed.' }));
      return;
    }

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.image;
      return updated;
    });

    setSelectedFile(file);
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    if (filePreview && filePreview.startsWith('blob:')) {
      URL.revokeObjectURL(filePreview);
    }
    setFilePreview(null);
  };

  const handleRemoveCurrentImage = () => {
    setCurrentImage('');
  };

  const handleApplyDirectImageUrl = () => {
    if (!directImageUrl.trim()) return;
    setCurrentImage(directImageUrl.trim());
    setDirectImageUrl('');
    handleClearSelectedFile();
  };

  // Instant image upload in edit mode
  const handleInstantUpload = async () => {
    if (!isEdit || !selectedFile) return;

    try {
      setUploadingDirectly(true);
      setServerError(null);
      const res = await adminApi.uploadCategoryImage(id, selectedFile);
      if (res.imageUrl) {
        setCurrentImage(res.imageUrl);
        handleClearSelectedFile();
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
      newErrors.name = 'Category name is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        image: currentImage.trim(),
      };

      let categoryId = id;

      if (isEdit) {
        await adminApi.updateCategory(id, payload);
      } else {
        const createRes = await adminApi.createCategory(payload);
        categoryId = createRes.category?.id || createRes.category?._id;
      }

      // If a file was selected, upload it to the category
      if (selectedFile && categoryId) {
        try {
          await adminApi.uploadCategoryImage(categoryId, selectedFile);
        } catch (uploadErr) {
          console.warn('Category saved, but image upload encountered an issue:', uploadErr);
        }
      }

      navigate('/categories', {
        state: {
          message: `Category '${payload.name}' was successfully ${isEdit ? 'updated' : 'created'}!`,
        },
      });
    } catch (err) {
      console.error('Category save error:', err);
      if (err.fields) {
        setErrors(err.fields);
      }
      setServerError(err.message || 'An error occurred while saving the category.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategory) {
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
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Loading category details...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '720px', margin: '0 auto' }}>
      {/* Header & Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <Link
            to="/categories"
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
            ← Back to Categories
          </Link>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: '#64748b' }}>
            {isEdit
              ? `Updating category: ${name || id}`
              : 'Create a new collection to categorize products on the storefront.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/categories')}
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

      {/* Category Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Details */}
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
            Category Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Category Name */}
            <div>
              <label
                htmlFor="category-name"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}
              >
                Category Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="e.g. Kashmiri Handicrafts"
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

            {/* Description */}
            <div>
              <label
                htmlFor="category-description"
                style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}
              >
                Description <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
              </label>
              <textarea
                id="category-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of items in this category for collection headings..."
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Category Cover Image */}
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
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>
              Cover Image
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Displayed on Home Category Grid (Max 5MB)
            </span>
          </div>

          {/* Current Saved Image Preview */}
          {currentImage && (
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={currentImage}
                alt="Current category cover"
                style={{
                  width: '90px',
                  height: '90px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/90?text=Broken+Link';
                }}
              />
              <div>
                <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a' }}>
                  Current Cover Image
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all', maxWidth: '380px' }}>
                  {currentImage}
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCurrentImage}
                  aria-label="Remove category cover image"
                  style={{
                    marginTop: '0.5rem',
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    padding: '0.45rem 0.8rem',
                    minHeight: '38px',
                    minWidth: '44px',
                    borderRadius: '6px',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}

          {/* Upload New Image Picker */}
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
            {filePreview ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <img
                  src={filePreview}
                  alt="Upload preview"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
                    {selectedFile?.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0.5rem 0' }}>
                    {(selectedFile?.size / 1024).toFixed(1)} KB — Ready to upload
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isEdit && (
                      <button
                        type="button"
                        disabled={uploadingDirectly}
                        onClick={handleInstantUpload}
                        style={{
                          background: '#0f172a',
                          color: '#fff',
                          border: 'none',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {uploadingDirectly ? 'Uploading...' : '⚡ Upload Now'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleClearSelectedFile}
                      style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        padding: '0.3rem 0.65rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel / Choose Other
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <input
                  id="category-image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="category-image-file"
                  style={{
                    display: 'inline-block',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                  }}
                >
                  📷 Choose Image to Upload
                </label>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                  Select an image file (PNG, JPG, WebP) to upload as the category banner.
                </p>
              </div>
            )}

            {errors.image && (
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', color: '#ef4444' }}>{errors.image}</p>
            )}
          </div>

          {/* Direct URL Input */}
          <div>
            <label
              htmlFor="category-direct-url"
              style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '0.3rem' }}
            >
              Or set image URL directly:
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                id="category-direct-url"
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
                onClick={handleApplyDirectImageUrl}
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
                Set URL
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            padding: '0.5rem 0',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/categories')}
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
                <span>Saving Category...</span>
              </>
            ) : (
              <span>{isEdit ? 'Save Changes' : 'Create Category'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
