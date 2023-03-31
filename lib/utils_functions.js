const validRestaurantsTypes = ["classic", "cafe", "burger", "pizza", "sandwich"]; // Todo : a recuperer via une requete .then( la suite)

function isValidType(type){
    return validRestaurantsTypes.includes(type)
}

function isValidTypes(typesTocheck){
    return typesTocheck.every(isValidType)
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}



function getStartingPoint(jsonData,length,type){
    if(type.length == 0){ // tous les combnaisons de types sont disponibles on se base uniquement sur la length
        for(data of jsonData){
            if(Math.abs(data.distance-length)<= data.distance*0.1){
                //console.log('itineraire possible avec ce starting point je renvoit ce point')
                return data.start_coord
            }
        }
    }
    else {
        all_possible_alternative = []
        for(data of jsonData){
            if(data.types.length==type.length){ // on verifie si les deux liste de types on la meme longeur
                if( data.types.every(function (e) { //on verifie si les deux listes on les memes types
                    return type.includes(e);
                    })){
                        //on verifie maintenant que la distance est bien de maximum +- 10% de la longeur voulue
                        if(Math.abs(data.distance-length)<= data.distance*0.1){
                            //console.log('itineraire possible avec ce starting point je renvoit ce point')
                            return data.start_coord
                        }
                        all_possible_alternative.push([Math.abs(data.distance-length),data])
                    }
                }
            }
            if(all_possible_alternative.length>1){//console.log('itineraire ompossible avec cette distance je renvoit un itineraire avec les memes types mais une longeur differentes la plus proche de la longeur cible')
                all_possible_alternative.sort(sortFunction);
                return all_possible_alternative[0][1].start_coord //on retourne l'itineraire avec la distance la lus proche de la distance voulu
            }
        //console.log('aucun itineraire avec cet distance et ces types')
        return jsonData[Math.floor(Math.random()*jsonData.length)].start_coord //on retourne un starting point aléatoir pour comme meme avoir quelque chose
    }
}

function sameTypesArray(array1,array2){
    nb_same = 0
    for(let i=0;i<array1.length;i++){
      for(let j=0;j<array2.length;j++){
        if(array1[i]==array2[j]){
          nb_same+=1
        }
        if(nb_same==array1.length && nb_same==array2.length){
          return true
        }
      }
    }
    return false
  }
    
function getParcour(jsonData,startingPoint,length,numberOfStops,type){
    all_possible_alternative = [],
    all_alternatives_2 = []
    for(data of jsonData){
        //si les coordonnes de départ son les mêmes
        if(data.start_coord.coordinates[0]==startingPoint.coordinates[0] && data.start_coord.coordinates[1]==startingPoint.coordinates[1]){
            //on va recuperer tous les itinéraire dispo
            if(type.length == 0){ // si tous les types disponibles
                if(Math.abs(data.distance-length)<= data.distance*0.1){
                    //console.log('itineraire possible avec ce starting point je renvoit ce point')
                    return data.parcour
                }
                return data.parcour
            }
            else if(data.types.length==type.length){ // on verifie si les deux liste de types on la meme longeur
                if(sameTypesArray(type,data.types)){
                        if(Math.abs(data.distance-length)<= data.distance*0.1){
                            //console.log('itineraire possible avec ce starting point je renvoit ce point')
                            //console.log('ça foctionne', data.types,type,data)
                            return data.parcour
                        }
                }
                all_possible_alternative.push([Math.abs(data.distance-length),data])
            }
        }
    }
    if(all_possible_alternative.length>1){
        all_possible_alternative.sort(sortFunction);
        return all_possible_alternative[0][1].parcour //on retourne l'itineraire avec la distance la lus proche de la distance voulu
    }
    else{
        //console.log('jamais censé arrivé') retourne un parcour aléatoire derniere solution
        return jsonData[Math.floor(Math.random()*jsonData.length)].parcour
    }
}

module.exports =  {isValidTypes,getStartingPoint,getParcour}
