const chai = require('chai');
const assert = chai.assert;
const Translator = require('../components/translator.js');
const translator = new Translator();

suite('Unit Tests', () => {
    const tests = [
        // American to British
        { text: 'Mangoes are my favorite fruit.', expected: 'Mangoes are my favourite fruit.', lang: 'american' },
        { text: 'I ate yogurt for breakfast.', expected: 'I ate yoghurt for breakfast.', lang: 'american' },
        { text: "We had a party at my friend's condo.", expected: "We had a party at my friend's flat.", lang: 'american' },
        { text: "Can you toss this in the trashcan for me?", expected: "Can you toss this in the bin for me?", lang: 'american' },
        { text: "The parking lot was full.", expected: "The car park was full.", lang: 'american' },
        { text: "Like a high tech Rube Goldberg machine.", expected: "Like a high tech Heath Robinson device.", lang: 'american' },
        { text: "To play hooky means to skip class or work.", expected: "To bunk off means to skip class or work.", lang: 'american' },
        { text: "No Mr. Bond, I expect you to die.", expected: "No Mr Bond, I expect you to die.", lang: 'american' },
        { text: "Dr. Grosh will see you now.", expected: "Dr Grosh will see you now.", lang: 'american' },
        { text: "Lunch is at 12:15 today.", expected: "Lunch is at 12.15 today.", lang: 'american' },
        
        // British to American
        { text: "We watched the footie match for a while.", expected: "We watched the soccer match for a while.", lang: 'british' },
        { text: "Paracetamol takes up to an hour to work.", expected: "Tylenol takes up to an hour to work.", lang: 'british' },
        { text: "First, caramelise the onions.", expected: "First, caramelize the onions.", lang: 'british' },
        { text: "I spent the bank holiday at the funfair.", expected: "I spent the public holiday at the carnival.", lang: 'british' },
        { text: "I had a bicky then went to the chippy.", expected: "I had a cookie then went to the fish-and-chip shop.", lang: 'british' },
        { text: "I've just got bits and bobs in my bum bag.", expected: "I've just got odds and ends in my fanny pack.", lang: 'british' },
        { text: "The car boot sale at Boxted Airfield was called off.", expected: "The swap meet at Boxted Airfield was called off.", lang: 'british' },
        { text: "Have you met Mrs Kalyani?", expected: "Have you met Mrs. Kalyani?", lang: 'british' },
        { text: "Prof Joyner of King's College, London.", expected: "Prof. Joyner of King's College, London.", lang: 'british' },
        { text: "Tea time is usually around 4 or 4.30.", expected: "Tea time is usually around 4 or 4:30.", lang: 'british' },
    ];

    tests.forEach(({ text, expected, lang }, index) => {
        test(`Test #${index + 1}: Translate "${text}"`, function () {
            translator.setLanguage(lang);
            translator.setText(text);
            assert.equal(translator.getTranslation(), expected);
        });
    });

    const highlightTests = [
        { text: "Mangoes are my favorite fruit.", expected: "Mangoes are my <span class=\"highlight\">favourite</span> fruit.", lang: 'american' },
        { text: "I ate yogurt for breakfast.", expected: "I ate <span class=\"highlight\">yoghurt</span> for breakfast.", lang: 'american' },
        { text: "We watched the footie match for a while.", expected: "We watched the <span class=\"highlight\">soccer</span> match for a while.", lang: 'british' },
        { text: "Paracetamol takes up to an hour to work.", expected: "<span class=\"highlight\">Tylenol</span> takes up to an hour to work.", lang: 'british' },
    ];

    highlightTests.forEach(({ text, expected, lang }, index) => {
        test(`Highlight Test #${index + 1}: Highlight "${text}"`, function () {
            translator.setLanguage(lang);
            translator.setText(text);
            assert.equal(translator.getHighlighted(), expected);
        });
    });
});