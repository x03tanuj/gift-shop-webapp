/**
 * Health check controller
 * @route GET /api/health
 */
export const getHealth = (req, res) => {
  res.status(200).json({ status: 'ok' });
};
