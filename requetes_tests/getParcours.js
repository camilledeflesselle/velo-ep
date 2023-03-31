const fs = require("fs");
const jsonData = require("./tableauPrecalcule.json");


sometest = [5000, 7500, 10000, 12000, 8000, 15000]

let i=0
for(test of sometest){
    console.log('test : '+test)
    for (data of jsonData) {
        if(Math.abs(data.distance - test)<=test*0.1){
            console.log(data.distance,data.nbstop) 
            i+=1
    }
    }
    console.log(i)
}
