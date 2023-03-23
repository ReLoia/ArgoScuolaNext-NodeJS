"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Session_debugLog, _Session_pageLoaded, _Session_clickEl;
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
class Session {
    ;
    constructor(scuola, nome, pass, debug = false) {
        this.logIn = false;
        this.debug = false;
        _Session_debugLog.set(this, (...msg) => {
            if (this.debug) {
                console.log(...msg);
            }
        });
        _Session_pageLoaded.set(this, () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Loaded: ", (_a = this.page) === null || _a === void 0 ? void 0 : _a.url());
            if ((_b = this.page) === null || _b === void 0 ? void 0 : _b.url().includes("?login_challenge")) {
                yield this.page.type("#username", this.nome);
                yield this.page.type("#password", this.pass);
                yield this.page.click(".card-body #accediBtn");
            }
            else if ((_c = this.page) === null || _c === void 0 ? void 0 : _c.url().includes("auth/sso/login")) {
                if ((_d = (yield this.html())) === null || _d === void 0 ? void 0 : _d.includes("Username e/o password non validi")) {
                    throw new Error("Username e/o password non validi");
                }
                this.close();
            }
            else if ((_e = this.page) === null || _e === void 0 ? void 0 : _e.url().includes("argoweb/famiglia/index.jsf")) {
                this.logIn = true;
                __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Logged in");
            }
        }));
        _Session_clickEl.set(this, (selector) => __awaiter(this, void 0, void 0, function* () {
            var _f, _g;
            yield ((_f = this.page) === null || _f === void 0 ? void 0 : _f.waitForSelector(selector));
            yield ((_g = this.page) === null || _g === void 0 ? void 0 : _g.evaluate((sel) => {
                const el = document.querySelector(sel);
                return el.click();
            }, selector));
        }));
        this.html = () => __awaiter(this, void 0, void 0, function* () {
            var _h;
            return yield ((_h = this.page) === null || _h === void 0 ? void 0 : _h.evaluate(() => {
                return document.documentElement.innerHTML;
            }));
        });
        this.scuola = scuola;
        this.nome = nome;
        this.pass = pass;
        this.debug = debug;
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _Session_debugLog, "f").call(this, "Logging in...");
            this.browser = yield puppeteer_1.default.launch();
            this.page = yield this.browser.newPage();
            this.page.on("load", __classPrivateFieldGet(this, _Session_pageLoaded, "f"));
            yield this.page.goto(`http://www.${this.scuola}.scuolanext.info/`);
            yield this.page.waitForNavigation();
            return this.logIn;
        });
    }
    compiti() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:compiti']");
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-compitiAssegnati:panel-compitiassegnati:form"] fieldset'));
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
        });
    }
    argomenti() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:argomenti']");
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-argomentiLezione:panel-argomentilezione:form"] fieldset'));
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
        });
    }
    docenti() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-serviziclasse:docenti-classe']");
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-docentiClasse:listgrid"] tr'));
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
        });
    }
    assenze() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:assenze']");
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-assenzeGiornaliere:sheet"] .btl-grid-dataViewContainer tbody tr'));
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
        });
    }
    note() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:note']");
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-noteDisciplinari:sheet"] .btl-grid-dataViewContainer tbody tr'));
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
        });
    }
    voti() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Session_clickEl, "f").call(this, "[id='menu-servizialunno:voti-giornalieri']");
            yield ((_a = this.page) === null || _a === void 0 ? void 0 : _a.waitForSelector('[id="sheet-sezioneDidargo:sheet"] fieldset'));
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
        });
    }
    close() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.browser) === null || _a === void 0 ? void 0 : _a.close());
        });
    }
}
exports.default = Session;
_Session_debugLog = new WeakMap(), _Session_pageLoaded = new WeakMap(), _Session_clickEl = new WeakMap();
