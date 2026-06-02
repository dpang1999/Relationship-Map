# Relationship Map App

A Next.js application that helps you map out your personal relationships. This tool allows you to create profiles for people you meet, add important facts or notes about them, and visually connect them in an interactive relationship graph.

## Tech Stack
- **Frontend/Backend:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database:** SQLite (local file)
- **Database ORM:** Prisma
- **Visuals:** React Force Graph 2D & Lucide React

## Getting Started

### 1. Install Dependencies
First, install all required packages:
```bash
npm install
```

### 2. Set Up the Database
This app uses a local SQLite database (`dev.db`). To initialize the database and create the schema, run the Prisma migration:
```bash
npx prisma migrate dev
```
*(Optional) If you face issues or the Prisma client needs regenerating, you can run `npx prisma generate`.*

### 3. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to use the app.

## Features
- **Interactive Graph:** See a live, floating network map of how everyone you know is connected.
- **Profiles:** Click on any node in the graph to view that person's specific notes and manage their connections.
- **Add/Edit/Delete:** Full control over modifying people and safely removing connections.

## Note on Privacy
Your data is stored entirely locally in `dev.db`. This file has been added to `.gitignore` so your personal relationships are not accidentally pushed to your remote repository. Do not commit or share this file to keep your data private!
