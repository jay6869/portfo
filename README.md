# Janith Godage - Cybersecurity Portfolio

A modern, interactive portfolio website built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui. Features a 3D Spline scene with spotlight effects for an engaging user experience.

## Features

- **Hero Section** - Stunning dark-themed hero with 3D Spline scene and spotlight effect
- **About Section** - Detailed information about skills and expertise organized by categories
- **Projects Section** - Showcase of penetration testing and security assessment projects
- **Contact Section** - Contact form and social media links
- **Responsive Design** - Mobile-first design that works on all devices
- **Dark/Light Mode Ready** - Tailwind CSS dark mode support
- **Interactive Components** - Smooth animations and hover effects

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **3D Graphics**: Spline (@splinetool/react-spline)
- **Animations**: Framer Motion

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm installed

### Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**
   ```bash
   npm run build
   npm run start
   ```

## Project Structure

```
components/
├── ui/                    # shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── spotlight.tsx
│   └── splite.tsx        # Spline 3D component
└── sections/             # Portfolio sections
    ├── hero.tsx
    ├── about.tsx
    ├── projects.tsx
    └── contact.tsx
```

## Customization

### Hero Section
Edit `components/sections/hero.tsx` to customize:
- Spline 3D scene URL
- Button actions and text
- Tagline and description

### About Section
Edit `components/sections/about.tsx` to:
- Update your skills and expertise
- Modify section descriptions
- Add/remove skill categories

### Projects Section
Edit `components/sections/projects.tsx` to:
- Add new security assessment projects
- Update project details and findings
- Customize severity indicators

### Contact Section
Edit `components/sections/contact.tsx` to:
- Update contact email and social links
- Implement form submission backend
- Customize form fields

## Spline 3D Scene

To customize the 3D scene:
1. Visit [spline.design](https://spline.design)
2. Create your own 3D scene
3. Replace the URL in `components/sections/hero.tsx`

## Deployment

### Vercel (Recommended)
```bash
vercel
```

### Other Platforms
- **Netlify**: Connect GitHub repo
- **Railway**, **Render**: Follow their Next.js guides

## Support

- [Next.js Documentation](https://nextjs.org)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Spline Documentation](https://docs.spline.design)

Built for cybersecurity professionals.
