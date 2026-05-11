const { ActivityLog } = require("../models");

const logActivity = async ({ userId, action, entity, details }) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      entity,
      details,
    });
  } catch (error) {
    console.error("Activity log error:", error.message);
  }
};

module.exports = logActivity;