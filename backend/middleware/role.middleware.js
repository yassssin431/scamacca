exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const normalizeRole = (role) => {
      const roleMap = {
        1: "Admin",
        2: "Manager",
        3: "Finance",
        "1": "Admin",
        "2": "Manager",
        "3": "Finance",
        Admin: "Admin",
        Manager: "Manager",
        Finance: "Finance",
      };

      return roleMap[role] || role;
    };

    const userRole = normalizeRole(
      req.user?.role ||
      req.user?.RoleId ||
      req.user?.roleId ||
      req.user?.roleName ||
      req.user?.RoleName
    );

    const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

    if (!userRole) {
      return res.status(403).json({ message: "Forbidden: role not found" });
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: insufficient role",
        userRole,
        allowedRoles: normalizedAllowedRoles,
      });
    }

    next();
  };
};