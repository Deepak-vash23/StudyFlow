# StudyFlow 🎓

StudyFlow is a modern, productivity-focused task management and daily planning application designed for students and professionals. It combines task tracking, daily scheduling, and visual progress monitoring into a unified, beautiful interface featuring a "Glass & Gradient" aesthetic.

![StudyFlow Dashboard Mockup](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3)

## ✨ Features

-   **Dashboard Overview**: Get a bird's-eye view of your productivity with daily progress bars, pending task counts, and upcoming schedule slots.
-   **Task Management**: Create, edit, and organize tasks with categories (Study, Work, Personal), priority levels, and deadlines.
    -   *Glassmorphism Cards*: Beautiful translucent task cards.
    -   *Custom Filters*: Filter by category, importance, or status using custom glass dropdowns.
-   **Daily Planner**: Structure your day hour-by-hour. Link specific tasks to time slots to ensure you stay on track.
    -   *Time Blocking*: Visual daily timeline.
    -   *Past History*: Review past days (read-only) to see what you accomplished.
-   **Calendar View**: Visualize your consistency with a monthly contribution grid (GitHub-style) and daily completion status.
-   **Modern UI/UX**:
    -   **Grainient Background**: A dynamic, animated mesh gradient background.
    -   **Glassmorphism**: Frosted glass effects on sidebars, modals, and cards (`backdrop-blur-xl`).
    -   **Responsive Design**: Fully functional mobile experience with a custom collapsible sidebar.

## 🛠️ Tech Stack

### Frontend
-   **React**: UI Library
-   **Tailwind CSS**: Utility-first styling
-   **Framer Motion / OGL**: For smooth animations and the WebGL gradient background
-   **Lucide React**: Beautiful icons
-   **Date-fns**: Date manipulation

### Backend
-   **Node.js & Express**: RESTful API
-   **MongoDB**: NoSQL Database for storing users, tasks, and planner slots
-   **Mongoose**: ODM for MongoDB

## 🚀 Getting Started

### Prerequisites
-   Node.js (v14+)
-   MongoDB (Local or Atlas connection string)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Deepak-vash23/StudyFlow.git
    cd StudyFlow
    ```

2.  **Install Dependencies**
    *Frontend:*
    ```bash
    npm install
    ```
    *Backend:*
    ```bash
    cd server
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Run the Application**
    *Start Backend:*
    ```bash
    cd server
    npm start
    ```
    *Start Frontend:*
    ```bash
    # In the root directory
    npm run dev
    ```

## 📸 Screenshots

*Screenshots to be added*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
