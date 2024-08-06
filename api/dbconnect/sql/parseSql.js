import config from "../../config/config.js";
import sql from "mysql";

const sqlConfig = {
    connectionLimit : 100, //important
  acquireTimeout: 30000,
  waitForConnections: true,
  multipleStatements: true,
    host: config.dbSqlServerHost,
    port:config.serverPort,
    user: config.dbSqlServerUser,
    password:  config.dbSqlServerPwd,
    database: config.dbSqlDbName
};
var con = sql.createConnection(sqlConfig);
const ParseSql = {};

ParseSql.execute = (async (operType, operCode) => {
    try{
        await con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            con.query("CREATE DATABASE mydb", function (err, result) {
              if (err) throw err;
              console.log("Database created");
            });
          });;
        //console.log(operCode)
        let resp = await con.query(operCode);
        console.log(resp)
        return resp.recordsets
    
    }catch(ex){
        return ex
    }
});


// ParseSql.execute = (async (operType, operCode) => {
//     try{
//         await con;
//         //console.log(operCode)
//         let resp = await con.query(operCode);
//         console.log(resp)
//         return resp.recordsets
    
//     }catch(ex){
//         return ex
//     }
// });
//ParseSql.execute("Sp","select * from dbo.Users")
//console.log("here")
export default ParseSql
