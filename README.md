# ArgoScuolaNext-NodeJS [ALTERNATIVE]

A NodeJS library that uses Puppeeteer to interact with ArgoScuolaNext.
This is not designed for production use it is primarily intended for testing and learning purposes.

## Installation
```bash
npm i argoscuolanext
(pnpm add / yarn add) 
```
Importing the package:
```js
import Session from "argoscuolanext";
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

```js
// Create the session
const argoscuolanext = require('./ArgoScuolaNext-NodeJS').default;
const session = new Argo('school code', 'user name', 'password', true); // Creates a new Session instance with debug true

// Use the async function
(async () => {
  // Login using the function
  if (await session.login()) {
    ...
  }
  
  ...
})();
```

### Requests

The informations can be obtained by calling the method of each 'endpoint'

```js
...

(async () => {
  
  if (await session.login()) {
    // The methods
    console.log(await session.voti());
    console.log(await session.argomenti());
    console.log(await session.assenze());
    console.log(await session.compiti());
    console.log(await session.docenti());
    console.log(await session.note());
  }

  ...
})();
```

### Contributing

Any suggestion is accepted! Please if you want to contribute, fork this repo and merge when you have done the modification.

## Disclaimer
This is for EDUCATIONAL AND EVALUATION PURPOSES ONLY.  
No responsibility is held or accepted for misuse.
