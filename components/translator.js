const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

const LANGUAGES = ['american','british'];

class Translator {

    constructor() {
        this.language = null;
        this.text = '';
        this.translation = '';
        this.highlighted = '';
        this.changes = false;
    }

    setLanguage(language) {
        if (!LANGUAGES.includes(language)) {
            throw new Error('Language not allowed');
        }
        this.language = language;
    }

    getLanguage() {
        return this.language;
    }

    getOtherLanguage() {
        if (!this.language) {
            throw new Error('Language not set');
        }
        return LANGUAGES.find(language => language !== this.language);
    }

    setText(text) {
        this.text = text;
        this.translate();
    }

    getTranslation() {
        return this.translation;
    }

    getHighlighted() {
        return this.highlighted;
    };

    isChanged() {
        return this.changes;
    };

    wrap(string) {
        return `<span class="highlight">${string}</span>`;
    };

    adjustTime() {
        const timePattern = this.language === 'american' ? /(\d{1,2}):(\d{1,2})/g : /(\d{1,2})\.(\d{1,2})/g;
        const substitute = this.language === 'american' ? '.' : ':';

        this.translation = this.translation.replace(timePattern, `$1${substitute}$2`);
        this.highlighted = this.highlighted.replace(timePattern, this.wrap(`$1${substitute}$2`));
    }

    isUpperCase(string) {
        return string.charAt(0) === string.charAt(0).toUpperCase();
    }

    capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    replace(pattern,substitute) {
        let translation = this.translation;
        let highlighted = this.highlighted;

        const superStrings = this.getSuperStrings(pattern);
        
        if (superStrings.some(str => new RegExp(str).test(this.translation))) {
            return;
        }
        
        const correctPattern = pattern.replace('.','\\.');
        let regexKey = `^(${correctPattern})(\\W+)`;
        let regexp = new RegExp(regexKey,'i');
        
        let match = regexp.exec(translation);

        if(match && this.isUpperCase(match[1])){
            substitute = this.capitalize(substitute);
        };

        translation = translation.replace(regexp,`${substitute}$2`);
        highlighted = highlighted.replace(regexp,`${this.wrap(substitute)}$2`);
        
        regexKey = `(\\W+)(${correctPattern})(\\W+)`;
        regexp = new RegExp(regexKey,'i');
        match = regexp.exec(translation);

        if(match && this.isUpperCase(match[2])){
            substitute = this.capitalize(substitute);
        };

        translation = translation.replace(regexp,`$1${substitute}$3`);
        highlighted = highlighted.replace(regexp,`$1${this.wrap(substitute)}$3`);
        regexKey = `(\\W+)(${correctPattern})$`;
        regexp = new RegExp(regexKey,'i');
        
        match = regexp.exec(translation);

        if(match && this.isUpperCase(match[2])){
            substitute = this.capitalize(substitute);
        };

        translation = translation.replace(regexp,`$1${substitute}`);
        highlighted = highlighted.replace(regexp,`$1${this.wrap(substitute)}`);
        
        this.translation = translation;
        this.highlighted = highlighted;
    };

    getSuperStrings(string) {
        const language = this.getOtherLanguage();
        const regexp = new RegExp(string);
        const strings = [];

        const addIfMatch = function (dict) {
            Object.keys(dict).forEach(key => {
                if (regexp.test(key)) {
                    strings.push(key);
                }
            });
        };

        if (language === 'american') {
            addIfMatch(americanOnly);
            addIfMatch(americanToBritishSpelling);
            addIfMatch(americanToBritishTitles);
            Object.keys(britishOnly).forEach(key => {
                if (regexp.test(britishOnly[key])) {
                    strings.push(britishOnly[key]);
                }
            });
        } else if (language === 'british') {
            addIfMatch(britishOnly);
            Object.keys(americanToBritishTitles).forEach(key => {
                if (regexp.test(americanToBritishTitles[key])) {
                    strings.push(americanToBritishTitles[key]);
                }
            });
            Object.keys(americanToBritishSpelling).forEach(key => {
                if (regexp.test(americanToBritishSpelling[key])) {
                    strings.push(americanToBritishSpelling[key]);
                }
            });
            Object.keys(americanOnly).forEach(key => {
                if (regexp.test(americanOnly[key])) {
                    strings.push(americanOnly[key]);
                }
            });
        } else {
            throw new Error('Invalid language');
        }

        return strings;
    }

    translate() {
        if (!this.language) {
            throw new Error('Language not set');
        }

        this.translation = this.text;
        this.highlighted = this.text;

        if (this.language === 'american') {
            Object.keys(americanOnly).forEach(key => this.replace(key, americanOnly[key]));
            Object.keys(americanToBritishSpelling).forEach(key => this.replace(key, americanToBritishSpelling[key]));
            Object.keys(americanToBritishTitles).forEach(key => this.replace(key, americanToBritishTitles[key]));
        } else if (this.language === 'british') {
            Object.keys(britishOnly).forEach(key => this.replace(key, britishOnly[key]));
            Object.keys(americanToBritishSpelling).forEach(key => this.replace(americanToBritishSpelling[key], key));
            Object.keys(americanToBritishTitles).forEach(key => this.replace(americanToBritishTitles[key], key));
        }

        this.adjustTime();
        this.changes = this.translation !== this.text;
    }
};

module.exports = Translator;