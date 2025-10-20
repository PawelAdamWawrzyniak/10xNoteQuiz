# 10xNoteQuiz - AI-Powered Quiz Generator from Your Notes

[![Project Status: In Development](https://img.shields.io/badge/status-in%20development-yellowgreen.svg)](https://github.com/PawelAdamWawrzyniak/10xdevs-project)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 1. Project Description

**10xNoteQuiz** is a web application designed to enhance the learning process for students and lifelong learners. It empowers users to create notes in Markdown and then leverages Artificial Intelligence to automatically generate personalized quizzes from them. The application integrates a Spaced Repetition System (SRS) to optimize memory retention, making studying more efficient and effective.

The core problem this project solves is the time-consuming nature of creating self-assessment materials. By automating quiz generation, 10xNoteQuiz saves valuable time, allowing users to focus on what matters most: learning.

## 2. Table of Contents
- [Project Description](#1-project-description)
- [Tech Stack](#3-tech-stack)
- [Getting Started Locally](#4-getting-started-locally)
- [Available Scripts](#5-available-scripts)
- [Project Scope](#6-project-scope)
- [Project Status](#7-project-status)
- [License](#8-license)

## 3. Tech Stack

The project is built with a modern, robust, and scalable tech stack:

-   **Frontend**:
    -   [Astro 5](https://astro.build/): For building fast, content-focused websites.
    -   [React 19](https://react.dev/): For creating interactive UI components.
    -   [TypeScript 5](https://www.typescriptlang.org/): For static type-checking and improved developer experience.
    -   [Tailwind CSS 4](https://tailwindcss.com/): A utility-first CSS framework for rapid styling.
    -   [Shadcn/ui](https://ui.shadcn.com/): A collection of accessible and reusable React components.

-   **Backend**:
    -   [Supabase](https://supabase.io/): An open-source Firebase alternative providing a PostgreSQL database, authentication, and a Backend-as-a-Service SDK.

-   **Artificial Intelligence**:
    -   [Openrouter.ai](https://openrouter.ai/): A service that provides access to a wide range of AI models (from OpenAI, Anthropic, Google, etc.) for high-efficiency and low-cost quiz generation.

-   **CI/CD & Hosting**:
    -   [GitHub Actions](https://github.com/features/actions): For continuous integration and deployment pipelines.
    -   [DigitalOcean](https://www.digitalocean.com/): For hosting the application via a Docker image.

## 4. Getting Started Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (comes with Node.js)
-   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PawelAdamWawrzyniak/10xdevs-project.git
    cd 10xdevs-project
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    You will need to populate this file with your credentials for Supabase and Openrouter.ai:
    
    - `SUPABASE_URL`: Your Supabase project URL
    - `SUPABASE_KEY`: Your Supabase anon/public key
    - `OPENROUTER_API_KEY`: Your OpenRouter API key (get it from [openrouter.ai](https://openrouter.ai/keys))

4.  **Set up Supabase:**
    -   Create a new project on [Supabase](https://supabase.io/).
    -   Use the Supabase SQL editor or CLI to set up the necessary database schema.
    -   Find your project's API URL and `anon` key in the "API" settings and add them to your `.env` file.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running at `http://localhost:4321`.

## 5. Available Scripts

This project includes the following scripts defined in `package.json`:

-   `npm run dev`: Starts the development server with hot-reloading.
-   `npm run build`: Builds the application for production.
-   `npm run preview`: Starts a local server to preview the production build.
-   `npm run lint`: Lints the codebase using ESLint to find and report issues.
-   `npm run lint:fix`: Lints the codebase and automatically fixes fixable issues.
-   `npm run format`: Formats the code using Prettier.

## 6. Project Scope

### Core Features (MVP)

The initial version of the application will include the following features:

-   **User Authentication**: Secure account creation and login via email and password.
-   **API Key Management**: Users can add and manage their own encrypted AI model API keys.
-   **Note Management**: Full CRUD (Create, Read, Update, Delete) functionality for notes in Markdown format.
-   **Note Organization**: Ability to categorize notes with tags and categories.
-   **AI-Powered Quiz Generation**: Generate quizzes from any note, consisting of True/False, multiple-choice, and short-answer questions.
-   **Quiz Management**: Users can accept, reject (and regenerate), or delete quizzes.
-   **Interactive Quiz Solving**: A user-friendly interface for taking quizzes.
-   **Progress Tracking**: View quiz results, aggregated statistics, and progress charts.
-   **Spaced Repetition System (SRS)**: An algorithm that schedules review sessions based on quiz performance to enhance long-term memory.

### Future Features (Post-MVP)

-   Automatic AI-powered summaries of notes.
-   Ability to edit individual questions within a quiz.
-   Advanced quiz generation options (e.g., number of questions, difficulty level).
-   Password recovery functionality.
-   Syntax highlighting for code snippets within notes.

## 7. Project Status

**Current Phase: In Development**

The project is currently focused on building the Minimum Viable Product (MVP). The primary goal is to implement all the core functionalities listed in the "Project Scope" section to provide a stable and useful tool for learners.

## 8. License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE.md) file for more details.
