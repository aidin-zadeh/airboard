



let year = 2017;
let month = 11;
let origin = {city: "Austin", state:"TX", country: "United States", airport_code: null};
let carrier = {name: null, code: null};

let indicator = "passengers";

let base_url = `/data/carrier/out/topn_stats.json/${year}/${indicator}`
let request_url = parse_request_url(base_url, month=month, origin=origin);

d3.json(request_url, function(response) {

    console.log(request_url)
    console.log(response);

    cols = response.origin.dest.map(x => [x.uid, x[`total_${indicator}`]] )
    console.log(cols)
    let donut_chart = c3.generate({
        bindto: "#donut-chart",
        data: {
            columns: cols,
            type : 'donut',
            // onclick: function (d, i) { console.log("onclick", d, i); },
            // onmouseover: function (d, i) { console.log("onmouseover", d, i); },
            // onmouseout: function (d, i) { console.log("onmouseout", d, i); }
        },
        donut: {
            title: "Title Is Here."
        }
    });

});