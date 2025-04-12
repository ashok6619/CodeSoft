# Taskify - Smart To-Do List App

Taskify is a simple yet powerful to-do list web application designed to help users stay organized, productive, and on top of their daily tasks. Built with HTML, CSS, and JavaScript, Taskify supports onboarding, personalized greetings, task management, and now features task notifications.

## ✨ Features

- 🚀 Onboarding slides to introduce the app's capabilities
- 👤 Personalized welcome screen with user name input
- 📝 Task creation with title
- ✅ Mark tasks as completed
- ❌ Delete tasks
- 📊 Real-time pending task count
- 🔎 Task search interface
- 🔔 **New Feature:** Browser notifications when a task is added
- 💾 Persistent storage using `localStorage`

## 🔧 How It Works

1. **Onboarding**: Users are guided through a 3-step onboarding.
2. **Name Input**: Users input their name for a personalized experience.
3. **Main App**:
   - View all tasks
   - Add new tasks
   - Mark tasks as complete/incomplete
   - Delete tasks
   - See a count of pending tasks
   - Notifications are shown using the browser's notification system when a task is added.

## 🛠 Installation & Usage

1. Clone the repository or download the ZIP file:
   ```bash
   git clone https://github.com/ashok6619/CodeSoft.git
   ```

2. Open `index.html` in your browser.

> **Note:** Make sure you allow notifications in your browser for the notification feature to work.

## 📁 Project Structure

```
Taskify/
├── index.html        # Main HTML file
├── styles.css        # App styling
└── script.js         # JavaScript logic and app functionality
```

## 🧠 Notification Feature Details

The notification system uses the [Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API). When a user adds a task:

- The app checks for notification permissions.
- If not granted, it requests permission.
- Once permission is granted, it triggers a notification with the task title.

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

---
Happy Tasking with Taskify! ✅
