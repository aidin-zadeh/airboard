accessToken = "pk.eyJ1IjoiYWlkaW5yYWFkIiwiYSI6ImNqa2l4cGk5bjVwZmszbG1sNTU2Nmh5ZjUifQ.oFfyS5HN-ru_gAI7eo_AKg";


var fmap = L.map("at-flowmap")
    .setView([30.26, -97.74], 13);



function create_map() {
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png?access_token={accessToken}', {
       	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        // attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 5,
        id: 'mapbox.streets',
        accessToken: accessToken
    }).addTo(fmap);

}

function render_map(error, response) {
    console.log("render_map");
    if (error) throw error;
    console.log("render_map");
    console.log(response)
}

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

create_map();

let year = 2017;
let month = 11;
let origin = {city: "Austin", state:"TX", country: null};
let dest = {city: null, state: null, Country: null};
let carrier = {name: null};

let request_url = parse_request_url(year, month, origin, dest, carrier);

console.log("request url= ", request_url);

d3.json(request_url, function (error, response) {
    console.log(response[0]);


    var Geodesic = L.geodesic([], {
	    weight: 2,
	    opacity: 0.5,
	    color: 'blue',
	    steps: 30
    }).addTo(fmap);


    let origin_latlng, dest_latlng;
    let latlng = [];

    let n_geodesics = response.length;
    // n_geodesics = 10;
    for (let i=0; i<n_geodesics; i++) {
        // console.log(i);
        origin_latlng = new L.LatLng(
            response[i]["ORIGIN_LATITUDE"],
            response[i]["ORIGIN_LONGITUDE"]);
        dest_latlng = new L.LatLng(
            response[i]["DEST_LATITUDE"],
            response[i]["DEST_LONGITUDE"]);

        latlng.push([origin_latlng, dest_latlng]);
        Geodesic.setLatLngs(latlng);
    }
});



d3.json("/data/state/market_domestic_stats.json/2015", function(data) {
  console.log(data);

  let origin = "UnitedStates,TX";
  let dest = "UnitedStates,AK";

  let flight_count = data[origin]["dest"][dest]["flight_count"];
  let total_passengers = data[origin]["dest"][dest]["total_passengers"];
  let total_mail = data[origin]["dest"][dest]["total_mail"];
  let total_freight = data[origin]["dest"][dest]["total_freight"];
  let total_distance = data[origin]["dest"][dest]["total_distance"];

  console.log(flight_count.slice(0, flight_count.length))

  console.log(flight_count);
  var chart = c3.generate({
        bindto: '#area-chart',
        data: {
            columns: [
                flight_count.slice(0, flight_count.length).unshift("Flight Count"),
                total_passengers.slice(0, total_passengers.length).unshift("Total Passengers"),
                total_freight.slice(0, total_freight.length).unshift("Total Freight"),
                total_mail.slice(0, total_mail.length).unshift("Total Mail"),
                total_distance.slice(0, total_distance.length).unshift("Total Distance")
            ],
            types: {
                data1: 'area-spline',
                data2: 'area-spline',
                data3: 'area-spline',
                data4: 'area-spline',

                // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
            },
            groups: [['data1', 'data2', "data3", "data4"]]
        }
    });
});
