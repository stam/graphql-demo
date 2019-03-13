const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const users = require('./src/data/users.json');
const sites = require('./src/data/sites.json');

const siteNames = sites.map(site => site.name);

let output = []

function createRequest(userName, siteSample) {
  const randomMonth = _.random(1, 12);
  const randomDay = _.random(1, 28);

  const request = {
    user: userName,
    site: _.sample(siteSample),
    date: `2019-${randomMonth}-${randomDay}`,
  }

  return request;
}

function updateMostFrequent(userName, value) {
  const index = _.findIndex(users, user => user.name === userName);
  _.set(users, [index, 'mostVisitedSite'], value);
}

function createRequests(count, userName, siteSample) {
  const newRequests = [];
  for (let i=0; i < count; i++) {
    let request = createRequest(userName, siteSample);
    newRequests.push(request);
  }

  const siteVisits = newRequests.map(req => req.site);

  const mostFrequent = _.head(_(siteVisits)
  .countBy()
  .entries()
  .maxBy('[1]'));

  output = output.concat(newRequests)
  updateMostFrequent(userName, mostFrequent);
}

users.forEach(user => {
  if (user.name === 'Alex') {
    createRequests(10, user.name, siteNames);
    createRequests(30, user.name, ['TOGAF']);

  } else if (user.name === 'Jasper') {
    createRequests(20, user.name, siteNames);
    createRequests(30, user.name, ['GitHub'])
  } else if (user.name === 'Marcel') {
    createRequests(1, user.name, ['Hacker news']);
    createRequests(2, user.name, ['GitHub']);
  } else {
    const randomSites = _.sampleSize(siteNames, 3);
    createRequests(10, user.name, randomSites);
  }
})


const targetPath = path.join(__dirname, 'src', 'data', 'requests.json');
const targetUserPath = path.join(__dirname, 'src', 'data', 'users.json');


fs.writeFile(targetPath, JSON.stringify(output), (err) => {
  if (!err) {
    console.log('Wrote requests data!');
  }
});

fs.writeFile(targetUserPath, JSON.stringify(users), (err) => {
  if (!err) {
    console.log('Wrote user data!');
  }
});
