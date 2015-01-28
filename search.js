var Joi = require('joi')
var js2xml = require('data2xml')({xmlDecl: false})
var xml2js = require('xml2js')

var searchSchema = Joi.object().keys({
  searchpurpose: Joi.any().valid('AP', 'AQ', 'IP', 'IQ', 'ML', 'MP', 'TS'),
  applicant: Joi.object().keys({
    name: Joi.object().keys({
      title: Joi.string().max(30).required(),
      forename: Joi.string().max(30).required(),
      othernames: Joi.string().max(30),
      surname: Joi.string().max(30).required()
    }).required(),
    aliases: Joi.object().keys({
      name: Joi.object().keys({
        title: Joi.string().max(30).required(),
        forename: Joi.string().max(30).required(),
        othernames: Joi.string().max(30),
        surname: Joi.string().max(30).required()
      }).required()
    }),
    currentaddress: Joi.alternatives().try(
      // Short form
      Joi.object().keys({
        premiseno: Joi.string().max(30),
        premisename: Joi.string().max(30),
        postcode: Joi.string().max(8).required(),
        addresstype: Joi.any().valid('short').required()
      }).or('premiseno', 'premisename'),
      // Long form
      Joi.object().keys({
        abodeno: Joi.string().max(30),
        buildingno: Joi.string().max(12),
        buildingname: Joi.string().max(30),
        street1: Joi.string().max(50),
        street2: Joi.string().max(50),
        sublocality: Joi.string().max(35),
        locality: Joi.string().max(35),
        posttown: Joi.string().max(25),
        postcode: Joi.string().max(8).required(),
        addresstype: Joi.any().valid('long').required()
      }).or('abodeno', 'buildingno', 'buildingname')
    ).required(),
    previousaddress: Joi.object().keys({
      abodeno: Joi.string().max(30),
      buildingno: Joi.string().max(12),
      buildingname: Joi.string().max(30),
      premiseno: Joi.string().max(30),
      premisename: Joi.string().max(30),
      street1: Joi.string().max(50),
      street2: Joi.string().max(50),
      sublocality: Joi.string().max(35),
      locality: Joi.string().max(35),
      posttown: Joi.string().max(25),
      postcode: Joi.string().max(8),
      addresstype: Joi.any().valid('long')
    }),
    telephone: Joi.object().keys({
      std: Joi.number().integer().max(999999),
      number: Joi.number().integer().max(99999999999)
    }),
    addrlessthan12months: Joi.boolean(),
    dateofbirth: Joi.string().isoDate(),
    identities: Joi.array().includes(
      Joi.object().keys({
        identity: Joi.object().keys({
          idtype: Joi.number().integer(),
          idparams: Joi.array().includes(
            Joi.object().keys({
              idparam: Joi.object().keys({
                idkey: Joi.any().valid(['IDNUMBER', 'MACHINEREADABLELINE1', 'MACHINEREADABLELINE2', 'MACHINEREADABLELINE3', 'EXPIRYDATE', 'VALIDUNTIL', 'PLACEOFISSUE', 'DATEOFISSUE', 'MAILSORT']),
                idvalue: Joi.string().max(50)
              })
            })
          )
        })
      })
    ),
    demographics: Joi.object().keys({
      person: Joi.object().keys({
        customerstatus: Joi.string().length(2),
        maritalstatus: Joi.string().length(2),
        totaldependents: Joi.number().integer().max(99),
        language: Joi.string().length(2),
        identity: Joi.object().keys({
          type: Joi.string().length(2)
        })
      }),
      accommodation: Joi.object().keys({
        type: Joi.string().length(2),
        propertyvalue: Joi.number(),
        mortgagebalance: Joi.number(),
        monthlyrental: Joi.number(),
        residentialstatus: Joi.string().length(2)
      }),
      contact: Joi.object().keys({
        email: Joi.object().keys({
          type: Joi.string().length(2),
          address: Joi.string().email().max(100)
        }),
        telephone: Joi.object().keys({
          type: Joi.string().length(2),
          std: Joi.number().integer().max(9999999999),
          number: Joi.number().integer().max(99999999999999999999),
          extension: Joi.number().integer().max(99999999)
        })
      }),
      employment: Joi.object().keys({
        occupation: Joi.string().length(2),
        employmentstatus: Joi.string().length(2),
        expirydate: Joi.string().isoDate(),
        employmentrecency: Joi.string().length(2),
        employercategory: Joi.string().length(2),
        timeatcurrentemployer: Joi.string().regex(/^[0-9]{4}$/)
      }),
      account: Joi.object().keys({
        sortcode: Joi.string().regex(/^[0-9]{6}$/),
        accountnumber: Joi.string().regex(/^[0-9]{0,20}$/),
        timeatbank: Joi.number().integer().max(999),
        paymentmethod: Joi.string().length(2),
        financetype: Joi.string().min(2).max(3)
      }),
      expenditure: Joi.object().keys({
        totaldebitcards: Joi.number().integer(),
        totalcreditcards: Joi.number().integer(),
        monthlyunsecuredamount: Joi.number()
      }),
      income: Joi.object().keys({
        primary: Joi.object().keys({
          amount: Joi.number(),
          type: Joi.string().length(2),
          paymentmethod: Joi.string().length(2),
          frequency: Joi.string().length(2)
        }),
        additional: Joi.object().keys({
          amount: Joi.number(),
          type: Joi.string().length(2),
          paymentmethod: Joi.string().length(2),
          frequency: Joi.string().length(2)
        })
      })
    })
  }).required(),
  searchdirectors: Joi.boolean().required(),
  excludesharegroups: Joi.string().max(20),
  excludeshareaccounttypes: Joi.string().max(350),
  minchecks: Joi.number().integer().required(),
  usebai: Joi.boolean().required(),
  useccj: Joi.boolean().required(),
  usehcj: Joi.boolean(),
  useer: Joi.boolean().required(),
  usesettledaccounts: Joi.boolean().required(),
  settledaccountmonths: Joi.number().integer().required(),
  useukinvestors: Joi.boolean().required(),
  decisionwarning: Joi.string().max(24),
  valueaddedservices: Joi.number().integer(),
  excludeownshare: Joi.string().max(200),
  numsearches: Joi.number().integer(),
  timeframeofsearch: Joi.number(),
  searchtelephone: Joi.boolean().required(),
  telephonedata: Joi.any().valid(1, 2, 3),
  ipaddress: Joi.string().max(15),
  yourreference: Joi.string().max(50)
}).required()

/**
* Send a primary search request to the CallML service
*/
function search (searchData, opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }

  opts = opts || {}

  var service = this

  searchSchema.validate(searchData, function (er, searchData) {
    if (er) return cb(er)

    var data = {
      _attr: {
        xmlns: search.namespace
      },
      searchDefinition: {
        parameters: {
          primarysearch: searchData
        }
      }
    }

    service.send(search.action, js2xml('Search06b', data), opts, function (er, res, xml) {
      if (er) return cb(er)
      if (res.statusCode != 200) return cb(new Error("Unexpected service status " + res.statusCode))

      xml2js.parseString(xml, {explicitArray: false}, function (er, obj) {
        if (er) return cb(er)
        try {
          var callmlResult = obj['soap:Envelope']['soap:Body'].Search06bResponse.Search06bResult
        } catch (er) {
          return cb(new Error('Unexpected response format ' + obj))
        }
        cb(null, callmlResult)
      })
    })
  })
}

search.action = 'urn:callcredit.co.uk/soap:callmlapi6/Search06b'
search.namespace = 'urn:callcredit.co.uk/soap:callmlapi6'

module.exports = search
