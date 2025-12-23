# Rowaad Project Hub

## Overview
A React-based project management and automation hub built with Vite and TypeScript. The application provides various modules for team management, task tracking, AI assistance, and system administration.

## Project Structure
- `/components/` - React components for each module (Dashboard, Login, AI Assistant, etc.)
- `/services/` - Service modules (Gemini AI integration)
- `App.tsx` - Main application component with routing
- `index.tsx` - Application entry point
- `vite.config.ts` - Vite configuration

## Tech Stack
- React 19
- Vite 6
- TypeScript
- Tailwind CSS (via CDN)
- Lucide React (icons)
- React Router DOM 7
- Google Gemini AI integration

## Development
- **Port**: 5000
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`

## Environment Variables
- `GEMINI_API_KEY` - Google Gemini API key for AI features

## Recent Changes
- 2025-12-23: Initial import and Replit environment setup
  - Configured Vite to use port 5000
  - Added allowedHosts for Replit proxy support
  - Added proper script entry point in index.html
  - Configured static deployment
