import Tab from "../models/Tab.js";

// Log or update tab time
export const logTabActivity = async (req, res) => {
  try {
    const { userId, domain, timeSpent } = req.body;
    if (!userId || !domain || !timeSpent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Tab.findOne({ userId, domain });
    if (existing) {
      existing.totalTime += timeSpent;
      existing.lastVisited = new Date();
      await existing.save();
      return res.json(existing);
    }

    const newTab = await Tab.create({ userId, domain, totalTime: timeSpent });
    res.status(201).json(newTab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all tab stats for a user
export const getTabStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const tabs = await Tab.find({ userId }).sort({ totalTime: -1 });
    res.json(tabs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
