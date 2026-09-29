# Store Ratings

A store rating web application with role-based access control.

## Setup & Running

1. Install root, server, and client dependencies:

   ```bash
   npm install
   npm --prefix server install
   npm --prefix client install
   ```

2. Copy environment files and configure `server/.env`:

   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. Run development mode (server at http://localhost:4000, client at http://localhost:5173):
   ```bash
   npm run dev
   ```
