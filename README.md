🔔 Real-Time Notification System
A MERN stack app for sending role-based, real-time notifications to remote teams using Socket.IO, JWT, and Tailwind CSS.

🚀 Features
👥 Manager/User roles

⚡ Real-time notifications (Socket.IO)

📨 Email simulation for offline users (high priority)

⏳ Auto-expiry for normal notifications

🔐 JWT Auth with protected routes

📱 Mobile-responsive UI with dark mode

🛠 Tech Stack
Frontend: React, Vite, Tailwind CSS, Socket.IO Client

Backend: Node.js, Express, MongoDB, JWT, Socket.IO

📦 Installation
1. Clone Repo
bash
Copy
Edit
git clone https://github.com/your-username/notification-system.git
cd notification-system
2. Setup Backend
bash
Copy
Edit
cd server
npm install
Create .env in /server:

ini
Copy
Edit
PORT=5000  
MONGODB_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
EMAIL_USER=ABCD  
EMAIL_PASS=ADMIN  
Start backend:

bash
Copy
Edit
npm run dev
3. Setup Frontend
bash
Copy
Edit
cd client
npm install
Create .env in /client:

bash
Copy
Edit
VITE_API_BASE_URL=http://localhost:5000/api  
Start frontend:

bash
Copy
Edit
npm run dev
🌐 Run URLs
Frontend: http://localhost:5173

Backend: http://localhost:5000

⚡ Socket.IO Events
send_notification

receive_notification

user_online / user_offline

🧠 Notes
MongoDB must be running locally or via Atlas.
Manager can send high/normal notifications.
Email logs shown in terminal for high-priority (offline) users.

🔄 App Flow (First-Time Setup)
➡️ When you first run the code, no users exist.

✔️ First, create a Manager using the signup form or API.
✔️ Then create one or more Users the same way (just choose role as User).
✔️ Open two tabs: one as Manager, one as User.

📤 Manager can send notifications:

If the User is online, they get it instantly.

If the User is offline and it's high priority, a simulated email will be shown in the server console.

💡 You can create more Managers if needed — not limited to one.

