# 🎓 Grade Genius

> **A smart, responsive examination system designed for both Examiners and Candidates.**

Grade Genius is a modern web application built to streamline the process of creating, managing, and taking examinations. It offers a comprehensive suite of tools for educators to build structured exams and a seamless, distraction-free environment for students to complete them.

---

## ✨ Key Features

- **📝 Full-page Exam Builder**  
  An intuitive interface for examiners to create complex exams with custom sections, varying question types (MCQ, numerical, subjective), and dynamic scoring.
  
- **📊 Responsive Dashboard for Examiners**  
  A centralized management hub to oversee examination halls, analyze student performance, and grade subjective submissions.

- **🧑‍🎓 Candidate Portal & Exam Interface**  
  A dedicated portal for students to join halls, track their classwork progress, and take active exams in a focused testing environment.

- **🔐 Role-Based Authentication**  
  A unified login and registration system for both candidates and examiners, utilizing persistent sessions to keep users logged in across page reloads.

- **📱 Fully Mobile Responsive**  
  Carefully crafted CSS grids and flexbox layouts ensure the application looks and functions perfectly on desktops, tablets, and smartphones.

---

## 🛠️ Tech Stack

This project is built using modern, industry-standard web technologies:

- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) *(if applicable)*

---

## 🚀 Installation & Setup

Follow these steps to get the project running on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ramshawork/Grade-genius-frontend.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd grade-genius-saas
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**  
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Folder Structure

Here is a brief overview of the core project structure:

```text
📦 grade-genius-saas
 ┣ 📂 app/              # Next.js App Router (Pages, Layouts, API routes)
 ┃ ┣ 📂 candidate-portal/ # Routes specific to the student experience
 ┃ ┗ 📂 examiner-dashboard/ # Routes specific to the teacher/admin experience
 ┣ 📂 components/       # Reusable React components (UI elements, Navbars)
 ┃ ┗ 📂 ui/             # Shadcn UI primitive components
 ┣ 📂 hooks/            # Custom React hooks (e.g., use-toast, use-mobile)
 ┣ 📂 lib/              # Utility functions and mock data (dummy-data.ts)
 ┗ 📜 tailwind.config.ts # Tailwind CSS configuration
```

---

*Designed and developed for seamless digital education.*
