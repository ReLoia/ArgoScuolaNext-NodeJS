const got = require('got');
require('dotenv').config()
// Non usato - Non ricordo perché
// const rgxVer = new RegExp(/([\d.])+/);

class MissingError extends Error {
	constructor(message) {
		super(message);
		this.name = 'MissingError';
	}
}

const oggi = new Date(Date.now());

const arHd = {
	key: 'ax6542sdru3217t4eesd9',
	ver: '2.1.0',
	cod: 'APF',
	cpn: 'ARGO Software s.r.l. - Ragusa',
	ept: 'https://www.portaleargo.it/famiglia/api/rest/',
	agt: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
};


class Session {
	logIn = false;
	info = {};
	version;

	constructor(scuola, nome, pass, version = arHd.ver) {
		if (!scuola || typeof scuola != 'string') throw (!scuola ? new MissingError('Missing school code') : new TypeError('School code must be a String'));
		if (!nome || typeof nome != 'string') throw (!nome ? new MissingError('Missing name') : new TypeError('Name must be a String'));

		return this.#initialize(scuola, nome, pass, version);
	}
	
	async #initialize(scuola, nome, pass, version = arHd.ver) {
		try {
			const response = await got(
				`${arHd.ept}login`, {
				headers: {
					"x-key-app": arHd.key,
					"x-version": this.version,
					"x-produttore-software": arHd.cpn,
					"x-app-code": arHd.cod,
					"user-agent": arHd.agt,
					"x-cod-min": scuola,
					"x-user-id": nome,
					"x-pwd": pass
				},
				searchParams: {
					"_dc": Math.round(Date.now())
				},
				responseType: 'json'
			});
			this.info = (await this.#getInfos(scuola,
				response.body['token'],
				version))[0];

		} catch (error) {
			console.log(error);
		}
		this.logIn = true;
		this.version = version;

		return this;
	}

	async get(method, date) {
		if (!this.logIn) throw new Error('Client did not login'); // Contattami se l'errore non sarebbe dovuto avvenire. https://github.com/zXRennyXz/ArgoScuolaNext-NodeJS
		if (!date) date = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).length === 2 ? oggi.getMonth() + 1 : `0${oggi.getMonth() + 1}`}-${String(oggi.getDate()).length === 2 ? oggi.getDate() : `0${oggi.getDate()}`}`;
		if (!method || typeof method !== 'string') throw (!method ? new MissingError('Missing Method') : new TypeError('Method must be a String.'));

		try {
			const response = await got(
				`${arHd.ept}${method}`, {
				headers: {
					"x-key-app": arHd.key,
					"x-version": this.version,
					"user-agent": arHd.agt,
					"x-produttore-software": arHd.cpn,
					"x-app-code": arHd.cod,
					"x-auth-token": this.info['authToken'],
					"x-cod-min": this.info['codMin'],
					"x-prg-alunno": String(this.info['prgAlunno']),
					"x-prg-scheda": String(this.info['prgScheda']),
					"x-prg-scuola": String(this.info['prgScuola'])
				},
				searchParams: {
					"_dc": Math.round(Date.now()),
					"datGiorno": date
				},
				responseType: 'json'
			});
			return response.body;

		} catch (error) {
			switch (error.message) {
				case 'Response code 404 (Not Found)':
					// console.log(error);
					throw new Error('This get does not exist.');
			
				default:
					console.log(error)
					break;
			}
		}
	}

	async #getInfos(scuola, token, version = arHd.ver) {
		if (!scuola) throw new MissingError('Missing school code');
		if (!token) throw new MissingError('Missing token.'); // Contattami se l'errore non sarebbe dovuto avvenire. https://github.com/zXRennyXz/ArgoScuolaNext-NodeJS
		try {
			const response = await got(
				`${arHd.ept}schede`, {
				headers: {
					"x-key-app": arHd.key,
					"x-version": version,
					"x-produttore-software": arHd.cpn,
					"x-app-code": arHd.cod,
					"user-agent": arHd.agt,
					"x-cod-min": scuola,
					"x-auth-token": token
				},
				searchParams: {
					"_dc": Math.round(Date.now()),
				},
				responseType: 'json'
			});
			return response.body;

		} catch (error) {
			console.log(error);
		}
	}

	token() {
		return this.info.authToken
	}

	async updater() {
		if (!(process.env.NO_ARGOLB_UPDATE === "true" || process.env.NO_ARGOLB_UPDATE === "True")) { // If the environment variable "NO_ARGOLB_UPDATE" is false then the library will check for updates
			try {
				const response = await got(
					'https://api.github.com/repos/zXRennyXz/ArgoScuolaNext-NodeJS/releases/latest', {
					responseType: 'json'
				});
				if (response.body.tag_name !== (require('./package.json').version)) {
					console.warn('[ArgoScuolaNext] The library is out of date! Update it from npm.')
				}
			}
			catch (err) {
				console.log(`There was an error while checking for updates: "${err.message}"
You can disable this check setting the environment variable "NO_ARGOLB_UPDATE" to true`);
			}
		}
	}
}

Session.prototype.updater();
module.exports = Session;