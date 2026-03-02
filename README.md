# Sail Together

## Abstract

Sail Together is a web-based platform designed to facilitate community engagement within the sailing community. The application enables users to discover, create, and participate in sailing-related events, browse and apply for maritime job opportunities, and interact with fellow sailing enthusiasts through an integrated social feed. The platform incorporates interactive mapping functionality to visualize events and job postings geographically, providing users with spatial context for sailing activities and opportunities.

## Technology Stack

This project is built using the following technologies:

- **Frontend Framework**: React 19.1.1 with TypeScript 5.9.3
- **Build Tool**: Vite (rolldown-vite 7.1.14)
- **Backend**: Parse Server 8.4.0
- **Styling**: Tailwind CSS 4.1.15
- **Mapping**: Mapbox GL JS 3.16.0
- **State Management**: Zustand 5.0.8
- **Data Fetching**: SWR 2.3.6
- **Routing**: React Router DOM 7.9.4
- **UI Components**: Radix UI primitives

## Prerequisites

Before proceeding with the installation and execution of this project, examiners must ensure the following prerequisites are met:

1. **Node.js**: Version 18.0.0 or higher must be installed on the system. Node.js can be obtained from [nodejs.org](https://nodejs.org/).

2. **npm**: The Node Package Manager (npm) is typically included with Node.js installation. Verify installation by executing `npm --version` in the terminal.

3. **Parse Server**: A running instance of Parse Server must be accessible. This can be either:
   - A local Parse Server instance running on the examiner's machine
   - A remote Parse Server instance hosted elsewhere
   - A Parse Server instance provided by the project authors

4. **Mapbox Account**: A Mapbox account with an API access token is required for map functionality. Free accounts are available at [mapbox.com](https://www.mapbox.com/).

5. **Environment Variables**: The following environment variables must be configured (see Configuration section below).

## Installation Instructions

### Step 1: Clone the Repository

Navigate to the directory where you wish to install the project and clone the repository:

```bash
git clone <repository-url>
cd sail-together
```

### Step 2: Install Dependencies

Install all required project dependencies using npm:

```bash
npm install
```

This command will read the `package.json` file and install all dependencies listed in both `dependencies` and `devDependencies` sections. The installation process may take several minutes depending on network speed and system performance.

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory of the project. This file will contain the necessary environment variables for the application to connect to Parse Server and Mapbox services.

**Required Environment Variables:**

```env
# Parse Server Configuration
VITE_PARSE_APP_ID=your_parse_app_id
VITE_PARSE_JS_KEY=your_parse_javascript_key
VITE_PARSE_SERVER_URL=http://localhost:1337/parse
PARSE_MASTER_KEY=your_parse_master_key

# Mapbox Configuration
VITE_MAPBOX_API_KEY=your_mapbox_access_token
```

**Instructions for obtaining values:**

- **Parse Server Variables**: These values should be obtained from your Parse Server configuration. If using a local Parse Server, consult the Parse Server configuration file or dashboard. The `PARSE_MASTER_KEY` is used for server-side operations such as database migrations and should be kept secure.

- **Mapbox API Key**: Log in to your Mapbox account, navigate to the Account page, and create a new access token. The default public token can be used for development purposes.

**Important**: The `.env.local` file is excluded from version control for security reasons. Examiners must create this file manually with the appropriate values for their environment.

### Step 4: Database Migration

Initialize the database schema by running the migration script:

```bash
npm run migrate
```

This command executes `src/db/migrate.ts`, which creates the necessary database schemas in Parse Server. The script will output success or error messages indicating whether the migration completed successfully.

**Note**: If a seed script is available (`src/db/seed.ts`), it can be executed using `npm run seed` to populate the database with initial test data. However, this step is optional and may not be required for examination purposes.

## Running the Application

### Development Mode

To start the application in development mode with hot module replacement (HMR), execute:

```bash
npm run dev
```

The development server will start and the application will be accessible at `http://localhost:5173` (or another port if 5173 is unavailable). The terminal will display the exact URL where the application is running.

The development server supports:
- **Hot Module Replacement**: Changes to source files will automatically refresh the browser
- **Source Maps**: For debugging purposes
- **Fast Refresh**: React components will update without losing component state

### Production Build

To create a production build of the application:

```bash
npm run build
```

This command performs the following operations:
1. Type checking using TypeScript compiler (`tsc -b`)
2. Building the application using Vite (`vite build`)

The production build will be output to the `dist/` directory. To preview the production build locally:

```bash
npm run preview
```

This starts a local server serving the production build, typically at `http://localhost:4173`.

## Project Structure

The project follows a modular architecture with the following key directories:

- **`src/components/`**: Reusable React components organized by feature (e.g., `feed/`, `forms/`, `map/`)
- **`src/pages/`**: Page-level components corresponding to application routes
- **`src/layouts/`**: Layout components for different page types (e.g., `AuthLayout`, `RootLayout`)
- **`src/features/`**: Feature-specific API calls and hooks (e.g., `events/`, `jobs/`, `posts/`)
- **`src/db/`**: Database schema definitions and migration scripts
- **`src/lib/`**: Utility functions and helper modules
- **`src/store/`**: Zustand store definitions for global state management
- **`src/types/`**: TypeScript type definitions

## Available Scripts

The following npm scripts are available:

- **`npm run dev`**: Start the development server
- **`npm run build`**: Create a production build
- **`npm run preview`**: Preview the production build locally
- **`npm run lint`**: Run ESLint to check code quality
- **`npm run migrate`**: Execute database migration scripts
- **`npm run seed`**: Execute database seeding scripts (if available)

## Troubleshooting

### Common Issues

1. **Port Already in Use**: If port 5173 is already in use, Vite will automatically select the next available port. Check the terminal output for the actual port number.

2. **Environment Variables Not Loading**: Ensure the `.env.local` file is in the root directory and contains all required variables. Restart the development server after creating or modifying environment variables.

3. **Parse Server Connection Errors**: Verify that:
   - Parse Server is running and accessible at the URL specified in `VITE_PARSE_SERVER_URL`
   - The Parse Server application ID and keys are correct
   - Network connectivity allows access to the Parse Server instance

4. **Mapbox Errors**: If maps do not display:
   - Verify the Mapbox API key is correct and active
   - Check browser console for API key-related errors
   - Ensure the Mapbox account has sufficient quota

5. **TypeScript Errors**: Run `npm run build` to check for TypeScript compilation errors. Ensure all dependencies are installed correctly.

### Database Migration Issues

If the migration script fails:
- Verify Parse Server is running and accessible
- Check that `PARSE_MASTER_KEY` is correctly set in `.env.local`
- Ensure network connectivity to the Parse Server instance
- Review the error message in the terminal for specific failure reasons

## Browser Compatibility

This application is designed to work with modern web browsers that support ES6+ JavaScript features. Recommended browsers include:

- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

## Additional Notes for Examiners

1. **Authentication**: The application includes user authentication functionality. Test accounts may need to be created through the sign-up interface or provided separately.

2. **Map Functionality**: Map features require an active internet connection and a valid Mapbox API key. Map rendering may be limited if the API key quota is exceeded.

3. **Database State**: The application state is stored in Parse Server. Examiners should be aware that data persists between sessions unless the database is reset.

4. **Development vs. Production**: For examination purposes, the development mode (`npm run dev`) is recommended as it provides better error messages and debugging capabilities.

## Contact and Support

For technical issues or questions regarding the setup and execution of this project, please refer to the project documentation or contact the project authors.

---

**Version**: 0.0.1  
**Last Updated**: 02.12.2025

## My Contributions

I co-developed this project as part of a university course.

My primary contributions included:

- Implemented Feed Page
- Developed API integration / database logic / UI components
- Refactored and improved code structure

I was actively involved in architectural decisions and frontend and backend implementation.
