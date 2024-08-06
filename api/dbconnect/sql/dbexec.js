import ParseSql from "./ParseSql.js"
const dbexec = {}

dbexec.GetLocation = async () => {
    let code = 'SELECT * FROM `locations`';
	//console.log(code)
	let ret = await ParseSql.execute("Sp",code)
	console.log("ret dbexec",ret);	 
	return ret
}

dbexec.getUser = async (par) => {
	let id = par.id;
	let status = par.status === true ?0 : 1;
	let userId = par.userId;
    let code = `dbo.GET_Users '${id}','${status}','${userId}' `;
	//console.log(code)
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret);	 
	return ret
}

dbexec.postUser = async (par) => {

	try{
		//console.log(par)
		let action = par.action;
		let id = par.rowId;
		let loginId = par.userId;
		let pwd = par.pwd;
		let eml = par.eml;
		let img = par.img;
		let username = par.userName
		let userId =par.userRowid;
		let code = `IUD_User '${action}',${id},'${loginId}','${pwd}','${eml}','${img}', '${username}', ${userId}  `;
		let ret = await ParseSql.execute("Sp",code)
		//console.log("ret dbexec",ret);	 
		return ret
	}catch(ex){
		console.log("ret dbexec err",ex);	 
		return ex.message
	}
	
}

dbexec.getResume = async (par) => {
	let id = par.id;
	let userId = par.userRowid;
    let code = `dbo.GET_Resume '${id}','${userId}' `;
	//console.log(code);
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret);	 
	return ret
}

dbexec.postResume = async (par) => {

	let action = par.action;
	let id = par.rowId;
	let personName = par.name;
	let tel = par.tel;
	let eml = par.eml;
	let spl = par.spl;
	let agency = par.agency;
	let file = par.fileId	
	let userId = par.userRowid  //par.userid;
    let code = `dbo.IUD_Resume '${action}',${id},'${personName}','${tel}','${eml}','${spl}','${agency}',${file},'${userId}'  `;
	//console.log(code);
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret);	 
	return ret
}
dbexec.postFile = async (par) => {
	let id = par.id;
	let tablename = par.tablename;
	let rowId = par.rowId;
	let fileloc = par.fileloc
	let code  = `dbo.IUD_File ${id}, '${tablename}', ${rowId}, '${fileloc}' `
	//console.log(code)
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret);	 
	return ret
}

dbexec.getFile = async (par) => {
	let id = par.id;
	let tablename = par.tablename;
	let rowId = par.rowId;
	let code  = `dbo.GET_File ${id}, '${tablename}', ${rowId} `
	//console.log(code)
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret);	 
	return ret

}

dbexec.getuniqueevent = async (par) => {
	let userId = par.userId;
    let code = `dbo.GET_Unique_Event ${userId}`;
	//console.log(code)
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret getuniqueevent",ret);	 
	return ret[0]
}
dbexec.getLinkEvent = async (par) => {
	let eventId = par.eventId;
	let userId = par.userId;
    let code = `dbo.GET_Link_Event ${eventId}, ${userId}`;
	//console.log(code)
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret getLinkEvent",ret);	 
	return ret[0]
}

dbexec.getEvent = async (par) => {
	let id = par.id;
	let userId = par.userId;
    let code = `dbo.GET_Event ${id},'${userId}' `;
	let ret = await ParseSql.execute("Sp",code)

	//console.log("ret dbexec",ret.data[0][0].status);	 
	return ret;
}

dbexec.postEvent = async (par) => {
	let id = par.lineId;
	let event = par.event;
	let parentId = par.eventLineId;
	let details = par.eventDet;
	let complete = par.completeFlag;
	let schDate = par.schDate === 'Invalid date' ?'' :par.schDate ;
	let schTime = par.schTime == null ?'' :par.schTime;
	let resume = par.linkedResume;
	let personal = par.personal;
	let assignUserId = par.assignUserId === undefined ?0: par.assignUserId;
	let userId = par.userId;
    let code = `dbo.IUD_Event ${id},'${event}',${parentId},'${details}',${complete},'${schDate}','${schTime}',${resume}, ${personal}, ${assignUserId}, '${userId}'  `;
	console.log(code)
	let ret = await ParseSql.execute("Sp",code)
	console.log("ret dbexec",ret[0][0]);	 
	return ret[0][0]
}
dbexec.getAllChildrenEvent = async (par) => {
	let parid = par.id;
	let userId = par.userId;
    let code = `dbo.GET_AllChildrenEvent ${parid},'${userId}' `;
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret[0]);	 
	return ret[0]
}
dbexec.getScheduleByDate = async (par) => {
	let fromDate = par.fromDate;
	let toDate = par.toDate;
	let userId = par.userId;
	let code = `dbo.GET_ScheduleByDate '${fromDate}', '${toDate}', ${userId}`
	//console.log(code);
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret[0]);	 
	return ret[0]
}
dbexec.getActivities= async (par) => {
	let fromDate = par.fromDate;
	let toDate = par.toDate;
	let userId = par.userId;
	let code = `dbo.GET_ActivitiesByDate '${fromDate}', '${toDate}', ${userId}`
	console.log(code);
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret[0]);	 
	return ret[0]
}

dbexec.postCancResched= async (par) => {
	let action = par.action;
	let id = par.id;
	let schDate = par.schDate;
	let schTime = par.schTime;
	let userId = par.userId;
	let code = `dbo.IUD_CancelResched '${action}', ${id}, '${schDate}', '${schTime}', ${userId}`
	console.log(code);
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret[0]);	 
	return ret[0]
}

dbexec.getEscPlan = async (par) => {
	let id = par.id;
	let userId = par.userId;
	let code = `dbo.GET_EscalationPlan '${id}, ${userId}`
	console.log(code);
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret[0]);	 
	return ret[0]
}
dbexec.postEscPlan = async (par) => {
	let id = par.id;
	let plan = par.plan;
	let userId = par.userId;
	let code = `dbo.IUD_EscalationPlan ${id}, '${plan}', ${userId}`
	console.log(code);
	let ret = await ParseSql.execute("Sp",code)
	//console.log("ret dbexec",ret[0]);	 
	return ret[0]
}
export default dbexec