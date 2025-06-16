# ClerkSmart - Medical History Assistant

A fast, mobile-first medical assistant app that helps medical students and junior doctors take complete, system-specific histories from patients. Simply enter a diagnosis and get a structured breakdown of all relevant questions to ask.

## Features

- 🔍 **Instant History Templates**: Type in any diagnosis and get comprehensive question lists
- 🏥 **Specialty-Specific**: Automatically infers clinical specialty and adapts questions accordingly
- 📋 **Structured Format**: Organized by standard medical history sections (HPC, PMH, Drug History, etc.)
- 📱 **Mobile-First**: Optimized for use during clinical rounds
- ⚡ **Lightning Fast**: Cached results for instant access to common conditions
- 📋 **Easy Copy**: One-click copying of sections or entire templates
- 🔒 **Offline Support**: Recent searches available without internet

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI**: shadcn/ui components with Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd clerksmart
npm install
\`\`\`

### 2. Environment Setup

Copy the environment template:

\`\`\`bash
cp env.example .env.local
\`\`\`

Fill in your environment variables in \`.env.local\`:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_PROJECT_ID=your_supabase_project_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3. Database Setup

1. Create a new Supabase project
2. Run the schema file in your Supabase SQL editor:

\`\`\`bash
# Copy the contents of supabase/schema.sql and paste into Supabase SQL editor
\`\`\`

3. Generate TypeScript types (optional):

\`\`\`bash
npm run db:generate
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   └── generate-template/ # Template generation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/            # React components
│   ├── history/          # History display components
│   ├── search/           # Search interface components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── openai.ts        # OpenAI integration
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # Helper functions
└── types/               # TypeScript type definitions
    ├── index.ts         # Main types
    └── supabase.ts      # Database types
\`\`\`

## Usage

1. **Search for Diagnosis**: Enter any medical condition in the search bar
2. **View Results**: Get a comprehensive history template organized by sections
3. **Copy Questions**: Click on any section to copy questions to clipboard
4. **Copy All**: Use "Copy All" to get the complete template
5. **Go Back**: Return to search for another condition

### Example Searches

- "Acute appendicitis"
- "Myocardial infarction"
- "Pneumonia"
- "Heart failure"
- "Diabetes mellitus"

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

\`\`\`bash
npm run build
npm start
\`\`\`

## Configuration

### OpenAI Settings

The app uses GPT-4 with optimized prompts for medical accuracy. You can modify the system prompt in \`src/lib/openai.ts\`.

### Database Schema

The app uses two main tables:
- \`diagnoses\`: Store common medical conditions
- \`history_templates\`: Cache generated templates for faster access

### Caching Strategy

- Templates are automatically cached after first generation
- Cache is checked before making new OpenAI requests
- Popular templates are served instantly from cache

## Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## Development

### Available Scripts

- \`npm run dev\`: Start development server
- \`npm run build\`: Build for production
- \`npm run start\`: Start production server
- \`npm run lint\`: Run ESLint
- \`npm run type-check\`: Check TypeScript types
- \`npm run db:generate\`: Generate Supabase types

### Code Style

- TypeScript for type safety
- ESLint + Prettier for code formatting
- Tailwind CSS for styling
- shadcn/ui for components

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This app is designed to assist medical education and should not be used as a substitute for clinical judgment. Always verify information independently and adapt questions based on patient presentation and clinical context.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for medical students and junior doctors** 