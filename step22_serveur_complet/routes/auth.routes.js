import express from "express";
const router = express.Router();

// Page login
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// Traitement login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    req.session.isAdmin = true;
    return res.redirect("/");
  }

  res.render("login", { error: "Identifiants incorrects" });
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
