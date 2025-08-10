export interface UserDemDto {
  id: number;
  fullName: string;
  adresse: string;
  telephone: string;
}


export interface Instrument {
  id: number;
  nomInstrument: string;
  codeInstrument: string;
}

export interface DemandeResponseDto {
  id: number;
  nomInstrument: string;
  referenceInstrument: string;
  constructeur: string;
  typeMesure: string;
  typeEtalonnage: string;
    statutEtalonnage : string;


  uniteMesure: string;
  minMesure: number;
  maxMesure: number;
  dateDemande: string;
  dateSouhaitee: string;
  statut: string;
  client: UserDemDto; // <- important
  instrument : Instrument;
}