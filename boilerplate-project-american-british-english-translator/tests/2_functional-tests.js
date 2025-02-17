const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {
    
    test('Should translate text from American to British English', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'american-to-british' })
            .end((err, res) => {
                assert.strictEqual(res.body.text, 'Mangoes are my favorite fruit.', 'Original text should be preserved');
                assert.strictEqual(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.', 'Translation should replace "favorite" with "favourite"');
                done();
            });
    });

    test('Should return error for invalid locale', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'american-to-australian' })
            .end((err, res) => {
                assert.strictEqual(res.body.error, 'Invalid value for locale field', 'Should return error for invalid locale');
                done();
            });
    });

    test('Should return error for missing text field', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({ locale: 'american-to-british' })
            .end((err, res) => {
                assert.strictEqual(res.body.error, 'Required field(s) missing', 'Should return error for missing text field');
                done();
            });
    });

    test('Should return error for missing locale field', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({ text: 'test' })
            .end((err, res) => {
                assert.strictEqual(res.body.error, 'Required field(s) missing', 'Should return error for missing locale field');
                done();
            });
    });

    test('Should return error for empty text field', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({ text: '', locale: 'british-to-american' })
            .end((err, res) => {
                assert.strictEqual(res.body.error, 'No text to translate', 'Should return error for empty text');
                done();
            });
    });

    test('Should return message for text that needs no translation', (done) => {
        chai.request(server)
            .keepOpen()
            .post('/api/translate')
            .send({ text: 'Mangoes are my favorite fruit.', locale: 'british-to-american' })
            .end((err, res) => {
                assert.strictEqual(res.body.translation, 'Everything looks good to me!', 'Should indicate no translation needed');
                done();
            });
    });
});