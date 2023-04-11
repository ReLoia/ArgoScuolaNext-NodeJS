import puppeteer, { Browser, Page } from "puppeteer";

export default class Session {
    logIn = false;
    browser: Browser = new Browser();
    page: Page = new Page();

    scuola: string;
    nome: string;
    pass: string;
    debug = false;

    constructor(scuola: string, nome: string, pass: string, debug = false) {
        this.scuola = scuola;
        this.nome = nome;
        this.pass = pass;
        this.debug = debug;
    }
    #debugLog = (...msg: any) => {
        if (this.debug) {
            console.log(...msg);
        }
    };

    async login(): Promise<boolean> {
        this.#debugLog("Logging in...");
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        this.page.on("load", this.#pageLoaded);
        await this.page.goto(`http://www.${this.scuola}.scuolanext.info/`);
        await this.page.waitForNavigation();

        return await this.#hasLoggedIn();
    }
    #pageLoaded = async () => {
        this.#debugLog("Loaded: ", this.page?.url());
        if (this.page?.url().includes("?login_challenge")) {
            await this.page.type("#username", this.nome);
            await this.page.type("#password", this.pass);
            await this.page.click(".card-body #accediBtn");
        } else if (this.page?.url().includes("auth/sso/login")) {
            if (
                (await this.html())?.includes(
                    "Username e/o password non validi"
                )
            ) {
                throw new Error("Username e/o password non validi");
            }
            this.close();
        } else if (this.page?.url().includes("argoweb/famiglia/index.jsf")) {
            this.logIn = true;
            this.#debugLog("Logged in");
        }
    };
    async #hasLoggedIn(): Promise<boolean> {
        let counter = 0;
        return new Promise(resolve => {
            const interval = setInterval(async () => {
                if (this.logIn) {
                    clearInterval(interval);
                    resolve(true);
                } else if (counter > 10) {
                    clearInterval(interval);
                    resolve(false);
                }
                counter++;
            }, 1000);
        });
    }

    async compiti(): Promise<
        Array<{
            consegna: string;
            materia: string;
            compito: string;
            assegnato: string;
        }>
    > {
        this.#debugLog("Executing compiti");
        await this.#clickEl("[id='menu-serviziclasse:compiti']");

        await this.page?.waitForSelector(
            '[id="sheet-compitiAssegnati:panel-compitiassegnati:form"] fieldset'
        );
        const ris = this.page?.evaluate(() => {
            let riss: Array<any> = [];
            Array.from(
                document.querySelectorAll(
                    '[id="sheet-compitiAssegnati:panel-compitiassegnati:form"] fieldset'
                )
            ).forEach(fieldset => {
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
        this.#clickEl(".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async argomenti(): Promise<
        Array<{
            materia: string | undefined;
            data: string;
            argomento: string;
        }>
    > {
        this.#debugLog("Executing argomenti");
        await this.#clickEl("[id='menu-serviziclasse:argomenti']");

        await this.page?.waitForSelector(
            '[id="sheet-argomentiLezione:panel-argomentilezione:form"] fieldset'
        );

        const ris = this.page?.evaluate(() => {
            let riss: Array<{
                materia: string | undefined;
                data: string;
                argomento: string;
            }> = [];

            Array.from(
                document.querySelectorAll(
                    '[id="sheet-argomentiLezione:panel-argomentilezione:form"] fieldset'
                )
            ).forEach(fieldset => {
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
        this.#clickEl(".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async docenti() {
        this.#debugLog("Executing docenti");
        await this.#clickEl("[id='menu-serviziclasse:docenti-classe']");

        await this.page?.waitForSelector(
            '[id="sheet-docentiClasse:listgrid"] tr'
        );
        const ris = this.page?.evaluate(() => {
            return Array.from(
                document.querySelectorAll(
                    '[id="sheet-docentiClasse:listgrid"] .btl-grid-dataViewContainer tbody tr'
                )
            ).map(el => {
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
        this.#clickEl(".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async assenze() {
        this.#debugLog("Executing assenze");
        await this.#clickEl("[id='menu-servizialunno:assenze']");
        await this.page?.waitForSelector(
            '[id="sheet-assenzeGiornaliere:sheet"] .btl-grid-dataViewContainer tbody tr'
        );

        const ris = this.page?.evaluate(() => {
            let riss: {
                assenze: Array<string>;
                uscite: Array<string>;
                ritardi: Array<string>;
            } = { assenze: [], uscite: [], ritardi: [] };

            Array.from(
                document.querySelectorAll(
                    '[id="sheet-assenzeGiornaliere:sheet"] .btl-grid-dataViewContainer tbody tr'
                )
            ).forEach(el => {
                Array.from(el.querySelectorAll("td")).forEach((il, i) => {
                    if (
                        il.innerHTML.includes('span[style=";"]') ||
                        !il.innerText
                    )
                        return;
                    if (i == 0) riss.assenze.push(il.innerText);
                    if (i == 1) riss.uscite.push(il.innerText);
                    if (i == 2) riss.ritardi.push(il.innerText);
                });
            });
            return riss;
        });

        this.#clickEl(".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async note() {
        this.#debugLog("Executing note");
        await this.#clickEl("[id='menu-servizialunno:note']");
        await this.page?.waitForSelector(
            '[id="sheet-noteDisciplinari:sheet"] .btl-grid-dataViewContainer tbody tr'
        );

        const ris = this.page?.evaluate(() => {
            return Array.from(
                document.querySelectorAll(
                    '[id="sheet-noteDisciplinari:sheet"] .btl-grid-dataViewContainer tbody tr'
                )
            ).map(tr => {
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

        this.#clickEl(".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }
    async voti(): Promise<
        Array<{
            materia: string | undefined;
            data: string | undefined;
            tipo: string | undefined;
            voto: string | undefined;
            description: string | undefined;
        }>
    > {
        this.#debugLog("Executing voti");
        if (!this.logIn) return [];
        await this.#clickEl("[id='menu-servizialunno:voti-giornalieri']");
        await this.page?.waitForSelector(
            '[id="sheet-sezioneDidargo:sheet"] fieldset'
        );

        const ris = this.page.evaluate(() => {
            let riss: Array<{
                materia: string | undefined;
                data: string | undefined;
                tipo: string | undefined;
                voto: string | undefined;
                description: string | undefined;
            }> = [];
            let lastData: any;

            Array.from(
                document.querySelectorAll(
                    '[id="sheet-sezioneDidargo:sheet"] fieldset'
                )
            ).forEach(fieldset => {
                Array.from(fieldset.querySelectorAll("tr")).forEach(function (tr) {
                    const data: any = tr.querySelector("td:nth-of-type(2)");

                    const info = /(Voto [A-Z-a-z]*?) .*? \((\d+\.\d{2})/g.exec(
                        tr.querySelector("td:nth-of-type(3)")?.innerHTML ?? ""
                    );
                    lastData = data.innerText.trim() || lastData;

                    riss.push({
                        materia: fieldset.querySelector("legend")?.innerText,
                        data: lastData,
                        tipo: info?.[1],
                        voto: info?.[2],
                        description:
                            tr.querySelector("td:nth-of-type(4)")?.innerHTML.trim(),
                    });
                });
            });

            return riss;
        });
        this.#clickEl(".btl-modal-head-mid .btl-modal-closeButton");
        return ris;
    }

    #clickEl = async (selector: string) => {
        await this.page?.waitForSelector(selector);
        await this.page?.evaluate(sel => {
            const el: any = document.querySelector(sel);
            return el.click();
        }, selector);
    };

    html = async () =>
        await this.page?.evaluate(() => {
            return document.documentElement.innerHTML;
        });

    async close() {
        try {
            await this.browser?.close();
        } catch {}
    }
}
