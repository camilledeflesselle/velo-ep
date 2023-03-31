


async function countTypesRestaurant() {
  const { MongoClient } = require('mongodb');
  // or as an es module:
  // import { MongoClient } from 'mongodb'

  // Connection URL
  const url = 'mongodb://mongo';

  const client = new MongoClient(url);

  // Database Name
  const dbName = 'project';
  // Use connect method to connect to the server
  await client.connect();
  //console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('restaurants');
  /*
  const findResult2 = await collection.aggregate([
  {$project: {"properties.tags.cuisine":"$properties.tags.cuisine"}},
  {$sortByCount : "$properties.tags.cuisine"}    
  ]).toArray();
  console.log(findResult2);
  */
  const allTypes = await collection.distinct('properties.tags.cuisine');
  let res = [];
  for (cuisine of allTypes){
    let findRes = await collection.aggregate([
      {$match:{"properties.tags.cuisine":cuisine}},
      {$count: "count"}
    ]).toArray();
    findRes[0].type=cuisine;
    res.push(findRes[0]);
  }
  res2 = Object.assign({}, ...res.map((x)=> ({[x.type]:x.count})))
  client.close()
  //console.log(res2)
  return res2
}


async function countNumberRestaurant() {
  const { MongoClient } = require('mongodb');
  // or as an es module:
  // import { MongoClient } from 'mongodb'

  // Connection URL
  const url = 'mongodb://mongo';

  const client = new MongoClient(url);
  // Database Name
  const dbName = 'project';
  await client.connect();
  //console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('restaurants');
  const res1 = await collection.aggregate([
    {$count:"number"}
  ]).toArray();
  //console.log(res1[0].number)
  client.close()
  return res1[0].number
    
}

async function extractMostTypes(n) {
  const { MongoClient } = require('mongodb');
  const url = 'mongodb://mongo';
  const client = new MongoClient(url);
  await client.connect();
  const dbName = 'project';
  const db = client.db(dbName);
  const collection = db.collection("restaurants");
  const allTypes = await collection.distinct("properties.tags.cuisine");
  let res = [];
  for (cuisine of allTypes) {
    let findRes = await collection
      .aggregate([
        { $match: { "properties.tags.cuisine": cuisine } },
        { $count: "count" },
      ])
      .toArray();
    findRes[0].type = cuisine;
    res.push(findRes[0]);
  }
  res.sort(function (a, b) {
    return b.count - a.count;
  });
  mostTypes = [];
  for (let i = 0; i < n; i++) {
    mostTypes.push(res[i].type);
  }
  client.close();
  return mostTypes;
}

//countNumberRestaurant().then(console.log)
//countTypesRestaurant().then(console.log)
module.exports =  {countTypesRestaurant, countNumberRestaurant, extractMostTypes}