const jsonPrecalFolder = '../json_data/parcours-precalc/'

const fs = require("fs");
const { exit } = require("process");

const sometest = [5000, 7500, 10000, 12000, 8000, 15000];

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

function sameTypesArray(array1,array2){
  if(array1.length==0 && array1.length==0){
    return true //les deux array sont vides
  }
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

function main(){

    all_json_data = require('../json_data/parcours-precalc/finalJson/parcours.json')
    console.log('nombre de parcours total',all_json_data.length)
    nbcorrect = 0
    let typesRestaux = ["classic", "cafe", "burger", "pizza", "sandwich"];
    for(data of all_json_data){
      for(point of data.parcour.features){
        types = []
        if(point.geometry.type == 'Point'){
          types.push(point.properties.Type)
        }
      }
      data.types = types
    }

    //suppression du mauve Type par type
    for(data of all_json_data){
      for(point of data.parcour.features){
        point.properties.type = point.properties.Type
        delete  point.properties.Type;
      }
    }

    //fs.writeFileSync('../json_data/parcours-precalc/finalJson/parcoursv2.json', JSON.stringify(all_json_data));
}

//mergeAllParcours()
main();


