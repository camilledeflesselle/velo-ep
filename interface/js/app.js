import {getParcours, getCalories, getNames} from "./api.js";
import {chartdata} from "./chart.js"
import { parcours } from "./test_geojson.js";
new Vue({
    el: "#app",
    vuetify: new Vuetify({
      theme: {
        themes: {
          dark: {
            primary: "#c9c9c9"
          }
        },
        dark: true
      }
    }),
    data: function () {
      return {
        selected: undefined,
        types: ["burger", "cafe", "classic", "sandwich", "pizza"],
        show: false,
        chartdata: chartdata,
        parcours: parcours,
        startingPoint: {"type":"Point","coordinates":[-71.2272035,46.8232789]},
        length:12000,
        showChart:true,
       numberOfStops:10,

      };
    },
  
    methods: {
      async getParcours() {
        this.show = true;
        this.parcours = await getParcours(this.startingPoint,this.length,this.numberOfStops,
          this.types);
        const ctx = document.getElementById("mychart");
        
      },
      getChartdata() {
          const ctx = document.getElementById("mychart");
          ctx.innerHTML="";
          const canvas = document.createElement("canvas");
          ctx.appendChild(canvas);
          this.chartdata.data.labels = getNames(this.parcours);
          this.chartdata.data.datasets[0].data = getCalories(this.parcours);
          //this.chartdata.data.datasets[0].data = getCaloriesDepensees(this.parcours);
          this.chartdata.data.datasets[0].backgroundColor= getCalories(this.parcours).map(result=>{if (result>=0) return "rgba(255, 99, 132, 0.8)"
          else return "rgba(75, 192, 192, 0.8)"});
          new Chart(canvas, this.chartdata);
          
      }
    }
  });
  