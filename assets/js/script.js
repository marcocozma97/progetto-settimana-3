/*
REGOLE
- Le risposte vanno scritte in JavaScript sotto questi commenti.
- Pattern fondamentale: stato -> render() -> eventi.
  Tutto cio' che vedi a schermo dipende dallo stato.
  Gli eventi modificano lo stato e poi chiamano render().
- Apri index.html nel browser. Apri la console (DevTools) per gli errori.
- Cerca su MDN solo i concetti dichiarati come "cerca tu":
  localStorage, Blob/URL.createObjectURL, FileReader.
  Tutto il resto e' stato visto in settimana.
- Niente AI per generare codice. Niente template scaricati.
*/


/* STATO
   In cima al file definisci poche variabili globali:
   - un array di oggetti come dato principale (es. libri, ricette, film, ...)
   - una variabile per il filtro corrente
   - una variabile per l'ordinamento corrente
   - una variabile per la stringa di ricerca corrente
*/

/* SCRIVI QUI LA TUA RISPOSTA */

let mangaShelf = [];
let filtroCorrente = "tutti";
let ordinamentoCorrente = "anno-crescente";
let stringaRicerca = "";


/* RENDER()
   Una sola funzione che ridipinge la lista. A ogni chiamata:
   1) parte dall'array completo,
   2) filtra,
   3) ordina,
   4) svuota il container DOM,
   5) ricrea gli elementi DOM per gli oggetti risultanti.
   Aggiorna anche conteggi e statistiche.
   Salva lo stato in localStorage in fondo a render() (cerca tu come funziona).
*/

/* SCRIVI QUI LA TUA RISPOSTA */

function render() {
    let contenitore = document.getElementById("lista-manga");
    contenitore.textContent = "";

    let filtrati = [];
    for (let i = 0; i < mangaShelf.length; i++) {
        let manga = mangaShelf[i];
        let okStato = (filtroCorrente === "tutti" || manga.stato === filtroCorrente);
        let okRicerca = manga.titolo.toLowerCase().indexOf(stringaRicerca.toLowerCase()) !== -1;

        if (okStato && okRicerca) {
            filtrati.push(manga);
        }
    }

    if (ordinamentoCorrente === "az") {
        filtrati.sort(function (a, b) { return a.titolo > b.titolo ? 1 : -1; });
    }

    for (let i = 0; i < filtrati.length; i++) {
        let manga = filtrati[i];
        let badgeClasse = (manga.stato === "letto") ? "badge-letto" : "badge-da-leggere";
        let badgeTesto = (manga.stato === "letto") ? "Letto" : "Da leggere";
        let div = document.createElement("div");
        div.className = "manga-card " + manga.stato;
        div.textContent = "<div class='manga-info'><strong>" + manga.titolo + "</strong><p>" + manga.autore + " — " + manga.anno + "</p></div>" +
            "<div class='manga-azioni'>" +
            "<span class='badge-stato " + badgeClasse + "'>" + badgeTesto + "</span>" +
            "<button onclick='cambiaStato(" + manga.id + ")'>" + (manga.stato === 'letto' ? 'Segna da leggere' : 'Segna letto') + "</button>" +
            "<button>Modifica</button>" +
            "<button onclick='elimina(" + manga.id + ")'>Elimina</button>" +
            "</div>";

        contenitore.appendChild(div);
    }
    aggiornaStatistiche();
}

function aggiornaStatistiche() {
    let tot = mangaShelf.length;
    let letti = 0;
    for(let i = 0; i < mangaShelf.length; i++) {
        if(mangaShelf[i].stato === "letto") {
            letti = letti + 1;
        }
    }
    document.getElementById("stat-totale").innerHTML = tot;
    document.getElementById("stat-letti").innerHTML = letti;
    document.getElementById("stat-da-leggere").innerHTML = tot - letti;
    let percentuale = 0;
    if (tot > 0) {
        percentuale = (letti / tot) * 100;
    }
    document.getElementById("#barra-avanzamento").style.width = percentuale + "%";
}


