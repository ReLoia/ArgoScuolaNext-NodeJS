"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Session_instances, _Session_debugLog, _Session_pageLoaded, _Session_hasLoggedIn, _Session_clickEl;
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
class Session {
    constructor(scuola, nome, pass, debug = false) {
        _Session_instances.add(this);
        this.logIn = false;
        this.browser = new puppeteer_1.Browser();
        this.page = new puppeteer_1.Page();
        this.debug = false;
        _Session_debugLog.set(this, (...msg) => {
            if (this.debug) {
                console.log(...msg);
            }
        });
        _Session_pageLoaded.set(this, async () => {
            __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Loaded: ", this.page?.url());
            if (this.page?.url().includes("?login_challenge")) {
                await this.page.type("#username", this.nome);
                await this.page.type("#password", this.pass);
                await this.page.click(".card-body #accediBtn");
            }
            else if (this.page?.url().includes("auth/sso/login")) {
                if ((await this.html())?.includes("Username e/o password non validi")) {
                    throw new Error("Username e/o password non validi");
                }
                this.close();
            }
            else if (this.page?.url().includes("argoweb/famiglia/index.jsf")) {
                this.logIn = true;
                __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Logged in");
            }
        });
        _Session_clickEl.set(this, async (selector) => {
            await this.page?.waitForSelector(selector);
            await this.page?.evaluate(sel => {
                const el = document.querySelector(sel);
                return el.click();
            }, selector);
        });
        this.html = async () => await this.page?.evaluate(() => {
            return document.documentElement.innerHTML;
        });
        this.scuola = scuola;
        this.nome = nome;
        this.pass = pass;
        this.debug = debug;
    }
    async login() {
        __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Logging in...");
        this.browser = await puppeteer_1.default.launch();
        this.page = await this.browser.newPage();
        this.page.on("load", __classPrivateFieldGet(this, _Session_pageLoaded, "f"));
        await this.page.goto(`http://www.${this.scuola}.scuolanext.info/`);
        await this.page.waitForNavigation();
        return await __classPrivateFieldGet(this, _Session_instances, "m", _Session_hasLoggedIn).call(this);
    }
    async compiti() {
        __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Executing compiti");
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:compiti']");
        await this.page?.waitForSelector('[id="sheet-compitiAssegnati:panel-compitiassegnati:form"] fieldset');
        const ris = this.page?.evaluate(() => {
            let riss = [];
            Array.from(document.querySelectorAll('[id="sheet-compitiAssegnati:panel-compitiassegnati:form"] fieldset')).forEach(fieldset => {
                let lastMateria = "";
                Array.from(fieldset.querySelectorAll("tr")).forEach(function (tr) {
                    const info = /<td> (.+) \(Assegnati il (\d{2}\/\d{2}\/\d{4})/g.exec(tr.innerHTML);
                    lastMateria = tr.querySelector("td")?.innerText || lastMateria;
                    riss.push({
                        consegna: fieldset.querySelector("legend")?.innerText,
                        materia: lastMateria,
                        compito: info?.[1],
                        assegnato: info?.[2],
                    });
                });
            });
            return riss;
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async argomenti() {
        __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Executing argomenti");
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:argomenti']");
        await this.page?.waitForSelector('[id="sheet-argomentiLezione:panel-argomentilezione:form"] fieldset');
        const ris = this.page?.evaluate(() => {
            let riss = [];
            Array.from(document.querySelectorAll('[id="sheet-argomentiLezione:panel-argomentilezione:form"] fieldset')).forEach(fieldset => {
                let lastData = "";
                Array.from(fieldset.querySelectorAll("tr")).forEach(function (tr) {
                    lastData = tr.querySelector("b")?.innerText || lastData;
                    riss.push({
                        materia: fieldset.querySelector("legend")?.innerText,
                        data: lastData,
                        argomento: tr.innerText.replace(lastData, "").trim(),
                    });
                });
            });
            return riss;
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async docenti() {
        __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Executing docenti");
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:docenti-classe']");
        await this.page?.waitForSelector('[id="sheet-docentiClasse:listgrid"] tr');
        const ris = this.page?.evaluate(() => {
            return Array.from(document.querySelectorAll('[id="sheet-docentiClasse:listgrid"] .btl-grid-dataViewContainer tbody tr')).map(el => {
                // return el.innerHTML;
                const info = /([a-z])\.png.*nominativo">(.*?)<\/.*materie">(.*?)<\//g.exec(el.innerHTML);
                return {
                    sesso: info?.[1] == "f" ? "F" : "M",
                    docente: info?.[2].replace("(*)", ""),
                    materia: info?.[3],
                    coordinatore: info?.[2].includes("(*)"),
                };
            });
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async assenze() {
        __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Executing assenze");
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:assenze']");
        await this.page?.waitForSelector('[id="sheet-assenzeGiornaliere:sheet"] .btl-grid-dataViewContainer tbody tr');
        const ris = this.page?.evaluate(() => {
            let riss = { assenze: [], uscite: [], ritardi: [] };
            Array.from(document.querySelectorAll('[id="sheet-assenzeGiornaliere:sheet"] .btl-grid-dataViewContainer tbody tr')).forEach(el => {
                Array.from(el.querySelectorAll("td")).forEach((il, i) => {
                    if (il.innerHTML.includes('span[style=";"]') ||
                        !il.innerText)
                        return;
                    if (i == 0)
                        riss.assenze.push(il.innerText);
                    if (i == 1)
                        riss.uscite.push(il.innerText);
                    if (i == 2)
                        riss.ritardi.push(il.innerText);
                });
            });
            return riss;
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async note() {
        __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Executing note");
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:note']");
        await this.page?.waitForSelector('[id="sheet-noteDisciplinari:sheet"] .btl-grid-dataViewContainer tbody tr');
        const ris = this.page?.evaluate(() => {
            return Array.from(document.querySelectorAll('[id="sheet-noteDisciplinari:sheet"] .btl-grid-dataViewContainer tbody tr')).map(tr => {
                const info = /(\d{2}\/\d{2}\/\d{4})<\/span.*?display:none;">([A-Z\/a-z ,.'\d]+)<.*?display:none;">([A-Z-a-z- -,-.]+)<\/span>.*?display:none;">([A-Z-a-z ]+)<\/span>.*?display:none;">(\d{2}:\d{2}:\d{2})<\//g.exec(tr.innerHTML);
                return {
                    data: info?.[1],
                    nota: info?.[2],
                    docente: info?.[3],
                    categoria: info?.[4],
                    ora: info?.[5],
                };
            });
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async voti() {
        __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Executing voti");
        if (!this.logIn)
            return [];
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:voti-giornalieri']");
        await this.page?.waitForSelector('[id="sheet-sezioneDidargo:sheet"] fieldset');
        const ris = this.page.evaluate(() => {
            let riss = [];
            let lastData;
            Array.from(document.querySelectorAll('[id="sheet-sezioneDidargo:sheet"] fieldset')).forEach(fieldset => {
                Array.from(fieldset.querySelectorAll("tr")).forEach(function (tr) {
                    const data = tr.querySelector("td:nth-of-type(2)");
                    const info = /(Voto [A-Z-a-z]*?) .*? \((\d+\.\d{2})/g.exec(tr.querySelector("td:nth-of-type(3)")?.innerHTML ?? "");
                    lastData = data.innerText.trim() || lastData;
                    riss.push({
                        materia: fieldset.querySelector("legend")?.innerText,
                        data: lastData,
                        tipo: info?.[1],
                        voto: info?.[2],
                        description: tr.querySelector("td:nth-of-type(4)")?.innerHTML.trim(),
                    });
                });
            });
            return riss;
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async close() {
        try {
            await this.browser?.close();
        }
        catch { }
    }
}
exports.default = Session;
_Session_debugLog = new WeakMap(), _Session_pageLoaded = new WeakMap(), _Session_clickEl = new WeakMap(), _Session_instances = new WeakSet(), _Session_hasLoggedIn = async function _Session_hasLoggedIn() {
    let counter = 0;
    return new Promise(resolve => {
        const interval = setInterval(async () => {
            if (this.logIn) {
                clearInterval(interval);
                resolve(true);
            }
            else if (counter > 10) {
                clearInterval(interval);
                resolve(false);
            }
            counter++;
        }, 1000);
    });
};
