let config = require('../config.js');
const apiKey = config.sms.smsApiKey;
const apiSecret = config.sms.smsSecretKey;
var smsglobal = require('smsglobal')(apiKey, apiSecret);
module.exports = {

genrateOTP()
{
    return Math.floor(1000 + Math.random() * 9000);
}
};

