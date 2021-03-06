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
    job(description: String!): Job
    jobs(filter: JobFilter): [Job!]
    company(name: String!): Company
    companies: [Company!]
    consultant(name: String!): Consultant
    consultants(filter: ConsultantFilter): [Consultant!]
  }

  type Mutation {
    addConsultantToJob(consultant: ID!, job: ID!): Job
  }

  type Consultant {
    id: ID
    name: String
    skill: String
    job: Job
  }

  type Job {
    id: ID!
    consultant: Consultant
    company: Company!
    description: String!
    hours: Int
  }

  type Company {
    id: ID
    name: String
    location: String
  }

  input JobFilter {
    description: String
    company: String
    consultant: String
  }

  input ConsultantFilter {
    skill: String
    job: String
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
  job: args => {
    const job = repository.job.find(args);
    if (!job) {
      return null;
    }
    return new Job(job)
  },
  jobs: ({ filter }) => repository.job.filter(filter).map(job => new Job(job)),

  company: args => new Company(repository.company.find(args)),
  companies: ({ filter }) => repository.company.filter(filter).map(company => new Company(company)),

  consultant: args => new Consultant(repository.consultant.find(args)),
  consultants: ({ filter }) => repository.consultant.filter(filter).map(consultant => new Consultant(consultant)),

  addConsultantToJob: ({ consultant, job }) => {
    const c = new Consultant(repository.consultant.find({ id: parseInt(consultant)}))
    const j = new Job(repository.job.find({ id: parseInt(job)}))

    if (!c) {
      throw new Error(`NotFound: Consultant with id ${consultant} not found`)
    }
    if (!j) {
      throw new Error(`NotFound: Job with id ${job} not found`)
    }
    if (c.job()) {
      throw new Error(`Validation: Consultant ${consultant} already has a job`);
    }
    if (j.consultant()) {
      throw new Error(`Validation: Job ${job} is already filled`);
    }
    j.consultantName = c.name;
    return j
  },
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
