export const getAdminDashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.fullName}! You can view all platform stats.` });
};
