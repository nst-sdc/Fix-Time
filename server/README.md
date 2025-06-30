# Fix-Time Server

## Setup Instructions

1. Create a `.env` file in the server directory with the following variables:
```
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/fixtime

# JWT Secret for Authentication
JWT_SECRET=your_jwt_secret_here

# Server Port
PORT=5001

# Node Environment
NODE_ENV=development
```

2. Install dependencies:
```
npm install
```

3. Start the server:
```
npm run dev
```

## Troubleshooting

If you encounter issues with appointment fetching:
- Make sure MongoDB is running and accessible
- Check that your JWT_SECRET matches between client and server
- Ensure your MongoDB version is compatible with Mongoose 6.x 