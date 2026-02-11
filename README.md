# Lets Talk - Server

Node.js backend for the Lets Talk chat application, handling authentication, message persistence, and real-time socket sessions.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time Communication**: Socket.io
- **Security**: BcryptJS for password hashing, JWT for session management

## Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
PORT=3000
MONGODB_URL="your_mongodb_connection_uri"
JWT_SECRET="your_secret_key"
JWT_EXPIRES="2d"
COOKIE_EXPIRES=2
CLIENT_URL="http://localhost:5173"
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   *(Requires nodemon to be installed globally or as a dev dependency)*

## API Structure
- `/api/user`: Authentication and profile management.
- `/api/message`: One-to-one and group message operations.
- `/api/group`: Group creation and retrieval.
