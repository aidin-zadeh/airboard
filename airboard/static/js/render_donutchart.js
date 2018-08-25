
var carrier_chart_id = "carrier-chart";
var dest_chart_id = "destination-chart";

// functions to render donut charts

function update_carrier_chart(year, month, indicator, origin, dest) {

    let base_url = `/data/carrier/out/topn_stats.json/${year}/${indicator}`;
    let request_url = parse_request_url(base_url, month=month, origin=origin, dest=dest);

    d3.json(request_url, function(response) {

        cols = response.origin.dest.map(x => [x.carrier_name, x[`total_${indicator}`]] )
        // console.log(cols);
        let donut_chart = c3.generate({
            bindto: `#${carrier_chart_id}`,
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

    let card_header_title = '<i class="fas fa-chart-pie"></i> Top 5 Carriers';
    document.getElementById(carrier_chart_id + "-header").innerHTML = card_header_title
}

function update_state_destination_chart(year, month, origin_state_code, indicator, dest, carrier) {

    // let origin = {city: null, state: null, country: "United States", airport_code: null};
    let base_url = `/data/state/out/topn_stats.json/${year}/${origin_state_code}/${indicator}`;
    let request_url = parse_request_url(base_url, month=month, dest=dest, carrier=carrier);
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

    let card_header_title = '<i class="fas fa-pie-chart"></i>Top 5 ' + indicator.capitalize();
    document.getElementById(dest_chart_id + "-header").innerHTML = card_header_title
}

function update_city_destination_chart(year, month, origin_city, indicator, dest, carrier) {

    // let origin = {city: null, state: null, country: "United States", airport_code: null};

    let base_url = `/data/city/out/topn_stats.json/${year}/${origin_city}/${indicator}`;
    let request_url = parse_request_url(base_url, month=month, dest=dest, carrier=carrier);

    d3.json(request_url, function(response) {

        // console.log(request_url);
        // console.log(response);
        cols = response.origin.dest.map(x => [`${x.city}, ${x.state}`, x[`total_${indicator}`]] )
        // console.log(cols);
        let dest_chart = c3.generate({
            bindto: `#${dest_chart_id}`,
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

        let card_header_title = '<i class="fas fa-chart-pie"></i> Top 5 ' + indicator.capitalize();
        document.getElementById(dest_chart_id + "-header").innerHTML = card_header_title

    });
}

function update_airport_destination_chart(year, month, origin_airport_code, indicator, dest, carrier) {

    let base_url = `/data/airport/out/topn_stats.json/${year}/${airport_code}/${indicator}`
    let request_url = parse_request_url(base_url, month=month, origin=origin, carrier=carrier);

    d3.json(request_url, function(response) {

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

        let card_header_title = '<i class="fas fa-chart-pie"></i> Top 5 ' + indicator.capitalize();
        document.getElementById(dest_chart_id + "-header").innerHTML = card_header_title

    });
}
