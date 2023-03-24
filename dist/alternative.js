"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Session_instances, _Session_debugLog, _Session_pageLoaded, _Session_hasLoggedIn, _Session_clickEl;
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
class Session {
    ;
    constructor(scuola, nome, pass, debug = false) {
        _Session_instances.add(this);
        this.logIn = false;
        this.debug = false;
        _Session_debugLog.set(this, (...msg) => {
            if (this.debug) {
                console.log(...msg);
            }
        });
        _Session_pageLoaded.set(this, async () => {
            var _a, _b, _c, _d, _e;
            __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Loaded: ", (_a = this.page) === null || _a === void 0 ? void 0 : _a.url());
            if ((_b = this.page) === null || _b === void 0 ? void 0 : _b.url().includes("?login_challenge")) {
                await this.page.type("#username", this.nome);
                await this.page.type("#password", this.pass);
                await this.page.click(".card-body #accediBtn");
            }
            else if ((_c = this.page) === null || _c === void 0 ? void 0 : _c.url().includes("auth/sso/login")) {
                if ((_d = (await this.html())) === null || _d === void 0 ? void 0 : _d.includes("Username e/o password non validi")) {
                    throw new Error("Username e/o password non validi");
                }
                this.close();
            }
            else if ((_e = this.page) === null || _e === void 0 ? void 0 : _e.url().includes("argoweb/famiglia/index.jsf")) {
                this.logIn = true;
                __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Logged in");
            }
        });
        _Session_clickEl.set(this, async (selector) => {
            var _a, _b;
            await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector(selector));
            await ((_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate((sel) => {
                const el = document.querySelector(sel);
                return el.click();
            }, selector));
        });
        this.html = async () => {
            var _a;
            return await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.evaluate(() => {
                return document.documentElement.innerHTML;
            }));
        };
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
        var _a, _b;
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:compiti']");
        await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-compitiAssegnati:panel-compitiassegnati:form"] fieldset'));
        const ris = (_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(() => {
            let riss = [];
            const fieldsets = Array.from(document.querySelectorAll('[id="sheet-compitiAssegnati:panel-compitiassegnati:form"] fieldset'));
            fieldsets.forEach((el) => {
                Array.from(el.querySelectorAll("tr")).forEach(function (il) {
                    var _a, _b;
                    const info = RegExp(/<td> (.+) \(Assegnati il ([0-9]{2}\/[0-9]{2}\/[0-9]{4})/g).exec(il.innerHTML);
                    riss.push({
                        consegna: (_a = el === null || el === void 0 ? void 0 : el.querySelector("legend")) === null || _a === void 0 ? void 0 : _a.innerText,
                        materia: (_b = el === null || el === void 0 ? void 0 : el.querySelector("b")) === null || _b === void 0 ? void 0 : _b.innerText,
                        compito: info === null || info === void 0 ? void 0 : info[1],
                        assegnato: info === null || info === void 0 ? void 0 : info[2],
                    });
                });
            });
            return riss;
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async argomenti() {
        var _a, _b;
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:argomenti']");
        await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-argomentiLezione:panel-argomentilezione:form"] fieldset'));
        const ris = (_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(() => {
            let riss = [];
            let lastData;
            const fieldsets = Array.from(document.querySelectorAll('[id="sheet-argomentiLezione:panel-argomentilezione:form"] fieldset'));
            fieldsets.forEach((el) => {
                Array.from(el.querySelectorAll("tr")).forEach(function (il) {
                    var _a, _b;
                    const arg = il.querySelector("td:nth-of-type(2)");
                    lastData = ((_a = il.querySelector("td")) === null || _a === void 0 ? void 0 : _a.innerText) || lastData;
                    riss.push({
                        materia: (_b = el.querySelector("legend")) === null || _b === void 0 ? void 0 : _b.innerText,
                        data: lastData,
                        argomento: arg.innerText,
                    });
                });
            });
            return riss;
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async docenti() {
        var _a, _b;
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:docenti-classe']");
        await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-docentiClasse:listgrid"] tr'));
        const ris = (_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(() => {
            const els = Array.from(document.querySelectorAll('[id="sheet-docentiClasse:listgrid"] .btl-grid-dataViewContainer tbody tr'));
            return els.map((el) => {
                // return el.innerHTML;
                const info = RegExp(/([a-z])\.png.*nominativo">(.*?)<\/.*materie">(.*?)<\//g).exec(el.innerHTML);
                return {
                    sesso: (info === null || info === void 0 ? void 0 : info[1]) == 'f' ? "F" : "M",
                    docente: info === null || info === void 0 ? void 0 : info[2].replace('(*)', ''),
                    materia: info === null || info === void 0 ? void 0 : info[3],
                    coordinatore: info === null || info === void 0 ? void 0 : info[2].includes('(*)')
                };
            });
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async assenze() {
        var _a, _b;
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:assenze']");
        await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-assenzeGiornaliere:sheet"] .btl-grid-dataViewContainer tbody tr'));
        const ris = (_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(() => {
            let riss = { assenze: [], uscite: [], ritardi: [] };
            const elements = Array.from(document.querySelectorAll('[id="sheet-assenzeGiornaliere:sheet"] .btl-grid-dataViewContainer tbody tr'));
            elements.forEach((el) => {
                Array.from(el.querySelectorAll('td')).forEach((il, i) => {
                    if (il.innerHTML.includes('span[style=";"]') || !il.innerText)
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
        var _a, _b;
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:note']");
        await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-noteDisciplinari:sheet"] .btl-grid-dataViewContainer tbody tr'));
        const ris = (_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(() => {
            const riss = [];
            const elements = Array.from(document.querySelectorAll('[id="sheet-noteDisciplinari:sheet"] .btl-grid-dataViewContainer tbody tr'));
            return elements.map((el) => {
                const info = RegExp(/([0-9]{2}\/[0-9]{2}\/[0-9]{4})<\/span.*?display:none;">([A-Z\/a-z ,.'0-9]+)<.*?display:none;">([A-Z-a-z- -,-.]+)<\/span>.*?display:none;">[A-Z-a-z- -,-.]+<\/span>.*?display:none;">([0-9]{2}:[0-9]{2}:[0-9]{2})<\//g).exec(el.innerHTML);
                return {
                    data: info === null || info === void 0 ? void 0 : info[1],
                    nota: info === null || info === void 0 ? void 0 : info[2],
                    docente: info === null || info === void 0 ? void 0 : info[3],
                    categoria: info === null || info === void 0 ? void 0 : info[4],
                    ora: info === null || info === void 0 ? void 0 : info[5],
                };
            });
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async voti() {
        var _a, _b;
        await __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:voti-giornalieri']");
        await ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-sezioneDidargo:sheet"] fieldset'));
        const ris = (_b = this.page) === null || _b === void 0 ? void 0 : _b.evaluate(() => {
            let riss = [];
            let lastData;
            const fieldsets = Array.from(document.querySelectorAll('[id="sheet-sezioneDidargo:sheet"] fieldset'));
            fieldsets.forEach((el) => {
                Array.from(el.querySelectorAll("tr")).forEach(function (il) {
                    var _a, _b, _c, _d;
                    const data = il.querySelector("td:nth-of-type(2)");
                    const info = RegExp(/(Voto [A-Z-a-z]*?) .*? \(([0-9]+\.[0-9]{2})/g).exec((_b = (_a = il.querySelector("td:nth-of-type(3)")) === null || _a === void 0 ? void 0 : _a.innerHTML) !== null && _b !== void 0 ? _b : '');
                    lastData = data.innerText.trim() || lastData;
                    riss.push({
                        materia: (_c = el.querySelector("legend")) === null || _c === void 0 ? void 0 : _c.innerText,
                        data: lastData,
                        tipo: info === null || info === void 0 ? void 0 : info[1],
                        voto: info === null || info === void 0 ? void 0 : info[2],
                        description: (_d = il.querySelector("td:nth-of-type(4)")) === null || _d === void 0 ? void 0 : _d.innerHTML,
                    });
                });
            });
            return riss;
        });
        __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, ".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async close() {
        var _a;
        await ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
    }
}
exports.default = Session;
_Session_debugLog = new WeakMap(), _Session_pageLoaded = new WeakMap(), _Session_clickEl = new WeakMap(), _Session_instances = new WeakSet(), _Session_hasLoggedIn = async function _Session_hasLoggedIn() {
    let counter = 0;
    return new Promise((resolve) => {
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
