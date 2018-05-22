const ProblemModel = require('../models/problemModel');

const getProblems = function() {
    console.log("In problem service get problems");
    return new Promise((resolve, reject) => {
        ProblemModel.find({}, (err, problems) => {
            if (err) {
               reject(err);
            } else {
                resolve(problems); 
            }
        });
    });
}

const getProblem = function (id) {
    console.log("In problem service get a problem");
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({id: id}, (err, problem) => {
            if (err) {
                reject(err);
            } else {
                resolve(problem);
            }
        });
    });
}

const addProblem = function(newProblem) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({name: newProblem.name}, (err, data) => {
            if (data) {
                reject("Problem already exists.");
            } else {
                ProblemModel.count({}, (err, count) => {
                    newProblem.id = count + 1;
                    const mongoProblem = new ProblemModel(newProblem);
                    mongoProblem.save();
                    resolve(mongoProblem);
                });
            }
        });
    });
}
                                          

module.exports = {
    getProblems,
    getProblem,
    addProblem
}
