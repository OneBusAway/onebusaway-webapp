import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./../locales/en.json'));
register('es', () => import('./../locales/es.json'));

const locale = getLocaleFromNavigator();

const lang = locale ? locale.split('-')[0] : 'en';


init({
  fallbackLocale: 'en',
  initialLocale: lang,
});
