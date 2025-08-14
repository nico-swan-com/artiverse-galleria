# Project structure

_Please keep in mind the project folder and file structure when contributing_

## Core Principles Guiding the Structure

- **Separation of Concerns:** Clearly delineate between frontend components, backend logic, data access, and API interactions.
- **Scalability:** The structure should easily accommodate growth in features and complexity.
- **Maintainability:** Code should be easy to find, understand, and modify.
- **Testability:** Structure should facilitate writing unit and integration tests.
- **Collaboration:** Make it easy for multiple developers to work on the codebase.

## Folders and files

```
├── _next/                          # Next.js generated files (build output, cache)
├── node_modules/                   # Node.js dependencies
├── public/                         # Static assets (images, fonts, etc.)
├── src/                            # The application code
│   ├── app/                        # New Next.js App Router (for server components, routes)
│   │   ├── (public)/               # Route group for unprotected website pages
│   │   │   ├── layout.tsx          # Layout for public pages
│   │   │   ├── page.tsx            # Homepage (public)
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   └── page.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (authentication)/       # Route group for authentication related pages
│   │   │   ├── layout.tsx          # Layout for auth pages (optional)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── forgot-password/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/            # Route group for protected dashboard pages
│   │   │   ├── layout.tsx          # Layout for dashboard pages (requires authentication)
│   │   │   ├── dashboard/          # Root dashboard page
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   ├── (user)/                 # Route group for user-specific protected pages
│   │   │   ├── layout.tsx          # Layout for user pages (requires authentication)
│   │   │   ├── cart/
│   │   │   │   └── page.tsx
│   │   │   ├── checkout/
│   │   │   │   └── page.tsx
│   │   │   ├── profile/
│   │   │   │   └── page.tsx
│   │   ├── api/                    # API routes (formerly in pages/api)
│   │   │   └── auth/
│   │   │       └── [...nextauth]
│   │   │             └── route.ts  # Router based authentication via next auth
│   │   │   [resource]/             # Example: api/users/[id].ts
│   │   │       └── route.ts
│   │   │   └── [resource]/         # Example: api/users/[id].ts
│   │   │       └── route.ts
│   │   ├── layout.tsx              # Root layout for the application
│   │   ├── page.tsx                # Homepage route
│   │   └── ...                     # Other route groups and pages
│   ├── components/                 # Reusable UI components
│   │   ├── common/                 # General, widely used components
│   │   ├── specific/               # Components specific to a feature or section i.e.
│   │   ├── public/                 # Components for the public facing website
|   │   ├── authentication/         # Components for authentication feature
│   │   ├── specific/               # Components specific to a feature or section i.e.
│   │   └── ui/                     # Primitive UI components (buttons, inputs, etc.)
│   ├── contexts/                   # Context API providers for global state management
│   ├── hooks/                      # Custom React hooks for reusable logic
│   ├── lib/                        # Application-specific libraries and utilities
│   │   ├── database/               # Database connection and helper functions
│   │   │   ├── data-source.ts      # Database client initialization TypeORM
│   │   │   ├── entities/           # Database schema definitions (if using an ORM)
│   │   │   │     └── index.ts      # Barrel file for all the entities.
│   │   │   └── migration/          # Contains all the migrations scripts for the ORM
│   │   │                           #  Prefer to have entities with features
│   │   ├── api-clients/            # Clients for interacting with external APIs
│   │   │   └── third-party.ts
│   │   ├── utils/                  # Utility functions (formatting, validation, etc.)
│   │   └── auth.ts                 # Authentication related logic (if applicable)
│   ├── middleware.ts               # Middleware for handling requests before they reach routes
│   ├── styles/                     # Global styles and CSS modules
│   │   ├── globals.css
│   │   └── ...
│   ├── types/                      # TypeScript type definitions
│   │   ├── api/                    # Types related to API requests and responses
│   │   ├── database/               # Types related to database entities
│   │   └── ...
│   └── utils/                      # General utility functions (consider merging with lib/utils)
├── .env.local                      # Environment variables for local development
├── .env.production                 # Environment variables for production
├── next.config.js                  # Next.js configuration file
├── package.json
├── README.md
├── tsconfig.json                   # TypeScript configuration file
└── ...
```

## Explanation of Key Folders

- **`src/app`** Route Groups (folder-name): We leverage Next.js App Router's route groups to organize pages based on their access control.
  - **(public)**: This group contains all the unprotected website pages like the homepage, about us, product listings, and the initial login page.
  - **(authentication)**: This group can house pages related to the authentication process itself, like registration and forgot password. You might choose to keep the login page here or in the (public) group depending on your preference.
  - **(dashboard)**: This group contains pages that require the user to be logged in and potentially have a specific role (if your dashboard has different access levels).
  - **(user)**: This group is specifically for pages related to the logged-in user's data, such as their cart, checkout process, and profile information.
