/**********  serveur nodejs  *******************/
const express = require("express");

var http = require("http")

const app = express();

const { pool } = require('pg');

const JSON = require('circular-json');

const path = require('path');

const MongoClient = require('mongodb').MongoClient;

const dsnMongoDb = 'mongodb://pedago02a.univ-avignon.fr:27017/SmartPark_db';

var server = http.createServer(app,function(){
    console.log("server created");
});

server.listen(5000);
console.log("server listening on port 5000");

app.get('/getData', function(request,response){
     
      MongoClient.connect(dsnMongoDb,{ useNewUrlParser: true },function(err,db){
      db.collection('information',function(err,collection){
      
      collection.find().toArray(function(err,items){
      if(err)throw err;
      console.log(items);
});
});
});
   
});


