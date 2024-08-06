/* Each db will have its own dbexec file executing same funtion */
import config from "../config/config.js"
import restdb  from "../dbconnect/rest/dbexec.js"
import sqldb from "../dbconnect/sql/dbexec.js"
const processDbRequest = config.appDbType == 'sql' ?sqldb :restdb;


export default processDbRequest