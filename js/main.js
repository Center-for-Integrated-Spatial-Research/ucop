dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.TitlePane");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.Select");
dojo.require("dijit.form.CheckBox");
dojo.require("dijit.TooltipDialog");
dojo.require("dijit.Tooltip");
dojo.require("dijit.Dialog");
dojo.require("dojox.fx");
dojo.require("dojox.widget.TitleGroup");
dojo.require("dijit._Widget");
dojo.require("dojo.data.ItemFileReadStore");
dojo.require("dojox.grid.DataGrid");
dojo.require("dojo.NodeList-traverse");
dojo.require("dojo.number");
dojo.require("dojo.currency");
dojo.require("dojo.DeferredList");

dojo.require("esri.map");
dojo.require("esri.virtualearth.VETiledLayer");
dojo.require("esri.layers.WebTiledLayer");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.dijit.OverviewMap");
dojo.require("esri.toolbars.navigation");
dojo.require("esri.tasks.locator");
dojo.require("esri.dijit.Geocoder")
dojo.require("esri.tasks.geometry");

var map, maxExtent, maxLevel, initExtent, tooltip, zoomEnd, districtSymbol, selectionSymbol, highlightSymbol, resultsImage;
var communityProgramLayerDefinition = "";
var campusLayerDefinition = "Type = 'University'";
var medCenterLayerDefinition = "Type = 'Medical Center'";
var labLayerDefinition = "Type = 'Lab'";
var resetLayers = false;
var queryLayers = false;
var communityProgramLayerUniqueValues = [];
var ucSystemValues = {
	"University":0,
	"Medical Center":0,
	"Lab":0,
	"Reserves":0,
	"Agriculture, Environment and Natural Resources":0,
	"Business and Economic Development":0,
	"Community College Student Services":0,
	"Community and Social Services":0,
	"Cultural Resources and Arts":0,
	"Health Services/Nutrition":0,
	"K-12 Student Services":0,
	"Public Policy":0,
	"Teacher Preparation":0,
	"Teacher Professional Development":0,
	"University Extension":0,
	"legendHeader":0
}
var streetsLayer;
var streetsLayerUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";
var streetsLayerUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer"
var baseMapLayer;
var baseMapLayerUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer";
var imageryLayer;
var imageryLayerUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer";
var grayLayer;
var grayLayerUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer";
var grayLayerLabels;
var grayLayerLabelsUrl = "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer"
var ovMapLayer;
var stamenTerrainLayer;
var stamenLayerInfos = {
	"options": { 
		"id": "Stamen Terrain",
		"visible": false, 
		"subDomains": ["a", "b", "c", "d"], 
		"copyright": 'Map tiles by Stamen Design. Data by OpenStreetMap.' 
	},
	"url": "http://${subDomain}.tile.stamen.com/terrain/${level}/${col}/${row}.jpg"
};
var oceanLayer;
var oceanLayerUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/StamenOcean/MapServer"
var locator;
var locatorUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";
var geoService;
var geoServiceUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/Utilities/Geometry/GeometryServer";
var highlightLayer;
var campusLargeFeatureLayer;
var medCenterLargeFeatureLayer;
var labLargeFeatureLayer;
var campusLargeUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/0";
var campusSmallFeatureLayer;
var medCenterSmallFeatureLayer;
var labSmallFeatureLayer;
var campusSmallUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/1";
var campusNames;
var reservesFeatureLayer;
var reservesUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/2";
var communityProgramDynamicLayer;
var communityProgramDynamicLayerUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOPCommunityPrograms_20150303/MapServer";
var communityProgramFeatureLayer577k;
var communityProgramUrl577k = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/3";
var communityProgramFeatureLayer288k;
var communityProgramUrl288k = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/4";
var communityProgramFeatureLayer144k;
var communityProgramUrl144k = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/5";
var communityProgramFeatureLayer72k;
var communityProgramUrl72k = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/6";

var assemblyFeatureLayer;
var assemblyUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/7"
var assemblyDistricts;
var senateFeatureLayer;
var senateUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/8"
var senateDistricts;
var congressFeatureLayer;
var congressUrl = "http://arcgis.cisr.ucsc.edu/arcgis/rest/services/UCOP/UCOP_20150303/MapServer/9"
var congressDistricts;
var maxOffset = 50;
var basemaps = [];
var activeTabs = [];
var filterSelectAll = " -- none -- ";
var navigationTool;
var addressInfo = {"address":"", "assembly":"", "senate":"", "congress":"", "campus":""}

