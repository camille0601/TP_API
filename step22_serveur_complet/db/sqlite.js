import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// chemin vers le fichier DB
const dbPath = path.join(__dirname, "../data/mds_b3dev_api_dev.db3");

// connexion
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur SQLite :", err.message);
  } else {
    console.log("✅ Connecté à SQLite");
  }
});

export default db;
