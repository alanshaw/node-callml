# node-callml [![Dependency Status](https://david-dm.org/alanshaw/node-callml.svg?style=flat)](https://david-dm.org/alanshaw/node-callml)
Sends applications to CallML 6.1.1 service

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

// Search details as a POJO
var data = {
  searchpurpose: 'MP',
  applicant: {
    name: {
      title: 'Mr',
      forename: 'Joe',
      surname: 'Bloggs'
    },
    currentaddress: {
      premiseno: '1',
      postcode: 'TE5T3S',
      addresstype: 'short'
    }
  },
  searchdirectors: true,
  searchtelephone: false,
  minchecks: 2,
  usebai: true,
  useccj: true,
  useer: false,
  usesettledaccounts: true,
  settledaccountmonths: 12,
  useukinvestors: true
}

// Perform mlprimarysearch06b
service.search(data, function (er, res) {
  if (er) throw er
  assert(res.results.appverified == 'Yes')
})
```

## Supported API

* mlprimarysearch06b
* <strike>overrridedecision06b</strike>
* <strike>subsequentsearch06b</strike>
* <strike>addresslinksearch06b</strike>

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
