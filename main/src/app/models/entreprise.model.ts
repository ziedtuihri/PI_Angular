export interface Entreprise {
  id: number;
  nom: string;
  secteurActivite: string;
  taille: number;
  adresse: string;
  telephone: string;
  email: string;
  siteWeb: string;
  contactRH: string;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE';
}
