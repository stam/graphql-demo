const repository = require('./repository');

class Consultant {
  constructor({ ...args }) {
    Object.assign(this, args);
  }

  job() {
    const job = repository.job.find({ consultant: this.name});
    if (!job) {
      return null;
    }
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
    return new Company(company)
  }

  consultant() {
    const consultant = repository.consultant.find({ name: this.consultantName });
    if (!consultant) {
      return null;
    }
    return new Consultant(consultant)
  }
}

module.exports = {
  Consultant, Company, Job
}
