const adminOnly = (req, res, next) => {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    next();
  };
  //i already write this so this need to avoid