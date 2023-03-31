const neo4j = require('neo4j-driver');
const { exit, mainModule } = require('process');

const uri = "bolt://neo4j" //localhost:7687
const user="neo4j"
const password="admin"


function execuSessionReq(session,requete){
    return new Promise(function (resolve,reject){
        session.run(requete)
        .then(r => {
            result = r.records.map(d => d.toObject());
            resolve(result)
      })
      .catch(error => {
        console.log(error)
      })
    })
}


async function getNbSegments() {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = driver.session({database: 'neo4j',defaultAccessMode: neo4j.session.READ})
    requete = 'MATCH (n1:Point)-[r:Route]-(n2) return COUNT(DISTINCT r) as res'
    res = await execuSessionReq(session,requete)
    session.close()
    console.log(res[0].res) //.records[0]._fields[0].low)
    return res[0].res.low
}

async function getLongueurCiclable() {
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = driver.session({database: 'neo4j',defaultAccessMode: neo4j.session.READ})
    requete = 'MATCH (n1:Point)-[r:Route]->(n2:Point) return sum(r.distance) as res'
    res = await execuSessionReq(session,requete)
    session.close()
    console.log(res[0].res)
    return res[0].res
}
    

module.exports =  {getNbSegments,getLongueurCiclable}
