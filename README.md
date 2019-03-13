# GQL quiz

An GraphQL server written in NodeJS used for a demo.

## Getting started
`yarn && yarn start`


```graphql
{
  jobs(filter: {description: "Backend"}) {
    id
    description
    consultant {
      id
    }
  }
  consultants {
    id
    skill
    job {
      id
    }
  }
}
```
