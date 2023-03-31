
let fs = require('fs');


fs.readFile('../json_data/restaurantsClean.json'  , (err, data) => {
    if (err) throw err;
    let restaurants = JSON.parse(data);

    const { MongoClient } = require('mongodb');
    // or as an es module:
    // import { MongoClient } from 'mongodb'

    // Connection URL
    const url = 'mongodb://localhost:27017';
    const client = new MongoClient(url);

    // Database Name
    const dbName = 'project';

    async function main() {
        // Use connect method to connect to the server
        await client.connect();
        console.log('Connected successfully to server');
        const db = client.db(dbName);
        const collection = db.collection('restaurants');
        db.dropDatabase();
        const insertResult = await collection.insertMany(restaurants.features);
        console.log('Inserted documents =>', insertResult);
        const findResult = await collection.find({}).toArray();
        //console.log(findResult);
        for (cu of findResult){
            test = cu.properties.tags.cuisine
            console.log(test);

        }
        return 'done.';
      }
      main()
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());
})
