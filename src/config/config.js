import { config } from "dotenv";

// Cargar variables de entorno desde un archivo .env
config();

export default {
    app: {
        PORT: process.env.PORT || 8080
    },
    mongo: {
        URL: process.env.MONGO_URL
    }
};