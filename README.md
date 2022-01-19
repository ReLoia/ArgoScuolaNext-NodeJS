# ArgoScuolaNext-NodeJS

A NodeJS library that allows you to interact with ArgoScuolaNext API.

### Premise

Thank you [hearot](https://github.com/hearot/) for some informations/endpoint/and other I took from your package [ArgoScuolaNext-Python](https://github.com/hearot/ArgoScuolaNext-Python).  

## Installation

npm:
```bash
npm i ArgoScuolaNext
```

yarn:
```bash
yarn add ArgoScuolaNext
```

Importing the package:
```js
const argo = require('./ArgoScuolaNext-NodeJS');
```

## Usage

#### Warning:  
This is an async library so you need to use [await/async](https://discordjs.guide/additional-info/async-await.html) or Promise.  
For this reason you need to use an async function.  
My tip is to use an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE). Example :
```js
(async () => {
	...
})();
```
In this example I have also used an [Arrow Function `() => {}`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) this doesn't have any great difference from a normal function `function() {}`  

### Login

First you need to create a new Session istance: logging in.  

```js
...

(async () => {
  const session = await (new argo('school code', 'user name', 'password'));
})();
```

### Requests

To make a request to the API you need to use the endpoint's method.  
Those methods are :
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
Those methods accept as parameter :
- date: The chosen date   - not required < This may not work with some API endpoints < Format : YYYY/MM/DD  
Note: In the future some endpoint may be not written here because the API may have been updated. To stay updated check hearot package's GitHub page.  
Example:
```js
...

(async () => {
  const session = await (new argo('school code', 'user name', 'password'));
  const result = await sessione.assenze();

  console.log(result)
})();
```
Result:
```js
{
  dati: [
    {
      codMin: string;
      prgScuola: number;
      prgAlunno: number;
      numAnno: number;
      prgScheda: number;
      numOra: number;
      datGiustificazione: string;
      giustificataDa: string;
      datAssenza: string;
      registrataDa: string;
      flgDaGiustificare: boolean;
      desAssenza: string;
      binUid: string;
      codEvento: string;
    }
  ],
  abilitazioni: {
  },
  disclaimer: ''
}
```
Using Visual Studio code will certainly help thanks to TypeScript IntelliSense which will show code completion.
I wrote the [module .d.ts](https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html) of the library. 

For more infos about results and other endpoints check hearot package's GitHub page.

#### Suggestion
I suggest you to take a look to [index.d.ts](https://github.com/zXRennyXz/ArgoScuolaNext-NodeJS/blob/main/index.d.ts) because it can be very useful to understand the API.
Any suggestion is accepted! Please if you want to contribute, fork this repo and merge when you have done the modification.

### More examples

#### Setting up a filter
```js
...

(async () => {
  const session = await (new argo('school code', 'user name', 'password'));
  const result = await sessione.assenze();
  const dati = risultato.dati; // We just need `dati`
  
  // Let's use Arrays' method `filter()` with an Arrow Function to set the filter.
  console.log( dati.filter(dato => { // You can give any name to the variable.
  	// In the Arrow Function we must put a condition that returns true.
	/**
   * For example, this condition is can be used to choose only `dati` with a certain "datAssenza"
   * This can be useful if the parameter `date` doesn't work with the chosen endpoint.
   * 
   * We can use any condition we want.
	*/
	return (dato.datAssenza == '2021-09-20' && dato.datGiustificazione == '2021-10-14') || dato.datAssenza == '2021-11-17'
  }) )
})();
```
Result:
```js
[
  {
    codMin: 'School code',
    prgScuola: 1,
    numOra: 1,
    datGiustificazione: '2021-12-02',
    giustificataDa: '(Prof. SURNAME NAME)',
    prgAlunno: number,
    numAnno: 2021,
    datAssenza: '2021-11-17',
    oraAssenza: '01-01-1970 08:20',
    registrataDa: '(Prof. SURNAME NAME)',
    flgDaGiustificare: true,
    prgScheda: 1,
    desAssenza: '',
    codEvento: 'I',
    binUid: ''
  },
  {
    codMin: 'School code',
    prgScuola: 1,
    numOra: null,
    datGiustificazione: '2021-09-21',
    giustificataDa: '(Prof. SURNAME NAME)',
    prgAlunno: number,
    numAnno: 2021,
    datAssenza: '2021-09-20',
    registrataDa: '(Prof. SURNAME NAME)',
    flgDaGiustificare: true,
    prgScheda: 1,
    desAssenza: '',
    codEvento: 'A',
    binUid: ''
  }
]
```

## Final infos

For more info contact me.

This is for EDUCATIONAL AND EVALUATION PURPOSES ONLY.  
No responsibility is held or accepted for misuse.
