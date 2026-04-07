import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import remissionRoutes from './routes/remission.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/remissions', remissionRoutes);

// Health Check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend de Remisiones IT TOCSA S.A. funcionando' });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Configuración de rutas estáticas para Angular
  const frontendPath = path.join(__dirname, '../../frontend/dist/remisiones-it-tocsa-frontend/browser');
  app.use(express.static(frontendPath));

  // Cualquier otra ruta que no sea de la API, se delega al enrutamiento de Angular
  app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

export default app;
