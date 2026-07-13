export type Roll = 'huvudtranare' | 'tranarteam' | 'spelare';

export type Status =
  | 'Ej påbörjat'
  | 'Pågår'
  | 'Delvis förstått'
  | 'Visat i träning'
  | 'Visat i match'
  | 'Etablerat';

export type SpelomradeId = 'anfall' | 'forsvar' | 'omstallning' | 'fasta';

export type PrincipNiva = 'super' | 'huvud' | 'sub' | 'roll';

export type MaterialTyp = 'bild' | 'video' | 'dokument' | 'länk';

export type MatchbevisTyp = 'match' | 'träningsmatch' | 'träning';

export type MatchbevisUtfall = 'uppnått' | 'delvis' | 'ej uppnått' | '—';

export interface Begrepp {
  term: string;
  forklaring: string;
}

export interface Kommentar {
  roll: Roll;
  text: string;
  datum: string;
}

export interface Identitet {
  id: string;
  namn: string;
  kortForklaring: string;
  beskrivning: string;
  varfor: string;
  beteenden: string[];
  missforstand: string[];
  coachrop: string[];
  matchexempel: string[];
  larstegIds: string[];
  uppdragIds: string[];
  matchbevisIds: string[];
}

export interface Larprogram {
  id: string;
  titel: string;
  beskrivning: string;
  larstegIds: string[];
}

export interface Larsteg {
  id: string;
  stegnummer: number;
  titel: string;
  sammanfattning: string;
  syfte: string;
  varforHar: string;
  forkunskaper: string;
  gemensamForstaelse: string;
  begrepp: Begrepp[];
  forstaelseHT: string;
  forstaelseTeam: string;
  forstaelseSpelare: string;
  beteenden: string[];
  identitetIds: string[];
  huvudomrade?: SpelomradeId;
  stodomraden: SpelomradeId[];
  traningsformer: string[];
  visualiseringar: string[];
  coachrop: string[];
  befintligtMaterial: string[];
  saknatMaterial: string[];
  uppdragIds: string[];
  matchbevisIds: string[];
  missforstand: string[];
  status: Status;
  progression: number;
  nastaSteg: string;
}

// Princip bär namn/beskrivning + allt beteendeinnehåll (planens fältlista
// beskriver formen på varje princip-post, inte separata Spelomrade-fält —
// källmaterialet är strukturerat per princip, inte per spelområde).
export interface Princip {
  id: string;
  namn: string;
  niva: PrincipNiva;
  parentId?: string;
  beskrivning: string;
  beteenden: string[];
  coachrop: string[];
  traningsformer: string[];
  bilder: string[];
}

export interface Spelomrade {
  id: SpelomradeId;
  namn: string;
  principer: Princip[];
}

export interface Traneruppdrag {
  id: string;
  titel: string;
  syfte: string;
  ansvarigRoll: Roll;
  forberedelser: string;
  observera: string;
  fragor: string[];
  coachrop: string[];
  forstarkBeteenden: string[];
  traningsformer: string[];
  nar: string;
  larstegId: string;
  status: Status;
  kommentarer: Kommentar[];
  nastaAktion: string;
}

export interface Matchbevis {
  id: string;
  situation: string;
  vadViSer: string;
  beteende: string;
  kvalitet: string;
  uppfoljning: string;
  utfall: MatchbevisUtfall;
  datum: string;
  typ: MatchbevisTyp;
  kommentar: string;
  materialRef: string;
  larstegId: string;
  identitetIds: string[];
}

export interface Material {
  id: string;
  titel: string;
  typ: MaterialTyp;
  url: string;
  beskrivning: string;
  taggar: string[];
}

export interface Observation {
  id: string;
  roll: Roll;
  text: string;
  datum: string;
  larstegId?: string;
  uppdragId?: string;
}

export interface AppState {
  larprogram: Larprogram;
  larsteg: Larsteg[];
  identiteter: Identitet[];
  spelomraden: Spelomrade[];
  uppdrag: Traneruppdrag[];
  matchbevis: Matchbevis[];
  material: Material[];
  observationer: Observation[];
  aktivtLarstegId: string;
}
