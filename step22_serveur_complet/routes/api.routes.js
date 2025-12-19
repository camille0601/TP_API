import express from "express";
import db from "../db/sqlite.js";

const router = express.Router();

/*
* GET -- voir
*/

// GET all

router.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "Utilisateurs récupérés avec succès",
      count: rows.length,
      data: rows,
    });
  });
});


// GET by ID

router.get("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      message: "Utilisateur trouvé",
      data: row,
    });
  });
});

/*
* POST --creer
*/

router.post("/api/users", (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  if (!["student", "instructor"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  db.run(
    "INSERT INTO users (name, email, role) VALUES (?, ?, ?)",
    [name, email, role],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        id: this.lastID,
      });
    }
  );
});

/*
*PUT -- modifier
*/

router.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  if (!["student", "instructor"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  db.run(
    "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Utilisateur non trouvé",
        });
      }

      res.json({
        message: "Utilisateur mis à jour avec succès",
      });
    }
  );
});


/*
*Delete -- supprimer
*/

router.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      message: "Utilisateur supprimé avec succès",
    });
  });
});


export default router;
