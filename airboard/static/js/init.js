
Array.range = (start, end) => Array.from({length: (end - start)}, (v, k) => k + start);

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};

/**
 *
 * @param form_id
 * @param options
 */
function create_select_options(form_id, options) {
    let $selectForm = document.getElementById(form_id);
    for (let i=0; i<options.length; i++){
        let $elem = document.createElement("option");
        $elem.innerHTML = options[i];
        $selectForm.appendChild($elem);
    }
}

function clear_container(element_id) {
    let div = document.getElementById(element_id);
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }
}


/**
 *
 * @param form_id
 * @param options
 */
function create_select_options(form_id, options) {
    let $selectForm = document.getElementById(form_id);
    for (let i=0; i<options.length; i++){
        let $elem = document.createElement("option");
        $elem.innerHTML = options[i];
        $selectForm.appendChild($elem);
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