function init(){
	var zSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([102,102,102]), 2), new dojo.Color([102,102,102,0.25]));
	esri.config.defaults.map.zoomSymbol = zSymbol.toJson();
	esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
	esri.config.defaults.io.proxyUrl = "/proxy/proxy.ashx"
	//esri.config.defaults.io.corsEnabledServers.push("tasks.arcgisonline.com");
	esri.config.defaults.io.corsEnabledServers.push("arcgis.cisr.ucsc.edu");
	
	dojo.style("mapProgressBar", { 
			display:"block",
			top: dojo.style("mapDiv", "height")/2 - dojo.style("mapProgressBar", "height")/2 + dojo.style("topDiv", "height")/2 + "px",
			left: dojo.style("mapDiv", "width")/2 - dojo.style("mapProgressBar", "width")/2 + "px"
	});
	
	var initExtent = new esri.geometry.Extent({
	"xmin": -13849152,
	"ymin": 3767250,
	"xmax": -12705090,
	"ymax": 5228832,
	"spatialReference": {
	  "wkid": 102100
	}
	});
	
	map = new esri.Map("mapDiv", {
		extent: initExtent,
		fadeOnZoom: true,
		fitExtent: true,
		maxZoom: 15,
		minZoom: 6,
		navigationMode:'css-transforms',
		slider: false,
		logo: false
	});

	navigationTool = new esri.toolbars.Navigation(map);
	navigationTool.setZoomSymbol(zSymbol);	
	
	locator = new esri.tasks.Locator(locatorUrl);
	geoService = new esri.tasks.GeometryService(geoServiceUrl);
	
	ovMapLayer = new esri.layers.ArcGISTiledMapServiceLayer(grayLayerUrl,{id:'ovmap', showAttribution: false});
	ovMapLayer.setOpacity(1.0);
	map.addLayer(ovMapLayer);
	
	grayLayer = new esri.layers.ArcGISTiledMapServiceLayer(grayLayerUrl,{id:'gray'});
	map.addLayer(grayLayer);
	basemaps.push(grayLayer);
	
	grayLayerLabels = new esri.layers.ArcGISTiledMapServiceLayer(grayLayerLabelsUrl,{id:'grayLabels'});
	grayLayerLabels.setOpacity(0.5);
	map.addLayer(grayLayerLabels);
	basemaps.push(grayLayerLabels);	
	
	streetsLayer = new esri.layers.ArcGISTiledMapServiceLayer(streetsLayerUrl,{id:'streets'});
	streetsLayer.setOpacity(0.65);
	map.addLayer(streetsLayer);
	basemaps.push(streetsLayer);
	streetsLayer.hide();
	
	/*
	imageryLayer = new esri.layers.ArcGISTiledMapServiceLayer(baseMapLayerUrl,{id:'imagery'});	
	imageryLayer.setOpacity(0.5)
	map.addLayer(imageryLayer);
	basemaps.push(imageryLayer);
	imageryLayer.hide();
	*/
	
	stamenTerrainLayer = new esri.layers.WebTiledLayer(stamenLayerInfos.url, stamenLayerInfos.options);
	stamenTerrainLayer.setOpacity(0.5)
	map.addLayer(stamenTerrainLayer);
	basemaps.push(stamenTerrainLayer);
	stamenTerrainLayer.hide();
	
	oceanLayer = new esri.layers.ArcGISTiledMapServiceLayer(oceanLayerUrl,{id:'ocean'});
	oceanLayer.setOpacity(1.0)
	map.addLayer(oceanLayer);
	basemaps.push(oceanLayer);
	oceanLayer.hide();
	
	districtSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([143,136,132,0.5]),1), new dojo.Color([143,136,132,0.35]));
	selectionSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,211,127,1]),1), new dojo.Color([212,215,217,0.1]));
	highlightSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([190,182,175,0.5]),1), new dojo.Color([143,136,132,0.1]));
	
	assemblyFeatureLayer = new esri.layers.FeatureLayer(assemblyUrl, {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"],
		  maxAllowableOffset: maxOffset
        });
	assemblyFeatureLayer.setRenderer(new esri.renderer.SimpleRenderer(districtSymbol));
	assemblyFeatureLayer.setSelectionSymbol(selectionSymbol);
	map.addLayer(assemblyFeatureLayer);
	assemblyFeatureLayer.hide();	

	senateFeatureLayer = new esri.layers.FeatureLayer(senateUrl, {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"],
		  maxAllowableOffset: maxOffset
        });
	senateFeatureLayer.setRenderer(new esri.renderer.SimpleRenderer(districtSymbol));
	senateFeatureLayer.setSelectionSymbol(selectionSymbol);
	map.addLayer(senateFeatureLayer);
	senateFeatureLayer.hide();
	
	congressFeatureLayer = new esri.layers.FeatureLayer(congressUrl, {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"],
		  maxAllowableOffset: maxOffset

        });
	congressFeatureLayer.setRenderer(new esri.renderer.SimpleRenderer(districtSymbol));
	congressFeatureLayer.setSelectionSymbol(selectionSymbol);
	map.addLayer(congressFeatureLayer);
	congressFeatureLayer.hide();
	
	highlightLayer = new esri.layers.GraphicsLayer({id:'highlightLayer'});
	highlightLayer.setRenderer(new esri.renderer.SimpleRenderer(highlightSymbol));
	map.addLayer(highlightLayer);
	
	communityProgramDynamicLayer = new esri.layers.ArcGISDynamicMapServiceLayer(communityProgramDynamicLayerUrl, {
		visible: true,	
	});
	communityProgramDynamicLayer.setImageFormat("png24");
	map.addLayer(communityProgramDynamicLayer);
	communityProgramDynamicLayer.hide();

	communityProgramFeatureLayer577k = new esri.layers.FeatureLayer(communityProgramUrl577k, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	communityProgramFeatureLayer577k.setScaleRange(0, 577790);
	communityProgramFeatureLayer577k.setDefinitionExpression(communityProgramLayerDefinition);
	map.addLayer(communityProgramFeatureLayer577k);
	communityProgramFeatureLayer577k.hide();
	
	communityProgramFeatureLayer288k = new esri.layers.FeatureLayer(communityProgramUrl288k, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	communityProgramFeatureLayer288k.setScaleRange(577789, 288895);
	communityProgramFeatureLayer288k.setDefinitionExpression(communityProgramLayerDefinition);
	map.addLayer(communityProgramFeatureLayer288k);
	
	communityProgramFeatureLayer144k = new esri.layers.FeatureLayer(communityProgramUrl144k, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	communityProgramFeatureLayer144k.setScaleRange(288894, 144447);
	communityProgramFeatureLayer144k.setDefinitionExpression(communityProgramLayerDefinition);
	map.addLayer(communityProgramFeatureLayer144k);		
	
	communityProgramFeatureLayer72k = new esri.layers.FeatureLayer(communityProgramUrl72k, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	communityProgramFeatureLayer72k.setScaleRange(144447, 0);
	communityProgramFeatureLayer72k.setDefinitionExpression(communityProgramLayerDefinition);
	map.addLayer(communityProgramFeatureLayer72k);	
	
	reservesFeatureLayer = new esri.layers.FeatureLayer(reservesUrl, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	map.addLayer(reservesFeatureLayer);
	reservesFeatureLayer.hide();
	
	medCenterSmallFeatureLayer = new esri.layers.FeatureLayer(campusSmallUrl, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	medCenterSmallFeatureLayer.setDefinitionExpression(medCenterLayerDefinition);
	map.addLayer(medCenterSmallFeatureLayer);
	medCenterSmallFeatureLayer.hide();

	labSmallFeatureLayer = new esri.layers.FeatureLayer(campusSmallUrl, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	labSmallFeatureLayer.setDefinitionExpression(labLayerDefinition);
	map.addLayer(labSmallFeatureLayer);
	labSmallFeatureLayer.hide();
	
	campusSmallFeatureLayer = new esri.layers.FeatureLayer(campusSmallUrl, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	campusSmallFeatureLayer.setDefinitionExpression(campusLayerDefinition);
	map.addLayer(campusSmallFeatureLayer);	

	medCenterLargeFeatureLayer = new esri.layers.FeatureLayer(campusLargeUrl, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	medCenterLargeFeatureLayer.setDefinitionExpression(medCenterLayerDefinition);
	map.addLayer(medCenterLargeFeatureLayer);
	medCenterLargeFeatureLayer.hide();

	labLargeFeatureLayer = new esri.layers.FeatureLayer(campusLargeUrl, {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          outFields: ["*"]
        });
	labLargeFeatureLayer.setDefinitionExpression(labLayerDefinition);
	map.addLayer(labLargeFeatureLayer);
	labLargeFeatureLayer.hide();
	
	campusLargeFeatureLayer = new esri.layers.FeatureLayer(campusLargeUrl, {
          mode: esri.layers.FeatureLayer.MODE_SNAPSHOT,
          outFields: ["*"]
        });
	campusLargeFeatureLayer.setDefinitionExpression(campusLayerDefinition);
	map.addLayer(campusLargeFeatureLayer);
	campusLargeFeatureLayer.hide();
	
	var query = new esri.tasks.Query();
	query.where = ("1=1");
	query.orderByFields = ["District_Number"];
	query.outFields = ["District_Number", "District_Name"];
	query.returnGeometry = false;
	
	var queryTask = new esri.tasks.QueryTask(assemblyUrl);
	queryTask.execute(query, function(results) {
		assemblyDistricts = filterSelectData(results.features, "District_Name");
	});	
	
	var queryTask = new esri.tasks.QueryTask(senateUrl);
	queryTask.execute(query, function(results) {
		senateDistricts = filterSelectData(results.features, "District_Name");
	});	
	
	var queryTask = new esri.tasks.QueryTask(congressUrl);
	queryTask.execute(query, function(results) {
		congressDistricts = filterSelectData(results.features, "District_Name");
	});
	
	var query = new esri.tasks.Query();
	query.where = ("Type = 'University'");
	query.orderByFields = ["Name"];
	query.outFields = ["Name"];
	query.returnGeometry = false;
	
	var queryTask = new esri.tasks.QueryTask(campusSmallUrl);
	queryTask.execute(query, function(results) 	{
		dojo.byId("University").childNodes[2].innerHTML = "" + results.features.length + "";
		ucSystemValues["University"] = results.features.length;
		campusNames = filterSelectData(results.features, "Name");
	});
	
	query.where = ("Type = 'Medical Center'");
	queryTask.execute(query, function(results) 	{
		dojo.byId("Medical Center").childNodes[2].innerHTML = "" + results.features.length + "";
		ucSystemValues["Medical Center"] = results.features.length;
	});
	
	query.where = ("Type = 'Lab'");
	queryTask.execute(query, function(results) 	{
		dojo.byId("Lab").childNodes[2].innerHTML = "" + results.features.length + "";
		ucSystemValues["Lab"] = results.features.length;
	});
	
	var query = new esri.tasks.Query();
	query.where = ("1=1");
	query.outFields = ["Reserve_Name"];
	query.returnGeometry = false;
	
	var queryTask = new esri.tasks.QueryTask(reservesUrl);
	queryTask.execute(query, function(results) 	{
		dojo.byId("Reserves").childNodes[2].innerHTML = "" + results.features.length + "";
		ucSystemValues["Reserves"] = results.features.length;
	});	
	
	var data = { label:"name", identifier:"id", items: 
			[{ "name": filterSelectAll, "id": filterSelectAll },
			{ "name": "State Assembly District", "id": "assembly" },
			{ "name": "State Senate District", "id": "senate" },
			{ "name": "US Congressional District", "id": "congress" },
			{ "name": "UC Campus", "id": "campus" }] 
	};
  	var store = new dojo.data.ItemFileReadStore({ data: data });
	new dijit.form.FilteringSelect({
		store: store,
		autoComplete: true,
		required: true,
		searchAttr: "name",
		value: filterSelectAll,
		maxHeight: 100,
		style: "width: 100%;",
		onChange: function(name) {
				var item = this.item;
				updateLayerVisibility(item.id);
				if ((addressInfo[item.id] != "")&&(item.id != filterSelectAll)) { dijit.byId("district").set("value", addressInfo[item.id]);  }
		}
	}, "layer");
	
	var data = { label:"name", identifier:"id", items: [{ "name": filterSelectAll, "id": filterSelectAll }] };
	var store = new dojo.data.ItemFileReadStore({ data: data });
	new dijit.form.FilteringSelect({
		store: store,
		autoComplete: true,
		required: false,
		searchAttr: "name",
		value: filterSelectAll,
		maxHeight: 100,
		style: "width: 100%;",
		onChange: function(name) {
			var item = this.item;
			if (item.id != filterSelectAll) {
				dijit.byId("searchButton").set('disabled', false);
				dijit.byId("clearButton").set('disabled', false);
			} else {
				dijit.byId("searchButton").set('disabled', true);
				dijit.byId("clearButton").set('disabled', true);
			}			
		}
	}, "district");	
	
	var query = new esri.tasks.Query();
	query.where = ("Category IS NOT Null");
	query.orderByFields = ["Category"];
	query.outFields = ["Category"];
	query.returnGeometry = false;

	var queryTask = new esri.tasks.QueryTask(communityProgramUrl577k);
	queryTask.execute(query, function(results) {
        var features = results.features;
        dojo.forEach (features, function(feature) {
			var value = feature.attributes["Category"];
			if (dojo.indexOf(communityProgramLayerUniqueValues, value) == -1) {
				communityProgramLayerUniqueValues.push(value);
			}
        });
		dojo.byId("legendHeader").childNodes[1].innerHTML = "" + dojo.number.format(features.length.toFixed(0)) + "";
		ucSystemValues["legendHeader"] = dojo.number.format(features.length.toFixed(0));
		var values = dojo.map(features, function(feature) {
			return feature.attributes["Category"];
		});
		dojo.forEach(communityProgramLayerUniqueValues, function(unique) {
			var program = dojo.filter(values, function(value) {
				return value == unique;
			});
			var count = program.length;
			dojo.byId(unique).childNodes[2].innerHTML = "" + dojo.number.format(count.toFixed(0)) + "";
			ucSystemValues[unique] = dojo.number.format(count.toFixed(0)) ;
		});
	});
 
	dojo.connect(map, 'onLoad', function(map) {
		dojo.connect(assemblyFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "District_Name", assemblyFeatureLayer.getSelectedFeatures()); });
		dojo.connect(senateFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "District_Name", senateFeatureLayer.getSelectedFeatures()); });
		dojo.connect(congressFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "District_Name",congressFeatureLayer.getSelectedFeatures()); });
		
		dojo.connect(assemblyFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "District_Name"); });		
		dojo.connect(senateFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "District_Name"); });		
		dojo.connect(congressFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "District_Name"); });		
		
		dojo.connect(assemblyFeatureLayer, "onClick", function(evt) { layerOnClick(evt); });
		dojo.connect(senateFeatureLayer, "onClick", function(evt) { layerOnClick(evt); });
		dojo.connect(congressFeatureLayer, "onClick", function(evt) { layerOnClick(evt); });

		dojo.connect(highlightLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "District_Name"); });		
		dojo.connect(highlightLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });
		dojo.connect(highlightLayer, "onClick", function(evt) { layerOnClick(evt); });
		
		dojo.connect(campusSmallFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "Name"); });
		dojo.connect(campusLargeFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "Name"); });
		dojo.connect(campusSmallFeatureLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });
		dojo.connect(campusLargeFeatureLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });
		dojo.connect(campusSmallFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "Name"); });
		dojo.connect(campusLargeFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "Name"); });		
		dojo.connect(campusSmallFeatureLayer, "onClick", function(evt) { campusOnClick(evt); });
		dojo.connect(campusLargeFeatureLayer, "onClick", function(evt) { campusOnClick(evt); });
		
		dojo.connect(medCenterSmallFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "Name"); });
		dojo.connect(medCenterLargeFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "Name"); });
		dojo.connect(medCenterSmallFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "Name"); });
		dojo.connect(medCenterLargeFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "Name"); });		
		dojo.connect(medCenterSmallFeatureLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });
		dojo.connect(medCenterLargeFeatureLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });		
		dojo.connect(medCenterSmallFeatureLayer, "onClick", function(evt) { campusOnClick(evt); });
		dojo.connect(medCenterLargeFeatureLayer, "onClick", function(evt) { campusOnClick(evt); });

		dojo.connect(labSmallFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "Name"); });
		dojo.connect(labLargeFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "Name"); });
		dojo.connect(labSmallFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "Name"); });
		dojo.connect(labLargeFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "Name"); });
		dojo.connect(labSmallFeatureLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });
		dojo.connect(labLargeFeatureLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });		
		dojo.connect(labSmallFeatureLayer, "onClick", function(evt) { campusOnClick(evt); });
		dojo.connect(labLargeFeatureLayer, "onClick", function(evt) { campusOnClick(evt); });		
		
		dojo.connect(reservesFeatureLayer, "onMouseOver", function(evt) { layerOnMouseOver(evt, "Reserve_Name"); });
		dojo.connect(reservesFeatureLayer, "onMouseOut", function(evt) { layerOnMouseOut(evt); });
		dojo.connect(reservesFeatureLayer, "onMouseMove", function(evt) { layerOnMouseMove(evt, "Reserve_Name"); });	
		dojo.connect(reservesFeatureLayer, "onClick", function(evt) { reservesOnClick(evt); });	

		dojo.connect(communityProgramFeatureLayer577k, "onClick", function(evt) { communityProgramsOnClick(evt); });
		dojo.connect(communityProgramFeatureLayer288k, "onClick", function(evt) { communityProgramsOnClick(evt); });
		dojo.connect(communityProgramFeatureLayer144k, "onClick", function(evt) { communityProgramsOnClick(evt); });
		dojo.connect(communityProgramFeatureLayer72k, "onClick", function(evt) { communityProgramsOnClick(evt); });
		
		//add the overview map
		var overviewMapDijit = new esri.dijit.OverviewMap({
			map: map,
			id: "overviewMap",
			attachTo: "top-right",
			baseLayer: ovMapLayer,
			visible:false,
			expandFactor: 2,
			width: 200,
			height: 150
		});
		overviewMapDijit.startup();
		
		 var geocoder = new esri.dijit.Geocoder({
				map: map,
				autoComplete: true,
				autoNavigate: false,
				arcgisGeocoder: {
					url: "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
					name: "Esri World Geocoder",
					placeholder: "Type an address",
					searchExtent: initExtent,
					sourceCountry: "USA"
				}
			}, "address");

		geocoder.startup();
		dijit.byId("address").inputNode.placeholder = "Type an address"
		
		dojo.connect(geocoder, "onAutoComplete", function (results) {
		  var length = results.results.length;
		  var testArray = [];
		  var newResults = [];
		  for (var i = 0; i < length; i++) {
			switch(i)
			{
			case 0:
			  testArray.push(results.results[i].name.toUpperCase());
			  newResults.push(results.results[i]);
			  break;
			default:
			  var name = results.results[i].name;
			  if (dojo.indexOf(testArray, name.toUpperCase()) === -1) {
				newResults.push(results.results[i]);
			  }
			  else {
				break;
			  }
			}
		  }
		  geocoder.set('results', newResults);
		});

		dojo.connect(geocoder, "onSelect", function(results){
			dijit.byId("searchButton").set('disabled', true);
			dijit.byId("clearButton").set('disabled', true);
			getSpatialQueryResults(results.name, results.feature.geometry);
			showGeocodeResults(results.feature.geometry)
			dijit.byId("addressIcon_tooltip").set("label", "Current address: " + results.name + "<br/>Click to clear/change street address.");			
		});

		dojo.connect(geocoder, "onFindResults", function(results){
			dijit.byId("searchButton").set('disabled', true);
			dijit.byId("clearButton").set('disabled', true);
			getSpatialQueryResults(results.results[0].name, results.results[0].feature.geometry);
			showGeocodeResults(results.results[0].feature.geometry);
			dijit.byId("address").inputNode.value = results.results[0].name;
			dijit.byId("addressIcon_tooltip").set("label", "Current address: <b>" + results.results[0].name + "</b><br/>Click to clear/change street address.");
		});

		dojo.connect(geocoder.clearNode,"onclick", function(){	
			addressInfo.address = "";
			addressInfo.assembly = "";
			addressInfo.senate = "";
			addressInfo.congress = "";
			addressInfo.campus = "";
			if (dojo.style("addressDiv", "display") == "block") {
				dojo.style("addressDiv", {"display":"none"});
			}
			map.graphics.clear();
			dijit.byId("addressIcon_tooltip").set("label","Click to choose a feature based <br/>on a custom street address.");
		})
		
		dijit.byId("address").clearNode.id = "addressClearNode";
		new dijit.Tooltip({ id:"addressIcon_tooltip", connectId: "addressIcon", label:"Click to choose a feature based <br/>on a custom street address.", showDelay:10, position:['below'] });
		new dijit.Tooltip({ id:"addressClearNode_tooltip", connectId: "addressClearNode", label:"Click to clear the current street address.", showDelay:10, position:['after'] });		
		
		dojo.style("baseMapOptionDiv", { "display":"block" });
		dojo.style("legendContentDiv", { "visibility":"visible" });
		dojo.style("taskDiv", { "visibility":"visible" });
		dijit.byId("infoTabs").domNode.style.display = "block";
		var api = $('.scroll-pane').data('jsp');
		api.reinitialise();		
		maxExtent = map.extent;
		maxLevel = map.getLevel();
	});
	
	dojo.connect(map, "onUpdateStart", function(){
			dojo.style("mapProgressBar", { "display":"block"} );	
	});	
	
	dojo.connect(map, "onUpdateEnd", function(){
			dojo.style("mapProgressBar", { "display":"none"} );	
	});
	
	dojo.connect(map, "onExtentChange", function(extent, delta, outLevelChange, outLod){
			if (!queryLayers) { 
				checkLegendVisibility();
			}
			resetLayers = false;
	});
	
	dojo.connect(map, "onZoomStart", function(extent, factor, anchor, level){
			communityProgramDynamicLayer.hide();
			communityProgramFeatureLayer577k.hide();
			communityProgramFeatureLayer288k.hide();
			communityProgramFeatureLayer144k.hide();
			communityProgramFeatureLayer72k.hide();
			campusSmallFeatureLayer.hide();
			medCenterSmallFeatureLayer.hide();
			labSmallFeatureLayer.hide();
			campusLargeFeatureLayer.hide();
			medCenterLargeFeatureLayer.hide();
			labLargeFeatureLayer.hide();
			reservesFeatureLayer.hide();
	});
	
	dojo.connect(map, "onZoomEnd", function(extent, factor, anchor, level){
			navigationTool.deactivate();
			dojo.style("mapDiv_layers", "cursor", "default");
	});
	
	dojo.connect(dojo.byId("zoomInIncrementDiv"), "onclick", function() {
			map.setLevel(map.getLevel() + 1);
	});

	dojo.connect(dojo.byId("zoomOutIncrementDiv"), "onclick", function() {
			map.setLevel(map.getLevel() - 1);
	});

	dojo.connect(dojo.byId("zoomInToolDiv"), "onclick", function() {
		navigationTool.activate(esri.toolbars.Navigation.ZOOM_IN);
		dojo.style("mapDiv_layers", "cursor", "crosshair");
	});
	
	dojo.connect(dojo.byId("zoomFullToolDiv"), "onclick", function() {
		map.setExtent(maxExtent);
	});	

	dojo.connect(dojo.byId("overviewDiv"), "onclick", function() {
			var display = dojo.style(dojo.query(".ovwContainer")[0], "display");
			if (display == "none") {
				dijit.byId("overviewMap").show();
			} else {
				dijit.byId("overviewMap").hide();
			}			
	});		
	
	dojo.connect(dijit.byId("taskDiv")._wipeOut, "onEnd", function () {
		dojo.query("#legendContentDiv .dijitTitlePaneTitle").at(0).style({ "backgroundImage": "url('images/results_white.png')"});
		var api = $('.scroll-pane').data('jsp');
		api.reinitialise();
	});
	
	dojo.connect(dijit.byId("taskDiv")._wipeIn, "onEnd", function () {
		dojo.query("#legendContentDiv .dijitTitlePaneTitle").at(0).style( {"backgroundImage": "url('images/results.png')" })
		var api = $('.scroll-pane').data('jsp');
		api.reinitialise();
	});		
	
	dojo.connect(dijit.byId("legendContentDiv"), "toggle", function () {
		var state = this.open;
		if (state == true) {
			dijit.byId("infoTabs").resize();
		}
	});

	dojo.connect(dojo.byId("taskDiv_titleBarNode"), "onmouseover", function () {
		dojo.query("#taskDiv .dijitTitlePaneTitle").at(0).style({ "backgroundImage": "url('images/search_over.png')"});
	});	
	
	dojo.connect(dojo.byId("taskDiv_titleBarNode"), "onmouseout", function () {
		dojo.query("#taskDiv .dijitTitlePaneTitle").at(0).style({ "backgroundImage": "url('images/search.png')"});
	});	

	dojo.connect(dojo.byId("legendContentDiv_titleBarNode"), "onmouseover", function () {
		resultsImage = dojo.query("#legendContentDiv .dijitTitlePaneTitle").at(0).style("backgroundImage");
		dojo.query("#legendContentDiv .dijitTitlePaneTitle").at(0).style({ "backgroundImage": "url('images/results_over.png')"});
	});	
	
	dojo.connect(dojo.byId("legendContentDiv_titleBarNode"), "onmouseout", function () {
		dojo.query("#legendContentDiv .dijitTitlePaneTitle").at(0).style({ "backgroundImage": resultsImage });
	});		
	
	dojo.connect(dojo.byId("searchButton"), "onclick", function() {
		if (dijit.byId("searchButton").get('disabled') == false){
			var value = dijit.byId('district').get('value');
			queryByLayer(value);
			dijit.byId("searchButton").set('disabled', true);
			dijit.byId("clearButton").set('disabled', true);
		};
	});
	
	dojo.connect(dojo.byId("clearButton"), "onclick", function() {
		if (dijit.byId("clearButton").get('disabled') == false){
			resetMap();
			dijit.byId("searchButton").set('disabled', true);
			dijit.byId("clearButton").set('disabled', true);
		};		
	});
	
	dojo.connect(dojo.byId("popupTableDiv"), "onmouseover", function() {
		//if (tooltip) { tooltip.style.display = "none"; }
	});

	dojo.connect(dojo.byId("popupTableDiv"), "onmouseout", function() {
		//if (tooltip) { tooltip.style.display = ""; }
	});	

	dojo.connect(dijit.byId("campus")._wipeIn, "onEnd", function () {
			var api = $('.scroll-pane').data('jsp');
			api.reinitialise();
	});	

	dojo.connect(dijit.byId("system")._wipeIn, "onEnd", function () {
			var api = $('.scroll-pane').data('jsp');
			api.reinitialise();
	});	
	
	dojo.connect(dijit.byId("infoTabs"), 'selectChild', function (evt) {
			selectedTab = this.selectedChildWidget;
			if (selectedTab.id == "districtDetails") {
				dijit.byId("districtDetails").resize();
				dijit.byId("infoTabs").resize();	
			}
			var api = $('.scroll-pane').data('jsp');
			api.reinitialise();		
	});
	
	tooltip = dojo.create("div", { "class": "maptooltip", "innerHTML": "" }, map.container);
	dojo.style(tooltip, { "position": "fixed", "display": "none" });
	var api = $('.scroll-pane').data('jsp');
	api.reinitialise();
	
	if (dojo.isIE <= 8) {
		dojo.byId("browserVersion").innerHTML = dojo.isIE
		dijit.byId("browser").show();
	}
	
	dojo.style("zoomNavToolDiv", {"display":"block"} );
	dojo.style("zoomInToolDiv", {"display":"block"} );
	dojo.style("zoomFullToolDiv", {"display":"block"} );
	dojo.style("overviewDiv", {"display":"block"} );
	
	dijit.byId("searchButton").set('disabled', true);
	dijit.byId("clearButton").set('disabled', true);
	
	new dijit.Tooltip({ id:"ag_tooltip", connectId: "Agriculture, Environment And Natural Resources", label:"<div class=\"cc_definitionContent\">Partnership programs providing research-based curriculum and staff training to community and youth-serving agencies to support quality afterschool environments for children ages 5 to 19. This includes programs such as 4-H Youth Clubs, After School Programs and UC Cooperative Extension. Advisors bring research innovations and practical solutions from UC to address the problems facing Californians in their communities.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"bs_tooltip", connectId: "Business and Economic Development", label:"<div class=\"cc_definitionContent\">Internship programs, with UC credit, offered in partnership with local companies, allowing students to apply classroom learning to solve complex business challenges for real world companies. These programs also focus on bringing together local companies and motivated individuals, placing students in high-tech and green-tech startups, thereby promoting civic engagement and community economic development.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"cc_tooltip", connectId: "Community College Student Services", label:"<div class=\"cc_definitionContent\">Programs supporting UC’s commitment to California Community College students, focusing on increasing the number of student prepared for transfer to UC and other 4-year institutions. These include MESA and PUENTO programs for community college students.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"cs_tooltip", connectId: "Community and Social Services", label:"<div class=\"cc_definitionContent\">Volunteer and partnership programs providing community and social services to neighborhoods near UC campuses. This includes  programs such as legal aid, Domestic Violence Clinics, Fair housing advocacy and volunteering at the offices of  legislative and congressional members.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"ca_tooltip", connectId: "Cultural Resources and Arts", label:"<div class=\"cc_definitionContent\">Programs that expose students at every level in the community to art and culture through performing arts, theater, cultural events, book clubs and exhibits. This includes programs like Viva el Arte!, READS and  Shakespeare to Go.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"hs_tooltip", connectId: "Health Services/Nutrition", label:"<div class=\"cc_definitionContent\">Partnership programs presenting the main messages of the Dietary Guidelines for Americans and MyPlate, though multiple lessons drawn from UC-developed, evidence-based curriculum.  UC nutrition educators facilitate behavioral changes in meal planning, food shopping, food preparation, food safety, resource management and nutrition, using youth-, adult- and family-centered approaches. Food and physical activity demonstrations are integrated into the lessons; handouts, worksheets and reinforcement items are provided.  All programs are evaluated to determine outcomes.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"k12_tooltip", connectId: "K-12 Student Services", label:"<div class=\"cc_definitionContent\">Programs geared to child education, and implemented in elementary, middle and high schools. This includes programs helping high school students complete a rigorous college preparatory curriculum. These efforts prepare students for study and careers in STEM fields, and provide support at every educational level. Examples of such programs include SAPEP, MESA, CAL SOAP, EAOP, PUENTO, Gear Up and the Mathematics Diagnostic Testing Project (MDTP).</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"pp_tooltip", connectId: "Public Policy", label:"<div class=\"cc_definitionContent\">Partnerships and sponsorships programs that engage the community and raise awareness to public policy issues. The partnerships are formed with various cities and agencies throughout California such as City of Riverside and the San Bernardino Sheriff’s Department.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"tp_tooltip", connectId: "Teacher Preparation", label:"<div class=\"cc_definitionContent\">Partnerships program focused on providing preparation for teachers-in-training.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"td_tooltip", connectId: "Teacher Professional Development", label:"<div class=\"cc_definitionContent\">Partnerships that provide professional development to teachers, Examples include CSMP, Assessing Student writing, the Pathway project and the Writing project.</div>", showDelay:10, position:['after'] });
	new dijit.Tooltip({ id:"ue_tooltip", connectId: "University Extension", label:"<div class=\"cc_definitionContent\">Programs geared toward workforce training for the community.  This includes partnership programs with UC departments to assist and encourage lifelong learning all the community members.  Examples include the Osher Lifelong Learning Institute (OLLI) and UC Extension continuing education courses.</div>", showDelay:10, position:['after'] });
	
	new dijit.Tooltip({ id:"basemap_tooltip", connectId: "baseMapSelector", label:"Click to change the underlying basemap.",  position: ["before"], showDelay:10 });
	new dijit.Tooltip({ id:"overview_tooltip", connectId: "overviewDiv", label:"Click to toggle the Overview Map.", position: ["below"], showDelay:10 });
	new dijit.Tooltip({ id:"pdf_tooltip", connectId: "downloadPdf", label:"Click to download a pdf of <br> the results.", position: ["below"], showDelay:10 });
	new dijit.Tooltip({ id:"data_tooltip", connectId: "downloadDoc", label:"Click to download documentation <br> of the data in this application.", position: ["after"], showDelay:10 });
}

