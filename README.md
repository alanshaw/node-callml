# node-callml [![Build Status](http://img.shields.io/travis/alanshaw/node-callml.svg?style=flat)](https://travis-ci.org/alanshaw/node-callml) [![Dependency Status](https://david-dm.org/alanshaw/node-callml.svg?style=flat)](https://david-dm.org/alanshaw/node-callml)
Sends applications to CallML 6.1.1 service

## Getting started

Install Node.js
Install dependencies:

```sh
npm install
```

## Usage

```js
var CallMLService = require('callml')
var assert = require('assert')

var service = new CallMLService({
  url: 'https://ct.callcreditsecure.co.uk/Services/CallML/CallML6.asmx',
  company: '[company]',
  username: '[username]',
  password: '[password]'
})

// Applicant details as a POJO
var applicant = {}

// Perform search
service.search(applicant, function (er, res) {
  if (er) throw er
  assert(res.results.appverified.toLowerCase() == 'yes')
})
```

## Running the tests

Create a `.callmlrc` file in project root directory. Add your CallML test credentials to it. e.g.

```js
{
  "url": "https://ct.callcreditsecure.co.uk/Services/CallML/CallML6.asmx",
  "company": "[company]",
  "username": "[username]",
  "password": "[password]"
}
```