- **`src/app/api/` (Next.js App Router):** This is where you define your backend API routes using the new App Router conventions. Each route segment can have its own `route.ts` (or `.js`) file that exports request handlers (e.g., `GET`, `POST`, `PUT`, `DELETE`).
- **`src/components/`:** Houses your reusable UI components. Organizing them further into `common`, `specific`, and `ui` can improve maintainability as the application grows.
- **`src/contexts/`:** If you're using the React Context API for global state management, put your context providers and consumers here.
- **`src/hooks/`:** Contains custom React hooks to encapsulate reusable logic that interacts with state, effects, or other hooks.
- **`src/lib/`:** This is a crucial folder for your backend logic and integrations.
  - **`database/`:** Manages your database interactions.
    - `data-source.ts`: Initializes your database client .
    - `entities/`: (Optional, if using an ORM) Defines your database schema models.
    - `migrations/`: Contain the migration script to create the database
  - **`api-clients/`:** Contains dedicated clients for interacting with external APIs. This promotes modularity and makes it easier to manage API keys and base URLs.
    - Each external API can have its own file (e.g., `third-party-service.ts`) with functions to make requests to that API.
  - **`utils/`:** General utility functions that don't fit neatly into other categories (e.g., date formatting, string manipulation).
  - **`auth.ts`:** Logic related to user authentication and authorization.
- **`src/middleware.ts`:** Used for middleware functions that run before requests are handled by your routes.
- **`src/styles/`:** Contains your global CSS files and potentially CSS modules for component-specific styling.
- **`src/types/`:** Holds TypeScript type definitions for your application. Organizing them into subfolders like `api` and `database` can be helpful.

## Benefits of This Structure

- **Clear Separation of Concerns:** It's easy to understand where different parts of your application reside.
- **Improved Maintainability:** Changes to the database logic or an external API won't directly impact your UI components.
- **Enhanced Testability:** You can easily mock database interactions and external API calls when testing components and logic.
- **Better Collaboration:** Developers can focus on specific areas of the codebase without stepping on each other's toes.
- **Scalability:** The structure is designed to handle a growing codebase by organizing files logically.

## Important Considerations

- **Database Choice:** The specific implementation within the `database/` folder is `PostgreSQL` for the database and [TypeORM](https://typeorm.io/) for managing query builder and migrations.
- **External API Clients:** Using `fetch` as the library in the `api-clients/` folder to make HTTP requests.
- **State Management:** Undecided - For more complex frontend state management, you might consider libraries like Zustand, Redux, or Recoil. These would likely have their own folders within `src/` (e.g., `src/store/`).
- **Authentication:** The `authentication` we are following the recommendations for the [NextAuth / Auth.js](https://authjs.dev/) authentication system.
- **Testing:** While not explicitly in the structure above, you'll likely have a `__tests__` or `test` folder at the root level or within specific modules to house your tests.

# Workflows

## Example Workflow

1.  **Frontend Component Needs Data:** A component in `src/components/users/UserList.tsx` needs to display a list of users.
2.  **API Request:** The component uses a hook (e.g., `src/hooks/useUsers.ts`) to fetch the user data.
3.  **API Client:** The hook calls a function in `src/lib/api-clients/users.ts` to make an API request to your backend.
4.  **API Route:** The API client interacts with a Next.js API route defined in `src/app/api/users/route.ts`.
5.  **Database Interaction:** The API route handler in `route.ts` uses functions from `src/lib/database/data-source.ts` (and potentially models) to query the database.
6.  **External API (Optional):** If the user data involves fetching information from an external API, the API route handler might also use a client from `src/lib/api-clients/external-service.ts`.
7.  **Response:** The API route sends the data back to the frontend component.

## Workflow with Authentication:

1. **User Accesses a Protected Page**: When a user tries to navigate to a route within the `(dashboard)` or `(user)` route groups (e.g., /dashboard/settings), the middleware.ts will intercept the request.
2. **Authentication Check**: The middleware will check if the user is authenticated (e.g., by checking for a session cookie or token).
3. **Redirection**: If the user is not authenticated, the middleware will redirect them to the login page (/login). The exception is on the `(public)` site as we only display if a user is signed in.
4. **Authenticated Access**: If the user is authenticated, the middleware allows the request to proceed to the requested page.
5. \*\*Data Fetching: Once on the protected page, components can fetch user-specific data from the database or external APIs, often using API routes within `src/app/api/`.

# File location and naming

## Core Principles Guiding the file naming

- **Separation of Concerns:** Colocate all files related to a concern together.
- **Readability** Files names should clearly identify what it contains in kebab case. i.e login-form.component.tsx see below for standards

## File postfix

- `.tsx`: These are UI component files that are for a feature and not in the ui folder. They should only contain the logic for the component dom ministrations
- `.schema.ts`: These are files for container the Zod schema validation for types.
- **Data types**: `.type.ts` Typescript type, `.interface.ts` or `.emum.ts` files. We want to keep to only one per file.
- `.action.ts` NextJS server actions in their own file.
