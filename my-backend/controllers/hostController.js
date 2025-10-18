export const getHostDashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.fullName}! You can manage your meetings.` });
};