/* FORM CON VALIDAZIONE
   addEventListener("submit") sul form.
   event.preventDefault().
   Leggi i valori con .value.trim().
   Se uno dei campi obbligatori e' vuoto, mostra errore e return.
   Altrimenti push allo stato, form.reset(), render().
   Id univoco con Date.now().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

document.querySelector(".form-completo").onsubmit = function (e) {
    e.preventDefault();
    let titolo = document.getElementById("titolo").value;
    let autore = document.getElementById("autore").value;
    let anno = document.getElementById("anno").value;
    let stato = document.getElementById("selezione-stato").value;

    if (titolo === "" || autore === "" || anno === "") {
        notifica("Errore: campi vuoti!");
        return;
    }

    let nuovo = { id: Date.now(), titolo: titolo, autore: autore, anno: anno, stato: stato };
    mangaShelf.push(nuovo);
    this.reset();
    render();
};

function notifica(testo) {
    let n = document.getElementById("notifica");
    n.textContent = testo;
    n.style.display = "block";
    setTimeout(function () { n.style.display = "none"; }, 3000);
}

document.getElementById("btn-tema").onclick = function () {
    document.body.classList.toggle("dark");
};


/* INTERAZIONI BASE — eliminare, modificare, contare
   - Elimina: filter per id, render(). Event delegation sul container.
   - Modifica in-place: button "Modifica". Al click il testo diventa <input>,
     si conferma con Invio o blur.
   - Conteggi dinamici dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */

function elimina(id) {
    for (let i = 0; i < mangaShelf.length; i++) {
        if (mangaShelf[i].id === id) {
            mangaShelf.splice(i, 1);
            break;
        }
    }
    render();
}

function cambiaStato(id) {
    for (let i = 0; i < mangaShelf.length; i++) {
        if (mangaShelf[i].id === id) {
            if (mangaShelf[i].stato === "letto") mangaShelf[i].stato = "da-leggere";
            else mangaShelf[i].stato = "letto";
        }
    }
    render();
}

// Ricerca e Filtri
document.getElementById("ricerca-input").oninput = function () {
    stringaRicerca = this.value;
    render();
};

document.getElementById("filtro-stato").onchange = function () {
    filtroCorrente = this.value;
    render();
};

/* RICERCA, FILTRO, ORDINAMENTO
   - Ricerca live: <input> con event "input". Salva in stato e render().
   - Filtro: <select> con event "change". Salva in stato e render().
   - Ordinamento: due button (o select). Salva in stato e render().
   I tre si compongono dentro render() in fila.
*/

/* SCRIVI QUI LA TUA RISPOSTA */

document.getElementById("ricerca-input").oninput = function () {
    stringaRicerca = this.value;
    render();
};

document.getElementById("filtro-stato").onchange = function () {
    filtroCorrente = this.value;
    render();
};

document.getElementById("ordine-manga").onchange = function () {
    ordinamentoCorrente = this.value;
    render();
};

/* NOTIFICHE TEMPORANEE
   Funzione notifica(testo) che imposta il testo del <div id="notifica">,
   lo mostra (display: block), poi dopo 3000ms (setTimeout) lo nasconde.
*/

/* SCRIVI QUI LA TUA RISPOSTA */

function notifica(testo) {
    let divNotifica = document.getElementById("notifica");
    divNotifica.textContent = testo;
    divNotifica.style.display = "block";
    setTimeout(function () {
        divNotifica.style.display = "none";
    }, 3000);
}


/* TEMA CHIARO/SCURO
   Un button che chiama document.body.classList.toggle("dark").
   In CSS scrivi le regole opposte (es. body.dark { background: #111; ... }).
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* PERSISTENZA — localStorage (cerca tu su MDN)
   - In fondo a render(), salva lo stato:
       localStorage.setItem("dati", JSON.stringify(stato));
   - All'avvio, prima della prima render(), carica:
       const salvato = localStorage.getItem("dati");
       if (salvato) stato = JSON.parse(salvato);
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* RIORDINO ↑ ↓
   Due button su ogni elemento. Click su ↑ scambia con il precedente nell'array,
   ↓ con il successivo. Event delegation. Poi render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* STATISTICHE GRAFICHE
   Almeno due indicatori: contatori grandi e/o barre orizzontali
   (<div> con width: X% in base al dato). Aggiorna dentro render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* MULTI-VISTA — lista / card / tabella
   Una variabile globale "vista" che render() legge per decidere quale HTML
   produrre. Tre button cambiano "vista" e chiamano render().
*/

/* SCRIVI QUI LA TUA RISPOSTA */


/* CATEGORIE
   Aggiungi un campo categoria nello schema. Nel form un <select> per sceglierla.
   In render(), raggruppa con reduce in { categoria: [elementi] } e disegna un
   header per categoria con sotto la lista di quella categoria.
*/

/* SCRIVI QUI LA TUA RISPOSTA */