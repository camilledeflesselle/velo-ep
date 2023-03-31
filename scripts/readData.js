const { Console } = require('console');
var fs = require('fs');
const { type } = require('os');
const { exit } = require('process');


//PREMIER PROCESS ON S'ASSURE QUE CHAQUE RESTAURANT A UN NOM VALIDE

fs.readFile('../json_data/restaurants.json', (err, data) => {
    if (err) throw err;
    let jsonData = JSON.parse(data);

    var nbRemoved, nbNameAdded
    nbRemoved = nbNameAdded = 0
    var indexToRemove = []
    for(obj in jsonData.features)  { 
        //console.log(obj)
            if(jsonData.features[obj].properties.tags.name==undefined){
                let tags = JSON.stringify(jsonData.features[obj].properties.tags)
                var regexName = /"[name]+:+[a-zA-Z]{1,}/

                if(tags.search(regexName)!=-1){
                    //il existe un nom dans une autre langue on va donc lui donné un nom name: valeur pour etre conforme et pouvoir l'utilisé
                    nomRestau = tags.substring(tags.search(regexName)).split('"')[3]
                    jsonData.features[obj].properties.tags.name = nomRestau
                    nbNameAdded+=1
                }
                else{
                    indexToRemove.push(obj)
                    nbRemoved +=1
                }
                
            }

    }
    // on supprime maintenant du tableau des features les restaurants sans noms
    for (var i = indexToRemove.length -1; i >= 0; i--)
        jsonData.features.splice(indexToRemove[i],1);

    //on verifie que tout c'est bien passé
    jsonData.features.forEach(function(obj) { 
            if(obj.properties.tags.name==undefined){
                console.log('IMPOSSIBLE TOUS LES RESTAURANTS ONT UN NOM NORMALEMENT !')
                exit();
            }
        });
    
    console.log("Nb Added Name: "+nbNameAdded,"/ Nb Removed: "+ nbRemoved)



    //ON VA MAINTENANT VERIFIER LES TYPES DE RESTAURANT ET CREER POUR CHACUN D'EU UN CHAMPS TYPE CORESPONDANT

    for(obj in jsonData.features)  { 
        if(jsonData.features[obj].properties.tags.cuisine){
            //rien a faire on réutilise la liste des types de cuisine existante
            jsonData.features[obj].properties.tags.cuisine = jsonData.features[obj].properties.tags.cuisine.split(";")
        }
        else{
            //console.log(jsonData.features[obj].properties.tags.cuisine)
            //console.log(jsonData.features[obj])
            if(jsonData.features[obj].properties.tags.amenity== 'fast_food'){
                jsonData.features[obj].properties.tags.cuisine = ['fast_food']
            } 
            else if(jsonData.features[obj].properties.tags.amenity== 'cafe'){
                jsonData.features[obj].properties.tags.cuisine =  ['cafe']
            } 
        }
    }
    
    var uniqueTypesRestaurant = []
    for(obj in jsonData.features)  { 
        if(jsonData.features[obj].properties.tags.cuisine){
            for(cu of jsonData.features[obj].properties.tags.cuisine){
                if(!uniqueTypesRestaurant.includes(cu)){
                    uniqueTypesRestaurant.push(cu)
                }
            }
        }
    }

    //affiche tous les type de cuisine unique
    console.log(uniqueTypesRestaurant.length,uniqueTypesRestaurant)

    for(obj in jsonData.features)  { 
        if(!jsonData.features[obj].properties.tags.cuisine){
            for(cuisine of uniqueTypesRestaurant){
                if(jsonData.features[obj].properties.tags.name.toLowerCase().includes(cuisine.toLowerCase())){
                    //console.log(jsonData.features[obj].properties.tags.name.toLowerCase(),cuisine.toLowerCase())
                    jsonData.features[obj].properties.tags.cuisine =  [cuisine]
                    break;
                }
            }
        }
    }
    
    // restaurants restants sans cuisine trouvé
    i=0,j=0
    for(obj in jsonData.features)  { 
        if(!jsonData.features[obj].properties.tags.cuisine){
            console.log(jsonData.features[obj].properties)
            i++
            jsonData.features[obj].properties.tags.cuisine = ['classic'] // CLASSIQUE QUAND PAS DE CUISINE ??
        }
        else j++
    }
    console.log(i,j)

    // normalisation des types de restaurants
    let uniqueTypesRestaurantNormalises = []

    for(obj in jsonData.features)  { 
        if(jsonData.features[obj].properties.tags.cuisine){
            let cuisine_normalise = []
            for(cu of jsonData.features[obj].properties.tags.cuisine){
                let cunorm = cu
                if(cu == 'Café_Saint-Henri'| cu=='café_troisième_vague' | cu== 'coffee_shop' | cu == 'coffee'){
                    cunorm ='cafe'
                }
                else if(cu == 'italian_pizza'){
                    if (!cuisine_normalise.includes('italian')) {
                        cuisine_normalise.push('italian')
                    }

                    if (!cuisine_normalise.includes('pizza')) {
                        cuisine_normalise.push('pizza')
                    }
                    cunorm = 'pizza'
                }
                else if(cu == 'Pizza_Excentrique'){
                    cunorm = 'pizza'
                }
                else if(cu == 'marocaine'|cu=='marocain'){
                    cunorm = 'moroccan'
                }
                else if(cu=='libanaise'){
                    cunorm = 'lebanese'
                }
                else if(cu=='soupe'){
                    cunorm = 'soup'
                }
                
                if(!uniqueTypesRestaurantNormalises.includes(cunorm)){
                    uniqueTypesRestaurantNormalises.push(cunorm)
                }
                if(!cuisine_normalise.includes(cunorm)){
                    cuisine_normalise.push(cunorm)
                }
            }
           
            jsonData.features[obj].properties.tags.cuisine = cuisine_normalise
        }
    }

    //affiche tous les types de cuisine après normalisation
    console.log(uniqueTypesRestaurantNormalises.length,uniqueTypesRestaurantNormalises)

    // compte nombre de chaque type de cuisine --> mongodb
    let numbers_type = []
    for (let j =0;  j<uniqueTypesRestaurantNormalises.length; j++){
        let i = 0
        let type = uniqueTypesRestaurantNormalises[j]
        for(obj in jsonData.features)  { 
            if(jsonData.features[obj].properties.tags.cuisine){
                for(cu of jsonData.features[obj].properties.tags.cuisine){
                    if(cu == type){
                        i++
                    }
                } 
            }
        }
        numbers_type.push({
            type:   type,
            number: i
        })
    }
    
    console.log(numbers_type.sort(function (a, b) {
        return b.number - a.number;
      }))
  

    //on ajoute tous les restaurant au fichier restaurantClean.json
    var jsonRes = JSON.stringify(jsonData,null,2)
    fs.writeFile("../json_data/restaurantsClean.json", jsonRes, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
        });
});

//ON VA ENSUITE DEFINIR UN TYPE POUR CHAQUE RESTAURANT ET LE NOM ET CREER UN FICHIER AVEC LES NOMS ET LE TYPE ET LES COORDONNEES GPS
//POUR LES COORDONNEE GPS ON FAIT LA MOYENNE DU POLYGON SI C'EST UN POLYGON POUR AVOIR LE CONTRE DU POLYGON ( du restaurant)


 
 