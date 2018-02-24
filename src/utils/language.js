import languageConstants from '../constants';

export default () => {
    const DEFAULT_VALUE = 'en';
    const languageDefault = navigator.language 
    || navigator.userLanguage 
    || navigator.browserLanguage
    || navigator.systemLanguage 
    || DEFAULT_VALUE;

    return languageConstants[languageDefault] || languageConstants.en;
};