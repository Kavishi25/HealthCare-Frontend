# Healthcare System Frontend

A comprehensive React-based frontend for healthcare system report generation and management.

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx   # Main dashboard component
│   ├── ErrorBoundary.jsx # Error boundary wrapper
│   ├── ErrorMessage.jsx # Error display components
│   ├── FilterModal.jsx  # Report filter modal
│   ├── LoadingSpinner.jsx # Loading indicators
│   ├── ReportCard.jsx  # Report type cards
│   ├── ReportViewer.jsx # Report display component
│   ├── AuditLogViewer.jsx # Audit log viewer
│   └── index.js        # Component exports
├── lib/                # External library configurations
│   ├── database.js     # Database schema definitions
│   ├── superbaseClient.js # Supabase client setup
│   └── index.js        # Library exports
├── services/           # API and business logic
│   ├── reportServices.js # Report generation services
│   ├── auditServices.js # Audit logging services
│   └── index.js        # Service exports
├── utils/              # Utility functions
│   ├── exportUtils.js  # Data export utilities
│   ├── validation.js   # Form validation utilities
│   └── index.js        # Utility exports
├── hooks/              # Custom React hooks
│   ├── useLocalStorage.js # Local storage hook
│   ├── useDebounce.js  # Debouncing hook
│   ├── usePagination.js # Pagination hook
│   ├── useReportGeneration.js # Report generation hook
│   └── index.js        # Hook exports
├── types/              # Type definitions
│   └── index.js        # Type exports
├── constants/          # Application constants
│   └── index.js        # Constant exports
├── config/              # Configuration
│   └── index.js        # Config exports
├── routes/              # Routing configuration
│   └── index.js        # Route exports
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── README.md           # This file
```

## Key Features

### Components
- **Dashboard**: Main application interface with report type selection
- **FilterModal**: Advanced filtering for report generation
- **ReportViewer**: Comprehensive report display with sorting, pagination, and export
- **AuditLogViewer**: Track report generation activities
- **ErrorBoundary**: Global error handling
- **LoadingSpinner**: Loading states and skeletons

### Services
- **Report Services**: Generate patient, appointment, and staff reports
- **Audit Services**: Log and track report generation activities
- **Export Services**: PDF and Excel export functionality

### Utilities
- **Validation**: Form validation and data sanitization
- **Export**: Multi-format data export (PDF, Excel, CSV)
- **Date Handling**: Date range utilities and formatting

### Hooks
- **useLocalStorage**: Persistent local storage management
- **useDebounce**: Input debouncing for performance
- **usePagination**: Data pagination logic
- **useReportGeneration**: Report generation state management

## Usage

### Importing Components
```javascript
import { Dashboard, ErrorBoundary } from './components'
import { generatePatientReport } from './services'
import { validateReportFilters } from './utils'
```

### Using Hooks
```javascript
import { useReportGeneration, usePagination } from './hooks'

function MyComponent() {
  const { generateReport, isLoading, result } = useReportGeneration()
  const { paginatedData, currentPage, totalPages } = usePagination(data)
  
  // Component logic
}
```

### Configuration
```javascript
import { config } from './config'

// Access configuration
const supabaseUrl = config.supabase.url
const isDevelopment = config.app.isDevelopment
```

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Dependencies

- React 18+
- Lucide React (icons)
- Supabase (database)
- jsPDF (PDF export)
- jspdf-autotable (PDF tables)
- xlsx (Excel export)
- PropTypes (type checking)

## Development

1. Install dependencies: `npm install`
2. Set up environment variables
3. Start development server: `npm run dev`
4. Build for production: `npm run build`

## Architecture

The application follows a modular architecture with clear separation of concerns:

- **Components**: UI components with minimal business logic
- **Services**: API calls and business logic
- **Hooks**: Reusable stateful logic
- **Utils**: Pure functions and utilities
- **Types**: Type definitions and schemas
- **Config**: Environment and application configuration
