export = Session;
declare class Session {
    constructor(scuola: string, nome: string, pass: string, version?: string);
    logIn: boolean;
    info: Info;
    version: string;

    get(method: 'oggi', date?: string): Promise<ROggi>;
    get(method: 'assenze', date?: string): Promise<RAssenze>;
    get(method: 'notedisciplinari', date?: string): Promise<RNote>;
    get(method: 'votigiornalieri', date?: string): Promise<RVoti>;
    get(method: 'compiti', date?: string): Promise<RCompiti>;
    get(method: 'argomenti', date?: string): Promise<RArgomenti>;
    get(method: 'promemoria', date?: string): Promise<RPromemoria>;
    get(method: 'orario', date?: string): Promise<ROrario>;
    get(method: 'docenticlasse', date?: string): Promise<Array<DDocenti>>;

    token(): string;
}

type Method = "oggi" | "assenze" | "notedisciplinari" | "votigiornalieri" | "compiti" | "argomenti" | "promemoria" | "orario" | "docenticlasse";

declare interface Info extends Dati {
    desSede: string;
    annoScolastico: {
        datInizio: string;
        datFine: string;
    }
    authToken: string;
    schedaSelezionata: boolean;
    alunno: {
        flgSesso: string;
        desCognome: string;
        desCittadinanza: string;
        desCg: string;
        desCellulare: any;
        desNome: string;
        datNascita: string;
        desCap: string;
        desComuneResidenza: string;
        desComuneNascita: string,
        desCapResidenza: string,
        desIndirizzoRecapito: string,
        desVia: string,
        desTelefono: string,
        desComuneRecapito: string
    }
    desScuola: string;
    desDenominazione: string;
    desCorso: string;
    prgClasse: number,
}

declare interface Result {
    dati: Array<Dati>;
    abilitazioni: Abilitazioni;
    disclaimer: string;
}
declare interface ROggi extends Dati{
    nuoviElementi: number;
    dati: Array<DOggi>;
}
declare interface RAssenze extends Result {
    dati: Array<DAssenze>;
}
declare interface RNote extends Result {
    dati: Array<DNote>;
}
declare interface RVoti extends Result {
    dati: Array<DVoti>;
}
declare interface RCompiti extends Result {
    dati: Array<DCompiti>;
}
declare interface RArgomenti extends Result {
    dati: Array<DArgomenti>;
}
declare interface RPromemoria extends Result {
    dati: Array<DPromemoria>;
}
declare interface ROrario extends Omit<Result, 'abilitazioni'> {
    dati: Array<DOrario>;
}

declare interface Dati {
    codMin: string;
    prgScuola: number;
    prgAlunno: number;
    numAnno: number;
    prgScheda: number;
}
declare interface DOggi extends Dati {
    ordine: number;
    tipo: string;
    titolo: string;
    giorno: string;
    dati: {
        codMin: string;
        prgScuola: number;
        numAnno: number;
        desArgomento: string;
        datGiorno: string;
        docente: string
        prgMateria: string;
        desMateria: string;
        prgClasse: number;
    };
}
declare interface DAssenze extends Dati {
    numOra: number;
    datGiustificazione: string;
    giustificataDa: string;
    datAssenza: string;
    registrataDa: string;
    flgDaGiustificare: boolean;
    desAssenza: string;
    binUid: string;
    codEvento: string;
}
declare interface DNote extends Dati {
    prgNota: number;
    desNota: string;
    flgVisualizzata: string;
    oraNota: string;
    datNota: string;
    docente: string;
    prgAnagrafe: number;
}
declare interface DVoti extends Dati {
    desProva: string;
    codVotoPratico: string;
    decValore: number;
    codVoto: string;
    docente: string;
    prgMateria: number;
    datGiorno: string;
    desMateria: string;
    desCommento: string;
}
declare interface DCompiti extends Omit<Dati, 'prgAlunno' | 'prgScheda'> {
    datCompitiPresente: boolean;
    datGiorno: string;
    docente: string;
    desCompitI: string;
    prgMateria: number;
    desMateria: string;
    prgClasse: number;
    datCompiti: string;
}
declare interface DArgomenti extends Omit<Dati, 'prgAlunno' | 'prgScheda'> {
    desArgomento: string;
    datGiorno: string;
    docente: string;
    prgMateria: number;
    desMateria: string;
    prgClasse: number;
}
declare interface DPromemoria extends Omit<Dati, 'prgAlunno' | 'prgScheda'> {
    desMittente: string;
    desAnnotazioni: string;
    prgProgressivo: number;
    datGiorno: string;
    prgAnagrafe: number;
    prgClasse: number;
}

declare interface DOrario {
    numOra: string;
    giorno: string;
    prgClasse: number;
    prgScuola: number;
    lezioni: Array<{
        materia: string;
        docente: string;
    }>
    numGiorno: string
    codMin: number;
}
declare interface DDocenti {
    codMin: string;
    prgScuola: number;
    materie: string;
    docente: {
        cognome: string;
        nome: string;
        email: string;
    };
    prgAnagrafe: number;
    prgClasse: number
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