function queryByLayer(value) {
	queryLayers = true;
	dojo.style("mapProgressBar", { "display":"block" });
	var layer = dijit.byId('layer').get('value');
	var query = new esri.tasks.Query();
	query.where = (layer == "campus") ? "Name = '" + value + "'" : "District_Name = '" + value + "'";
	dojo.byId("queryDefinition").innerHTML = "Filter: <b>" + value+ "</b>";
	
	if (activeTabs.length > 0) {
		resetTabContainer();	
	}
	
	if (layer == "campus") {
		dojo.style("downloadPdf", {"display":"none"});
		dojo.style("queryDefinition", {"width":"267px"});
		var fields = {"Community Programs": "Managing_Campus", "Campus": "Name", "Reserves": "Managing_Campus", "Medical Center": "Campus_Name", "Lab": "Campus_Name"};
		var geometry = ''
		queryMultipleLayers(layer, fields, [value,value], geometry);
	} else if (layer == "assembly"){	
		assemblyFeatureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function(results) {	
			var value = results[0].attributes["District_Name"].slice(-2);
			var fields = {"Community Programs": "AssemblyDistrict", "Campus": "Campus", "Reserves": "AssemblyDistrict", "Medical Center": "AssemblyDistrict", "Lab": "AssemblyDistrict"};
			var geometry = results[0].geometry;
			queryMultipleLayers(layer, fields, [value, "'" + results[0].attributes["Campus_Legislator"] + "'"], geometry);			
			showDistrictResults(results[0].attributes);
			dojo.style("downloadPdf", {"display":"block"});
			dojo.style("queryDefinition", {"width":"247px"});
		});
	} 
	else if (layer == "senate") {
		senateFeatureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function(results) {
			var value = results[0].attributes["District_Name"].slice(-2);
			var fields = {"Community Programs": "SenateDistrict", "Campus": "Campus", "Reserves": "SenateDistrict", "Medical Center": "SenateDistrict", "Lab": "SenateDistrict"};
			var geometry = results[0].geometry;
			queryMultipleLayers(layer, fields, [value, "'" + results[0].attributes["Campus_Legislator"] + "'"], geometry);			
			showDistrictResults(results[0].attributes);
			dojo.style("downloadPdf", {"display":"block"});
			dojo.style("queryDefinition", {"width":"247px"});
		});
	} 
	else if (layer == "congress") {
		congressFeatureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, function(results) {
			var value = results[0].attributes["District_Name"].slice(-2);
			var fields = {"Community Programs": "CongressionalDistrict", "Campus": "CongressionalDistrict", "Reserves": "CongressionalDistrict", "Medical Center": "CongressionalDistrict", "Lab": "CongressionalDistrict"};
			var geometry = results[0].geometry;
			queryMultipleLayers(layer, fields, [value,value], geometry)
			showDistrictResults(results[0].attributes);
			dojo.style("downloadPdf", {"display":"block"});
			dojo.style("queryDefinition", {"width":"247px"});			
		});
	}

	if (dijit.byId("legendContentDiv").open == false) { dijit.byId("legendContentDiv").toggle(); }
}

