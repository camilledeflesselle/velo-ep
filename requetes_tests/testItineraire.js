const neo4j = require('neo4j-driver');
const { exit, mainModule } = require('process');
const fs = require('fs')

const uri = "bolt://localhost:7687" //localhost:7687   "bolt://neo4j"
const user="neo4j"
const password="admin"


function execuSessionReq(session,requete){
    return new Promise(function (resolve,reject){
        session.run(requete)
        .then(r => {
            //console.log(r)
            //result = r.records.map(d => d.toObject());
            resolve(r)
      })
      .catch(error => {
        console.log(error)
      })
    })
}


async function getItineraire(requete) {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = driver.session({database: 'neo4j',defaultAccessMode: neo4j.session.READ})
    res = await execuSessionReq(session,requete)
    session.close()
    return res
}

    

requete = 'MATCH p=shortestPath((p1)-[:Route*1..20000]-(p2)) where id(p1)=40 and id(p2)=50000 RETURN p';

getItineraire(requete).then((res) =>{
    let segments = res.records[0]._fields[0].segments
    let itineraire = []
    for (s in segments){
        if(s==0){
            itineraire.push(
                [
                    segments[s].start.properties.long,
                    segments[s].start.properties.lat
                ]
            )
        }
        itineraire.push([
            segments[s].end.properties.long,
            segments[s].end.properties.lat
        ]
        )
    }

    geoJson = {
        "type": "LineString",
        "coordinates": itineraire
    };
    console.log(geoJson)
    var jsonPretty = JSON.stringify(geoJson,null,2);  
    fs.writeFileSync('test_geojson.json', jsonPretty);   
    exit();
})
