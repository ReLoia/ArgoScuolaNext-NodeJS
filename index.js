const got = require('got');


const rgxVer = new RegExp(/([\d.])+/);
const oggi = new Date(Date.now());

const arHd = {
	key: 'ax6542sdru3217t4eesd9',
	ver: '2.1.0',
	cod: 'APF',
	cpn: 'ARGO Software s.r.l. - Ragusa',
	ept: 'https://www.portaleargo.it/famiglia/api/rest/',
	agt: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36',
};


// Codice

class Session {
	logged_in = false;
	information = {};
	version;

	constructor(scuola, nome, pass, version = arHd.ver) {
		if (!scuola) throw new Error('Codice scuola mancante');
		if (!nome) throw new Error('Codice utente mancante');

		return this.init(scuola, nome, pass, version);
	}
	
	async init(scuola, nome, pass, version = arHd.ver) {
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
	
			if (response.statusCode != 200) {
				try {
					version = rgxVer.exec(response.body['value'])[0];
					this.information = Session(scuola, nome, pass, version).information;
					arHd.ver = version;
				} catch (err) {
					throw new Error('Richiesta o credenziali sbagliate.');
				}
			}
			else {
				this.information = await this.get_information(scuola,
					response.body['token'],
					version);
			}
		} catch (error) {
			console.log(error);
		}
		this.logged_in = true;
		this.version = version;

		return this;
	}

	async get(method, date) {

		if (!this.logged_in) throw new Error('Il client non ha fatto il login. Contattare il creatore della libreria se l\'errore non dovrebbe avvenire.');
		if (!date) date = `${oggi.getFullYear()}-${String(oggi.getMonth() + 1).length === 2 ? oggi.getMonth() + 1 : `0${oggi.getMonth() + 1}`}-${String(oggi.getDate()).length === 2 ? oggi.getDate() : `0${oggi.getDate()}`}`;
		if (typeof method !== 'string') throw new TypeError('Method deve essere una Stringa.');

		try {
			const response = await got(
				`${arHd.ept}${method}`, {
				headers: {
					"x-key-app": arHd.key,
					"x-version": this.version,
					"user-agent": arHd.agt,
					"x-produttore-software": arHd.cpn,
					"x-app-code": arHd.cod,
					"x-auth-token": this.information[0]['authToken'],
					"x-cod-min": this.information[0]['codMin'],
					"x-prg-alunno": String(this.information[0]['prgAlunno']),
					"x-prg-scheda": String(this.information[0]['prgScheda']),
					"x-prg-scuola": String(this.information[0]['prgScuola'])
				},
				searchParams: {
					"_dc": Math.round(Date.now()),
					"datGiorno": date
				},
				responseType: 'json'
			});

			if (response.statusCode != 200) {
				try {
					this.version = rgxVer.exec(response.body['value'])[0];
					return this.get(method, date);
				} catch (err) {
					throw new Error('Richiesta o credenziali sbagliate.');
				}
			}
			else {
				return response.body;
			}
		} catch (error) {
			console.log(error);
		}

	}

	async get_information(scuola, token, version = arHd.ver) {
		if (!scuola) throw new Error('Codice scuola mancante');
		if (!token) throw new Error('Token mancante. Contattare il creatore della libreria se l\'errore non dovrebbe avvenire.');
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

			if (response.statusCode != 200) {
				version = rgxVer.exec(response.body['value'])[0];
				return Session.get_information(scuola, token, version);
			}
			return response.body;

		} catch (error) {
			console.log(error);
		}
	}

	token() {
		return this.information[0]['authToken'];
	}
}

module.exports = Session;