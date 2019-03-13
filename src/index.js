/**
 *  Copyright (c) 2015-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

const express = require('express');
const graphqlHTTP = require('express-graphql');
const GraphQL = require('graphql');
const depthLimit = require('graphql-depth-limit');

const repository = require('./repository');
const { Job, Company, Consultant } = require('./models');

// Construct a schema, using GraphQL schema language
var schema = GraphQL.buildSchema(`
  type Query {
    hello: String
    job(location: String): Job
    jobs: [Job!]
    company(name: String!): Company
    companies: [Company!]
    consultant(name: String!): Consultant
    consultants: [Consultant!]
  }

  type Mutation {
    addJob(job: InputJob!): Job
    addConsultantToJob(consultantId: Int, jobId: Int): Job
  }

  type Consultant {
    id: ID
    name: String
    skill: String
    job: Job
  }

  type Job {
    id: ID
    consultant: Consultant
    company: Company
    description: String
    hours: Int
  }

  type Company {
    id: ID
    name: String
    location: String
  }

  input InputJob {
    id: ID!
    consultantName: String
    companyName: String!
    salary: Int
  }
`);

const job = {
  id: 1,
  consultant: {
    id: 1,
    name: 'Henk',
    specialty: 'GraphQL',
  },
  company: {
    id: 1,
    name: 'Oracle',
    location: 'Amsterdam'
  },
  salary: 6900,
}
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => 'Hello world!',
  job: args => new Job(repository.job.find(args)),
  jobs: ({ filter }) => repository.job.filter(filter).map(job => new Job(job)),

  company: args => new Company(repository.company.find(args)),
  companies: ({ filter }) => repository.company.filter(filter).map(company => new Company(company)),

  consultant: args => new Consultant(repository.consultant.find(args)),
  consultants: ({ filter }) => repository.consultant.filter(filter).map(consultant => new Consultant(consultant)),

  addJob: () => job,
  addConsultantToJob: (bla) => job,
};

var app = express();
app.use(
  '/',
  graphqlHTTP((req, res) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    validationRules: [
      depthLimit(4),
    ]
  })),
);
app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');
