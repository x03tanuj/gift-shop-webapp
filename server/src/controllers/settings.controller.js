import Settings from '../models/Settings.js';

/**
 * GET /api/settings
 * Returns singleton boutique and shop settings.
 */
export const getSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();
    return res.json({ settings });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/settings
 * Updates singleton boutique and shop settings.
 */
export const updateSettings = async (req, res, next) => {
  try {
    const settings = await Settings.getSettings();

    const allowedFields = [
      'storeName',
      'tagline',
      'phone',
      'whatsappNumber',
      'email',
      'address',
      'openingHours',
      'socialLinks',
      'googleMapsUrl',
      'mapEmbedUrl',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        settings[field] = req.body[field];
      }
    });

    await settings.save();

    return res.json({
      settings,
      message: 'Store settings updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
