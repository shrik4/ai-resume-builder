# Contributing to AI Resume Builder

## Getting Started

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-builder.git
cd ai-resume-builder
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env.local` file:
```bash
OPENAI_API_KEY=your_api_key_here
```

5. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

## Development

1. Run the development server:
```bash
npm run dev
```

2. Make your changes
3. Test your changes
4. Commit your changes:
```bash
git add .
git commit -m "Description of changes"
```

5. Push to your fork:
```bash
git push origin feature/your-feature-name
```

6. Create a Pull Request

## Project Structure

```
ai-resume-builder/
├── app/              # Next.js app router
├── components/       # React components
├── lib/             # Utility functions
├── public/          # Static assets
└── styles/          # Global styles
```

## Key Components

- `resume-preview.tsx`: Resume preview and PDF export
- `personal-info-form.tsx`: Personal information form
- `experience-form.tsx`: Experience section form
- `projects-form.tsx`: Projects section form
- `skills-form.tsx`: Skills section form
- `ai-assistant.tsx`: AI-powered suggestions

## Pull Request Guidelines

1. Follow existing code style
2. Add comments for complex logic
3. Update documentation if needed
4. Test all changes thoroughly
5. Keep PRs focused and atomic

## Need Help?

Open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase
