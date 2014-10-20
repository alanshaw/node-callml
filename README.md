# node-callml
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
  assert(res.appverified.toLowerCase() == 'yes')
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