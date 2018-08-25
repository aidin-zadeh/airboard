

function update_index(year, month, origin, dest, carrier, indicator) {


    update_carrier_chart(year, month, indicator, origin, dest);

    // update top N destination donut chart
    if (origin.airport_code != null) {
        update_airport_destination_chart(year, origin, origin.airport_code, indicator, dest);
    } else if (origin.city != null) {
        update_city_destination_chart(year, month,origin.city, indicator, dest, carrier);
    } else if (origin.state != null) {
        update_state_destination_chart(year, month, origin.state, indicator, dest);
    }

    // update table

    // update card footer
    let elems = document.getElementsByClassName("card-footer");
    let current_date = new Date();
    for (let i=0; i<elems.length; i++) {
        elems[i].innerText = "Updated at " +
            (current_date.getMonth()+1)  + " " +
            current_date.getDate() + "/" +
            current_date.getFullYear() + " @ " +
            current_date.getHours() + ":" +
            current_date.getMinutes() + ":"
            + current_date.getSeconds();
    }

}

function window_load_handler() {


    let year = 2017;
    let month = null;
    let origin = {
        country: COUNTRY,
        state: "TX",
        city: "Austin",
        airport_code: null,
    };
    let dest = {
        country: COUNTRY,
        state: null,
        city: null,
        airport_code: null,
    };
    let carrier = {
        code: null,
        name: null
    };

    let indicator = "mail";

    // summary cards

    // update flowmap


    // update carrier donut chart
    update_carrier_chart(year, month, indicator, origin, dest);

    // update top N destination donut chart
    if (origin.airport_code != null) {
        update_airport_destination_chart(year, origin, origin.airport_code, indicator, dest);
    } else if (origin.city != null) {
        update_city_destination_chart(year, month, origin.city, indicator, dest, carrier);
    } else if (origin.state != null) {
        update_state_destination_chart(year, month, origin.state, indicator, dest);
    }

    // update table

    // update card footer
    let elems = document.getElementsByClassName("card-footer");
    let current_date = new Date();
    for (let i=0; i<elems.length; i++) {
        elems[i].innerText = "Updated at " +
            (current_date.getMonth()+1)  + "/" +
            current_date.getDate() + "/" +
            current_date.getFullYear() + " @ " +
            current_date.getHours() + ":" +
            current_date.getMinutes() + ":"
            + current_date.getSeconds();
    }
}

function year_if_change_handler(element) {

    let year = parseInt(element.target.value);
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    // summary cards
    // update flowmap
    // update carrier donut chart
    update_carrier_chart(year, month, indicator, origin, dest);

    // update top N destination donut chart
    if (origin.airport_code != null) {
        update_airport_destination_chart(year, origin, origin.airport_code, indicator, dest);
    } else if (origin.city != null) {
        update_city_destination_chart(year, month,origin.city, indicator, dest, carrier);
    } else if (origin.state != null) {
        update_state_destination_chart(year, month, origin.state, indicator, dest);
    }

    // update table

    // update card footer
    let elems = document.getElementsByClassName("card-footer");
    let current_date = new Date();
    for (let i=0; i<elems.length; i++) {
        elems[i].innerText = "Updated at " +
            (current_date.getMonth()+1)  + " " +
            current_date.getDate() + "/" +
            current_date.getFullYear() + " @ " +
            current_date.getHours() + ":" +
            current_date.getMinutes() + ":"
            + current_date.getSeconds();
    }
}


function month_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = parseInt(element.target.value);
    let origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    // summary cards
    // update flowmap
    // update carrier donut chart
    update_carrier_chart(year, month, indicator, origin, dest);

    // update top N destination donut chart
    if (origin.airport_code != null) {
        update_airport_destination_chart(year, origin, origin.airport_code, indicator, dest);
    } else if (origin.city != null) {
        update_city_destination_chart(year, month,origin.city, indicator, dest, carrier);
    } else if (origin.state != null) {
        update_state_destination_chart(year, month, origin.state, indicator, dest);
    }

    // update table

    // update card footer
    let elems = document.getElementsByClassName("card-footer");
    let current_date = new Date();
    for (let i=0; i<elems.length; i++) {
        elems[i].innerText = "Updated at " +
            (current_date.getMonth()+1)  + " " +
            current_date.getDate() + "/" +
            current_date.getFullYear() + " @ " +
            current_date.getHours() + ":" +
            current_date.getMinutes() + ":"
            + current_date.getSeconds();
    }
}


function origin_state_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let origin = {
        country: COUNTRY,
        state: element.target.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    update_index(year, month, origin, dest, carrier, indicator)
}


function origin_city_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: element.target.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    update_index(year, month, origin, dest, carrier, indicator)
}


function origin_airport_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: element.target.value,
    }, dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    update_index(year, month, origin, dest, carrier, indicator)
}


function dest_state_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let dest = {
        country: COUNTRY,
        state: element.target.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    update_index(year, month, origin, dest, carrier, indicator)
}


function dest_city_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: element.target.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    update_index(year, month, origin, dest, carrier, indicator)
}


function dest_airport_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: element.target.value,
    }, origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, carrier = {
        code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
        name: null
    };

    let indicator = "mail";

    update_index(year, month, origin, dest, carrier, indicator)
}


function carrier_if_change_handler(element) {

    let year = ($yearInput.value === "-- All --") ? null : $yearInput.value;
    let month = ($monthInput.value === "-- All --") ? null : $monthInput.value;
    let origin = {
        country: COUNTRY,
        state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
        city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
        airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
    }, dest = {
        country: COUNTRY,
        state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
        city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
        airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
    }, carrier = {
        code: element.target.value,
        name: null
    };

    let indicator = "mail";

    update_index(year, month, origin, dest, carrier, indicator);
}



let indicator = "mail"

window.addEventListener("load", window_load_handler)
$yearInput.addEventListener("change", year_if_change_handler);
$monthInput.addEventListener("change", month_if_change_handler);
$originStateInput.addEventListener("change", origin_state_if_change_handler);
$originCityInput.addEventListener("change", origin_city_if_change_handler());
$originAiroportInput.addEventListener("change", origin_airport_if_change_handler());
$destStateInput.addEventListener("change", dest_state_if_change_handler);
$destCityInput.addEventListener("change", dest_city_if_change_handler());
$destAiroportInput.addEventListener("change", dest_airport_if_change_handler());
$carrierInput.addEventListener("change", carrier_if_change_handler());


