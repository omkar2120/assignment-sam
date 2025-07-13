import User from '../models/User.js';
import bcrypt from "bcryptjs";

const createDefaultAdmin = async () => {
  const existing = await User.findOne({ email: 'admin@system.com' });
  if (!existing) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Default Manager',
      email: 'admin@system.com',
      password: hashedPassword,
      role: 'Manager',
      isOnline: false
    });
    console.log('✅ Default Manager created: admin@system.com / admin123');
  } else {
    console.log('ℹ️ Default Manager already exists');
  }
};

export default createDefaultAdmin;
