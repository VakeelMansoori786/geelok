const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');
var common = {};

common.encrypt=(text)=>{
    return cryptr.encrypt(text);
  }
   
  common.decrypt=(text)=>{
    return cryptr.decrypt(text);
  }
  
  module.exports = common;