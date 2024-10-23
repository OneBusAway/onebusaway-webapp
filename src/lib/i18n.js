import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./../locales/en.json')); // English
register('es', () => import('./../locales/es.json')); // Spanish
register('pl', () => import('./../locales/pl.json')); // Polish
register('vi', () => import('./../locales/vi.json')); // Vietnamese
register('tl', () => import('./../locales/tl.json')); // Tagalog
register('so', () => import('./../locales/so.json')); // Somali
register('am', () => import('./../locales/am.json')); // Amharic

const locale = getLocaleFromNavigator();

const lang = locale ? locale.split('-')[0] : 'en';

init({
	fallbackLocale: 'en',
	initialLocale: lang
});