function queryMultipleLayers(layer, fields, values, geometry) {
	var aDeferreds = [];
	var qtCommunityPrograms = queryCommunityPrograms( fields["Community Programs"], values[0] );
	aDeferreds.push(qtCommunityPrograms);
	var qtCampus = queryCampus( fields["Campus"] , values[1] )
	aDeferreds.push(qtCampus);
	var qtReserves = queryReserves( fields["Reserves"], values[0] )
	aDeferreds.push(qtReserves);
	var qtMedCenter = queryMedCenter(fields["Medical Center"], values[0] )
	aDeferreds.push(qtMedCenter);
	var qtLab = queryLab( fields["Lab"], values[0] )
	aDeferreds.push(qtLab);
	
	var tasks = dojo.map(aDeferreds, function(task) {
		return task[1];
	});
	
	var params = dojo.map(aDeferreds, function(task) {
		return task[0];
	});
	
	var defTasks = dojo.map(tasks, function(task) {
		return new dojo.Deferred();
	});
	var deferredList = new dojo.DeferredList(defTasks)
	deferredList.then(function(results) {
		processCommunityProgramsResults(results[0][1])
		processCampusResults(results[1][1])
		processReservesResults(results[2][1])
		processMedCenterResults(results[3][1])
		processLabResults(results[4][1])
		if (geometry !='') { zoomToFeature(geometry) };
		queryLayers = false;
		dijit.byId("searchButton").set('disabled', false);
		dijit.byId("clearButton").set('disabled', false);
	});
	
    for (i=0;i<params.length;i++) {
		tasks[i].execute(params[i],defTasks[i].callback)
	}          	
}

function zoomToFeature(geometry){
	var extent = geometry.getExtent()
	map.setExtent(extent.expand(1.0))
}

function queryCommunityPrograms(field, value) {
	communityProgramLayerDefinition = (dijit.byId('layer').get('value') == "campus") ? field + " = '" + value + "'" : field + " = " + value;
	var query = new esri.tasks.Query();
	query.where = communityProgramLayerDefinition;
	query.orderByFields = ["Category"];
	query.outFields = ["Category"];
	query.returnGeometry = false;

	var queryTask = new esri.tasks.QueryTask(communityProgramUrl577k);
	return [query, queryTask];
	//queryTask.execute(query, processCommunityProgramsResults);
}

function processCommunityProgramsResults(results) {
	dojo.byId("legendHeader").childNodes[1].innerHTML = "" + dojo.number.format(results.features.length.toFixed(0)) + "";
	var values = dojo.map(results.features, function(feature) {
		return feature.attributes["Category"];
	});
	dojo.forEach(communityProgramLayerUniqueValues, function(unique) {
		var program = dojo.filter(values, function(value) {
			return value == unique;
		});
		var count = program.length;
		var visible = dojo.getAttr(unique,"layerVisible");
		dojo.byId(unique).childNodes[2].innerHTML = "" + dojo.number.format(count.toFixed(0)) + "";
		if (count > 0) {
			if (visible == "false") { toggleLegendStyle(unique, "true"); }				
		} else { 
			if (visible == "true") { toggleLegendStyle(unique, "false"); }
		};
	});
}

function queryCampus(field, value) {
	campusLayerDefinition = (dijit.byId('layer').get('value') == "campus") ? field + " = '" + value + "'": campusLayerDefinition.split(" AND ", 1)[0] + " AND " + field + " = " + value;
	var query = new esri.tasks.Query();
	query.where = campusLayerDefinition
	query.outFields = ["*"];
	query.returnGeometry = true;
	
	var queryTask = new esri.tasks.QueryTask(campusSmallUrl);
	return [query, queryTask];
	//queryTask.execute(query, processCampusResults);
}

function processCampusResults(results) {
	if (results.features.length > 0) {
			var campus = [];
			var centers = [];
			var labs = [];
			
			if ((dijit.byId('layer').get('value') == "assembly") && (assemblyFeatureLayer.getSelectedFeatures()[0].attributes["Campus"] == null)) {
				dojo.byId("University").childNodes[2].innerHTML = "0";
				if (dojo.getAttr("University","layerVisible") == "true") { toggleLegendStyle("University", "false"); }
			} else if ((dijit.byId('layer').get('value') == "senate") && (senateFeatureLayer.getSelectedFeatures()[0].attributes["Campus"] == null)) {
				dojo.byId("University").childNodes[2].innerHTML = "0";
				if (dojo.getAttr("University","layerVisible") == "true") { toggleLegendStyle("University", "false"); }
			} else {
				dojo.byId("University").childNodes[2].innerHTML = results.features.length;
				if (dojo.getAttr("University","layerVisible") == "false") { toggleLegendStyle("University", "true"); }
			}
			dojo.forEach(results.features, function(feature, i) {
					var a = feature.attributes
					var content = "<div id=\"campusTableDiv\" class=\"resultsTableDiv\">";
					content += "<table id=\"" + a["Name"] + "Table\" class=\"resultsTable\"  border=\"0\" cellspacing=\"0\">";
					campus.push(a["Name"])
					content += populateCampusTable(a);
					content += "</table>";
					content += "</div>";
					if ((dijit.byId('layer').get('value') == "assembly") && (assemblyFeatureLayer.getSelectedFeatures()[0].attributes["Campus"] == null)) {
						dijit.byId("campus").set("title", a["Name"] + " (Advocacy Jurisdiction)");
					} else if ((dijit.byId('layer').get('value') == "senate") && (senateFeatureLayer.getSelectedFeatures()[0].attributes["Campus"] == null)) {
						dijit.byId("campus").set("title", a["Name"] + " (Advocacy Jurisdiction)");
					} else {
						dijit.byId("campus").set("title", a["Name"]);
					}					
					dijit.byId("campus").set("content", content);
					if (dijit.byId("campus").open == false) { dijit.byId("campus").toggle(); }
					if (dijit.byId("system").open == true) { dijit.byId("system").toggle(); }
					dijit.byId("infoTabs").selectChild(dijit.byId("legendContent"))
					dijit.byId("infoTabs").resize();		
			});
			if (dijit.byId('layer').get('value') == "campus") {
				var geo = results.features[0].geometry
				map.centerAndZoom(geo, 11)
			}	
		} else {
			dojo.byId("University").childNodes[2].innerHTML = "0";
			if (dojo.getAttr("University","layerVisible") == "true") { toggleLegendStyle("University", "false"); }
			var value = dijit.byId('district').get('value').split(" ").pop()
			content = '<div style="border: 1px dotted #bbb; background: #F5F5F5; padding: 5px 5px 5px 10px; margin:5px;"><table><tr><td style="width:50px; text-align:center;"><img src="images/no_table.png"></td><td style="font-size:13px; color:#666">No campus located in District ' + value + '.</td></tr></table></div>'
			dijit.byId("campus").set("title", "Campus");
			dijit.byId("campus").set("content", content);
			if (dijit.byId("campus").open == false) { dijit.byId("campus").toggle(); }
			if (dijit.byId("system").open == true) { dijit.byId("system").toggle(); }
			dijit.byId("infoTabs").selectChild(dijit.byId("legendContent"))
			dijit.byId("infoTabs").resize();			
		}			
}

