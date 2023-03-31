const jsonPrecalFolder = '../json_data/parcours-precalc/'

const fs = require("fs");
const { exit } = require("process");

const sometest = [5000, 7500, 10000, 12000, 8000, 15000];


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



function getItineraire_en_double(data){
liste = []
for(parcour in data){
  for(parcour2 in data){
    if(parcour!=parcour2 && all_json_data[parcour].distance==all_json_data[parcour2].distance && parcour<parcour2){
      liste.push ([all_json_data[parcour2]])
    }
  }
}
return liste
}

function mergeAllParcours(){
  all_json_data_file_names = []
  fs.readdir(jsonPrecalFolder, (err, files) => {
    if (err) {
        throw err;
    }
    files.forEach(file => {
      all_json_data_file_names.push(file);
    });
    all_json_data = []
    console.log(all_json_data_file_names)
    for(data of all_json_data_file_names){
      if(data!='finalJson'){
        let jsonData = require(jsonPrecalFolder+data);
        all_json_data = all_json_data.concat(jsonData)
      }
    }
    fs.writeFileSync('../json_data/parcours-precalc/finalJson/parcours.json', JSON.stringify(all_json_data));
  })
}


function main(){

  all_json_data_file_names = []
    all_json_data = require('../json_data/parcours-precalc/finalJson/parcours.json')
    console.log('nombre de parcours total',all_json_data.length)
    let typesRestaux = ["classic", "cafe", "burger", "pizza", "sandwich"];
    allpossTypes = getAllPossibleTypes(typesRestaux);
    liste_parcours_manquant=[]
    let i=0
    for(test of sometest){
      for(typeR of allpossTypes){
        let is_in_parcour=false
        for(parcour of all_json_data){
          if(sameTypesArray(typeR,parcour.types) && Math.abs(parcour.distance - test)<=test*0.1){
            //console.log(sameTypesArray(typeR,parcour.types),test,parcour.distance,parcour.types)
            is_in_parcour=true
          }
        }
        if(is_in_parcour==false){
          liste_parcours_manquant.push([typeR,test])
        }
      }
    }
    console.log('parcours manquants',liste_parcours_manquant)
    console.log('doublons:',getItineraire_en_double(all_json_data).length)
        // for (data of jsonData) {
        //     if(Math.abs(data.distance - test)<=test*0.1){
        //         console.log(data.distance,data.nbstop) 
        //         i+=1
        //     }
        // }
}

//mergeAllParcours()
main();


