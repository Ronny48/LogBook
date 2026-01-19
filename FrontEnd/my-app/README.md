# Frontend: Visitor Tracking System

## Overview

React (Vite) frontend for the Visitor & Package Tracking System. Implements dashboards, authentication, visit management, and office-specific views.

## Features

- Login and role-based dashboards (admin, receptionist, staff)
- Create, view, and manage visits
- Office-specific stats and visit history
- Responsive UI with modern design

## Project Structure

```
my-app/
	package.json
	README.md
	src/
		App.jsx
		pages/
			Dashboard.jsx
			Dashboard_Office.jsx
			LogIn.jsx
			Unauthorized.jsx
		components/
			AddVisit.jsx
			AllVisits.jsx
			Cards.jsx
			CurrentUser.jsx
			Navbar.jsx
			OfficeBtn.jsx
			OfficeRoute.jsx
			OfficeVisit.jsx
			ProtectedRoutes.jsx
			ReceptionBtn.jsx
			Search.jsx
		assets/
			logo.png
			plus.png
			users.png
	public/
	vite.config.js
```

## Getting Started

1. Prerequisites
   - Node.js 18+
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the frontend
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173` in your browser.

## How It Works

- Users log in and are routed to their dashboard based on role.
- Receptionists/admins can create visits and assign destinations.
- Staff can view and receive visits assigned to their office.
- Stats and visit history are displayed in real time.

## Configuration

- API base URL: `http://localhost:3000` (update in code if backend port changes)

## Deployment (Render)

1. Connect your GitHub repository to Render
2. Choose **Static Site** option
3. Set **Build Command**: `npm install && npm run build`
4. Set **Publish Directory**: `dist`
5. Render will automatically build and serve your frontend on each deploy

## Troubleshooting

- Ensure backend is running at the expected port.
- Check browser console for errors.
- CORS errors: backend may not have CORS enabled for your frontend URL.

## Future Advancements

- Add search, edit, and delete for visits
- Add automated tests
- Improve UI/UX and accessibility
