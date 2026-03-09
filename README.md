<div align="center">
<img src="./static/favicon.svg" width="80"/>

# Simple Kanban

**Simple Kanban board for project management**

<a href="https://opensource.org/license/mit"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" height="24" /></a>
<a href="https://pnpm.io/"><img src="https://img.shields.io/badge/Package-PNPM-orange?style=flat-square" height="24" /></a>
<img src="https://img.shields.io/badge/Module-ECMAScript-yellow?style=flat-square" height="24" />
</div>

![Preview](https://github.com/user-attachments/assets/491c4d63-f15f-4a5b-ba6e-eb649eee09e0)

## Features
- Create, update, and delete backlogs
- Drag and drop tasks between columns (To-Do, In Progress, In Review, Done)
- Responsive design for use on both desktop and mobile devices

## Stack Used
- Monolithic [SvelteKit](https://svelte.dev/)
- [Tailwind](https://tailwindcss.com/) with [daisyUI](https://daisyui.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)

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
