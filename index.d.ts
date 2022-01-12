export = Session;
declare class Session {
    constructor(scuola: string, nome: string, pass: string, version?: string): Promise<Session>;
    logIn: boolean;
    info: {};
    version: string;
    get(method: string, date: string): Promise<Risultato>;
    token(): string;
    #private;
}

declare interface Risultato {
    dati: Array<Dati>;
    abilitazioni: Abilitazioni;
    disclaimer: string;
}

declare interface Dati {
    codMin: string;
    prgScuola: number;
    numOra?: number;
    datGiustificazione?: string;
    giustificataDa?: string;
    prgAlunno: number;
    numAnno: number;
    datAssenza?: string;
    registrataDa?: string;
    flgDaGiustificare?: boolean;
    prgScheda: number;
    desAssenza?: string;
    codEvento: string;
    binUid: string;
}

declare interface Abilitazioni {
    ORARIO_SCOLASTICO: boolean;
    CURRICULUM_MODIFICA_FAMIGLIA: boolean;
    PAGELLINO_ONLINE: boolean;
    VALUTAZIONI_PERIODICHE: boolean;
    VALUTAZIONI_GIORNALIERE: boolean;
    INVALSI: boolean;
    COMPITI_ASSEGNATI: boolean;
    IGNORA_OPZIONE_VOTI_DOCENTI: boolean;
    DOCENTI_CLASSE: boolean;
    RECUPERO_DEBITO_SF: boolean;
    RICHIESTA_CERTIFICATI: boolean;
    MODIFICA_RECAPITI: boolean;
    CONSIGLIO_DI_ISTITUTO: boolean;
    NOTE_DISCIPLINARI: boolean;
    ACCESSO_CON_CONTROLLO_SCHEDA: boolean;
    MEDIA_PESATA: boolean;
    GIUSTIFICAZIONI_ASSENZE: boolean;
    TABELLONE_PERIODI_INTERMEDI: boolean;
    PAGELLE_ONLINE: boolean;
    ASSENZE_PER_DATA: boolean;
    CURRICULUM_VISUALIZZA_FAMIGLIA: boolean;
    VALUTAZIONI_SOSPESE_PERIODICHE: boolean;
    CAMBIO_PASSWORD: boolean;
    VISUALIZZA_ASSENZE_REG_PROF: boolean;
    ARGOMENTI_LEZIONE: boolean;
    ACCESSO_SENZA_CONTROLLO: boolean;
    ALILITA_BSMART_FAMIGLIA: boolean;
    VOTI_GIUDIZI: boolean;
    VISUALIZZA_CURRICULUM: boolean;
    RECUPERO_DEBITO_INT: boolean;
    ABILITA_AUTOCERTIFICAZIONE_FAM: boolean;
    TABELLONE_SCRUTINIO_FINALE: boolean;
    PIN_VOTI: boolean;
    VISUALIZZA_BACHECA_PUBBLICA: boolean;
    DISABILITA_ACCESSO_FAMIGLIA: boolean;
    TASSE_SCOLASTICHE: boolean;
    PROMEMORIA_CLASSE: boolean;
    PRENOTAZIONE_ALUNNI: boolean;
    CONSIGLIO_DI_CLASSE: boolean;
}