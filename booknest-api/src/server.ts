import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { bookRoutes } from './routes/bookRoutes';
import { memberRoutes } from './routes/memberRoutes';
import { issuanceRoutes } from './routes/issuanceRoutes';
import { queryRoutes } from './routes/queryRoutes';
import { validateApiKey } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => validateApiKey(req, res, next));

// Routes
app.use('/book', bookRoutes);
app.use('/member', memberRoutes);
app.use('/issuance', issuanceRoutes);
app.use('/query', queryRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});