function queryReserves(field, value) {
	var sql = (dijit.byId('layer').get('value') == "campus") ? field + " = '" + value + "'" : field + " = " + value;
	reservesFeatureLayer.setDefinitionExpression(sql);
	reservesFeatureLayer.redraw();
	reservesFeatureLayer.show();
	
	var query = new esri.tasks.Query();
	query.where = sql;
	query.orderByFields = ["Reserve_Name"];
	query.outFields = ["Reserve_Name"];
	query.returnGeometry = false;

	var queryTask = new esri.tasks.QueryTask(reservesUrl);
	return [query, queryTask];
	//queryTask.execute(query, processReservesResults);	
}

function processReservesResults(results){
	var visible = dojo.getAttr("Reserves","layerVisible");
	if (results.features.length > 0) {
		dojo.byId("Reserves").childNodes[2].innerHTML = "" + results.features.length + "";
		var values = dojo.map(results.features, function(feature) {
			return feature.attributes["Reserve_Name"];
		});
		if (visible == "false") { toggleLegendStyle("Reserves", "true"); }				
	} else { 
		dojo.byId("Reserves").childNodes[2].innerHTML = "0";
		if (visible == "true") toggleLegendStyle("Reserves", "false");
	};
}

function queryMedCenter(field, value) {
	var query = new esri.tasks.Query();
	var sql = (dijit.byId('layer').get('value') == "campus") ? field + " = '" + value + "'": field + " = " + value;
	medCenterLayerDefinition = "Type = 'Medical Center' AND " + sql;
	query.where = medCenterLayerDefinition;
	query.outFields = ["*"];
	query.returnGeometry = false;
	
	var queryTask = new esri.tasks.QueryTask(campusSmallUrl);
	return [query, queryTask];
	//queryTask.execute(query, processMedCenterResults);
}

function processMedCenterResults(results){
	var visible = dojo.getAttr("Medical Center","layerVisible");
	if (results.features.length > 0) {
		dojo.byId("Medical Center").childNodes[2].innerHTML = results.features.length;
		if (visible == "false") { toggleLegendStyle("Medical Center", "true"); }
	} else {
		dojo.byId("Medical Center").childNodes[2].innerHTML = "0";
		if (dojo.getAttr("Medical Center","layerVisible") == "true") { toggleLegendStyle("Medical Center", "false"); }
	}
}

function queryLab(field, value) {
	var query = new esri.tasks.Query();
	var sql = (dijit.byId('layer').get('value') == "campus") ? field + " = '" + value + "'": field + " = " + value;
	labLayerDefinition = "Type = 'Lab' AND " + sql;
	query.where = labLayerDefinition;
	query.outFields = ["*"];
	query.returnGeometry = false;
	
	var queryTask = new esri.tasks.QueryTask(campusSmallUrl);
	return [query, queryTask];
	//queryTask.execute(query, processLabResults);
}

function processLabResults(results){
	var visible = dojo.getAttr("Lab","layerVisible");
	if (results.features.length > 0) {
		dojo.byId("Lab").childNodes[2].innerHTML = "" + results.features.length + "";
		if (visible == "false") { toggleLegendStyle("Lab", "true"); }
	} else {
		dojo.byId("Lab").childNodes[2].innerHTML = "0";
		if (visible == "true") { toggleLegendStyle("Lab", "false"); };
	}
}

function getSpatialQueryResults(name,geometry) {
	addressInfo.address = name;
	
	var aDeferreds = []; campuses = [];
	
	var query = new esri.tasks.Query();
	query.returnGeometry = false;
	query.outFields = ["District_Name"]
	query.geometry = geometry;
	aDeferreds.push(assemblyFeatureLayer.queryFeatures(query));
	aDeferreds.push(senateFeatureLayer.queryFeatures(query))
	aDeferreds.push(congressFeatureLayer.queryFeatures(query));

	var distParams = new esri.tasks.DistanceParameters();
	distParams.distanceUnit = esri.tasks.GeometryService.UNIT_STATUTE_MILE;
	distParams.geometry1 = geometry
	dojo.forEach(campusSmallFeatureLayer.graphics, function(graphic){
		campuses.push(graphic.attributes["Name"]);
		distParams.geometry2 = graphic.geometry;
		aDeferreds.push(geoService.distance(distParams))
	});
	
	var deferredList = new dojo.DeferredList(aDeferreds)
	deferredList.then(function(results) {
		addressInfo.assembly = results[0][1].features[0].attributes["District_Name"];
		addressInfo.senate = results[1][1].features[0].attributes["District_Name"];
		addressInfo.congress = results[2][1].features[0].attributes["District_Name"];
		var distances = [];
		dojo.forEach(results, function(result,i) {
			if (i>2) { distances.push(result[1]) }
		});
		var closest = Math.min.apply(Math, distances);
		var campus = campuses[dojo.indexOf(distances, closest)]
		addressInfo.campus = campus;
		
		if (dijit.byId("layer").get("value") != filterSelectAll) {
			dijit.byId("district").set("value", addressInfo[dijit.byId("layer").get("value")]); 
			dijit.byId("searchButton").set('disabled', false);
			dijit.byId("clearButton").set('disabled', false);			
		}
		showAddressDialog();
	});
}

function showGeocodeResults(geometry) {
	map.graphics.clear();
	map.centerAndZoom(geometry, 13);
	var symbol = new esri.symbol.PictureMarkerSymbol({
	"angle": 0,
	"xoffset": 2,
	"yoffset": 5,
	"type": "esriPMS",
	"url": "../ucop/images/address_map_icon.png",
	"contentType": "image/png",
	"width": 24,
	"height": 24
	});	
	var graphic = new esri.Graphic(geometry, symbol);
	map.graphics.add(graphic);
}

function filterSelectData(features, nameField) {
	var data = dojo.map(features, function(feature) {
		var item = feature.attributes[nameField];
		return { "name": item, "id": item };
	});
	
	var obj = { "name": filterSelectAll, "id": filterSelectAll };
	data.splice(0, 0, obj);
	
	return { label:"name", identifier:"id", items: data };
}

function populateFilterSelect(data, domNode) {
	var store = new dojo.data.ItemFileReadStore({ data: data });
	new dijit.form.FilteringSelect({
		store: store,
		autoComplete: true,
		required: false,
		searchAttr: "name",
		value: filterSelectAll,
		maxHeight: 100,
		style: "width: 100%;",
		onChange: function(name) {
				var item = this.item;
				queryByLayer(item.name)
		}
	}, domNode);
}

function layerOnMouseOver(evt, field, features) {
	showTooltip(evt, field);
	if ( (features) && (features.length == 0) ) {	
		var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol, evt.graphic.attributes);
		highlightLayer.add(highlightGraphic);
	} else {
		var attribute = evt.graphic.attributes[field];
		var selection = (features) ? features[0].attributes[field] : "XXX";
		if (selection != attribute) {
			var highlightGraphic = new esri.Graphic(evt.graphic.geometry, highlightSymbol, evt.graphic.attributes);
			highlightLayer.add(highlightGraphic);
		}		
	}

}

function layerOnMouseOut(evt) { 
	highlightLayer.clear();
	if (tooltip) { tooltip.style.display = "none";} 
}

function layerOnMouseMove(evt, field){
	showTooltip(evt, field)
}

function layerOnClick(evt){
	showLayerPopup(evt.graphic.attributes, evt.screenPoint, "map")
}
					
function showDistrictResults(a) {
	var layer = dijit.byId('layer').get('value');
	
	if (layer == "assembly"){	
		var person = "Assembly_Person";
	} else if (layer == "senate"){
		var person = "Senate_Person"
	} else if (layer == "congress") {
		var person = "Congress_Person";
	}
	
	var content = '<div id="districtTableDiv">';
	content += '<div class="legislatorTitleDiv">District Information</div>';
	content += '<div class="legislator" style="margin-top:5px;">';
	content += '<div class="districtImage" style="background: url(\'images/' + layer + '.png\') no-repeat center center;">';
	content += '<div class="legislatorInfoDiv"><span style="font-weight:bold;font-size:16px;">' + a[person] + '</span><br><span style="font-size:14px;">' + a["District_Name"] + '</span></div>';
	content += '</div>';
	content += '<div class="legislatorImage"><img src="images/' + layer + '/' + a["District_Name"].split(" ").pop() + '.jpg"></div>';
	content += '</div>';
	content += '<div style="padding:0px 10px 10px 10px">';
	content += '<div class="resultsTableTitleDiv">University of California in District ' + a["District_Name"].split(" ").pop() + '</div>';
	content += '<div class="resultsTableDiv">';
	content += populateDistrictTable(a);
	content += '</table>';
	content += '</div>';
	content += '</div>';		
	dijit.byId("districtDetails").set("content", content);
	dijit.byId("infoTabs").resize();
}					

function showLayerPopup(a, pt, where) {
	var layer = dijit.byId('layer').get('value');
	
	if (layer == "assembly"){	
		var person = "Assembly_Person";
	} else if (layer == "senate"){
		var person = "Senate_Person"
	} else if (layer == "congress") {
		var person = "Congress_Person";
	}
	
	var content = "<div id=\"popupTableDiv\">";
	content += '<div class="legislator">';
	content += '<div class="districtImage" style="background: url(\'images/' + layer + '.png\') no-repeat center center;">';
	content += '<div class="legislatorInfoDiv"><span style="font-weight:bold;font-size:16px;">' + a[person] + '</span><br><span style="font-size:14px;">' + a["District_Name"] + '</span></div>';
	content += '</div>';
	content += '<div class="legislatorImage"><img src="images/' + layer + '/' + a["District_Name"].split(" ").pop() + '.jpg"></div>';
	content += '</div>';
	content += '<div style="padding:0px 0px;">';
	content += '<div class="resultsTableTitleDiv">University of California in District ' + a["District_Name"].split(" ").pop() + '</div>';
	content += '<div class="resultsTableDiv">';
	content += populateDistrictTable(a);
	var value = dijit.byId('district').get('value');
	if (value != a["District_Name"]) {
		content += '<tr><td></td><td></td></tr>';
		content += "<tr><td colspan=3><div id=\"popupSearch\" style=\"cursor:pointer; text-align: center; font-weight: bold; font-size: 13px; color:#606060\" onClick=\"queryFromPopup('" + layer + "', '" + a["District_Name"] + "')\">-- run search --</div></td></tr>";
	}
	content += '</table>';
	content += '</div>';
	content += '</div>';
	
	map.infoWindow.setTitle("District Information")
	map.infoWindow.setContent(content);
	map.infoWindow.show(pt, map.getInfoWindowAnchor(pt));
	var height = dojo.byId("popupTableDiv").offsetHeight;
	map.infoWindow.resize(300, height);
}

