
import {getParcours, getCaloriesDepensees, getCaloriesEat, getNames} from "./api.js";
import {chartdata} from "./chart.js"
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
  data: {
    show: false,
    types: ["burger", "pizza", "sandwich"],
    selected: undefined,
    chartdata: chartdata,
    accessToken:
      "pk.eyJ1IjoiZGVmbGVzc2MiLCJhIjoiY2t0enFiY2RoM2EyajJwcGl6enp5MG95biJ9.HJiHufyLG-7K-8DwOCL-cw",
    mapStyle: "mapbox://styles/mapbox/outdoors-v11",
    geojsonlayer: {
      id: "layer1",
      source: "parcours",
      type: "line",
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": "#003399",
        "line-width": 5
      }
    }
  },

  methods: {
    async getParcours() {
      const res = await getParcours(this.inputValue, this.length, this.startpoint);
      this.show = true;
      this.parcours = res;
    }
  },
  mounted() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZGVmbGVzc2MiLCJhIjoiY2t0enFiY2RoM2EyajJwcGl6enp5MG95biJ9.HJiHufyLG-7K-8DwOCL-cw';

      /**
       * Add the map to the page
       */
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center:[
          -71.3005144,
          46.8314256
        ],
        zoom: 10
      });

      const parcours = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -71.3005144,
          46.8314256
        ]
      },
      "properties": {
        "name": "3 Brasseurs",
        "Type": "burger"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [
          [
            [
              -71.3022469,
              46.8332507
            ],
            [
              -71.3021283,
              46.8333149
            ],
            [
              -71.3018916,
              46.8334348
            ],
            [
              -71.3007087,
              46.833949
            ],
            [
              -71.3006878,
              46.8339581
            ],
            [
              -71.3005986,
              46.8339969
            ],
            [
              -71.2996929,
              46.8343906
            ],
            [
              -71.2990063,
              46.834689
            ],
            [
              -71.2987561,
              46.8347863
            ],
            [
              -71.2985996,
              46.834868
            ],
            [
              -71.2973285,
              46.8354189
            ],
            [
              -71.2968443,
              46.8356288
            ],
            [
              -71.2961608,
              46.8358626
            ],
            [
              -71.295891,
              46.8359052
            ],
            [
              -71.2956482,
              46.8359435
            ],
            [
              -71.295175,
              46.8359345
            ],
            [
              -71.2936766,
              46.8357187
            ],
            [
              -71.2932166,
              46.8356917
            ],
            [
              -71.2927303,
              46.8357637
            ],
            [
              -71.2922177,
              46.8359165
            ],
            [
              -71.2915779,
              46.8361883
            ],
            [
              -71.2917366,
              46.8363422
            ],
            [
              -71.2917788,
              46.8363835
            ],
            [
              -71.2911287,
              46.8366854
            ],
            [
              -71.2903054,
              46.8370657
            ],
            [
              -71.2890461,
              46.8376473
            ],
            [
              -71.2887769,
              46.8377716
            ],
            [
              -71.2883649,
              46.8379595
            ],
            [
              -71.2861321,
              46.8388832
            ],
            [
              -71.2854726,
              46.83914
            ],
            [
              -71.2849569,
              46.839372
            ],
            [
              -71.2839016,
              46.8398468
            ],
            [
              -71.2835621,
              46.840053
            ],
            [
              -71.2831643,
              46.8403102
            ],
            [
              -71.2827233,
              46.8406968
            ],
            [
              -71.2826074,
              46.8408043
            ],
            [
              -71.2815628,
              46.841996
            ],
            [
              -71.2812866,
              46.8423197
            ],
            [
              -71.281079,
              46.8425579
            ],
            [
              -71.2810505,
              46.8425842
            ],
            [
              -71.2805909,
              46.8430084
            ],
            [
              -71.2804739,
              46.8430973
            ],
            [
              -71.279894,
              46.843538
            ],
            [
              -71.279356,
              46.8438508
            ],
            [
              -71.278924,
              46.8440606
            ],
            [
              -71.2788504,
              46.8440964
            ],
            [
              -71.2787838,
              46.8441256
            ],
            [
              -71.2776703,
              46.8446142
            ],
            [
              -71.2775269,
              46.8446735
            ],
            [
              -71.2766404,
              46.8450399
            ],
            [
              -71.2755418,
              46.8456739
            ],
            [
              -71.2744423,
              46.8463302
            ],
            [
              -71.2733617,
              46.8467717
            ],
            [
              -71.2725806,
              46.8469537
            ],
            [
              -71.2716161,
              46.847104
            ],
            [
              -71.2705711,
              46.8471298
            ],
            [
              -71.2689294,
              46.847097
            ],
            [
              -71.2686696,
              46.8470847
            ],
            [
              -71.268538,
              46.8471028
            ],
            [
              -71.2685172,
              46.8472106
            ],
            [
              -71.268494,
              46.8472935
            ],
            [
              -71.2684913,
              46.8473479
            ],
            [
              -71.2684602,
              46.8479768
            ],
            [
              -71.2684582,
              46.8488053
            ],
            [
              -71.2683773,
              46.8488193
            ],
            [
              -71.2666888,
              46.8491122
            ],
            [
              -71.2665658,
              46.849256
            ],
            [
              -71.2665786,
              46.8493009
            ],
            [
              -71.2662653,
              46.8493547
            ],
            [
              -71.2656724,
              46.849435
            ],
            [
              -71.2649247,
              46.849508
            ],
            [
              -71.2615115,
              46.8496778
            ],
            [
              -71.2607754,
              46.848876
            ],
            [
              -71.2604079,
              46.8484832
            ],
            [
              -71.2600388,
              46.8480887
            ],
            [
              -71.2597623,
              46.8477829
            ],
            [
              -71.2595066,
              46.8475071
            ],
            [
              -71.259045,
              46.8477095
            ],
            [
              -71.2568304,
              46.8486807
            ],
            [
              -71.2564646,
              46.8481798
            ],
            [
              -71.2549358,
              46.8488534
            ],
            [
              -71.2519327,
              46.8500959
            ],
            [
              -71.2515232,
              46.8496376
            ],
            [
              -71.2510133,
              46.8490832
            ],
            [
              -71.2505807,
              46.8486013
            ],
            [
              -71.2501555,
              46.8481173
            ],
            [
              -71.2495007,
              46.8474055
            ],
            [
              -71.2478025,
              46.8481519
            ],
            [
              -71.2472433,
              46.8475414
            ],
            [
              -71.2465649,
              46.846798
            ],
            [
              -71.2460171,
              46.8462124
            ],
            [
              -71.2457605,
              46.8459425
            ],
            [
              -71.2452684,
              46.8454211
            ],
            [
              -71.245224,
              46.845378
            ],
            [
              -71.2451682,
              46.8453193
            ],
            [
              -71.2443084,
              46.8444147
            ],
            [
              -71.2440901,
              46.844184
            ],
            [
              -71.2440405,
              46.8441315
            ],
            [
              -71.2435645,
              46.8436284
            ],
            [
              -71.2432895,
              46.8433403
            ],
            [
              -71.2430232,
              46.8430475
            ],
            [
              -71.2424365,
              46.8424179
            ],
            [
              -71.2419036,
              46.8418462
            ],
            [
              -71.2413222,
              46.8412223
            ],
            [
              -71.2408224,
              46.8406859
            ],
            [
              -71.240476,
              46.8403131
            ],
            [
              -71.2403369,
              46.840165
            ],
            [
              -71.2398573,
              46.8396465
            ],
            [
              -71.2393928,
              46.8391519
            ],
            [
              -71.2388276,
              46.8385454
            ],
            [
              -71.23877,
              46.838471
            ],
            [
              -71.2379744,
              46.8377976
            ],
            [
              -71.2379354,
              46.8377665
            ],
            [
              -71.2378079,
              46.8376648
            ],
            [
              -71.2368247,
              46.8368806
            ],
            [
              -71.2362757,
              46.8363868
            ],
            [
              -71.2356322,
              46.8356634
            ],
            [
              -71.2349892,
              46.8349983
            ],
            [
              -71.2344215,
              46.8343832
            ],
            [
              -71.2338565,
              46.8337645
            ],
            [
              -71.2332277,
              46.8330682
            ],
            [
              -71.2326625,
              46.83246
            ],
            [
              -71.2325753,
              46.8323698
            ],
            [
              -71.2320573,
              46.8318122
            ],
            [
              -71.2314833,
              46.8311661
            ],
            [
              -71.2308997,
              46.830531
            ],
            [
              -71.2313062,
              46.8303481
            ],
            [
              -71.2323349,
              46.8299063
            ],
            [
              -71.2327765,
              46.8297292
            ],
            [
              -71.2321661,
              46.8290828
            ],
            [
              -71.2315837,
              46.8284385
            ],
            [
              -71.2309867,
              46.8277956
            ],
            [
              -71.2304373,
              46.8271384
            ]
          ]
        ]
      },
      "properties": {
        "length": 8255.15630719925
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [
          -71.23002333191452,
          46.82693867487896
        ]
      },
      "properties": {
        "name": "Valentine",
        "Type": "burger"
      }
    }
  ]
};

      /**
       * Assign a unique id to each store. You'll use this `id`
       * later to associate each point on the map with a listing
       * in the sidebar.
       */
      parcours.features.forEach((store, i) => {
        store.properties.id = i;
      });

      /**
       * Wait until the map loads to make changes to the map.
       */
      map.on('load', () => {
        /**
         * This is where your '.addLayer()' used to be, instead
         * add only the source without styling a layer
         */
        map.addSource('places', {
          'type': 'geojson',
          'data': parcours
        });

        /**
         * Add all the things to the page:
         * - The location listings on the side of the page
         * - The markers onto the map
         */
        buildLocationList(parcours);
        addMarkers();
      });

      /**
       * Add a marker to the map for every store listing.
       **/
      function addMarkers() {
        /* For each feature in the GeoJSON object above: */
        for (const marker of parcours.features) {
          /* Create a div element for the marker. */
          const el = document.createElement('div');
          /* Assign a unique `id` to the marker. */
          el.id = `marker-${marker.properties.id}`;
          /* Assign the `marker` class to each marker for styling. */
          el.className = 'marker';

          /**
           * Create a marker using the div element
           * defined above and add it to the map.
           **/
          new mapboxgl.Marker(el, { offset: [0, -23] })
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

          el.addEventListener('click', (e) => {
            /* Fly to the point */
            flyToStore(marker);
            /* Close all other popups and display popup for clicked store */
            createPopUp(marker);
            /* Highlight listing in sidebar */
            const activeItem = document.getElementsByClassName('active');
            e.stopPropagation();
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            const listing = document.getElementById(
              `listing-${marker.properties.id}`
            );
            listing.classList.add('active');
          });
        }
      }

      /**
       * Add a listing for each store to the sidebar.
       **/
      function buildLocationList(parcours) {
        for (const store of parcours.features) {
			if (store.geometry.type == 'Point'){
          /* Add a new listing section to the sidebar. */
          const listings = document.getElementById('listings');
          const listing = listings.appendChild(document.createElement('div'));
          /* Assign a unique `id` to the listing. */
          listing.id = `listing-${store.properties.id}`;
          /* Assign the `item` class to each listing for styling. */
          listing.className = 'item';

          /* Add the link to the individual listing created above. */
          const link = listing.appendChild(document.createElement('a'));
          link.href = '#';
          link.className = 'title';
          link.id = `link-${store.properties.id}`;
          link.innerHTML = `${store.properties.name}`;

          /* Add details to the individual listing. */
          const details = listing.appendChild(document.createElement('div'));
          details.innerHTML = `${store.properties.Type}`;
    
          link.addEventListener('click', function () {
            for (const feature of parcours.features) {
              if (this.id === `link-${feature.properties.id}`) {
                flyToStore(feature);
                createPopUp(feature);
              }
            }
            const activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
              activeItem[0].classList.remove('active');
            }
            this.parentNode.classList.add('active');
          });
		}
        }
      }

      /**
       * Use Mapbox GL JS's `flyTo` to move the camera smoothly
       * a given center point.
       **/
      function flyToStore(currentFeature) {
        map.flyTo({
          center: currentFeature.geometry.coordinates,
          zoom: 13
        });
      }

      /**
       * Create a Mapbox GL JS `Popup`.
       **/
      function createPopUp(currentFeature) {
        const popUps = document.getElementsByClassName('mapboxgl-popup');
        if (popUps[0]) popUps[0].remove();
        const popup = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat(currentFeature.geometry.coordinates)
          .setHTML(
            `<h3>Restaurant</h3><h4>${currentFeature.properties.name}</h4>`
          )
          .addTo(map);
      }
  },
  computed: {
    geojsonSource(){
      let res = new Object();
      res.type ='geojson';
      res.data = this.parcours;
      return res
    }
  }
});