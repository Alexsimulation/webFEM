

function gen_datasets(mesh) {
    datasets = [];
    for (var i=0; i<mesh["elements"].length; ++i) {
        var n0 = mesh["nodes"][mesh["elements"][i][0]];
        var n1 = mesh["nodes"][mesh["elements"][i][1]];
        var n2 = mesh["nodes"][mesh["elements"][i][2]];
        datasets.push({
            borderColor: "rgba(5, 5, 5, 1)",
            showLine: true,
            tension: 0,
            data:[
                {"x":n0[0], "y":n0[1]},
                {"x":n1[0], "y":n1[1]},
                {"x":n2[0], "y":n2[1]},
                {"x":n0[0], "y":n0[1]}
            ]
        });
    }
    return datasets;
}



var myChart = new Chart("myChart", {
    type:'scatter',
    data:{
        datasets:[{
            borderColor: "rgba(5,5,5,1.0)",
            data:[]
        }]
    },
    options:{
        responsive: true,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
});



commands = {
    "points":[[0., 0.], [0.8, 0.0], [1.0, 1.0], [0.2, 1.0]],
    "lines":[[0, 1, 10], [1, 2, 10], [2, 3, 10], [3, 0, 10]],
    "bounds":{"edge":[0, 2], "inlet":[3], "outlet":[1]}
}
mesh = gen_mesh(commands);

console.log(mesh);
data = gen_datasets(mesh);
myChart["data"]["datasets"] = data;
myChart.update();



