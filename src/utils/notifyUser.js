const Notification = require('../models/Notification');

const notifyUser = async (userId, message) => {
  await Notification.create({
    user: userId,
    message
  });
};

module.exports = notifyUser;
