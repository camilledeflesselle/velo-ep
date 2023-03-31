var fs = require('fs');

var queryOverpass = require("query-overpass")
var query ='area["name:en"="Quebec City"]->.searchArea;'+
'( node["amenity"~"(restaurant|fast_food|cafe)"](area.searchArea);'+
 ' way["amenity"~"restaurant|fast_food|cafe"](area.searchArea););'+
'out body;>;out skel qt;'

var jsonRes;
var mycallback = (error, data) => {
  if (error) {
    console.log(error.message)
    console.log(error.statusCode)
  return;
  }
  var jsonRes = JSON.stringify(data)
  fs.writeFile("../json_data/restaurants.json", jsonRes, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
    });
 }
 
queryOverpass(query,mycallback);
 
 