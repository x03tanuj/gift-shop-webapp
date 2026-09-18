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
