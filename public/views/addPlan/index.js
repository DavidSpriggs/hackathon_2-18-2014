(function() {
  'use strict';
  

  $('#when-date').pickadate();
  $('#when-time').pickatime();
  
}());

var AGS_BUSINESS = "https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/2";
var AGS_ACTIVITES = "https://services1.arcgis.com/wQnFk5ouCfPzTlPw/ArcGIS/rest/services/BigTripin/FeatureServer/1";

var map;
var chosenFeature;

require([
       "esri/map", 
       "esri/layers/FeatureLayer",
       "esri/tasks/QueryTask",
       "esri/tasks/query",
      
       "dojo/on",
       "dojo/dom",
       "dojo/dom-attr",
       "dojo/_base/array",
        
       "dojo/domReady!"], 
 
 function(
   Map, FeatureLayer, QueryTask, Query,
   on, dom, domAttr, array) 
 {
    // map = new Map("map", {
    //   basemap: "topo",
    //   center: [-122.45,37.75], // long, lat
    //   zoom: 13,
    //   sliderStyle: "small"
    // });
    
    doQuery();
    on(dom.byId("place"), "keyup", function(event) {
      var text = domAttr.get(dom.byId('place'), 'value');
      if(text.length >= 2 ) {
        //doQuery(text);
      }
    });
   
    on(dom.byId('countMeIn'), 'click', function(event) {
        var fl = new FeatureLayer( AGS_ACTIVITES );
        if(chosenFeature == null || chosenFeature.feature == null) {
          alert("Choose a valid location");
        }
        var targetGraphic = chosenFeature.feature;
        
        delete targetGraphic.attributes["OBJECTID"];
        delete targetGraphic.attributes["ObjectID"];
        
        var date = moment(domAttr.get(dom.byId('when-date'), 'value'));
        var time = moment(domAttr.get(dom.byId('when-time'), 'value'), 'HH:mm A');
        targetGraphic.attributes['DATE'] = date;


        fl.applyEdits([targetGraphic], null, null,
          function(result) {
            
            console.log(result);
            window.location = "/activities/home/";
          },
          function(err) {
            
            console.log(err);
            window.location = "/activities/home/";
          });
        //activties/home
    });
    
   
      
    function doQuery(text) {
      var qt = new QueryTask(AGS_BUSINESS);
      var query = new Query();
      query.where = "1=1";
      query.returnGeometry = true;
      query.outFields = ['NAME', 'OBJECTID', 'BUSINESSID', 'BUSINESSID_1'];
      qt.execute(query, function(results) {
        var data = array.map(results.features, function(feature) {
          
          return {
            value: feature.attributes['NAME'],
            data: {feature: feature}
          };
          
        });
        $('#place').autocomplete({
            lookup: data,
             onSelect: function (suggestion) {
               chosenFeature = suggestion.data;
             }
            
         });
        
    
         
        
      });
   }
    
  
  
  
});