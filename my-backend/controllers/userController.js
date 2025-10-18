export const getUserBookings = (req, res) => {
  res.json({ message: `Welcome ${req.user.fullName}! You can view your bookings.` });
};
