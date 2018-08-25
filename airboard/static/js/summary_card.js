
// functions to render donut charts


function update_state_summary(year, month, origin_state_code, indicator) {

    let base_url = `/data/state/out/topn_stats.json/${year}/${origin_state_code}/${indicator}`;
    let request_url = parse_request_url(base_url, month=month);

    console.log(request_url);
    d3.json(request_url, function(response) {
        console.log(response)


    });
}


function update_city_summary(year, month, origin_city, indicator) {

    let base_url = `/data/city/out/topn_stats.json/${year}/${origin_city}/${indicator}`;
    let request_url = parse_request_url(base_url, month=month);

    d3.json(request_url, function(response) {
        console.log(response)


    });
}

function update_airport_summary(year, month, origin_airport_code, indicator) {

    let base_url = `/data/airport/out/topn_stats.json/${year}/${airport_code}/${indicator}`
    let request_url = parse_request_url(base_url, month=month);

    d3.json(request_url, function(response) {
        console.log(response)

    });
}
