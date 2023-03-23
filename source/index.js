// Check for update using .checkupdate() if the module is not working propertly.

const got = require('got');
// Not used because it is not necessary.
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

errorHandler = (err) => {
	switch (err.message) {
		case 'Response code 404 (Not Found)':
			throw new Error('That method does not exist.');
		case 'Response code 401 (Unauthorized)':
			throw new Error('Wrong credentials.');

		default:
			console.log(err);
			break;
	}
};

class Session {
	logIn = false;
	info = {};
	version;

	constructor(scuola, nome, pass) {
		if (!scuola || typeof scuola != 'string') throw (!scuola ? new MissingError('Missing school code') : new TypeError('School code must be a String'));
		if (!nome || typeof nome != 'string') throw (!nome ? new MissingError('Missing name') : new TypeError('Name must be a String'));
		if (!pass || typeof pass != 'string') throw (!pass ? new MissingError('Missing password') : new TypeError('Password must be a String'));

		return this.#initialize(scuola, nome, pass);
	}

	async #initialize(scuola, nome, pass) {
		try {
			const response = await got(
				`${arHd.ept}login`, {
				headers: {
					"x-key-app": arHd.key,
					"x-version": arHd.ver,
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
			this.info = (await this.#getInfos(scuola, response.body['token']))[0];

		} catch (error) {
			errorHandler(error);
		}
		this.logIn = true;

		return this;
	}

	async get(method, date = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).length === 2 ? oggi.getMonth() + 1 : `0${oggi.getMonth() + 1}`}-${String(oggi.getDate()).length === 2 ? oggi.getDate() : `0${oggi.getDate()}`}`) {
		if (!this.logIn) throw new Error('Client did not login'); // Contant the creator of the library if the error shouldn't have happened. https://github.com/ReLoia/ArgoScuolaNext-NodeJS
		if (!method || typeof method !== 'string') throw (!method ? new MissingError('Missing Method') : new TypeError('Method must be a String.'));

		try {
			const response = await got(
				`${arHd.ept}${method}`, {
				headers: {
					"x-key-app": arHd.key,
					"x-version": arHd.ver,
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
			errorHandler(error);
		}
	}

	async #getInfos(scuola, token) {
		if (!token) throw new MissingError('Missing token.'); // Contant the creator of the library if the error shouldn't have happened. https://github.com/ReLoia/ArgoScuolaNext-NodeJS
		try {
			const response = await got(
				`${arHd.ept}schede`, {
				headers: {
					"x-key-app": arHd.key,
					"x-version": arHd.ver,
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
			errorHandler(error);
		}
	}
	
}

module.exports = Session;
