const express = require('express')
const app = express()
const port = 80
const libNeo4j = require("./lib/libNeo4j");
const libMongoDb = require("./lib/libMongoDb");
const utils_functions = require("./lib/utils_functions");
const path = require('path');
var bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({echec: "veuillez utiliser /heartbeat, /extracted_data ou /transformed_data"})
})

app.get('/readme', (req, res) => {
  res.sendFile(path.join(__dirname, '/readme.html'));
})

app.get('/heartbeat', (req, res) => {
    res.send({"villeChoisie": "Québec"})
})


app.get('/interface', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})
  
app.get('/marker', (req, res) => {
    res.sendFile(path.join(__dirname, '/marker.png'));
})

app.get('/extracted_data', (req, res) => {

  libNeo4j.getNbSegments().then(nbSegments => { 

    libMongoDb.countNumberRestaurant().then(nbRestaurants => {

      res.send({
        "nbRestaurants":nbRestaurants,
        "nbSegments":nbSegments
      })

    });
    })
})

app.get('/transformed_data', (req, res) => {

  libNeo4j.getLongueurCiclable().then(longeur => { 

    libMongoDb.countTypesRestaurant().then(typesRestau => {
      
      res.send({
        "restaurants":typesRestau,
        "longueurCyclable":longeur
      })

    });
    })
})

app.get('/type', (req, res) =>{
  libMongoDb.extractMostTypes(5).then(types => {
    res.send(types)
  })
})

const jsonData = require("./json_data/parcours-precalc/finalJson/parcoursv2.json");
const { type } = require('express/lib/response');

app.get('/starting_point', (req, res) =>{
  
  let length = req.body.length
  let type = req.body.type

  if(!Array.isArray(type) || !Number.isFinite(length)){
    res.statusCode = 400;
    res.send('Invalid type or length');
  }
  else if(!utils_functions.isValidTypes(type)){
    res.statusCode = 400;
    res.send('Invalid type please check your array of types');
  }
  else{
    let uniqueITypes = [...new Set(type)]
    res.send({
      startingPoint: utils_functions.getStartingPoint(jsonData,length,uniqueITypes)
  })
  }
})


app.get('/parcours', (req, res) =>{
  let startingPoint = req.body.startingPoint
  let length = req.body.length
  let numberOfStops = req.body.numberOfStops
  let type = req.body.type

  test = false
  if(Array.isArray(type)){
    if(Number.isInteger(type[0]) || !Number.isFinite(length)){
      res.statusCode = 400;
      res.send('Invalid type or length or numberOfStops');
      test = true
    }
  }
  if((test==false) && ((startingPoint.type==undefined) || (startingPoint.coordinates==undefined) ||  !Number.isInteger(numberOfStops))){
    res.statusCode = 400;
    res.send('Invalid type or length or numberOfStops or startingPoint');
  }
  else if(length>=3546433 || !utils_functions.isValidTypes(type)){
    res.statusCode = 404;
    res.send('Invalid length or type values');
  }
  else{
    let uniqueITypes = [...new Set(type)]
    res.send(
      utils_functions.getParcour(jsonData,startingPoint,length,numberOfStops,uniqueITypes)
    )
  }

})

app.post('/starting_point', (req, res) =>{
  
  let length = req.body.length
  let type = req.body.type

  if(!Array.isArray(type) || !Number.isFinite(length)){
    res.statusCode = 400;
    res.send('Invalid type or length');
  }
  else if(!utils_functions.isValidTypes(type)){
    res.statusCode = 400;
    res.send('Invalid type please check your array of types');
  }
  else{
    let uniqueITypes = [...new Set(type)]
    res.send({
      startingPoint: utils_functions.getStartingPoint(jsonData,length,uniqueITypes)
  })
  }

app.post('/parcours', (req, res) =>{
  let startingPoint = req.body.startingPoint
  let length = req.body.length
  let numberOfStops = req.body.numberOfStops
  let type = req.body.type

  test = false
  if(Array.isArray(type)){
    if(Number.isInteger(type[0]) || !Number.isFinite(length)){
      res.statusCode = 400;
      res.send('Invalid type or length or numberOfStops');
      test = true
    }
  }
  if((test==false) && ((startingPoint.type==undefined) || (startingPoint.coordinates==undefined) ||  !Number.isInteger(numberOfStops))){
    res.statusCode = 400;
    res.send('Invalid type or length or numberOfStops or startingPoint');
  }
  else if(length>=3546433 || !utils_functions.isValidTypes(type)){
    res.statusCode = 404;
    res.send('Invalid length or type values');
  }
  else{
    let uniqueITypes = [...new Set(type)]
    res.send(
      utils_functions.getParcour(jsonData,startingPoint,length,numberOfStops,uniqueITypes)
    )
  }

})


})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
  console.log(`Go here to see the name of the city -> http://localhost:${port}/heartbeat`)
  console.log(`Go here to see extracted data -> http://localhost:${port}/extracted_data`)
  console.log(`Go here to see transformed data -> http://localhost:${port}/transformed_data`)
  console.log(`Go here to see available types -> http://localhost:${port}/type`)
  console.log(`Go here to see the web interface ! -> http://localhost:${port}/interface`)
})