function populateDistrictTable(a) {
	var layer = dijit.byId('layer').get('value');
	layerFields = {};
	if (layer == "assembly"){	
		dojo.forEach(assemblyFeatureLayer.fields, function(field) { layerFields[field.name] =  field.alias });
		var fields = ["Campus_Legislator", "Undergraduate_Applicants_2015", "Freshmen", "Student_Count","Total_Alumni", "Total_Employee_Count", "Retiree_Count", "Licensee_Count",  "Salary_Gross", "Med_Center", "National_Lab", "Cal_Grant_Recipients", "Cal_Grant_Amount"]
		var person = "Assembly_Person";
		var personTitle = "Assembly Person";
	} 
	else if (layer == "senate") {
		dojo.forEach(senateFeatureLayer.fields, function(field) { layerFields[field.name] =  field.alias });
		var fields = ["Campus_Legislator", "Undergraduate_Applicants_2015", "Freshmen", "Student_Count","Total_Alumni", "Total_Employee_Count", "Retiree_Count", "Licensee_Count",  "Salary_Gross", "Med_Center", "National_Lab", "Cal_Grant_Recipients", "Cal_Grant_Amount"];
		var person = "Senate_Person";
		var personTitle = "Senate Person";
	} 
	else if (layer == "congress") {
		dojo.forEach(congressFeatureLayer.fields, function(field) { layerFields[field.name] =  field.alias });
		var fields = ["Campus", "Undergraduate_Applicants_2015", "Freshmen", "Student_Count", "Total_Alumni",  "Total_Employee_Count", "Retiree_Count", "Licensee_Count", "Licensee_Count_Campus", "Total_Salary", "Med_Center", "National_Lab", "Pell_Grant_Recipient_Count", "Pell_Grant_Amount", "Federal_Loan_Recipients", "Federal_Loan_Amount"];
		var person = "Congress_Person";
		var personTitle = "Member of Congress";
	}
	
	var content = "<table id=\"districtResultsTable\" class=\"resultsTable\"  border=\"0\" cellspacing=\"0\">";
	dojo.forEach(fields, function(field,i) {
		var value = a[field];
		if (value != null) {
			if (!isNaN(value)) { value = dojo.number.format(value.toFixed(0)) }
			
			if ((field == "Campus_Legislator") || (field == "Campus"))  {
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Campus</td><td class=\"resultsTableAmounts\">" + value.split("/")[0] + "</td></tr>"
				//content += "<tr><td><img src=\"images/spacer.gif\">" + value + "</td><td></td></tr>";
			}
			
			if ((field == "Med_Center") && (a["Med_Center"] != null)){
				content += "<tr><td colspan=2></td><td></td></tr>"
				content += "<tr><td colspan=3 class=\"resultsTableHeaderText\">Medical Center(s)</td></tr>";
				centers = a["Med_Center"].split(";").sort();
				dojo.forEach(centers, function(center) {
					content += "<tr><td colspan=2></td><td></td></tr>"
					content += "<tr><td style=\"width:15px;\"></td><td colspan=2>" + center + "</td></tr>";
				});
			}
			
			if ((field == "National_Lab") && (a["National_Lab"] != null)) {
				content += "<tr><td colspan=2></td><td></td></tr>"
				content += "<tr><td colspan=3 class=\"resultsTableHeaderText\">National Laboratory(s)</td></tr>";
				labs = a["National_Lab"].split(";")
				dojo.forEach(labs, function(lab) {
					content += "<tr><td colspan=2></td><td></td></tr>"
					content += "<tr><td style=\"width:15px;\"></td><td colspan=2>" + lab + "</td></tr>";
				});
			}
			
			if ( (field == "Salary_Gross") || (field == "Total_Salary") || (field == "Pell_Grant_Amount") || (field == "Federal_Loan_Amount") || (field == "Cal_Grant_Amount") ) {
				value = "$" + value
			}
			if (field == "Undergraduate_Applicants_2015") {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Undergraduate Applicants (2015)</td><td class=\"resultsTableAmounts\">" + value  + "</td></tr>"
			}
			if (field == "Freshmen") {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td style=\"width:15px;\"></td><td>Freshman Applicants</td><td class=\"resultsTableAmounts\">" + value  + "</td></tr>"
			}
			if (field == "Student_Count") {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Undergraduates Enrolled (2014)</td><td class=\"resultsTableAmounts\">" + value  + "</td></tr>"
			}
			if (field == "Total_Alumni") {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Alumni</td><td class=\"resultsTableAmounts\">" + value + " </td></tr>"
			}
			if (field == "Total_Employee_Count") {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Employees</td><td class=\"resultsTableAmounts\">" + value  + "</td></tr>"
			}		
			if (field == "Retiree_Count") {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Retirees</td><td class=\"resultsTableAmounts\">" + value + " </td></tr>"				
			}
			if (field == "Licensee_Count") {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Technology Licensees</td><td class=\"resultsTableAmounts\">" + value + " </td></tr>"
			}
			if ( (field == "Salary_Gross") || (field == "Total_Salary")) {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">UC Payroll</td><td class=\"resultsTableAmounts\">" + value  + "</td></tr>"
				content += "<tr><td colspan=2></td><td></td></tr>";
			}				
			if ((field == "Pell_Grant_Amount") && (layer == "congress")) {
				content += "<tr><td colspan=3 class=\"resultsTableHeaderText\">Federal Funding for Student Aid</td></tr>";
				content += "<tr><td style=\"width:15px;\"></td><td>Pell Grant Recipients</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Pell_Grant_Recipient_Count"].toFixed(0)) + "</td></tr>";			
				content += "<tr><td style=\"width:15px;\"></td><td>Pell Grant Amount</td><td class=\"resultsTableAmounts\">" + value + "</td></tr>";			
			}
			if ((field == "Federal_Loan_Amount") && (layer == "congress")) {
				content += "<tr><td style=\"width:15px;\"></td><td>Federal Loan Recipients</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Federal_Loan_Recipients"].toFixed(0)) + "</td></tr>";
				content += "<tr><td style=\"width:15px;\"></td><td>Federal Loan Amount</td><td class=\"resultsTableAmounts\">" + value + "</td></tr>";
			}			
			if ((field == "Cal_Grant_Amount") && (layer == "assembly" || layer == "senate"))  {
				content += "<tr><td colspan=2></td><td></td></tr>";
				content += "<tr><td colspan=3 class=\"resultsTableHeaderText\">State Funding for Student Aid</td></tr>";
				content += "<tr><td style=\"width:15px;\"></td><td>Cal Grant Recipients</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Cal_Grant_Recipients"].toFixed(0)) + "</td></tr>";
				content += "<tr><td style=\"width:15px;\"></td><td>Cal Grant Amount</td><td class=\"resultsTableAmounts\">" + value + "</td></tr>";	
			}
		}
	});
	return content;
}

function queryFromPopup(layer, value){
	if (dijit.byId("layer").get("value") != layer) { dijit.byId("layer").set("value", layer) }
	setTimeout(function(){ 
		dijit.byId("district").set("value", value); 
		queryByLayer(value);
	},500);
	dojo.style("popupSearch", { "display": "none"} );
	map.infoWindow.hide();	
}

function campusOnClick(evt){
	var a = evt.graphic.attributes;
	var content = "<div id=\"popupTableDiv\" class=\"resultsTableDiv\">";
	content += "<table id=\"popupTable\" class=\"resultsTable\"  border=\"0\" cellspacing=\"0\">";
	content +="<tr><td colspan=2></td><td></td></tr>"
	if (a["Type"] != "University") {
		content += "<tr><td colspan=2 class=\"resultsTableHeaderText\"><a class=\"reserveLink\" href=\"" + a["WebAddress"] + "\" target=\"_blank\">" + a["Name"] + "</a></td><td></td></tr>"
		content += "<tr><td colspan=2 style=\"padding-left: 10px;\">" + a["Street"] + "<br>" + a["City"] + ", " + a["State"] + "&nbsp;&nbsp;" + a["Zip"] + "</td><td></td></tr>"
	} else {
		content += "<tr><td colspan=2 class=\"resultsTableHeaderText\"><a class=\"reserveLink\" href=\"" + a["WebAddress"] + "\" target=\"_blank\">" + a["Name"] + "</a></td><td></td></tr>"
		content += "<tr><td colspan=2 style=\"padding-left: 10px;\">" + a["Street"] + "<br>" + a["City"] + ", " + a["State"] + "&nbsp;&nbsp;" + a["Zip"] + "</td><td></td></tr>"
		content +="<tr><td colspan=2></td><td></td></tr>"
		content += populateCampusTable(a);
	}
	if (a["Type"] == "University") { content += "<tr><td colspan=3><div id=\"popupSearch\" style=\"cursor:pointer; text-align: center; font-weight: bold; font-size: 13px; color:#606060\" onClick=\"queryFromPopup('campus', '" + a["Name"] + "')\">-- run search --</div></td></tr>"; }
	content += "</table>";
	content += "</div>";	
	
	map.infoWindow.setTitle(a["Name"])
	map.infoWindow.setContent(content)
	map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
	var height = dojo.byId("popupTableDiv").offsetHeight;
	map.infoWindow.resize(300, height);
}

