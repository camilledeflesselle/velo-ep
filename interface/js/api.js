import { endpoint } from "./endpoint.js";
import { parcours } from "./test_geojson.js";
const info = {
    "calories_km": 40,
    "calories_type": {
        "classic": 500,
        "cafe": 200,
        "burger": 1200,
        "pizza": 1200,
        "sandwich": 400,
        "sushi": 500,
        "fast_food": 1200
    }

}

export const getParcours = async (
  startingPoint,
  length,
  numberOfStops,
  type
) => {
  const request = new Request(`${endpoint}/parcours`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    params: {
      startingPoint: startingPoint,
      length: length,
      numberOfStops: numberOfStops,
      type: type
    }
  });

  const response = await fetch(request).catch((err)=>{
    return parcours
  }
  );
  return await response.json();
};


export const getCaloriesDepensees = function(parcours){
  return parcours.features.map(result => { return -result.properties.length * info.calories_km/1000 || 0})
}
export const getCaloriesEat = function(parcours){
  return parcours.features.map(result => { return info.calories_type[result.properties.Type] || 0})
}
export const getCalories = function(parcours){
  return parcours.features.map(result => { return info.calories_type[result.properties.Type] || -result.properties.length * info.calories_km/1000})
}
export const getNames = function(parcours){
  return parcours.features.map(result => { return result.properties.name || 'Vélo'})
}

export const getTypes = function(parcours){
  return parcours.features.filter(result=>result.geometry.type=="Point").map(result => { return result.properties.Type})
}




//console.log(getCaloriesDepensees(parcours))
//console.log(getNames(parcours))
//console.log(getTypes(parcours))
//console.log(getCaloriesEat(parcours))