accessToken = "pk.eyJ1IjoiYWlkaW5yYWFkIiwiYSI6ImNqa2l4cGk5bjVwZmszbG1sNTU2Nmh5ZjUifQ.oFfyS5HN-ru_gAI7eo_AKg";


var fmap = L.map("at-flowmap")
    .setView([30.26, -97.74], 13);

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}{r}.png?access_token={accessToken}', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 5,
    id: 'mapbox.streets',
    accessToken: accessToken
}).addTo(fmap);

function parse_request_url(year, month=null, origin=null, dest=null, carrier=null) {

    // set base url
    var request_url = `/data/market_domestic.json/${year}`;

    // parse params
    let params = [];

    // parse month
    if (month != null) params.push(`month=${month}`);

    // parse origin airport parameters
    if ("country" in origin && origin.country != null) params.push(`origin_country=${origin.country}`);
    if ("state" in origin && origin.state != null) params.push(`origin_state=${origin.state}`);
    if ("city" in origin && origin.city != null) params.push(`origin_city=${origin.city}`);

    // parse origin destination parameters
    if ("country" in dest && dest.country != null) params.push(`dest_country=${dest.country}`);
    if ("state" in dest && dest.state != null) params.push(`dest_state=${dest.state}`);
    if ("city" in dest && dest.city != null) params.push(`dest_city=${dest.city}`);

    // parse carrier
    if ("name" in carrier && carrier.name != null) params.push(`carrier_name=${carrier.name}`);

    if (params.length === 0) {
        return request_url
    } else if (params.length === 1){
        return `${request_url}?` + params[0];
    } else if (params.length > 1) {
        return `${request_url}?` + params.join("&");
    }
}

// let year = 2017;
// let month = 11;
// let origin = {city: "Austin", state:"TX", country: null};
// let dest = {city: null, state: null, Country: null};
// let carrier = {name: null};

// var request_url = parse_request_url(year, month, origin, dest, carrier);
// console.log("request url= ", request_url);

var request_url = "/data/state/market_domestic_stats.json/2015";
var request_url = "/data/state/market_domestic_stats.json/2015";
console.log("request url= ", request_url);


d3.json(request_url, function(data) {
    // if (error) throw error;

    console.log(data);

    // var Geodesic = L.geodesic([], {
	//     weight: 2,
	//     opacity: 0.5,
	//     color: 'blue',
	//     steps: 30
    // }).addTo(fmap);

    // let origin_latlng, dest_latlng;
    // let latlng = [];

    for (let i=0; i<data.length; i++) {

        var Geodesic = L.geodesic([], {
            weight: 2,
            opacity: 0.1,
            color: 'blue',
            steps: 30
        }).addTo(fmap);

        var origin_latlng = new L.LatLng(
            data[i]["ORIGIN_LATITUDE"],
            data[i]["ORIGIN_LONGITUDE"]
        );
        console.log(origin_latlng);

        var dest_latlng = new L.LatLng(
            data[i]["DEST_LATITUDE"],
            data[i]["DEST_LONGITUDE"]
        );
        console.log(dest_latlng);

        Geodesic.setLatLngs([[origin_latlng, dest_latlng]]);
        // latlng.push([origin_latlng, dest_latlng]);
        // Geodesic.setLatLngs(latlng);

    }
});



// d3.json("/data/state/market_domestic_stats.json/2015", function(data) {
d3.json(request_url, function(data) {
  console.log(data);

  var chart = c3.generate({
        bindto: '#area-chart',
        data: {
            columns: [
                ['data1', 300, 350, 300, 0, 0, 120],
                ['data2', 130, 100, 140, 200, 150, 50]
            ],
            types: {
                data1: 'area-spline',
                data2: 'area-spline'
                // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
            },
            groups: [['data1', 'data2']]
        }
    });
});
