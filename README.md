# ArgoScuolaNext-NodeJS

Una libreria per accedere ai servizi ArgoScuolaNext utilizzano NodeJS.

### Premessa

Ho sgraffignato molte delle informazioni/variabili/header/altro dalla libreria di [hearot](https://github.com/hearot/) :  
[ArgoScuolaNext-Python](https://github.com/hearot/ArgoScuolaNext-Python)  
Non usi Python? Queste sono altre librerie per ArgoScuolaNext **create da hearot** :  
[ArgoScuolaNext APIs in Php](https://github.com/hearot/ArgoScuolaNext)  
[ArgoScuolaNext APIs in Go](https://github.com/hearot/ArgoScuolaNext-go)

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
Questa libreria è asincrona e quindi dovrai utilizzare [await/async](https://discordjs.guide/additional-info/async-await.html).    
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

Nota: Nei prossimi esempi nei quali è utilizzato await la IIFE è sottintesa.

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
2Nota : La funzione è asincrona.
Esempio:
```js
  (async () => {
    const sessione = await (new argo('codice scuola', 'nome utente', 'password'));
    const risultato = await sessione.get('assenze','');
    console.log(risultato)
  })();
```
Risultato:
```json
{
  "dati": [
    {
      "codMin": "",
      "prgScuola": number,
      "numOra": number,
      "prgAlunno": number,
      "numAnno": number,
      "datAssenza": "YYYY-MM-DD",
      "oraAssenza": "01-01-1970 HH:MM",
      "registrataDa": "",
      "flgDaGiustificare": boolean,
      "prgScheda": number,
      "desAssenza": "",
      "codEvento": "",
      "binUid": ""
    }
  ],
  "abilitazioni": {
  },
  "disclaimer": ""
}
```
Per migliori informazioni sui risultati e altri endpoint controllare la pagina GItHub di hearot.
