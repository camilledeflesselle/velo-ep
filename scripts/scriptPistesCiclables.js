var fs = require('fs');

var queryOverpass = require("query-overpass")
var query ='area["name:en"="Quebec City"]->.searchArea;(' +
  'way[highway~"^(trunk|primary|secondary|tertiary|unclassified|residential|living_street|road|pedestrian|path|bridleway|cycleway)$"][area!=yes](area.searchArea); '+
  'way[highway=footway][bicycle=yes](area.searchArea););out body;>;out skel qt;'
var jsonRes;
var mycallback = (error, data) => {
  if (error) {
    console.log(error.message)
    console.log(error.statusCode)
  return;
  }
  var jsonRes = JSON.stringify(data)
  fs.writeFile("../json_data/PistesCiclables.json", jsonRes, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
    });
 }
 
queryOverpass(query,mycallback);
 
 