var config = {};

config.JWT_SERECT_KEY="123";
config.JWT_OPTION={ expiresIn: '10h' };

config.routename='/api'
// config.connectionStrings = {
//   connectionLimit : 100, //important
//   acquireTimeout: 30000,
//   waitForConnections: true,
//   multipleStatements: true,
//     host: "184.168.120.232",
//     port:"3306",
//     user: "betamirrors_vakeel",
//     password: "Oexd149?",
//     database: "betamirr_mir_DB"
//   };
  
// config.connectionStrings_log = {
//   connectionLimit : 100, //important
//   acquireTimeout: 30000,
//   waitForConnections: true,
//   multipleStatements: true,
//     host: "184.168.120.232",
//     port:"3306",
//     user: "betamirrors_vakeel",
//     password: "Oexd149?",
//     database: "betamirrors_log_db"
//   };

config.connectionStrings = {
  connectionLimit : 100, //important
  acquireTimeout: 30000,
  waitForConnections: true,
  multipleStatements: true,
    host: "193.203.184.54",
    port:"3306",
    user: "u816834887_salim",
    password: "2*zG2vLJN3",
    database: "u816834887_globalvalves"
  };
  

  config.sms ={
    "smsApiKey": "70e790c23fd140376ca460c495b31b0f",
    "smsSecretKey": "424d4c7f2f74c5f71bf12d1f50f9e174",
    "origin": "Mirrors",
    "smsMsg": "Use {{otp}} to verify your Account with Mirrors Beauty Lounge."
  }
  config.payment={
    //Test
//     "PaymentTokenUrl":"https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
//     "PaymentUrl":"https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/3c111ad7-3aa6-4c33-89a5-fd5c435fcb88/payment/card",
//     "CreateOrdersUrl":"https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/3c111ad7-3aa6-4c33-89a5-fd5c435fcb88/orders",
//     "PaymentOutletId":"3c111ad7-3aa6-4c33-89a5-fd5c435fcb88",
//     "RetrieveOrder":"https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/{outletId}/orders/{ref}",
//     "PaymentPhrase":"3c111ad7-3aa6-4c33-89a5-fd5c435fcb88",
//     "PaymentKey":"ZjhmODkzNGEtM2VlZi00YjMwLWFkODMtNDIwMDAxYmVmNDBjOjA2MWI3Zjg4LTBlMzYtNDg2Yi1iN2M4LTZmYjcyNWRmMjY3ZA==",
// "TermUrl":"https://ideaintl.net/booking/"
    // //Production
    "PaymentTokenUrl":"https://api-gateway.ngenius-payments.com/identity/auth/access-token",
    "PaymentUrl":"https://api-gateway.ngenius-payments.com/transactions/outlets/a19b1136-336b-464a-9b60-5bda7bfe737c/payment/card",
    "CreateOrdersUrl":"https://api-gateway.ngenius-payments.com/transactions/outlets/a19b1136-336b-464a-9b60-5bda7bfe737c/orders",
    "PaymentOutletId":"a19b1136-336b-464a-9b60-5bda7bfe737c",
    "RetrieveOrder":"https://api-gateway.ngenius-payments.com/transactions/outlets/{outletId}/orders/{ref}",
    "PaymentPhrase":"a19b1136-336b-464a-9b60-5bda7bfe737c",
    "PaymentKey":"MmI0MzAyMzItMWEyNi00ODEwLTg2NDAtNTNhZGIzOGE3MDg3OmRlMTRkODU2LTc5YzctNGU4OS1hZjMyLTY0NDcxYjVlMDU5ZQ==",
    "TermUrl":"https://mirrorsbeautylounge.com"
  }
  module.exports = config;
  