function update_if_options(element_id, values, display_values, selected_value) {

    let $selectForm = document.getElementById(element_id);
    var length = $selectForm.options.length;
    for (let i = 0; i < length; i++) {
        $selectForm.options[i] = null;
    }

    for (let i=0; i<values.length; i++) {
        let $elem = document.createElement("option");
        if (values[i] === "-- All --" ) {
            $elem.innerHTML = "-- All --";
            $elem.value = "-- All --";
        } else {
            $elem.innerHTML = display_values[i];
            $elem.value = values[i];
        }
        if (values[i] === selected_value && default_value != null) {
            $elem.setAttribute("selected", true)
        }

        $selectForm.appendChild($elem)
    }


}

function year_if_change_filter_handler(year, month, origin, dest, carrier) {
    let base_url = `/data/filtered_options.json/${year}`;
    let request_url = parse_request_url(
        base_url,
        month=month,
        origin=origin,
        dest=dest,
        carrier=carrier
    );

    d3.json(request_url, function(response) {
        console.log(response);


        let key = "month";
        let element_id = "month-if"
        let selected_value = month;
        let values = response[key];
        let display_values = values.map(x => month_names[x]);
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "origin_state_code";
        element_id = "origin-state-if";
        selected_value = origin.state;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "dest_state_code";
        element_id = "dest-state-if";
        selected_value = dest.state;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "origin_city";
        element_id = "origin-city-if";
        selected_value = origin.city;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "dest_city";
        element_id = "dest-city-if";
        selected_value = dest.city;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "origin_airport_code";
        element_id = "origin-airport-if";
        selected_value = origin.airport_code;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "dest_airport_code";
        element_id = "dest-airport-if";
        selected_value = dest.airport_code;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "carrier_code";
        element_id = "carrier-if";
        selected_value = carrier.code;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

    });
}


function month_if_change_filter_handler(year, month, origin, dest, carrier) {
    let base_url = `/data/filtered_options.json/${year}`;
    let request_url = parse_request_url(
        base_url,
        month=month,
        origin=origin,
        dest=dest,
        carrier=carrier
    );

    d3.json(request_url, function(response) {
        console.log(response);

        let key = "origin_state_code";
        let element_id = "origin-state-if";
        let selected_value = origin.state;
        let values = response[key];
        let display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "dest_state_code";
        element_id = "dest-state-if";
        selected_value = dest.state;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "origin_city";
        element_id = "origin-city-if";
        selected_value = origin.city;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "dest_city";
        element_id = "dest-city-if";
        selected_value = dest.city;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "origin_airport_code";
        element_id = "origin-airport-if";
        selected_value = origin.airport_code;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "dest_airport_code";
        element_id = "dest-airport-if";
        selected_value = dest.airport_code;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

        key = "carrier_code";
        element_id = "carrier-if";
        selected_value = carrier.code;
        values = response[key];
        display_values = values;
        values = ["-- All --"].concat(values);
        display_values = ["-- All --"].concat(display_values);
        update_if_options(element_id, values, display_values, selected_value);

    });
}


function update_summary(year, month, origin, dest, carrier) {

    let base_url = `/data/summary_stats.json/${year}`;
    let request_url = parse_request_url(
        base_url,
        month=month,
        origin=origin,
        dest=dest,
        carrier=carrier
    );

    d3.json(request_url, function(json) {
        $totalPassengersCard.innerHTML = `<h4>${json["total_passengers"]} Passengers</h4>`;
        $totalDistanceCard.innerHTML = `<h4>${json["total_distance"]} Distance (mile)</h4>`;
        $totalMailCard.innerHTML = `<h4>${json["total_mail"]} Mail (pound)</h4>`;
        $totalFreightCard.innerHTML = `<h4>${json["total_freight"]} Freight (pound)</h4>`;
    });
}
