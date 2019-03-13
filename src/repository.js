const _ = require('lodash');

const consultants = require('./data/consultants.json');
const jobs = require('./data/jobs.json');
const companies = require('./data/companies.json');


class Repository {
  constructor(collection) {
    this.collection = collection;
  }

  find(query) {
    return _.find(this.collection, model => _.isMatch(model, query))
  }

  filter(query) {
    return _.filter(this.collection, model => _.isMatch(model, query))
  }
}

module.exports = {
  consultant: new Repository(consultants),
  job: new Repository(jobs),
  company: new Repository(companies),
};
