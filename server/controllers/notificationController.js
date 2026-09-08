const Notification = require('../models/Notification');
const notificationService = require('../services/notificationService');

/**
 * @desc    Get current user's notifications and unread count
 * @route   GET /api/notifications
 * @access  Private
 */
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    // If student, run check for due soon & overdue alerts in background
    if (req.user.role === 'student') {
      notificationService.checkAndNotifyDueSoonAndOverdue(userId).catch(() => {});
    }

    const { unreadOnly, limit = 50 } = req.query;
    const query = { userId };

    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const [notifications, unreadCount, totalCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10))
        .lean(),
      Notification.countDocuments({ userId, isRead: false }),
      Notification.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      unreadCount,
      totalCount,
      data: notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving notifications',
      error: error.message,
    });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or unauthorized',
      });
    }

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
      unreadCount,
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating notification',
      error: error.message,
    });
  }
};

/**
 * @desc    Mark all user's notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      unreadCount: 0,
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error marking all notifications as read',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await Notification.findOneAndDelete({ _id: id, userId });
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or unauthorized',
      });
    }

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    return res.status(200).json({
      success: true,
      message: 'Notification deleted',
      unreadCount,
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting notification',
      error: error.message,
    });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
};
