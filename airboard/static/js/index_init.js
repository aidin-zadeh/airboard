var COUNTRY = "United States";

const month_names = {1: "January", 2: "February", 3: "March",
                    4: "April", 5: "May", 6: "June",
                    7: "July", 8: "August", 9: "September",
                    10: "October", 11: "November", 12: "December"};

const year_names = {2010: "2010", 2011: "2011",
                    2012: "2012", 2013: "2013",
                    2014: "2014", 2015: "2015",
                    2016: "2017", 2018: "2018",};


var $yearInput = document.getElementById("year-if");
var $monthInput = document.getElementById("month-if");
var $originStateInput = document.getElementById("origin-state-if");
var $originCityInput = document.getElementById("origin-city-if");
var $originAiroportInput = document.getElementById("origin-airport-if");
var $destStateInput = document.getElementById("dest-state-if");
var $destCityInput = document.getElementById("dest-city-if");
var $destAiroportInput = document.getElementById("dest-airport-if");
var $carrierInput = document.getElementById("carrier-if");


Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};


function create_select_options(form_id, display_values, values, default_value=null) {
    let $selectForm = document.getElementById(form_id);
    for (let i=0; i<values.length; i++) {
        let $elem = document.createElement("option");
        $elem.innerHTML = display_values[i];
        $elem.value = values[i];
        if (values[i] === default_value && default_value != null) {
            $elem.setAttribute("selected", true)
        }
        $selectForm.appendChild($elem)

    }
}

function clear_container(element_id) {
    let div = document.getElementById(element_id);
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};


function parse_request_url(base_url, month=null, origin=null, dest=null, carrier=null) {

    // parse params
    let params = [];

    // parse month
    if (month != null) params.push(`month=${month}`);


    // parse origin airport parameters
    if (origin != null) {
        if ("country" in origin && origin.country != null) params.push(`origin_country=${origin.country}`);
        if ("state" in origin && origin.state != null) params.push(`origin_state=${origin.state}`);
        if ("city" in origin && origin.city != null) params.push(`origin_city=${origin.city}`);
        if ("airport_code" in origin && origin.airport_code != null) params.push(`origin_airport_code=${origin.airport_code}`);
    }
    // parse origin destination parameters
    if (dest != null) {
        if ("country" in dest && dest.country != null) params.push(`dest_country=${dest.country}`);
        if ("state" in dest && dest.state != null) params.push(`dest_state=${dest.state}`);
        if ("city" in dest && dest.city != null) params.push(`dest_city=${dest.city}`);
        if ("airport_code" in dest && dest.airport_code != null) params.push(`dest_airport_code=${dest.airport_code}`);
    }
    // parse carrier parameters
    if (carrier != null) {
        if ("name" in carrier && carrier.name != null) params.push(`carrier_name=${carrier.name}`);
        if ("code" in carrier && carrier.code != null) params.push(`carrier_code=${carrier.code}`);
    }

    if (params.length === 0) {
        return base_url
    } else if (params.length === 1){
        return `${base_url}?` + params[0];
    } else if (params.length > 1) {
        return `${base_url}?` + params.join("&");
    }
}

// create year drop-down select list
create_select_options(
    form_id="year-if",
    display_values=Object.values(year_names),
    values=Object.keys(year_names),
    default_value=2018);


create_select_options(
    form_id="month-if",
    display_values=["-- All --"],
    values=["-- All --"]);

// create month drop-down select list
create_select_options(
    form_id="month-if",
    display_values=Object.values(month_names),
    values=Object.keys(month_names));


// create month drop-down select list
d3.json("data/state", function (state_data) {

    create_select_options(
        form_id="origin-state-if",
        display_values=["-- All --"],
        values=["-- All --"],
        default_value="TX");

    create_select_options(
        form_id="dest-state-if",
        display_values=["-- All --"],
        values=["-- All --"]);

    create_select_options(
        form_id="origin-state-if",
        display_values=Object.values(state_data).map(x => x["STATE_NAME"]),
        values=Object.keys(state_data),
        default_value="TX");

    create_select_options(
        form_id="dest-state-if",
        display_values=Object.values(state_data).map(x => x["STATE_NAME"]),
        values=Object.keys(state_data),
        default_value="-- All --");

});

// create month drop-down select list
d3.json("data/city", function (city_data) {

    create_select_options(
        form_id="origin-city-if",
        display_values=["-- All --"],
        values=["-- All --"],
        default_value="Austin");

    create_select_options(
        form_id="dest-city-if",
        display_values=["-- All --"],
        values=["-- All --"]);

    create_select_options(
        form_id="origin-city-if",
        display_values=Object.keys(city_data),
        values=Object.keys(city_data),
        default_value="Austin");

    create_select_options(
        form_id="dest-city-if",
        display_values=Object.keys(city_data),
        values=Object.keys(city_data));

});

// create airport drop-down select list
d3.json("data/airport", function (airport_data) {

    create_select_options(
        form_id="origin-airport-if",
        display_values=["-- All --"],
        values=["-- All --"]);

    create_select_options(
        form_id="dest-airport-if",
        display_values=["-- All --"],
        values=["-- All --"]);

    create_select_options(
        form_id="origin-airport-if",
        display_values=Object.values(airport_data).map(x => x["DISPLAY_AIRPORT_NAME"]),
        values=Object.keys(airport_data));

    create_select_options(
        form_id="dest-airport-if",
        display_values=Object.values(airport_data).map(x => x["DISPLAY_AIRPORT_NAME"]),
        values=Object.keys(airport_data));

});


// create airport drop-down select list
d3.json("data/carrier", function (carrier_data) {
    
    // var items = Object.keys(carrier_data).map(function(key) {
    //     return [key, carrier_data[key]];
    // });
    //
    // items.sort(function(first, second) {
    //     return second[1] - first[1];
    // });
    // console.log(items)
    create_select_options(
        form_id="carrier-if",
        display_values=["-- All --"],
        values=["-- All --"]);

    create_select_options(
        form_id="carrier-if",
        display_values=Object.values(carrier_data).map(x => x["CARRIER_NAME"]),
        values=Object.keys(carrier_data));

});

