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
    const query = `SELECT T.Id, T.Nome, T.Tipologia, T.Descrizione FROM Cibo AS C INNER JOIN Abbinamento AS A ON C.Id = A.IdCibo INNER JOIN Te AS T ON T.Id = A.IdTe WHERE C.Nome = "${nomeCibo}"`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log("Errore di esecuzione della query");
            return res.status(500).json({errore: err.message})
        }
        if (!rows || rows.length === 0)      {
            return res.status(404).json({ errore: "Nessun abbinamento trovato"});
        }
        res.json(rows);
    });
});

app.get("/abb/te/:nomeTe", (req, res) => {
    // Eseguire una query sul DB per ottenere tutti gli abbinamenti
    // per la variabile nomeTe e inviarli in JSON
    const nomeTe = req.params.nomeTe;
    const query = `SELECT C.Id, C.Nome, C.Tipologia, C.Descrizione FROM Te AS T INNER JOIN Abbinamento AS A ON T.Id = A.IdTe INNER JOIN Cibo AS C ON C.Id = A.IdCibo WHERE T.Nome = "${nomeTe}"`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log("Errore di esecuzione della query");
            return res.status(500).json({errore: err.message})
        }
        if (!rows || rows.length === 0)      {
            return res.status(404).json({ errore: "Nessun abbinamento trovato"});
        }
        res.json(rows);
    });
});

app.post("/te",(req, res) => {
    const { Nome, Tipologia, Descrizione } = req.body;
    if (!Nome || Nome.length === 0 || !Tipologia || Tipologia.length === 0) {
        return res.status(400).json({ "Errore": "Nome e Tipologia sono obbligatori"});
    }
    const query = `INSERT INTO Te (Nome, Tipologia, Descrizione) VALUES ("${Nome}","${Tipologia}","${Descrizione}");`;
    db.run(query,(err) => {
        if (err) {
            return res.status(500).json({ "Errore": err.message });
        }
        res.status(201).json({ "Messaggio" : "te inserito con successo"});
    });
});

app.listen(PORT,() => {
    console.log(`Server in ascolo sulla porta ${PORT}`);
});