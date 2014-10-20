var Joi = require('joi')

function CallMLService (config) {
  if (!(this instanceof CallMLService)) return new CallMLService(config)

  Joi.assert(config, Joi.object().keys({
    url: Joi,string().required(),
    company: Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().required()
  }), 'Invalid service configuration')

  this.config = config
}

/**
* Send a SOAP request to the CallML service
*/
CallMLService.prototype.send = function (action, body, opts, cb) {
  if (!cb) {
    cb = opts
    opts = {}
  }

  opts = opts || {}

  var headers = {
    'Content-Type': 'text/xml; charset=utf-8',
    'SOAPAction': '"' + action + '"'
  }

  var config = this.config

  var envelope = '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
                   '<soap:Header>' +
                     '<callcreditheaders xmlns="urn:callcredit.co.uk/soap:callcreditapi">' +
                       '<company>' + config.company + '</company>' +
                       '<username>' + config.username + '</username>' +
                       '<password>' + config.password + '</password>' +
                     '</callcreditheaders>' +
                   '</soap:Header>' +
                   '<soap:Body>' + body + '</soap:Body>' +
                 '</soap:Envelope>'

  opts.url = opts.url || config.url
  opts.headers = opts.headers || headers
  opts.body = opts.body || envelope

  request.post(opts, cb)
}

CallMLService.prototype.search = require('./search')

module.exports = CallMLService