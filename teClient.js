import axios from "axios";
import inquirer from "inquirer";

const serverURL = "http://localhost:3000";

const questions = [
    {
        type: "input",
        name: "nomeTe",
        message: "Inserisci il nome del tè per cui vuoi vedere gli abbinamenti:",
        validate: (input) => {
            if (input.trim() === "") {
                return "Il nome del tè non può essere vuoto.";
            }
            return true;
        }
    }
];

const menu = [
    {
        type: "list",
        name: "azione",
        message: "Cosa vuoi fare?",
        choices: [ 
            { name: "Visualizza abbinamenti per un tè", value: "abbTe" },
            { name: "Inserisci un nuovo tè", value: "insTe" },
            { name: "Visualizza abbinamenti per un cibo", value: "abbCibo" },
            { name: "Inserisci un nuovo cibo", value: "insCibo" },
            { name: "Inserisci un nuovo abbinamento", value: "insAbb" },
            { name: "Esci", value: "esci" }
        ]
    }
];

/*
inquirer.prompt(questions)
    .then((answers) => {
        return axios.get(`${serverURL}/abb/te/${answers.nomeTe}`);})
    .then((response) => {
        console.log(response.data);})
    .catch((error) => {
        console.error("Errore durante la richiesta:", error.message);
    });
*/

async function abbinamentiTe() {
    try {
        const answers = await inquirer.prompt(questions);
        const response = await axios.get(`${serverURL}/abb/te/${answers.nomeTe}`);
        if (response.status === 200) {
            console.log("Abbinamenti trovati:");
            response.data.forEach((item) => {
                console.log(`- ${item.Nome} (${item.Tipologia}): ${item.Descrizione}`);
            });
        }
    } catch (error) {
        if (error.status === 404) {
            console.log("Nessun abbinamento trovato per il tè specificato.");
        }
        if (error.status === 500) {
            console.error("Errore durante la richiesta:", response.data.errore);
        }
    }
}

async function main() {
    try {
        const scelta = await inquirer.prompt(menu);
        switch (scelta.azione) {
            case "abbTe":
                    await abbinamentiTe();
                    break;
            case "insTe":
                    break;
            case "abbCibo":
                    break;
            case "insCibo":
                    break;
            case "insAbb":
                    break;
            case "esci":
                    console.log("Uscita dal programma.");
                    process.exit(0);
                    break;
            default:
                    console.log("Azione non riconosciuta.");
                    break;
        }
    } catch (error) {
        console.error("Errore durante l'esecuzione:", error.message);
    }
}

while (true) {
    await main();
}
