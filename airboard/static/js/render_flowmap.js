accessToken = "pk.eyJ1IjoiYWlkaW5yYWFkIiwiYSI6ImNqa2l4cGk5bjVwZmszbG1sNTU2Nmh5ZjUifQ.oFfyS5HN-ru_gAI7eo_AKg";


// var fmap = L.map("flowmap")
//     .setView([30.26, -97.74], 13);



// let year = 2017;
// let month = 11;
// let origin = {airport_code: null, city: "Austin", state:"TX", country: null};
// let dest = {airport_code: null, city: null, state: null, country: null};
// let carrier = {code: null, name: null};
// let base_url = `/data/state/market_domestic_stats.json/${year}`;
//
// let request_url = parse_request_url(base_url, month, origin, dest, carrier);
// console.log("request url= ", request_url);


var lrmap = L.map('map', {zoomControl: false})
    .setView([35, -95], 5);

// L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw')
//     .addTo(lrmap);
let map_url = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}{r}.png?access_token={accessToken}';
let attributions ='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
// let attribution = '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',

L.tileLayer(map_url, {
    attribution: attributions,
    maxZoom: 6,
    minZoom: 3,
    id: 'mapbox.streets',
    accessToken: accessToken
}).addTo(lrmap);


function render_flomap(year) {

    d3.json(`/data/state/market_domestic_stats.json/${year}`, function (json) {
        // console.log(json);
        let origin = "UnitedStates,TX";
        let flight_color = "#e9ff20";

        // // -------------- geodesic map --------------
        // var Geodesic = L.geodesic([], {
        //     weight: 2,
        //     opacity: 0.6,
        //     steps: 100,
        //     color: flight_color,
        //     steps: 30
        // }).addTo(lrmap);
        //
        // let origin_latlng,
        //     dest_latlng,
        //     latlng = [];
        //
        // Object.keys(json[origin]["dest"]).forEach(function (key, index) {
        //     // origin_latlng = new L.LatLng(
        //     //     json[origin]["latitude"],
        //     //     json[origin]["longitude"]);
        //     // dest_latlng = new L.LatLng(
        //     //     json[origin]["dest"][key]["latitude"],
        //     //     json[origin]["dest"][key]["longitude"]);
        //     // latlng = [[origin_latlng, dest_latlng]];
        //     // console.log(latlng);
        //     // Geodesic.setLatLngs(latlng);
        //
        //     origin_latlng = new L.LatLng(
        //         json[origin]["latitude"],
        //         json[origin]["longitude"]);
        //     dest_latlng = new L.LatLng(
        //         json[origin]["dest"][key]["latitude"],
        //         json[origin]["dest"][key]["longitude"]);
        //     latlng.push([origin_latlng, dest_latlng]);
        // });
        // Geodesic.setLatLngs(latlng);

        // -------------- flight map --------------
        // get map data

        var map_data = Object.values(json[origin]["dest"]).map(function (x) {
            let elem = {};
            elem["from"] = [json[origin]["longitude"], json[origin]["latitude"]];
            elem["to"] = [x["longitude"], x["latitude"]];
            elem["labels"] = [null, null];
            elem["color"] = flight_color;
            return elem

        });

        var migrationLayer = new L.migrationLayer({
                map: lrmap,
                data: map_data,
                pulseRadius: 10,
                pulseBorderWidth: 3,
                arcWidth: 0.0,
                arcLabel: true,
                arcLabelFont: '10px sans-serif',
            }
        );

        migrationLayer.addTo(lrmap);

        function setData(){
            migrationLayer.setData(data2);
        }
        function hide(){
            migrationLayer.hide();
        }
        function show(){
            migrationLayer.show();
        }
        function play(){
            migrationLayer.play();
        }
        function pause(){
            migrationLayer.pause();
        }
        function destroy() {
            migrationLayer.destroy();
        }

        // -------------- area chart --------------
        let dest = "UnitedStates,AK";

        let label_1 = "Passengers",
            label_2 = "Mail",
            label_3 = "Freight",
            label_4 = "Distance";

        // get area-chart data
        let total_passengers = json[origin]["dest"][dest]["total_passengers"];
        let total_mail = json[origin]["dest"][dest]["total_mail"];
        let total_freight = json[origin]["dest"][dest]["total_freight"];
        let total_distance = json[origin]["dest"][dest]["total_distance"];

        total_passengers = [label_1].concat(total_passengers);
        total_mail = [label_2].concat(total_mail);
        total_freight = [label_3].concat(total_freight);
        total_distance = [label_4].concat(total_distance);

        let months = Array.range(1, 13);
        let xticks = [].concat(months.map(m => `${m}-${year}`));

        var area_chart = c3.generate({
            bindto: "#area-chart",
            data: {
                columns: [
                    total_passengers,
                ],
                types: {
                    Passengers: 'area-spline',
                },
                groups: [[label_1]]
            },
            point: {
                r: 5
            },
            legend: {
                show: true,
                // position: "top",
                // inset: {
                // }
            },
            axis: {
                x: {
                    type: "category",
                    categories: xticks,
                },
                y: {
                    show: false
                }
            },
            zoom: {
                enabled: true,
            },
            transition: {
                duration: 0
            }
        });

        setTimeout(function () {
            area_chart.load({

                columns: [
                    total_mail,
                ],
                types: {
                    Mail: 'area-spline',
                },
                groups: [[label_2]]

            });

        }, 200);

        setTimeout(function () {
            area_chart.load({

                columns: [
                    total_freight,
                ],
                types: {
                    Freight: 'area-spline',
                },
                groups: [[label_3]]

            });

        }, 400);

        setTimeout(function () {
            area_chart.load({

                columns: [
                    total_distance,
                ],
                types: {
                    Distance: 'area-spline',
                },
                groups: [[label_4]]

            });

        }, 600);
    });

}