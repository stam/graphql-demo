const repository = require('./repository');

class Consultant {
  constructor({ ...args }) {
    Object.assign(this, args);
  }

  job() {
    const job = repository.job.filter({ consultant: this.name});
    console.log('consultant.job', this.name, job.id, new Job(job));

    return new Job(job);
  }
}

class Company {
  constructor(args) {
    Object.assign(this, args);
  }
}

class Job {
  constructor({ company, consultant, ...args }) {
    this.companyName = company;
    this.consultantName = consultant;
    Object.assign(this, args);
  }

  company() {
    const company = repository.company.find({ name: this.companyName });
    return new User(company)
  }

  consultant() {
    const consultant = repository.consultant.find({ name: this.consultantName });
    return new Site(consultant)
  }
}

module.exports = {
  Consultant, Company, Job
}
