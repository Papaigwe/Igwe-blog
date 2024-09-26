const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
const PASSWORD = 'papaigwe'; // Le mot de passe pour ajouter un article

// Configurer le serveur
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Créer une base de données en mémoire
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE articles (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, image TEXT)");
});

// Route pour obtenir tous les articles
app.get('/api/articles', (req, res) => {
    db.all("SELECT * FROM articles", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Route pour ajouter un nouvel article
app.post('/api/articles', (req, res) => {
    const { title, content, image, password } = req.body;

    if (password !== PASSWORD) {
        return res.json({ success: false });
    }

    db.run("INSERT INTO articles (title, content, image) VALUES (?, ?, ?)", [title, content, image], function(err) {
        if (err) {
            return console.error(err.message);
        }
        res.json({ success: true, id: this.lastID });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
