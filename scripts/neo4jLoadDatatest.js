const neo4j = require('neo4j-driver');
const { exit } = require('process');
var fs = require('fs');
const haversine = require('haversine-distance')


function coordExistInListe(coord,listeCoord){
    let exist = false
            for(c of listeCoord){
                if(c[0]==coord[0] && c[1]==coord[1]){
                    //console.log('bingo')
                    return c[2] // on lui retourne l'id avec lequel la coordonée a été ajouté dans la liste
                }
            }
        return -1 //on retourne -1 la coordonée n'est pas dans la liste
}

function replace2DotbyUnderscore(str){
    re = /([^:\",])+:+([^:\",])/g
    res = str
    while(1){
        strToreplace = re.exec(res)
        if(strToreplace==null){
            return res
        }else {
            replacement = strToreplace[0].split(':').join('_')
            res = res.replace(strToreplace[0],replacement)
        }
    }
}


///////////////////////////////////////////////////
 // SCRIPT DE CREATION DE LA REQUETE NEO4j qui se trouve dan neo4jData.txt
////////////////////////////////////////////////////

/*
fs.readFile('../json_data/PistesCiclables.json', (err, data) => {
    if (err) throw err;
    let jsonData = JSON.parse(data);
    
    let listeRequeteNeo4j = []
    let coordAdded = []
    let i,j
    let indexAdded=1
    nbRoutes = jsonData.features.length
    progress = 0
    for(way of jsonData.features){

        unquotedTags = JSON.stringify(way.properties.tags).replace(/"([^"]+)":/g, '$1:')
        unquotedTagsNoBracket = unquotedTags.replace(/[\{\}']+/g, '')
        tagsClean = replace2DotbyUnderscore(unquotedTagsNoBracket)
        infoRoute = '{ idOSM:'+way.properties.id +','+ tagsClean

        for(i=0;i<way.geometry.coordinates.length - 1 ;i++){
            //on reintialise la requete pour ce couple de noeud
            let requeteNeo4j = ''

            //on recupere le couple de chaque coordonée
            coord1 = way.geometry.coordinates[i],
            coord2 = way.geometry.coordinates[i+1]

            existCoord1 = coordExistInListe(coord1,coordAdded)
            existCoord2 = coordExistInListe(coord2,coordAdded)

            if(existCoord1!=-1 && existCoord2!=-1){ // les deux coordonées sont déja dans la liste
                //on creer la relation route entre ces deux points
                requeteNeo4j += 'MATCH (p1:Point) where p1.long='+coord1[0]+' and p1.lat='+coord1[1]+ '\n'
                requeteNeo4j += 'MATCH (p2:Point) where p2.long='+coord2[0]+' and p2.lat='+coord2[1]+ '\n'
                requeteNeo4j += 'CREATE (p1)-[:Route '+ infoRoute +', distance: '+haversine(coord1,coord2)+'} ]->(p2)'

                listeRequeteNeo4j.push([requeteNeo4j])
                
            } else if(existCoord1!=-1) { // la premiere coordoné uniquement est déja dans la base ce qui risuqe souvent d'arriivé car on coulisse dans la liste
                // on creer la coordoné 2 qi n'est pas déja dans la liste
                requeteNeo4j += 'MATCH (p1:Point) where p1.long='+coord1[0]+' and p1.lat='+coord1[1]+ '\n'
                requeteNeo4j += 'CREATE (p2:Point {long:'+coord2[0]+', lat:'+coord2[1] +'})'+ '\n'

                //on creer la relation route entre ces deux points
                requeteNeo4j += 'CREATE (p1)-[:Route '+ infoRoute +', distance: '+haversine(coord1,coord2)+'} ]->(p2)'
                
                listeRequeteNeo4j.push([requeteNeo4j])
                coordAdded.push([coord2[0],coord2[1],indexAdded])
                indexAdded+=1

            } else if(existCoord2!=-1) { // la deuxième coordoné uniquement est déja dans la liste
                // on creer la coordoné 1 qui n'est pas déja dans la liste
                requeteNeo4j += 'MATCH (p2:Point) where p2.long='+coord2[0]+' and p2.lat='+coord2[1]+ '\n'
                requeteNeo4j += 'CREATE (p1:Point {long:'+coord1[0]+', lat:'+coord1[1] +'})'+ '\n'

                //on creer la relation route entre ces deux points
                requeteNeo4j += 'CREATE (p1)-[:Route '+ infoRoute +', distance: '+haversine(coord1,coord2)+'} ]->(p2)'
                
                listeRequeteNeo4j.push([requeteNeo4j])
                coordAdded.push([coord1[0],coord1[1],indexAdded])
                indexAdded+=1
            }
            else{ //aucune des 2 coordonées n'est déja dans la base
                //on creer les noeud des 2 points
                requeteNeo4j += 'CREATE (p1:Point {long:'+coord1[0]+', lat:'+coord1[1] +'})'+ '\n'
                requeteNeo4j += 'CREATE (p2:Point {long:'+coord2[0]+', lat:'+coord2[1] +'})'+ '\n'

                //on creer la relation route entre ces deux points
                requeteNeo4j += 'CREATE (p1)-[:Route '+ infoRoute +', distance: '+haversine(coord1,coord2)+'} ]->(p2)'
                
                listeRequeteNeo4j.push([requeteNeo4j])
                coordAdded.push([coord1[0],coord1[1],indexAdded])
                coordAdded.push([coord2[0],coord2[1],indexAdded+1])
                indexAdded+=2

            }
            
            //if(indexAdded==10){
             //   for(ele of listeRequeteNeo4j){
            //        console.log(ele)
             //   }
             //   exit()
            //} 

        }
        progress+=1
        if(((progress/nbRoutes*100) %10) == 0){
            console.log((progress/nbRoutes*100)+'%')
        }

        resultat = {listeRequetes: listeRequeteNeo4j}
        resultat = JSON.stringify(resultat,null,2)
    }
    fs.writeFile("./neo4jDataTable.json", resultat, (err) => {
        if (err) {
            throw err;
        }
        console.log("Requetes Neo4j is saved in neo4jDataTable.json.");
        });

}) */

///////////////////////////////////////////////////
// SCRIPT de chargement des données dans la base de donnée neo4j a l'aide de la requete neo4jData.txt
////////////////////////////////////////////////////



// MATCH (n)-[r]-() DELETE r
// MATCH (n) DELETE n
/*
function execuSessionReq(session,requete){
    return new Promise((resolve,reject) => {
        session.run(requete)
                .subscribe({
                    onCompleted: () => {
                         resolve();
                    },
                onError: error => {
                    session.close()
                    console.log(error)
                    reject();
                }
            })
      });
}

async function executeRequete(requetes){

    uri = "bolt://localhost:7687"
    user="neo4j"
    password="admin"
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = driver.session({database: 'neo4j',defaultAccessMode: neo4j.session.WRITE})
        //    requete
        //'MATCH (n) DELETE n'
        //'CREATE (n:Person {name: "Andy", title: "Developer"})'
        
        progress=0
        //console.log(requetes.length)
        for(req of requetes){
            //console.log(req[0])
            await execuSessionReq(session,req[0])
            progress+=1

            if((progress%500) == 0){
                console.log(progress)
            }
        }
        

        session.close()
        console.log('finished oura')
        exit();
}

fs.readFile('neo4jDataTable.json', 'utf8', function(err, data){
    if (err) throw err;

    requetesTableau=JSON.parse(data).listeRequetes
    executeRequete(requetesTableau)
});
*/

