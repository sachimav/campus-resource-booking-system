exports.isAdmin = (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};