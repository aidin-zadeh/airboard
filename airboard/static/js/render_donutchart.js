

function update_carrier_chart() {
    let year = 2016;
    let month = 10;
    let origin = {city: "Austin", state:"TX", country: "United States", airport_code: null};
    let carrier = {name: null, code: null};

    let indicator = "passengers";

    let base_url = `/data/carrier/out/topn_stats.json/${year}/${indicator}`;
    let request_url = parse_request_url(base_url, month=month, origin=origin);

    d3.json(request_url, function(response) {

        // console.log(request_url);
        // console.log(response);
        cols = response.origin.dest.map(x => [x.carrier_name, x[`total_${indicator}`]] )
        // console.log(cols);
        let donut_chart = c3.generate({
            bindto: "#carrier-chart",
            data: {
                columns: cols,
                type : 'donut',
                // onclick: function (d, i) { console.log("onclick", d, i); },
                // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: "Carriers"
            },
            legend: {
                show: true,
                position: "right",
            }
        });

    });
}

function update_state_destination_chart() {

    let year = 2016;
    let month = 10;
    let state_code = "TX";
    // set params to filter by
    let origin = {city: null, state: null, country: "United States", airport_code: null};
    let carrier = {name: null, code: null};

    let indicator = "passengers";
    let base_url = `/data/state/out/topn_stats.json/${year}/${state_code}/${indicator}`;

    let request_url = parse_request_url(base_url, month=month, origin=origin);

    d3.json(request_url, function(response) {

        // console.log(request_url)
        // console.log(response);
        cols = response.origin.dest.map(x => [`${x.state}, ${x.country}`, x[`total_${indicator}`]] )
        // console.log(cols)
        let dest_chart = c3.generate({
            bindto: "#destination-chart",
            data: {
                columns: cols,
                type : 'donut',
                // onclick: function (d, i) { console.log("onclick", d, i); },
                // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: indicator.capitalize()
            },
            legend: {
                show: true,
                position: "right",
            }
        });

    });
}

function update_city_destination_chart() {

    let year = 2016;
    let month = 10;
    let city = "Austin";
    // set params to filter by
    let origin = {city: null, state: null, country: "United States", airport_code: null};
    let carrier = {name: null, code: null};

    let indicator = "passengers";
    let base_url = `/data/city/out/topn_stats.json/${year}/${city}/${indicator}`;

    let request_url = parse_request_url(base_url, month=month, origin=origin);

    d3.json(request_url, function(response) {

        // console.log(request_url);
        // console.log(response);
        cols = response.origin.dest.map(x => [`${x.city}, ${x.state}`, x[`total_${indicator}`]] )
        // console.log(cols);
        let dest_chart = c3.generate({
            bindto: "#destination-chart",
            data: {
                columns: cols,
                type : 'donut',
                // onclick: function (d, i) { console.log("onclick", d, i); },
                // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: indicator.capitalize()
            },
            legend: {
                show: true,
                position: "right"
            }
        });

    });
}

function update_airport_destination_chart() {

    let year = 2016;
    let month = 5;
    let airport_code = "AUS";
    // set params to filter by
    let origin = {city: null, state: null, country: "United States", airport_code: null};
    let carrier = {name: null, code: null};

    let indicator = "passengers";
    let base_url = `/data/airport/out/topn_stats.json/${year}/${airport_code}/${indicator}`

    let request_url = parse_request_url(base_url, month=month, origin=origin);

    d3.json(request_url, function(response) {

        // console.log(request_url);
        // console.log(response);
        let labels = response.origin.dest.map(x => [`${x.airport_code}`]);
        let cols = response.origin.dest.map(x => [`${x.airport_code}`, x[`total_${indicator}`]] )
        // console.log(cols);
        let dest_chart = c3.generate({
            bindto: "#destination-chart",
            data: {
                columns: cols,
                type : 'donut',
                // onclick: function (d, i) { console.log("onclick", d, i); },
                // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
            },
            donut: {
                title: indicator.capitalize()
            },
            legend: {
                show: true,
                position: "right"
            }
        });

    });
}
update_carrier_chart();
// update_state_destination_chart();
// update_city_destination_chart();
update_airport_destination_chart();