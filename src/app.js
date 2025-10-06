import express from "express";
import bodyParser from "body-parser";
import path from "path";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import writingsRouter from "./routes/writings.router.js";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config/config.js";

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin origin (ej: aplicaciones móviles, Postman)
    if (!origin) return callback(null, true);
    if (config.env.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origin no permitido: ${origin}`);
      callback(new Error("No permitido por política CORS"));
    }
  },
  credentials: true, // Permitir cookies/credenciales
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 200, // Para navegadores legacy
};

app.use(cors(corsOptions));

// Confiar en proxy (importante para obtener IP real en producción)
app.set("trust proxy", 1);

const mongoURL = process.env.MONGO_URL || config.mongo.URL;
// Debug: verificar que la URL existe
console.log(
  "MONGO_URL:",
  mongoURL ? "Configurada correctamente" : "NO CONFIGURADA"
);
console.log("NODE_ENV:", process.env.NODE_ENV);
if (!mongoURL) {
  console.error("Error: MONGO_URL no está definida");
  process.exit(1);
}
mongoose.connect(mongoURL);

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos desde la carpeta 'public'
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Servir archivos estáticos desde la carpeta 'uploads'

app.use("/api/products", productsRouter);
app.use("/api/writings", writingsRouter);

const PORT = process.env.PORT || config.app.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port: ${PORT}`);
  console.log(`Environment: ${config.env.NODE_ENV}`);
  console.log(`CORS enabled for: ${config.env.ALLOWED_ORIGINS.join(", ")}`);
});
