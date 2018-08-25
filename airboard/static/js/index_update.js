
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

let indicator = "mail";

// let year = parseInt($yearInput.value);
// let month = parseInt($monthInput.value);
// let origin = {
//     country: COUNTRY,
//     state: ($originStateInput.value === "-- All --") ? null : $originStateInput.value,
//     city: ($originCityInput.value === "-- All --") ? null : $originCityInput.value,
//     airport_code: ($originAiroportInput.value === "-- All --") ? null : $originAiroportInput.value,
// }, dest = {
//     country: COUNTRY,
//     state: ($destStateInput.value === "-- All --") ? null : $destStateInput.value,
//     city: ($destCityInput.value === "-- All --") ? null : $destCityInput.value,
//     airport_code: ($destAiroportInput.value === "-- All --") ? null : $destAiroportInput.value,
// }, carrier = {
//     code: ($carrierInput.value === "-- All --") ? null : $carrierInput.value,
//     name: null
// };
//
// console.log(origin)
// console.log(dest)
// // summary cards
//
// // update flowmap
//
//
// // update carrier donut chart
// update_carrier_chart(year, month, indicator, origin, dest);
//
// // update top N destination donut chart
// if (origin.airport_code != null) {
//     update_airport_destination_chart(year, origin, origin.airport_code, indicator, dest);
// } else if (origin.city != null) {
//     update_city_destination_chart(year, month,origin.city, indicator, dest, carrier);
// } else if (origin.state != null) {
//     update_state_destination_chart(year, month, origin.state, indicator, dest);
// }
//
// // update table
//
// // update card footer
// let elems = document.getElementsByClassName("card-footer");
// let current_date = new Date();
// for (let i=0; i<elems.length; i++) {
//     elems[i].innerText = "Updated at " +
//         (current_date.getMonth()+1)  + " " +
//         current_date.getDate() + "/" +
//         current_date.getFullYear() + " @ " +
//         current_date.getHours() + ":" +
//         current_date.getMinutes() + ":"
//         + current_date.getSeconds();
// }


window.addEventListener("load", window_load_handler)
$yearInput.addEventListener("change", year_if_change_handler);
$monthInput.addEventListener("change", month_if_change_handler);
// $yearInput.addEventListener("change", year_if_change_handler);
// $yearInput.addEventListener("change", year_if_change_handler);
// $yearInput.addEventListener("change", year_if_change_handler);
// $yearInput.addEventListener("change", year_if_change_handler);


