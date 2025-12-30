import BusinessInfo from "../model/BusinessInfo.js";

/**
 * GET – Public
 */
export const getBusinessInfo = async (req, res) => {
  try {
    const info = await BusinessInfo.findOne();
    // Return an empty object if null to avoid frontend errors
    res.json(info || {});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching business info", error: error.message });
  }
};

/**
 * PATCH – Admin only
 */
export const updateBusinessInfo = async (req, res) => {
  try {
    const updates = req.body;
    let info = await BusinessInfo.findOne();

    if (!info) {
      // Create new if it doesn't exist
      info = await BusinessInfo.create({
        ...updates,
        updatedBy: req.user.id,
      });
    } else {
      // Update existing
      Object.assign(info, updates);
      info.updatedBy = req.user.id;
      await info.save();
    }

    res.json({ message: "Business info updated successfully", info });
  } catch (error) {
    // 400 for validation errors, 500 for server issues
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: "Failed to update business info",
      error: error.message,
    });
  }
};
