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

create_map();

let year = 2017;
let month = 11;
let origin = {city: "Austin", state:"TX", country: null};
let dest = {city: null, state: null, Country: null};
let carrier = {name: null};
let base_url = `/data/market_domestic.json/${year}` ;

let request_url = parse_request_url(base_url, month, origin, dest, carrier);

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

    flight_count = ["FlightCount"].concat(flight_count)
    total_passengers = ["TotalPassengers"].concat(total_passengers)
    total_mail = ["TotalMail"].concat(total_mail)
    total_freight = ["TotalFreight"].concat(total_freight)
    total_distance = ["TotalDistance"].concat(total_distance)



    var chart = c3.generate({
        bindto: '#area-chart',
        data: {
            columns: [
                flight_count,
                total_passengers,
                total_freight,
                total_mail,
                total_distance
            ],
            types: {
                data1: 'area-spline',
                data2: 'area-spline',
                data3: 'area-spline',
                data4: 'area-spline',
                data5: 'area-spline',
                // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
            },
            groups: [['data1', 'data2', "data3", "data4", "aea5"]]
        }
    });
});
