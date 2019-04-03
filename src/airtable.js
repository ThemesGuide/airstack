import 'whatwg-fetch';
import { createParam } from './helpers';
const env = require("./env");

const config = {
  base: env.AIRTABLE_BASE,
  table: env.AIRTABLE_TABLE,
  view: env.AIRTABLE_VIEW,
  apiKey: env.AIRTABLE_API_KEY,
  maxRecords: env.AIRTABLE_MAX_RECORDS
};

const getList = function(tableName){
  //console.log(tableName);
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}?maxRecords=${config.maxRecords}`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`
    })
  });
};

const getListView = function(tableName,view){
  //console.log(tableName);
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}?maxRecords=${config.maxRecords}&view=${view}`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`
    })
  });
};

const getPagedListView = function(tableName,view,pageSize,offset){
  //console.log(tableName);
  
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}?pageSize=${pageSize}&offset=${offset}&view=${view}`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`
    })
  });
};

const getRecord = function(tableName,id){
  //console.log(tableName+":"+id);
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}/${id}`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`
    })
  });
};

const findRecordsByBoolean = function(tableName,booleanFieldName,booleanFieldValue){
  //console.log("findRecordsByBoolean",tableName);
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}?filterByFormula=(${booleanFieldName}='${booleanFieldValue}')`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`
    })
  });
};

const findRecords = function(tableName,fieldName,fieldValue,view){
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}?view=${view}&filterByFormula=(FIND(LOWER("${encodeURIComponent(createParam(fieldValue))}"),LOWER({${fieldName}})))`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`
    })
  });
};

const incrCounter = function(tableName,id,countFieldName,currValue,lastIp,ip){
  //console.log("incrCounter",tableName);
  
  if (lastIp===ip) {
    return;
  }
  var obj = {fields:{}};
  obj.fields[countFieldName] = currValue+1;
  obj.fields.LastIp = ip;
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}/${id}`, {
    method: 'patch',
    body: JSON.stringify(obj),
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-type': 'application/json'
    })
  });
};

const getChildRecords = function(tableName,values,view){
  
  var orString = "";
  for (var id in values) {
    orString += "RECORD_ID()='" + values[id] + "'";
    //console.log("vl",values.length-1);
    //console.log("id",id);
    if (parseInt(id,0)===(values.length-1)) {
      break;
    }
    else {
      orString += ",";
    }
  }
  
  if (!view || view === null) {
    view = "Grid view";
  }
  
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}?view=${view}&filterByFormula=(OR(` + orString + `))`, {
    method: 'get',
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`
    })
  });
};

const createRecord = function(tableName,obj){
  //console.log("create",tableName);
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}`, {
    method: 'post',
    body: JSON.stringify(obj),
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-type': 'application/json'
    })
  });
};

const updateRecord = function(tableName,id,obj){
  //console.log(tableName);
  return new Request(`https://api.airtable.com/v0/${config.base}/${tableName}/${id}`, {
    method: 'patch',
    body: JSON.stringify(obj),
    headers: new Headers({
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-type': 'application/json'
    })
  });
};

const createOrUpdateRecord = async function(tableName,obj){
  //console.log("createOrUpdateRecord",tableName);
  
  // uses first object key in fields 
  // to check for existing record
  var k1 = Object.keys(obj.fields)[0];
  var v1 = obj.fields[k1];
  var resp = await fetch(new Request(`https://api.airtable.com/v0/${config.base}/${tableName}?filterByFormula=(FIND(LOWER("${encodeURIComponent(createParam(v1))}"),LOWER({${k1}})))`, {
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${config.apiKey}`
      })
  })).catch(err => {console.log(err)});
  
  var matches = await resp.json();
  //console.log("matches",categories);
  if (matches.records && matches.records.length>0) {
    //update
    console.log("createUserRecord update");
    var existingRecordId = matches.records[0].id;
    return this.updateRecord(tableName,existingRecordId,obj);
  }
  else {
    // create
    console.log("createUserRecord create");
    return this.createRecord(tableName,obj);
  }
};


export default {
    getList,
    getListView,
    getPagedListView,
    getRecord,
    findRecords,
    findRecordsByBoolean,
    getChildRecords,
    createRecord,
    updateRecord,
    createOrUpdateRecord,
    incrCounter
};