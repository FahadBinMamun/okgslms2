// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health-check route for Railway
app.get('/', (req, res) => {
  res.status(200).json({ message: '✅ Backend is running successfully!' });
});

// Example API endpoint (change based on your schema)
app.get('/users', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Railway or local port
const PORT = process.env.PORT || 3000;

// Function to start server with DB check
async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });

    // Gracefully handle shutdown
    process.on('SIGTERM', async () => {
      console.log('🛑 SIGTERM received. Closing HTTP server...');
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('🛑 SIGINT received. Closing HTTP server...');
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();
