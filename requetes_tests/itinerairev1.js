const neo4j = require("neo4j-driver");
const { exit, mainModule } = require("process");
const fs = require("fs");

const uri = "bolt://localhost:7687"; //localhost:7687   "bolt://neo4j"
const user = "neo4j";
const password = "admin";

const { MongoClient } = require("mongodb");
const { resolve } = require("path");
const { range } = require("express/lib/request");
const url = "mongodb://localhost:27017";

const dbName = "project";

function area(poly) {
  var s = 0.0;
  var ring = poly.coordinates[0];
  for (i = 0; i < ring.length - 1; i++) {
    s += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return 0.5 * s;
}

function centroid(poly) {
  var c = [0, 0];
  var ring = poly.coordinates[0];
  for (i = 0; i < ring.length - 1; i++) {
    c[0] +=
      (ring[i][0] + ring[i + 1][0]) *
      (ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]);
    c[1] +=
      (ring[i][1] + ring[i + 1][1]) *
      (ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1]);
  }
  var a = area(poly);
  c[0] /= a * 6;
  c[1] /= a * 6;
  return c;
}

async function extractMostTypes(n) {
  const client = new MongoClient(url);
  await client.connect();
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
    mostTypes.push([res[i].type, res[i].count]);
  }
  client.close();
  return mostTypes;
}

function execReqNeo4j(requete) {
  return new Promise(function (resolve, reject) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    const session = driver.session({
      database: "neo4j",
      defaultAccessMode: neo4j.session.READ,
    });

    session
      .run(requete)
      .then((r) => {
        session.close();
        resolve(r);
      })
      .catch((error) => {
        console.log(error);
        session.close();
        reject("Echec requete", error);
      });
  });
}

async function getRandomRestaurantWithType(typeRestaurant) {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("restaurants");
  randomRestau = await collection
    .aggregate([
      { $match: { "properties.tags.cuisine": { $in: [typeRestaurant] } } },
      { $sample: { size: 1 } },
    ])
    .toArray();
  client.close();
  return randomRestau[0];
}

async function GetRandomRestau(typeRestau) {
  restau = await getRandomRestaurantWithType(typeRestau);
  if (restau.geometry.type != "Point") {
    //modifie les coordonné en un point plustot qu'un polygon
    centre = centroid(restau.geometry);
    restau.geometry.type = "Point";
    restau.geometry.coordinates = centre;
  }
  return restau;
}

// GetRandomRestau("burger").then((r) => {
//   console.log(r);
// });

async function getPointsNear(long, lat) {
  requete =
    `MATCH (position:Point) WITH point({longitude: position.long, latitude: position.lat})
     AS trainPoint, point({
         longitude:` +
    long +
    `, latitude:` +
    lat +
    `}) AS officePoint, position
    with  distance(trainPoint, officePoint) as travel_distance,position ORDER BY travel_distance ASC where travel_distance<=500 return position,travel_distance limit 10`;
  res = await execReqNeo4j(requete);
  return res;
}

async function getListePointNear(long, lat) {
  postionsProcheResteau = await getPointsNear(long, lat);
  listePos = [];
  postionsProcheResteau.records.forEach(function (item) {
    listePos.push({
      posId: parseInt(item._fields[0].identity),
      coordinates: {
        long: item._fields[0].properties.long,
        lat: item._fields[0].properties.lat,
      },
      distance: item._fields[1],
    });
  });
  return listePos;
}

async function getPathBeetween2Pos(posId1, posId2) {
  requete =
    `MATCH p=shortestPath((p1)-[:Route*1..20000]-(p2)) where id(p1)=` +
    posId1 +
    ` and id(p2)=` +
    posId2 +
    ` RETURN p`;
  res = await execReqNeo4j(requete);
  if (res.records) {
    return res;
  } else return undefined;
}

// getListePointNear(-71.2101877, 46.8162873);
//getPathBeetween2Pos(40, 80);

