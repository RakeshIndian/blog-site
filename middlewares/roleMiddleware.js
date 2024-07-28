const roleMiddleware = (req, res, next) => {
  const roles = ["Admin", "Editor", "Viewer"];
  if (!roles.includes(req.user.role)) {
    res
      .status(httpStatus.UNAUTHORIZED)
      .json({ message: "Assigned role does not have this permission" });
  }
  next();
};
