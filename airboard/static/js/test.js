// Load data from hours-of-tv-watched.csv
//var file = “https://raw.githubusercontent.com/the-Coding-Boot-Camp-at-UT/UTAUS201804DATA2-Class-Repository-DATA/master/16-D3/2/Activities/03-Par_BarChart_From_CSV/Solved/hours-of-tv-watched.csv?token=AjcRLr4RW9ePAjBdA2ZjD6xywBb7XT0Vks5bgzsQwA%3D%3D”

// let filename = "https://raw.githubusercontent.com/aidinhass/airboard/master/airboard/data/ext/2001_616181125_T_T100D_MARKET_ALL_CARRIER_CLEAN.csv"
//
// // Function that deals with the returned data (if request was successful)
// function successHandle(tvData) {
//     // Print the tvData
//     console.log(tvData);
//
//     // Cast the hours value to a number for each piece of tvData
//     tvData.forEach(function (data) {
//         data.hours = +data.hours;
//     });
// };
//
// function errorHandle (error) {
//     if (error) throw error;
// }
//
// d3.csv(filename, function(error, response) {
//     // console.log(response[0])
//     // errorHandle(error);
//     // successHandle(response);
// });

var chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 50, 20, 10, 40, 15, 25]
      ]
    }
});