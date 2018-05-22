const express = require('express');
const router = express.Router();
const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

const EXECUTOR_SERVER_URL = 'http://localhost:7000/results';
restClient.registerMethod('getResults', EXECUTOR_SERVER_URL, 'POST');

// get problems
router.get('/', (req, res) => {
    problemService.getProblems()
        .then(problems => res.json(problems));
});

// get a problem
router.get('/:id', (req, res) => {
    const id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem));
});

// post new problem
router.post('/', jsonParser, (req, res) => {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);
        }, (error) => {
            res.status(400).send(error);
        });
});

// build and run problem
router.post('/results', jsonParser, (req, res) => {
    const userCodes = req.body.userCodes;
    const lang = req.body.lang;

    restClient.methods.getResults(
        {
            data: {code: userCodes, lang: lang},
            headers: {'Content-Type': 'application/json'}
        },
        (data, response) => {
            const text = `Build output: ${data['build']}, execute output: ${data['run']}`;
            console.log('in results route in server, text is ' + text);
            data['text'] = text;
            res.json(data);
        }
    );
});
            
module.exports = router;
