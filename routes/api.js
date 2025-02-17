'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  const locales = ['american-to-british', 'british-to-american'];

  app.route('/api/translate').post((req, res) => {
      const { text, locale } = req.body;

      if(locale === undefined || text === undefined){
        return res.json({error:'Required field(s) missing'});
      }

      if (text.trim().length === 0) {
        return res.json({ error: 'No text to translate' });
      }

      if(!locales.includes(locale)){
        return res.json({error:'Invalid value for locale field'});
      }

      translator.setLanguage(locale.split('-')[0]);
      translator.setText(text);
      
      return res.json({
        text,
        translation: translator.isChanged()
          ? translator.getHighlighted()
          : 'Everything looks good to me!'
      });
    });
};