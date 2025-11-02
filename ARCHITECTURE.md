# Project Architecture

This document outlines the architecture and structure of the Adaptive Project Generator application.

## Overall Architecture

The project follows a **MERN stack** (MongoDB, Express, React, Node.js) with a modern, modular architecture that separates concerns for maintainability and scalability.

## Frontend Architecture

### Structure
```
frontend/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── index.jsx               # Entry point
│   ├── index.css               # Global styles
│   ├── components/             # React components
│   │   ├── SkillChips.jsx      # Skill selection chips
│   │   ├── Header.jsx          # Application header
│   │   ├── ProjectSpec.jsx     # Project specification display
│   │   ├── FileManifest.jsx    # File manifest list
│   │   ├── FilePreview.jsx     # Code preview with syntax highlighting
│   │   └── Notification.jsx    # Success/error notifications
│   ├── services/               # API services
│   │   └── api.js              # API client for backend calls
│   └── utils/                  # Utility functions
│       └── languageDetection.js # Language detection for syntax highlighting
```

### Design Patterns

#### Component-Based Architecture
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Components can be easily reused across the application
- **Maintainability**: Changes to one component don't affect others

#### Service Layer
- **API Client**: Centralized API calls in `services/api.js`
- **Error Handling**: Consistent error handling across all API calls
- **Abstraction**: Frontend doesn't need to know backend implementation details

#### State Management
- **Local State**: Uses React hooks (`useState`) for component-level state
- **Props Drilling**: Data flows down through props
- **Event Handlers**: Callbacks passed as props for child-to-parent communication

## Backend Architecture

### Structure
```
backend/
├── src/
│   ├── index.js                # Server entry point
│   ├── routes/                 # API routes
│   │   └── project.js          # Project-related routes
│   ├── controllers/            # Business logic layer
│   │   └── projectController.js # Project business logic
│   ├── models/                 # Database models
│   │   ├── Project.js          # Project MongoDB schema
│   │   └── User.js             # User MongoDB schema (future)
│   ├── llm/                    # LLM integration
│   │   └── adapters.js         # Gemini API adapter
│   └── utils/                  # Utility functions
│       └── zipProject.js       # ZIP file generation
```

### Design Patterns

#### MVC Architecture
- **Model**: Mongoose schemas define data structure
- **View**: Not applicable (backend only)
- **Controller**: Business logic separated from routes

#### Layered Architecture
```
┌─────────────────────────────────┐
│         Routes Layer            │  ← HTTP endpoints
│  (API definitions, validation)  │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│      Controllers Layer          │  ← Business logic
│   (Request processing, LLM)     │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│        Models Layer             │  ← Data access
│   (Database operations, CRUD)   │
└─────────────────────────────────┘
```

#### Separation of Concerns
- **Routes**: Define endpoints, delegate to controllers
- **Controllers**: Handle business logic, call models and services
- **Models**: Define data structure and database operations
- **Utils**: Reusable helper functions
- **LLM Adapter**: Abstracted AI/LLM service integration

## Data Flow

### Project Generation Flow
```
1. User clicks "Generate Project"
   ↓
2. Frontend: App.jsx → api.generateProject()
   ↓
3. Backend: POST /api/generate-project
   ↓
4. Route: project.js → projectController.generateProject()
   ↓
5. Controller: Validation + LLM call + Database save
   ↓
6. LLM Adapter: callPreferred() → Gemini API
   ↓
7. Controller: Parse response, create Project model
   ↓
8. Response: JSON with projectId, manifest, spec
   ↓
9. Frontend: Update state, render components
```

### File Generation Flow
```
1. User clicks "Generate" on a file
   ↓
2. Frontend: App.jsx → api.generateFile()
   ↓
3. Backend: POST /api/generate-file
   ↓
4. Route: project.js → projectController.generateFile()
   ↓
5. Controller: Find project, generate file via LLM
   ↓
6. Response: JSON with file content
   ↓
7. Frontend: Update fileContent, render in FilePreview
```

## API Design

### RESTful Endpoints
```
GET  /health                      # Health check
POST /api/generate-project        # Create new project
POST /api/generate-file           # Generate single file
POST /api/generate-all            # Generate all files
GET  /api/project/:id             # Get project by ID
GET  /api/download/:projectId     # Download project as ZIP
```

### Request/Response Patterns
- **Request**: JSON body with required fields
- **Response**: JSON with `error`, `details`, `hint` for failures
- **Error Handling**: Consistent error format across all endpoints

## Technology Stack

### Frontend
- **React 18**: UI library
- **Axios**: HTTP client
- **react-syntax-highlighter**: Code syntax highlighting
- **CSS-in-JS**: Styled with inline styles (neo-brutalist design)

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **Google Gemini API**: LLM for project generation
- **Archiver**: ZIP file creation

## Design System

### Neo-Brutalist Aesthetic
- **Colors**: Bold, high-contrast (#6BCB77, #FFD93D, #FF6B6B, #4ECDC4)
- **Typography**: Uppercase, bold, spaced lettering
- **Shadows**: Black box shadows (8px, 4px offsets)
- **Borders**: Thick black borders (3-4px)
- **Components**: Flat design with geometric shapes

## Future Enhancements

### Potential Improvements
1. **State Management**: Redux or Zustand for complex state
2. **Authentication**: JWT-based user authentication
3. **Database**: Optimistic queries and caching
4. **Testing**: Unit tests for components, integration tests for API
5. **Error Boundaries**: React error boundaries for better error handling
6. **TypeScript**: Type safety across frontend and backend
7. **Docker**: Containerization for easy deployment
8. **CI/CD**: Automated testing and deployment pipeline

## Development Guidelines

### Frontend
- Keep components small and focused
- Use services for all API calls
- Extract complex logic into utility functions
- Follow React best practices

### Backend
- Keep routes thin, delegate to controllers
- Business logic belongs in controllers
- Models handle data operations only
- Use async/await for asynchronous operations
- Always handle errors appropriately

## Contributing

When adding new features:
1. Follow the existing architecture patterns
2. Create separate components for UI elements
3. Add business logic to controllers
4. Update this document if architecture changes
5. Ensure backward compatibility

