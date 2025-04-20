router.post("/register", async (req, res) => {
  const { username, email, password, name, surname, birthdate } = req.body;

  // Validation basique
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  // Création utilisateur
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email déjà utilisé" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    name,
    surname,
    birthdate,
  });

  res.status(201).json({ message: "Utilisateur créé", user: newUser });
});