async function getFirstShortestPath(coord1, coord2) {
  listeCoord1 = await getListePointNear(coord1[0], coord1[1]); // liste des points de routes autour du point1
  listeCoord2 = await getListePointNear(coord2[0], coord2[1]); // liste des points de routes autour du point2
  for (co1 of listeCoord1) {
    for (co2 of listeCoord2) {
      if (co1.posId != co2.posId) {
        path = await getPathBeetween2Pos(co1.posId, co2.posId);
        if (path.records.length > 0) {
          return path;
        } else {
        }
        //console.log("domage pas d itineraire trouvé très rare mais possible");
      } else {
        console.log("meme posID bizard a enqueter");
      }
    }
  }
  return undefined;
}

function formatItineraireGeoJson(path) {
  let segments = path.records[0]._fields[0].segments;
  let itineraire = [];
  let sommeDistance = 0;
  for (s in segments) {
    if (s == 0) {
      itineraire.push([
        segments[s].start.properties.long,
        segments[s].start.properties.lat,
      ]);
    }
    itineraire.push([
      segments[s].end.properties.long,
      segments[s].end.properties.lat,
    ]);
    sommeDistance += segments[s].relationship.properties.distance;
  }

  Feature = {
    type: "Feature",
    geometry: {
      type: "MultiLineString",
      coordinates: [itineraire],
    },
    properties: {
      length: sommeDistance,
    },
  };
  return Feature;
}

function getFeatureRestaurant(restaurant, typeCuisine) {
  return {
    type: "Feature",
    geometry: restaurant.geometry,
    properties: {
      name: restaurant.properties.tags.name,
      type: typeCuisine,
    },
  };
}

async function test() {
  typeRestaurant = "burger";
  let restau1 = await GetRandomRestau(typeRestaurant);
  let restau2 = await GetRandomRestau(typeRestaurant);
  let coordRestau1 = restau1.geometry.coordinates;
  let coordRestau2 = restau2.geometry.coordinates;
  let path = await getFirstShortestPath(coordRestau1, coordRestau2);
  if (path) {
    geoJSON = {
      type: "FeatureCollection",
      features: [],
    };
    //on ajoute le restaurant de départ

    geoJSON.features.push(getFeatureRestaurant(restau1, typeRestaurant));
    //on ajoute le path entre les 2 restaurants
    let featurePath = formatItineraireGeoJson(path);
    geoJSON.features.push(featurePath);
    //on ajoute le restaurant suivant
    geoJSON.features.push(getFeatureRestaurant(restau2, typeRestaurant));
    var jsonPretty = JSON.stringify(geoJSON, null, 2);
    fs.writeFileSync("test_geojson.json", jsonPretty);

    console.log("path generé");
  }
}

async function getPathBetween2TypeRestaurant(typeRestaurant1, typeRestaurant2) {
  let restau1 = await GetRandomRestau(typeRestaurant1);
  let restau2 = await GetRandomRestau(typeRestaurant2);
  while (restau2.id == restau1.id) {
    //si on tire le même restau 2 fois (peut arriver si 1 seul type de restau chosisit)
    // console
    //   .log
    //   "meme restau a enqueter si cela arrive souvent lors de la generation"
    //   ();
    restau2 = await GetRandomRestau(typeRestaurant2);
  }
  let coordRestau1 = restau1.geometry.coordinates;
  let coordRestau2 = restau2.geometry.coordinates;
  let path = await getFirstShortestPath(coordRestau1, coordRestau2);

  if (path) {
    let pathOfFeatures = [];
    pathOfFeatures.push(getFeatureRestaurant(restau1, typeRestaurant1));
    //on ajoute le path entre les 2 restaurants
    pathOfFeatures.push(formatItineraireGeoJson(path));
    //on ajoute le restaurant suivant
    pathOfFeatures.push(getFeatureRestaurant(restau2, typeRestaurant2));
    return pathOfFeatures;
  } else {
    // path impossible d'etre genener entre ces deux restaux on doit rappeller getPathBetween2TypeRestaurant
    return undefined;
  }
}

