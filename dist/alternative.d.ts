import { Browser, Page } from "puppeteer";
export default class Session {
    #private;
    logIn: boolean;
    browser: Browser;
    page: Page;
    scuola: string;
    nome: string;
    pass: string;
    debug: boolean;
    constructor(scuola: string, nome: string, pass: string, debug?: boolean);
    login(): Promise<boolean>;
    compiti(): Promise<Array<{
        consegna: string;
        materia: string;
        compito: string;
        assegnato: string;
    }>>;
    argomenti(): Promise<Array<{
        materia: string | undefined;
        data: string;
        argomento: string;
    }>>;
    docenti(): Promise<{
        sesso: string;
        docente: string | undefined;
        materia: string | undefined;
        coordinatore: boolean | undefined;
    }[]>;
    assenze(): Promise<{
        assenze: Array<string>;
        uscite: Array<string>;
        ritardi: Array<string>;
    }>;
    note(): Promise<{
        data: string | undefined;
        nota: string | undefined;
        docente: string | undefined;
        categoria: string | undefined;
        ora: string | undefined;
    }[]>;
    voti(): Promise<Array<{
        materia: string | undefined;
        data: string | undefined;
        tipo: string | undefined;
        voto: string | undefined;
        description: string | undefined;
    }>>;
    html: () => Promise<string>;
    close(): Promise<void>;
}
