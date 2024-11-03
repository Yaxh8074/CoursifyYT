# CourseifyYT - YouTube Course Tracker

CourseifyYT is a modern web application that transforms YouTube playlists into structured online courses. Built with React, TypeScript, and Tailwind CSS, it offers a seamless learning experience by organizing educational content from YouTube in a course-like format.
![Screenshot (4261)](https://github.com/user-attachments/assets/0d3315ca-7843-4c0c-8a54-5c78dc7774f5)


## Features

- **Multiple Course Management**
  - Add multiple YouTube playlists as courses
  - Track progress across different courses
  - Easy navigation between courses
  - Delete courses you've completed

- **Smart Progress Tracking**
  - Automatic video completion tracking
  - Manual toggle for completed videos
  - Visual progress bars for each course
  - Persistent progress saving

- **Enhanced Video Player**
  - Integrated YouTube player
  - Auto-marks videos as complete when finished
  - Remembers your last watched position

- **Modern UI/UX**
  - Clean, intuitive interface
  - Responsive design for all devices
  - Dark/Light mode support
  - Collapsible sidebar for better focus

- **Search & Organization**
  - Search within course videos
  - Organized video listing
  - Video duration display
  - Clear course structure
![Screenshot (4265)](https://github.com/user-attachments/assets/b61edf86-65d9-4d0b-baee-95faa7a9cbfc)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Yaxh8074/CoursifyYT
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Adding a Course**
   - Click "Add Course" on the main dashboard
   - Paste a YouTube playlist URL
   - Wait for the course to load

2. **Watching Videos**
   - Select a course from your dashboard
   - Click on any video to start watching
   - Videos are automatically marked as complete when finished
   - Manually toggle completion status with the checkbox

3. **Managing Progress**
   - Track your progress with the progress bar
   - Use the sidebar to navigate between videos
   - Search videos within a course
   - Return to the dashboard using "My Courses"

4. **Customization**
   - Toggle dark/light mode
   - Collapse sidebar for focused viewing
   - Organize multiple courses

## Technical Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Local Storage
- **Video Integration**: YouTube IFrame API
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/         # React components
│   ├── CourseList.tsx # Course dashboard
│   ├── Header.tsx     # App header
│   ├── Sidebar.tsx    # Video navigation
│   ├── VideoPlayer.tsx# YouTube player
│   └── ...
├── hooks/             # Custom React hooks
├── services/          # API services
├── types/             # TypeScript definitions
└── App.tsx           # Main application
```

## Local Storage

The application uses local storage to persist:
- Course progress
- Completed videos
- Dark mode preference
- Active course selection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
