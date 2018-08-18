

var fmap = L.map("at-flowmap")
    .setView([51.505, -0.09], 13);



function create_map() {
    accessToken = "pk.eyJ1IjoiYWlkaW5yYWFkIiwiYSI6ImNqa2l4cGk5bjVwZmszbG1sNTU2Nmh5ZjUifQ.oFfyS5HN-ru_gAI7eo_AKg";
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
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


let year = 2018;

create_map()

d3.json("/data/market/domestic/all/2018", function (error, response) {
    console.log(response)
});


