# Simple Kanban
<a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" height="24" /></a>
<a href="https://pnpm.io/"><img src="https://img.shields.io/badge/Package-PNPM-orange?style=flat-square" height="24" /></a>
<img src="https://img.shields.io/badge/Module-ECMAScript-yellow?style=flat-square" height="24" />

Simple Kanban board for project management

![image](https://github.com/user-attachments/assets/03834fee-1fdf-48b0-82fc-bd809fb06044)

## Features
- Create, update, and delete backlogs
- Drag and drop tasks between columns (To-Do, In Progress, In Review, Done)
- Responsive design for use on both desktop and mobile devices

## Stack Used
- [SvelteKit](https://svelte.dev/)
- [Tailwind](https://tailwindcss.com/)
- [Skeleton UI](https://www.skeleton.dev/)
- [MongoDB](https://www.mongodb.com/)

## Local Preview
1. Clone this repository to your local computer
2. Copy the default environment file and ensure all variables are correctly filled
   ```sh
   cp .env.example .env
   ```
3. Install all required dependencies
   ```sh
   pnpm i
   ```
4. Run the application in development mode
   ```sh
   pnpm run dev
   ```

## Deployment
1. Clone this repository to the development server
2. Copy the default environment file and ensure all variables are correctly filled
   ```sh
   cp .env.example .env
   ```
3. Install all required dependencies
   ```sh
   pnpm i
   ```
4. Optimize the application for production
   ```sh
   pnpm run build
   ```
5. Serve the application using PM2
   ```sh
   pm2 start ecosystem.config.cjs
   ```
