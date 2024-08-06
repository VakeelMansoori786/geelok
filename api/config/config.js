import 'dotenv/config';
const config = {};

config['dev']={
    serverPort: 3306,
    appCors:process.env.CORS_ORIGIN,
    appDbType: process.env.RUN_DB,
    dbSqlServerHost : "184.168.120.232",
    dbSqlServerUser : "betamirrors_vakeel",
    dbSqlServerPwd : "Oexd149?",
    dbSqlDbName:"betamirr_mir_DB",
    dbRestApiHost: "",
    dbRestApiUser: "",
    dbRestApiPwd: "",
    filesFolder:"E://App//ECRUIT//files/",
    smsApiKey: "70e790c23fd140376ca460c495b31b0f",
    smsSecretKey: "424d4c7f2f74c5f71bf12d1f50f9e174",
    origin: "Mirrors",
    smsMsg: "Use {{otp}} to verify your Account with Mirrors Beauty Lounge."
}
config['prod']={
    serverPort: 3306,
    appCors:process.env.CORS_ORIGIN,
    appDbType: process.env.RUN_DB,
    dbSqlServerHost : "184.168.120.232",
    dbSqlServerUser : "betamirrors_vakeel",
    dbSqlServerPwd : "Oexd149?",
    dbSqlDbName:"betamirr_mir_DB",
    dbRestApiHost: "",
    dbRestApiUser: "",
    dbRestApiPwd: "",
    filesFolder:"E://App//ECRUIT//files/",
    smsApiKey: "70e790c23fd140376ca460c495b31b0f",
    smsSecretKey: "424d4c7f2f74c5f71bf12d1f50f9e174",
    origin: "Mirrors",
    smsMsg: "Use {{otp}} to verify your Account with Mirrors Beauty Lounge."
}
export default config[process.env.RUN_ENV]