async function getPathBetween2Restaurant(
  restau1,
  restau2,
  typeRestaurant1,
  typeRestaurant2
) {
  let coordRestau1 = restau1.geometry.coordinates;
  let coordRestau2 = restau2.geometry.coordinates;
  let path = await getFirstShortestPath(coordRestau1, coordRestau2);

  if (path) {
    let pathOfFeatures = [];
    pathOfFeatures.push(getFeatureRestaurant(restau1, typeRestaurant1));
    //on ajoute le path entre les 2 restaurants
    pathOfFeatures.push(formatItineraireGeoJson(path));
    //on ajoute le restaurant suivant
    pathOfFeatures.push(getFeatureRestaurant(restau2, typeRestaurant2));
    return pathOfFeatures;
  } else {
    // path impossible d'etre genener entre ces deux restaux on doit rappeller getPathBetween2TypeRestaurant
    return undefined;
  }
}

async function GenerateRandomItinairy(nbStop, typesRestau) {
  typesRestauChosit = typesRestau; // liste random untilisé pour generer la liste final de type de restau aléatoire
  listeRandomType = []; //liste des types random de restau final utilisé
  listeRestauIdUsed = []; //liste des id des restaurants utilisés (utile pour verifier qu'un restaurant n'a pas déja été utilisé)
  let nbArrets = nbStop;
  if (nbStop <= 1) {
    //si nombre de stop <=1 on prend comme meme 2 restaux pour tracer l'itinéraire
    nbArrets = 2;
  }
  for (let i = 0; i < nbArrets; i++) {
    if (typesRestauChosit.length == 0) {
      typesRestauChosit = typesRestau;
    }
    randomType =
      typesRestauChosit[
        Math.floor(Math.random() * (typesRestauChosit.length - 1))
      ];
    typesRestauChosit = typesRestauChosit.filter((item) => item !== randomType);

    listeRandomType.push(randomType);
  }

  let path = await getPathBetween2TypeRestaurant(
    // path entre deux restos random
    listeRandomType[0],
    listeRandomType[1]
  );
  while (path == undefined) {
    //on essaye de trouver un autre itinéraire aléatoire avec deux type de restaux, path entre deux restos random
    path = await getPathBetween2TypeRestaurant(
      listeRandomType[0],
      listeRandomType[1]
    );
  }

  geoJSON = {
    type: "FeatureCollection",
    features: [],
  };

  if (nbStop == 0) {
    //on push uniquement le multiline string //itineraire sans point (impossible normalement)
    geoJSON.features.push(path[1]);
  } else if (nbStop == 1) {
    //on push uniquement le multiline string et le point de départ
    geoJSON.features.push(path[0], path[1]);
  } else {
    let precedenRestau = undefined;
    for (let s = 0; s < nbStop - 1; s++) {
      if (s == 0) {
        let restau1 = await GetRandomRestau(listeRandomType[s]);
        let restau2 = await GetRandomRestau(listeRandomType[s + 1]);
        while (restau2.id == restau1.id) {
          //si on tire le même restau 2 fois (peut arriver si 1 seul type de restau chosisit)
          // console.log(
          //   "meme restau a enqueter si cela arrive souvent lors de la generation"
          // );
          restau2 = await GetRandomRestau(listeRandomType[s + 1]);
        }
        let path = await getPathBetween2Restaurant(
          restau1,
          restau2,
          listeRandomType[s],
          listeRandomType[s + 1]
        );
        while (path == undefined) {
          //on essaye de trouver un autre itinéraire aléatoire avec autres restaurants de meme type
          console.log("si trop souvent enqueter");
          let restau1 = await GetRandomRestau(listeRandomType[s]);
          let restau2 = await GetRandomRestau(listeRandomType[s + 1]);
          let path = await getPathBetween2Restaurant(
            restau1,
            restau2,
            listeRandomType[s],
            listeRandomType[s + 1]
          );
        }
        precedenRestau = restau1;
        listeRestauIdUsed.push(restau1.id, restau2.id);
        // debut de l'itineraire on ajoute debut et fin
        geoJSON.features.push(path[0], path[1], path[2]); //les 2 points et le multiline string
      } else {
        //pour les 2autres itinéraire, on fait l'itinéraire entre le précedent restau et le nouveau
        let restau2 = await GetRandomRestau(listeRandomType[s + 1]);
        while (listeRestauIdUsed.includes(restau2.id)) {
          //on verifie si le restau n'a pas deja été tiré
          //si on tire le même restau 2 fois (peut arriver si 1 seul type de restau chosisit) ou un itineraire avec beaucoup de stops
          // console.log(
          //   "meme restau a enqueter si cela arrive souvent lors de la generation"
          // );
          restau2 = await GetRandomRestau(listeRandomType[s + 1]);
        }
        path = await getPathBetween2Restaurant(
          precedenRestau,
          restau2,
          listeRandomType[s],
          listeRandomType[s + 1]
        );
        if (path == undefined) {
          console.log(
            "echec de la creation de l'itineraire possible, si trop souvent augmenter nombre de point autour du restau"
          );
          return undefined;
        }
        precedenRestau = restau2;
        listeRestauIdUsed.push(restau2.id);
        geoJSON.features.push(path[1], path[2]); //le multilinestring et un point
      }
    }
  }
  //console.log("path generé");
  return geoJSON;
}