function populateCampusTable(a) {
	var fields = ["Students", "Undergraduates", "Employees", "Retirees", "Alumni", "UC_Payroll", "Outpatient_Visits", "Cal_Grant_Recipients", "Cal_Grant_Amount", "Pell_Grant_Recipients", "Pell_Grant_Amount", "Federal_Loan_Recipients", "Federal_Loan_Amount", "Funding_NIH", "Funding_NSF", "Funding_DOE", "Funding_DOD", "Funding_USDA", "Funding_NASA", "Funding_Other"];
	var fieldNames = dojo.map(campusSmallFeatureLayer.fields, function(field) {
		return field.name
	});
	var funding_fields = fields.slice(13, fields.length)	
	var content = ""
	if (a["Students"] != null) {
		content += "<tr><td colspan=2 class=\"resultsTableHeaderText\">Students (2014)</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Students"].toFixed(0))  + "</td></tr>"
	}
	if (a["Undergraduates"] != null) {
		content +="<tr><td style=\"width:15px;\"></td><td>Undergraduates</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Undergraduates"].toFixed(0))  + "</td></tr>"
	}	
	content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Employees in CA</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Employees"].toFixed(0))  + "</td></tr>"
	content +="<tr><td colspan=2></td><td></td></tr>"
	content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Retirees in CA</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Retirees"].toFixed(0))  + "</td></tr>"
	content +="<tr><td colspan=2></td><td></td></tr>"	
	content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">Alumni in CA</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Alumni"].toFixed(0))  + "</td></tr>"
	content +="<tr><td colspan=2></td><td></td></tr>"
	content +="<tr><td colspan=2 class=\"resultsTableHeaderText\">UC Payroll in CA</td><td class=\"resultsTableAmounts\">$" + dojo.number.format(a["UC_Payroll"].toFixed(0))  + "</td></tr>"	

	if (a["Med_Center"] != null) {
		content += "<tr><td colspan=2></td><td></td></tr>"
		content += "<tr><td colspan=2 class=\"resultsTableHeaderText\">Medical Center(s)</td><td></td></tr>";
		centers = a["Med_Center"].split(";").sort();
		dojo.forEach(centers, function(center) {
			content += "<tr><td style=\"width:15px;\"></td><td colspan=2>" + center + "</td></tr>";
		});
		content +="<tr><td style=\"width:15px;\"></td><td>Outpatient Visitors</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Outpatient_Visits"].toFixed(0))  + "</td></tr>"
	}
	
	if (a["Cal_Grant_Recipients"] != null) {
		content += "<tr><td colspan=2></td><td></td></tr>"
		content += "<tr><td class=\"resultsTableHeaderText\" colspan=3>State and Federal Funding for Student Aid</td></tr>"
		content += "<tr><td style=\"width:15px;\"></td><td>Cal Grant Recipients</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Cal_Grant_Recipients"].toFixed(0)) + "</td></tr>"
		content += "<tr><td style=\"width:15px;\"></td><td>Cal Grant Amount</td><td class=\"resultsTableAmounts\">" + "$" + dojo.number.format(a["Cal_Grant_Amount"].toFixed(0)) + "</td></tr>"
	}

	if (a["Pell_Grant_Recipients"] != null) {
		content += "<tr><td style=\"width:15px;\"></td><td>Pell Grant Recipients</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Pell_Grant_Recipients"].toFixed(0)) + "</td></tr>"
		content += "<tr><td style=\"width:15px;\"></td><td>Pell Grant Amount</td><td class=\"resultsTableAmounts\">" + "$" + dojo.number.format(a["Pell_Grant_Amount"].toFixed(0)) + "</td></tr>"
	}
	
	if (a["Federal_Loan_Recipients"] != null) {
		content += "<tr><td style=\"width:15px;\"></td><td>Federal Loan Recipients</td><td class=\"resultsTableAmounts\">" + dojo.number.format(a["Federal_Loan_Recipients"].toFixed(0)) + "</td></tr>"
		content += "<tr><td style=\"width:15px;\"></td><td>Federal Loan Amount</td><td class=\"resultsTableAmounts\">" + "$" + dojo.number.format(a["Federal_Loan_Amount"].toFixed(0)) + "</td></tr>"
	}	
	
	content += "<tr><td colspan=2></td><td></td></tr>"
	content += "<tr><td colspan=2 class=\"resultsTableHeaderText\">Federal Funding for UC Research</td><td class=\"resultsTableAmounts\">$" + dojo.number.format(a["Funding_Total"].toFixed(0)) + "</td></tr>"
	for (var i=0;i<funding_fields.length;i++) {
		if (a[funding_fields[i]] != null) {
			content += "<tr><td style=\"width:15px;\"></td><td>" + campusSmallFeatureLayer.fields[dojo.indexOf(fieldNames, funding_fields[i])].alias + "</td><td class=\"resultsTableAmounts\">" + "$" + dojo.number.format(a[funding_fields[i]].toFixed(0)) + "</td></tr>"
		}
	}
	//console.log(funding_fields)
	
	return content;
}

function reservesOnClick(evt) {
	a = evt.graphic.attributes
	var content = '<div id="popupContentDiv">';
	content += '<div style="width:275px;height:175px;text-align:center;margin:5px 0px 10px 10px;padding:0px;border: 2px solid #8F8884; box-shadow: 2px 2px 6px #6a6a6a;overflow:hidden;"><img src="' + window.location.href + 'images/reserves/' + stripAccents(a["Reserve_Name"]) + '.jpg"></div>'
	content += '<div style="margin:0px 0px 10px 0px; padding:0px 10px 0px 10px">' + a["Description"] + ' <a class="reserveLink" href="' + a["WebAddress"] + '" target="_blank">... read more</a></div>';
	content += '</div>';
	
	map.infoWindow.setTitle(a["Reserve_Name"]);
	map.infoWindow.setContent(content);
	var height = dojo.byId("popupContentDiv").offsetHeight;
	map.infoWindow.resize(320, height + 50);
	map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
}

function communityProgramsOnClick(evt){
	var a = evt.graphic.attributes;
	var content = "<div id=\"popupTableDiv\" class=\"resultsTableDiv\">";
	content += "<table id=\"popupTable\" class=\"resultsTable\"  border=\"0\" cellspacing=\"0\">";
	content +="<tr><td></td></tr>"
	content += "<tr><td class=\"resultsTableHeaderText\"><a class=\"reserveLink\" href=\"" + a["Site1"] + "\" target=\"_blank\">" + a["Title"] + "</a></td></tr>"
	content += "<tr><td style=\"padding-left: 10px;\">" + ((typeof a["Address"] != 'undefined') ? (a["Address"] + "<br>") : "") + a["City"] + ", " + a["State"] + "&nbsp;&nbsp;" + a["Zip"] + "</td></tr>"
	content += "<tr><td style=\"padding-left: 10px;\"><br><span style=\"font-style: italic;\">Program Description:</span>&nbsp;&nbsp;" + ((a["Description"]) ? (a["Description"]) : "not available") + "</td></tr>"
	content += "</table>";
	content += "</div>";	
	
	map.infoWindow.setTitle(a["Category"])
	map.infoWindow.setContent(content)
	map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
	var height = dojo.byId("popupTableDiv").offsetHeight;
	map.infoWindow.resize(300, height);
}

function stripAccents(str) {
 var rExps=[
 {re:/[\xC0-\xC6]/g, ch:'A'},
 {re:/[\xE0-\xE6]/g, ch:'a'},
 {re:/[\xC8-\xCB]/g, ch:'E'},
 {re:/[\xE8-\xEB]/g, ch:'e'},
 {re:/[\xCC-\xCF]/g, ch:'I'},
 {re:/[\xEC-\xEF]/g, ch:'i'},
 {re:/[\xD2-\xD6]/g, ch:'O'},
 {re:/[\xF2-\xF6]/g, ch:'o'},
 {re:/[\xD9-\xDC]/g, ch:'U'},
 {re:/[\xF9-\xFC]/g, ch:'u'},
 {re:/[\xD1]/g, ch:'N'},
 {re:/[\xF1]/g, ch:'n'} ];

 for(var i=0, len=rExps.length; i<len; i++)
  str=str.replace(rExps[i].re, rExps[i].ch);

 return str;
}

function showTooltip(evt, field) {
	var px, py;        
	if (evt.clientX || evt.pageY) {
	  px = evt.clientX;
	  py = evt.clientY;
	} else {
	  px = evt.clientX + dojo.body().scrollLeft - dojo.body().clientLeft;
	  py = evt.clientY + dojo.body().scrollTop - dojo.body().clientTop;
	}
	
	content = evt.graphic.attributes[field];;
	tooltip.innerHTML = content;
	
	tooltip.style.display = "none";
	dojo.style(tooltip, { left: (px + 15) + "px", top: (py) + "px" });
	tooltip.style.display = "";
}

function resetTabContainer() {
	activeTabs = [];
	
	dijit.byId("campus").set("title", "Campus");

	var content = '<div style="border: 1px dotted #bbb; background: #F5F5F5; padding: 5px 5px 5px 15px; margin:5px;"><table><tr><td style="width:50px; text-align:center;"><img src="images/no_table.png"></td><td style="font-size:13px; color:#444">No results to display.<br>Run a search to retrieve records.</td></tr></table></div>'
	dijit.byId("campus").set("content", content);
	dijit.byId("districtDetails").set("content", content);
	dijit.byId("districtDetails").resize();
	
	dijit.byId("infoTabs").selectChild(dijit.byId("legendContent"))
	dijit.byId("infoTabs").resize();
	
}

function resetLegendCount(){
	for (x in ucSystemValues) {
		if (x != "legendHeader") {
			dojo.byId(x).childNodes[2].innerHTML = ucSystemValues[x];
		} else {
			dojo.byId(x).childNodes[1].innerHTML = ucSystemValues[x];
		}
	}
	dojo.byId("dataAvailable").innerHTML = ""
}

function resetLegendVisibility() {
	dojo.forEach(dojo.query('[layerVisible]'), function (layer, i) {
		var id = layer.id;
		var imageSrc = dojo.byId(id).childNodes[0].getElementsByTagName('img')[0].src
		if (id == "University") {
			dojo.setAttr(layer.id, "layerVisible", "true");
			if ( dojo.hasClass(id, "legendOutOff") ) { 
				dojo.removeClass(id, "legendOutOff"); 
				dojo.addClass(id, "legendOut");
				dojo.byId(id).childNodes[0].getElementsByTagName('img')[0].src = imageSrc.replace('_off.png','.png');	
			}
		} else {
			dojo.setAttr(id, "layerVisible", "false");
			if ( dojo.hasClass(id, "legendOut") ) {
				dojo.removeClass(id, "legendOut");
				dojo.addClass(id, "legendOutOff");
				dojo.byId(id).childNodes[0].getElementsByTagName('img')[0].src = imageSrc.replace('.png','_off.png')
			}
		}
	});
}

function resetMap(){
	resetLayers = true;
	map.infoWindow.hide();
	map.graphics.clear();
	addressInfo.address = "";
	addressInfo.assembly = "";
	addressInfo.senate = "";
	addressInfo.congress = "";
	addressInfo.campus = "";	
	resetMapLayersData();
	dojo.byId("queryDefinition").innerHTML = "Filter: <b>-- none --</b>";
	dojo.style("downloadPdf", {"display":"none"});
	dojo.style("queryDefinition", {"width":"267px"});
	dijit.byId("layer").set('value', filterSelectAll);
	var data = { label:"name", identifier:"id", items: [{ "name": filterSelectAll, "id": filterSelectAll }] };
	dijit.byId("district").set('store', new dojo.data.ItemFileReadStore({ data: data }) );
	dijit.byId("district").textbox.value = filterSelectAll;
	
	if (dijit.byId("legendContentDiv").open == false) { dijit.byId("legendContentDiv").toggle(); }
	if (dijit.byId("taskDiv").open == false) { dijit.byId("taskDiv").toggle(); }
	dijit.byId("searchButton").set('disabled', true);
	dijit.byId("clearButton").set('disabled', true);	
}

function resetMapLayersData(){
	if ((map.getLevel() != maxLevel) && (addressInfo.address == "")) { map.setExtent(maxExtent, true); }
	resetLayerDefinitions();
	resetTabContainer();
	resetLegendCount();
	resetLegendVisibility();
	checkLegendVisibility();
	campusLargeFeatureLayer.hide(); // hack
	assemblyFeatureLayer.hide();
	senateFeatureLayer.hide();
	congressFeatureLayer.hide();
	
	var layer = dijit.byId('layer').get('value');
	if (layer == "assembly"){	
		assemblyFeatureLayer.clearSelection();
	}
	else if (layer == "senate") {
		senateFeatureLayer.clearSelection();
	} 
	else if (layer == "congress") {
		congressFeatureLayer.clearSelection();
	}
}

