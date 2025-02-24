import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { bookRoutes } from './routes/bookRoutes';
import { memberRoutes } from './routes/memberRoutes';
import { issuanceRoutes } from './routes/issuanceRoutes';
import { queryRoutes } from './routes/queryRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/book', bookRoutes);
app.use('/member', memberRoutes);
app.use('/issuance', issuanceRoutes);
app.use('/query', queryRoutes);

// Error handling
app.use(errorHandler);

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});