function binaryCombos(n) {
  var result = [];
  for (y = 0; y < Math.pow(2, n); y++) {
    var combo = [];
    for (x = 0; x < n; x++) {
      //shift bit and and it with 1
      if ((y >> x) & 1) combo.push(true);
      else combo.push(false);
    }
    result.push(combo);
  }
  return result;
}

function getAllPossibleTypes(typesR) {
  combos = binaryCombos(5);
  liste = [];
  for (let i = 0; i < combos.length; i++) {
    inter = [];
    for (b = 0; b < combos[i].length; b++) {
      if (combos[i][b]) {
        inter.push(typesR[b]);
      }
    }
    liste.push(inter);
  }
  liste.shift(); // on enleve le premier element qui est [] on considere que []== tous les types
  return liste;
}

function calculDistanceParcour(parcourGeoJson) {
  //calcul la distance d'un parcour geojson
  let distance = 0;
  for (feature = 0; feature < parcourGeoJson.features.length; feature++) {
    if (parcourGeoJson.features[feature].geometry.type == "MultiLineString") {
      distance += parcourGeoJson.features[feature].properties.length;
    }
  }
  return distance;
}

// test();
async function main() {
  let typesRestaux = ["classic", "cafe", "burger", "pizza", "sandwich"];
  allpossTypes = getAllPossibleTypes(typesRestaux); //combinaison de tous les types possibles

  jsonTable = []; // tableau ou tout va etre stocker

  //on va maintenant creer tous les itinéraire possible
  allpossTypes = [ [ 'classic', 'pizza', 'sandwich' ]]

  //GENERE ICI 10x(2^5) itineraire = 
  let nbgenerated = 0;
  repetition = 0
  while(repetition<150){
    for (let i = 0; i < allpossTypes.length; i++) {
      for (let nbstop = 3; nbstop <= 3; nbstop++) {
        parcour = await GenerateRandomItinairy(nbstop, allpossTypes[i]);
        if (parcour != undefined) {
          // on a réussi a generer un parcour (tres tres rare que celui si n'arrive pas)
          distance = calculDistanceParcour(parcour);
          jsonTable.push(
            {
              types: allpossTypes[i],
              distance: distance,
              nbstop: nbstop,
              start_coord: parcour.features[0].geometry,
              parcour: parcour,
            },
          );
          nbgenerated += 1;
          console.log(nbgenerated);
        }
      }
    }
    repetition+=1
  }
  

  const d = new Date();
  date = d.getTime();
  fs.writeFileSync('../json_data/parcours-precalc/ItinerairesCalculated-'+date+'.json', JSON.stringify(jsonTable));
  console.log("finished !");
  exit();
  // return geoJSON;
  // let jsonPretty = JSON.stringify(geoJSON);
  // fs.writeFileSync("test_geojson.json", jsonPretty);
}

main();
