import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: 'Rick and Morty Characters',
      status: 'Status',
      species: 'Species',
      gender: 'Gender',
      sortBy: 'Sort By',
      origin: 'Origin',
      name: 'Character Name',
      all: 'All',
      alive: 'Alive',
      dead: 'Dead',
      unknown: 'Unknown',
      enterSpecies: 'Enter species',
      loadMore: 'Load More',
      english: 'English',
      german: 'German',
      error: 'An error occurred. Please try again.',
    },
  },
  de: {
    translation: {
      appTitle: 'Rick und Morty Charaktere',
      status: 'Status',
      species: 'Spezies',
      gender: 'Geschlecht',
      sortBy: 'Sortieren nach',
      origin: 'Herkunft',
      name: 'Charaktername',
      all: 'Alle',
      alive: 'Lebendig',
      dead: 'Tot',
      unknown: 'Unbekannt',
      enterSpecies: 'Spezies eingeben',
      loadMore: 'Mehr laden',
      english: 'Englisch',
      german: 'Deutsch',
      error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
