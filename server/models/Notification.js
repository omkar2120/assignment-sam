import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['normal', 'high'],
      default: 'normal',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

notificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 172800,
    partialFilterExpression: { priority: 'normal' },
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
