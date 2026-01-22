# Year Calendar Mockup

A beautiful year-in-pixels calendar application built with Next.js, displaying your progress through the year on an iPad 11" mockup.

## Features

- 📅 Visual year-in-pixels calendar
- 📊 Progress tracking with percentage and days remaining
- 🎨 iPad 11" mockup display
- 📱 Responsive design
- 🔗 Shareable URLs for GitHub Pages deployment

## Setup

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a `.env.local` file and configure your GitHub Pages URL:
   ```bash
   NEXT_PUBLIC_BASE_URL=https://your-username.github.io/year-calendar-mockup
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### GitHub Pages Deployment

1. Update `.env.local` with your GitHub Pages URL:
   ```
   NEXT_PUBLIC_BASE_URL=https://your-username.github.io/year-calendar-mockup
   ```

2. Build the project:
   ```bash
   pnpm build
   ```

3. The output can be deployed to GitHub Pages using GitHub Actions or manually

## Project Structure

- `/app` - Next.js app directory with pages
- `/components` - React components (YearCalendar, UI components)
- `/lib` - Utility functions
- `/styles` - Global styles

## Environment Variables

- `NEXT_PUBLIC_BASE_URL` - The base URL for your deployment (required for GitHub Pages URLs to work correctly)

## Technologies

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Lucide Icons

## License

MIT
