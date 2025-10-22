export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;
    const meeting = await Meeting.findById(id);
    if (!meeting) return res.status(404).json({ message: "Meeting not found" });
    res.json({ url: meeting.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
