import Notification from '../models/Notification.js';
import User from '../models/User.js';
import sendEmail from '../utils/email.js';


export const createNotification = async (req, res) => {
    try {
      const { message, priority } = req.body;
  
      const notification = await Notification.create({
        message: message,
        priority: priority,
      });
      req.io.emit("new_notification", notification);
  
      if (priority === "high") {
        const allUsers = await User.find({ role: "User" }); 
  
        for (const user of allUsers) {
          if (!req.onlineUsers.has(user._id.toString())) {
            console.log(`Email sent to offline user: ${user.email}`);
            sendEmail(user.email, message);
          }
        }
      }
  
      res.status(201).json(notification);
    } catch (err) {
      console.error("Error creating notification:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

export const getNotifications = async (req, res) => {
  try {
    const data = await Notification.find().sort({ createdAt: -1 }).limit(20);
    console.log(data)
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


  