function updateLayerVisibility(value) {
	dojo.style("mapProgressBar", { "display":"block" });
	dojo.byId("queryDefinition").innerHTML = "Filter: <b>-- none --</b>";
	dojo.style("downloadPdf", {"display":"none"});
	dojo.style("queryDefinition", {"width":"267px"});
	resetMapLayersData();
	var layer = value[0];

	if (layer == "campus") {
		campusSmallFeatureLayer.show();
		dijit.byId("district").set('store', new dojo.data.ItemFileReadStore({ data: campusNames }) );
	} else if (layer == "assembly") {
		assemblyFeatureLayer.show();
		dijit.byId("district").set('store', new dojo.data.ItemFileReadStore({ data: assemblyDistricts }) );
	} else if (layer == "senate") {
		senateFeatureLayer.show();
		dijit.byId("district").set('store', new dojo.data.ItemFileReadStore({ data: senateDistricts }) );
	} else if (layer == "congress") {
		congressFeatureLayer.show();
		dijit.byId("district").set('store', new dojo.data.ItemFileReadStore({ data: congressDistricts }) );
	}
	dijit.byId("district").textbox.value = filterSelectAll;
	
	map.infoWindow.hide();
	if (tooltip) { tooltip.style.display = "none";}
}

function resetLayerDefinitions() {
	campusLayerDefinition = "Type = 'University'";
	campusSmallFeatureLayer.setDefinitionExpression(campusLayerDefinition);
	campusSmallFeatureLayer.refresh();
	
	medCenterLayerDefinition = "Type = 'Medical Center'";
	medCenterSmallFeatureLayer.setDefinitionExpression(medCenterLayerDefinition);
	medCenterSmallFeatureLayer.refresh();
	
	labLayerDefinition = "Type = 'Lab'";
	labSmallFeatureLayer.setDefinitionExpression(labLayerDefinition);
	labSmallFeatureLayer.refresh();		
	
	campusLargeFeatureLayer.setDefinitionExpression(campusLayerDefinition);
	campusLargeFeatureLayer.refresh();
	
	medCenterLargeFeatureLayer.setDefinitionExpression(medCenterLayerDefinition);
	medCenterLargeFeatureLayer.refresh();

	labLargeFeatureLayer.setDefinitionExpression(labLayerDefinition);
	labLargeFeatureLayer.refresh();	
	
	reservesFeatureLayer.setDefinitionExpression("");
	reservesFeatureLayer.refresh();	

	communityProgramLayerDefinition = "0=1";
	communityProgramLayerDefinitions = [communityProgramLayerDefinition,communityProgramLayerDefinition,communityProgramLayerDefinition,communityProgramLayerDefinition];
	communityProgramDynamicLayer.setLayerDefinitions(communityProgramLayerDefinitions);
		
	communityProgramFeatureLayer577k.setDefinitionExpression(communityProgramLayerDefinition);
	communityProgramFeatureLayer577k.refresh();
	
	communityProgramFeatureLayer288k.setDefinitionExpression(communityProgramLayerDefinition);
	communityProgramFeatureLayer288k.refresh();

	communityProgramFeatureLayer144k.setDefinitionExpression(communityProgramLayerDefinition);
	communityProgramFeatureLayer144k.refresh();

	communityProgramFeatureLayer72k.setDefinitionExpression(communityProgramLayerDefinition);
	communityProgramFeatureLayer72k.refresh();
}

function changeBaseMap(node,layer) {
	dojo.fx.wipeOut({
		node: "baseMapSelectorOptions",
		duration: 300,
		onEnd: function(){
			dojo.style("baseMapSelector",{
				"borderRadius":"4px 4px 4px 4px"
			});
			dojo.forEach(basemaps, function(service){ service.hide(); });
			layer.show()
			if (layer.id == "Stamen Terrain") { oceanLayer.show(); };
			if (layer.id == "gray") { grayLayerLabels.show(); };
			//toggleToolState("baseMapSelector");			
		}
	}).play();	
}

function toolHover(id, state){
	if (state == 'over') {
		dojo.style(id, { "backgroundImage": dojo.style(id, "backgroundImage").split("-")[0] + '-over.png")' });
	} else {
		dojo.style(id, { "backgroundImage": dojo.style(id, "backgroundImage").split("-")[0] + '-out.png")' });
	}
}

function hover(t, style) {
	t.className=style;
}

function hoverLegendItem(t, style) {
	var id = t.id;
	var visible = dojo.getAttr(id,"layerVisible");
	if (visible == "true") {
		hover(t, style);
	} else if (visible == "false") {
		hover(t, style + "Off");
	}
}

function toggleLegendStyle(id, visible) {
	dojo.setAttr(id, "layerVisible", visible);
	if ((dojo.hasClass(id, "legendOutOff")) || (dojo.hasClass(id, "legendOverOff"))) {
		if ( dojo.hasClass(id, "legendOutOff") ) { 
			dojo.removeClass(id, "legendOutOff"); 
			dojo.addClass(id, "legendOut");
		}
		if ( dojo.hasClass(id, "legendOverOff") ) { 
			dojo.removeClass(id, "legendOverOff");
			dojo.addClass(id, "legendOver");
		}
		var image = dojo.byId(id).childNodes[0].getElementsByTagName('img')[0].src.replace('_off.png','.png')
	} else if ((dojo.hasClass(id, "legendOut")) || (dojo.hasClass(id, "legendOver"))) {
		if ( dojo.hasClass(id, "legendOut") ) {
			dojo.removeClass(id, "legendOut");
			dojo.addClass(id, "legendOutOff");
		}
		if ( dojo.hasClass(id, "legendOver") ) {
			dojo.removeClass(id, "legendOver");
			dojo.addClass(id, "legendOverOff");
		}
		var image = dojo.byId(id).childNodes[0].getElementsByTagName('img')[0].src.replace('.png','_off.png')
	}
	dojo.byId(id).childNodes[0].getElementsByTagName('img')[0].src = image;
}


function toggleLegendVisibility(id) {
	dojo.style("mapProgressBar", { "display":"block" });
	var visible = dojo.getAttr(id,"layerVisible");
	if (visible == "true") {		
		toggleLegendStyle(id, "false");
	} else {
		toggleLegendStyle(id, "true");		
	}
	checkLegendVisibility();	
}

function checkLegendVisibility() {

	communityProgramLayerVisibility = [];
	campusLayerVisibility = [];
	
	dojo.forEach(dojo.query('[layerVisible]'), function (layer, i) {
		if (i < 3) {
			if (dojo.getAttr(layer, 'layerVisible') == "true") { campusLayerVisibility.push(layer.id); }
		} else if (i == 3) {
			if (dojo.getAttr(layer, 'layerVisible') == "true") { 
				reservesFeatureLayer.show();
			} else {
				reservesFeatureLayer.hide();
			}			
		} else if (i > 3) {
			if (dojo.getAttr(layer, 'layerVisible') == "true") { communityProgramLayerVisibility.push(layer.id); }
		}
	});
	
	if (communityProgramLayerVisibility.length > 0) {
		var cm_definition = communityProgramLayerDefinition.split(" AND ", 1)[0];
		var cm_expression = "Category IN ('" + communityProgramLayerVisibility.join("', '") + "')";
		if ((cm_definition != "") && (cm_definition != "0=1") && (cm_definition.substring(0,8) != "Category")){
			communityProgramLayerDefinition = cm_definition + " AND " + cm_expression;
		} else {
			communityProgramLayerDefinition = cm_expression;
		}
	} else {
		communityProgramLayerDefinition = "0=1";
	}
	redrawLayers();
}

function redrawLayers() {
	var level = map.getLevel();
	if (level <= 10) {
		
		campusSmallFeatureLayer.hide();
		medCenterSmallFeatureLayer.hide();
		labSmallFeatureLayer.hide();
		dojo.forEach(campusLayerVisibility, function (layer) {
			switch(layer) {
				case "University":
				campusSmallFeatureLayer.setDefinitionExpression(campusLayerDefinition);
				campusSmallFeatureLayer.redraw();
				campusSmallFeatureLayer.show();
				break;
				
				case "Medical Center":
				medCenterSmallFeatureLayer.setDefinitionExpression(medCenterLayerDefinition);
				medCenterSmallFeatureLayer.redraw();
				medCenterSmallFeatureLayer.show();
				break;
				
				case "Lab":
				labSmallFeatureLayer.setDefinitionExpression(labLayerDefinition);
				labSmallFeatureLayer.redraw();				
				labSmallFeatureLayer.show();
				break;
			}
		});

		if (level < 9) {
			var communityProgramLayerDefinitions = [communityProgramLayerDefinition,communityProgramLayerDefinition,communityProgramLayerDefinition,communityProgramLayerDefinition];
			communityProgramDynamicLayer.setLayerDefinitions(communityProgramLayerDefinitions);
			communityProgramDynamicLayer.show()					
		} else if (level >= 9) { //577k
			communityProgramFeatureLayer577k.setDefinitionExpression(communityProgramLayerDefinition);
			communityProgramFeatureLayer577k.redraw();
			communityProgramFeatureLayer577k.show();
		}
	} else if (level > 10) {
		if (level == 11) { //288k
			communityProgramFeatureLayer288k.setDefinitionExpression(communityProgramLayerDefinition);
			communityProgramFeatureLayer288k.redraw();
			communityProgramFeatureLayer288k.show();
		} else if (level == 12) { //144k
			communityProgramFeatureLayer144k.setDefinitionExpression(communityProgramLayerDefinition);
			communityProgramFeatureLayer144k.redraw();
			communityProgramFeatureLayer144k.show();			
		} else if (level >= 13) { //72k
			communityProgramFeatureLayer72k.setDefinitionExpression(communityProgramLayerDefinition);
			communityProgramFeatureLayer72k.redraw();
			communityProgramFeatureLayer72k.show();			
		}
		
		campusLargeFeatureLayer.hide();
		medCenterLargeFeatureLayer.hide();
		labLargeFeatureLayer.hide();
		dojo.forEach(campusLayerVisibility, function (layer) {
			switch(layer) {
				case "University":
				campusLargeFeatureLayer.setDefinitionExpression(campusLayerDefinition);
				campusLargeFeatureLayer.redraw();
				campusLargeFeatureLayer.show();
				break;
				
				case "Medical Center":
				medCenterLargeFeatureLayer.setDefinitionExpression(medCenterLayerDefinition);
				medCenterLargeFeatureLayer.redraw();
				medCenterLargeFeatureLayer.show();
				break;
				
				case "Lab":
				labLargeFeatureLayer.setDefinitionExpression(labLayerDefinition);
				labLargeFeatureLayer.redraw();				
				labLargeFeatureLayer.show();
				break;
			}
		});				
	}
}

function showAddressDialog(){
	var display = dojo.style("addressDiv", "display");
	if (display == "block") {
		dojo.style("addressDiv", {"display":"none"});
	} else {
		dojo.style("addressDiv", {"display":"block"})
	}
}

function baseMapSelectorToggle(){
	var display = dojo.style("baseMapSelectorOptions","display");
	if (display=="none") {
		dojo.fx.wipeIn({
			node: "baseMapSelectorOptions",
			duration: 300
		}).play();
	} else {
		dojo.fx.wipeOut({
			node: "baseMapSelectorOptions",
			duration: 300
		}).play();	
	}
	//toggleToolState("baseMapSelector");	
}

function showDataPdf() {
	window.open("Data_Documentation.pdf", "_blank");
}

function showMapPdf() {
	var layer = dijit.byId('layer').get('value');
	var value = dijit.byId('district').get('value');
	if ((layer == 'assembly') || (layer == 'senate') || (layer == 'congress')) {
		var prefix = (layer == 'assembly') ? "AD" : (layer == 'senate') ? "SD" : "CD";
		window.open("maps/" + layer + "/" + prefix + "_" + value.split(" ").pop() + ".pdf", "_blank");
	}
}