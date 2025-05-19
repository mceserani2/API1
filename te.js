import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const PORT = 3000;

app.use(express.json());

const db = new sqlite3.Database(".\\te.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log("Errore! ", err.message);
        process.exit(1);
    }
    console.log("Connessione all database effettuata!");
});

app.get("/abb/cibo/:nomeCibo", (req, res) => {
    // Eseguire una query sul DB per ottenere tutti gli abbinamenti
    // per la variabile nomeCibo e inviarli in JSON
    const nomeCibo = req.params.nomeCibo;
    const query = `SELECT * FROM Cibo AS C INNER JOIN Abbinamento AS A ON C.Id = A.IdCibo INNER JOIN Te AS T ON T.Id = A.IdTe WHERE C.Nome = "${nomeCibo}"`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log("Errore di esecuzione della query");
            return res.status(500).json({errore: err.message})
        }
        if (!rows || rows.length === 0) {
            return res.status(404).json({ errore: "Nessun abbinamento trovato"});
        }
        res.json(rows);
    });
});

app.listen(PORT,() => {
    console.log(`Server in ascolo sulla porta ${PORT}`);
});