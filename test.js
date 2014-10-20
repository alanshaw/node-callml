var test = require('tape')
var CallMLService = require('./')
var fs = require('fs')
var config = JSON.parse(fs.readFileSync(__dirname + '/.callmlrc', 'utf8'))

var service = new CallMLService(config)

test('Test searchpurpose validation', function (t) {
  var searchData = {
    searchpurpose: '!!!INVALID!!!',
    applicant: {
      name: {
        title: 'Miss',
        forename: 'Julia',
        surname: 'Audi'
      },
      currentaddress: {
        premiseno: '1',
        postcode: 'X99LF',
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

  t.plan(3)

  service.search(searchData, function (er, response) {
    t.ok(er, 'Expected error')
    t.equal(er.name, 'ValidationError', 'Expected validation error')
    t.ok(
      er.details.some(function (er) {return er.path == 'searchpurpose'}),
      'Error referenced searchpurpose'
    )
    t.end()
  })
})

test('Test Julia Audi passes', function (t) {
  var searchData = {
    searchpurpose: 'MP',
    applicant: {
      name: {
        title: 'Miss',
        forename: 'Julia',
        surname: 'Audi'
      },
      currentaddress: {
        premiseno: '1',
        postcode: 'X99LF',
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

  t.plan(3)

  service.search(searchData, function (er, res) {
    t.error(er, 'No error when searching')
    t.ok(res, 'Response not falsey')
    t.equal(res.results.appverified, 'Yes', 'Applicant verified successfully')
    t.end()
  })
})

test('Test create service instance without new', function (t) {
  var service = CallMLService(config)
  t.ok(service instanceof CallMLService, 'Service created without new')
  t.end()
})

test('Test search with invalid service url', function (t) {
  var searchData = {
    searchpurpose: 'MP',
    applicant: {
      name: {
        title: 'Miss',
        forename: 'Julia',
        surname: 'Audi'
      },
      currentaddress: {
        premiseno: '1',
        postcode: 'X99LF',
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

  t.plan(1)

  service.search(searchData, {url: 'invalid:junk'}, function (er) {
    t.ok(er, 'Expected error')
    t.end()
  })
})
