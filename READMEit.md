# ArgoScuolaNext-NodeJS

Una libreria per accedere ai servizi ArgoScuolaNext utilizzano NodeJS.

# Attenzione

Questo README è obsoleto perché non ho voglia di aggiornare entrambi i README (scusate).
Per rimanere aggiornati usare il README in inglese oppure contattarmi su Telegram.\

---

### Premessa

Ho sgraffignato molte delle informazioni/variabili/header/endpoint/altro dalla libreria di [hearot](https://github.com/hearot/) :  
[ArgoScuolaNext-Python](https://github.com/hearot/ArgoScuolaNext-Python)  
Non usi Python? Queste sono altre librerie per ArgoScuolaNext **create da hearot** :  
[ArgoScuolaNext APIs in Php](https://github.com/hearot/ArgoScuolaNext)  
[ArgoScuolaNext APIs in Go](https://github.com/hearot/ArgoScuolaNext-go)  

Senza chiedere alcun permesso e per questo lo ringrazio molto per il suo lavoro precedentemente fatto per trovare gli endpoint e altro.

## Installazione e Aggiunta nel progetto

Usando npm:
```bash
npm i ArgoScuolaNext
```

Usando yarn:
```bash
yarn add ArgoScuolaNext
```

Importare:
```js
const argo = require('./ArgoScuolaNext-NodeJS');
```

## Utilizzo

#### Attenzione:  
Questa libreria è asincrona e quindi dovrai utilizzare [await/async](https://discordjs.guide/additional-info/async-await.html) o Promise.  
Per questo motivo è necessario eseguire il codice in una funzione asincrona.  
Il mio consiglio è di usare una [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). Esempio :
```js
(async () => {
	// Codice da eseguire
})();
```
Nell'esempio viene utilizzata anche una [Arrow Function `() => {}`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) questo non comporta alcun cambiamento notevole rispetto a una normale funzione `function() {}`  
Il contenuto della IIFE verrà eseguito come un qualsiasi codice ma in modalità asincrona.

### Login

Per prima cosa devi creare l'istanza della classe Sessione cioè loggare.  

```js
(async () => {
  const sessione = await (new argo('codice scuola', 'nome utente', 'password'));
})();
```
Al posto di 'codice scuola' inserisci il codice della tua scuola.  
Al posto di 'nome utente' inserisci il tuo nome utente.  
Al posto di 'password' inserisci la tua password.

### Richieste

Per effettuare una richiesta all'API devi utilizzare la funzione `get()`.  
La funzione richiede due parametri :  
- method: L'endpoint dell'API   - obbligatorio
  - oggi
  - assenze
  - notedisciplinari
  - votigiornalieri
  - votiscrutinio
  - compiti
  - argomenti
  - promemoria
  - orario
  - docenticlasse
- date: La data scelta          - facoltativo < Potrebbe non funzionare con tutte richieste endpoint < Format : YYYY/MM/DD  
Nota : In futuro potrebbero mancare alcuni metodi dati gli aggiornamenti del API. Per rimanere aggiornati è consigliato controllare la pagina GItHub di hearot.  
Nota2 : La funzione è asincrona.
Esempio:
```js
(async () => {
  const sessione = await (new argo('codice scuola', 'nome utente', 'password'));
  const risultato = await sessione.get('assenze');

  console.log(risultato)
})();
```
Risultato:
```js
{
  dati: [
    {
      codMin: 'Codice scuola',
      prgScuola: number,
      numOra: number,
      prgAlunno: number,
      numAnno: number,
      datAssenza: 'YYYY-MM-DD',
      oraAssenza: '01-01-1970 HH:MM',
      registrataDa: '(Prof. COGNOME NOME)',
      flgDaGiustificare: boolean,
      prgScheda: number,
      desAssenza: '',
      codEvento: '',
      binUid: ''
    }
  ],
  abilitazioni: {
  },
  disclaimer: ''
}
```
Per migliori informazioni sui risultati e altri endpoint controllare la pagina GItHub di hearot.

### Esempi più complicati

#### Impostare un filtro
```js
...

(async () => {
  const sessione = await (new argo('codice scuola', 'nome utente', 'password'));
  const risultato = await sessione.get('assenze');
  const dati = risultato.dati; // Ci interessa avere solo i dati dalla risposta, non le abilitazioni o il disclaimer. Questo ritorna una variabile di tipo Array.
  
  // Utilizziamo il metodo `filter()` degli Array con una Arrow Function per impostare il filtro.
  console.log( dati.filter(dato => { // La variabile può essere chiamata in qualsiasi modo. Io ho scelto dato.
  	// Nella Arrow Function dobbiamo inserire una condizione che ritordi true.
	/*
	  Questa condizione, per esempio, serve a scegliere solo i dati che hanno una certa data.
	  Per esempio se il parametro `date` non funziona con l'endpoint scelto.
	  
	  Possiamo usare tutte le condizioni che vogliamo.
	*/
	return (dato.datAssenza == '2021-09-20' && dato.datGiustificazione == '2021-10-14') || dato.datAssenza == '2021-11-17'
  }) )
})();
```
Risultato:
```js
[
  {
    codMin: 'Codice scuola',
    prgScuola: 1,
    numOra: 1,
    datGiustificazione: '2021-12-02',
    giustificataDa: '(Prof. COGNOME NOME)',
    prgAlunno: number,
    numAnno: 2021,
    datAssenza: '2021-11-17',
    oraAssenza: '01-01-1970 08:20',
    registrataDa: '(Prof. COGNOME NOME)',
    flgDaGiustificare: true,
    prgScheda: 1,
    desAssenza: '',
    codEvento: 'I',
    binUid: ''
  },
  {
    codMin: 'Codice scuola',
    prgScuola: 1,
    numOra: null,
    datGiustificazione: '2021-09-21',
    giustificataDa: '(Prof. COGNOME NOME)',
    prgAlunno: number,
    numAnno: 2021,
    datAssenza: '2021-09-20',
    registrataDa: '(Prof. COGNOME NOME)',
    flgDaGiustificare: true,
    prgScheda: 1,
    desAssenza: '',
    codEvento: 'A',
    binUid: ''
  }
]
```

## Informazioni finali

Per qualsiasi aiuto contattatemi su Telegram, link nella mia Bio.

Questa libreria è stata creata per usi EDUCATIVI E DI VALUTAZIONE.  
Nessuna responsabilità viene ritenuta o accettata per uso improprio.