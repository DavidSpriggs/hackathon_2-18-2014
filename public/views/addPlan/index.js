(function() {
  'use strict';
  

  $('#when-date').pickadate();
  $('#when-time').pickatime();
  
}());

var AGS_BUSINESS = "https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/2/query";
var map;

require([
       "esri/map", 
       "esri/tasks/QueryTask",
       "esri/tasks/query",
      
       "dojo/on",
       "dojo/dom",
       "dojo/dom-attr",
        
       "dojo/domReady!"], 
 
 function(
   Map, QueryTask, Query,
   on, dom, domAttr) 
 {
    map = new Map("map", {
      basemap: "topo",
      center: [-122.45,37.75], // long, lat
      zoom: 13,
      sliderStyle: "small"
    });
    
    on(dom.byId("place"), "keyup", function(event) {
          doQuery(domAttr.get(dom.byId('place'), 'value'));
    });
    
   
      
    function doQuery(text) {
          var qt = new QueryTask(AGS_BUSINESS);
          var query = new Query();
          query.where = "1=1";
          query.returnGeometry = false;
          query.outFields = window.outFields;
          qt.execute(query, function(results) {
            var data = array.map(results.features, function(feature) {
              return {
                // property names used here match those used when creating the dgrid
                "id": feature.attributes[window.outFields[0]],
                "stateName": feature.attributes[window.outFields[1]],
                "median": feature.attributes[window.outFields[2]],
                "over1m": feature.attributes[window.outFields[3]]
              }
            });
            var memStore = new Memory({ data: data });
            window.grid.set("store", memStore);
          });
   }
    
  
  
  
});