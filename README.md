# Sellpy Web Interview

Welcome to Hugo's Sellpy Web Interview repository!

## Prerequisites

- **Node.js** – If you don’t already have it installed, consider using [nvm](https://github.com/nvm-sh/nvm) for easier version management.

## Getting Started

### Starting the Backend

1. Navigate to the `backend` folder.
2. Run `npm ci`.
3. By default, the backend will use an **in-memory MongoDB** if `USE_INMEMORY_DB=true` is set in the `.env` file.  
   If you'd prefer to use an external database, set this value to `false` and configure the `MONGO_URI` accordingly.
4. Run `npm start`.

### Starting the Frontend

1. Navigate to the `frontend` folder.
2. Run `npm ci`.
3. Run `npm start`.

A browser tab will automatically open and load the app.

## Changelog

### Backend

- Updated to support both in-memory and persistent MongoDB storage.
- Uses GraphQL to serve data.
- `dueBy` and `completed` fields have been added to the Todos.

### Frontend

- Now fetches data from the backend using GraphQL.
- Implements internal caching, with mutations updating the cache directly to minimize unnecessary queries.
- Supports adding todo lists and todos, with automatic state saving after changes.
- Added the ability to mark todos as complete and set a due date (`dueBy`).
- Todo lists display aggregated data about the progress of their todos.

## Coming Soon...

- User authentication with per-user todo visibility.
- Logging for all mutations and exceptions.
