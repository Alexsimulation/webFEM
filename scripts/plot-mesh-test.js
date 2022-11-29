

function gen_data_nodes(mesh) {
    data = [];
    for (var i=0; i<mesh["nodes"].length; ++i) {
        n = mesh["nodes"][i];
        data.push({"x":n[0], "y":n[1]});

    }
    return data;
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
        aspectRatio: 0.5, 
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
});



commands = {
    "points":[[0., 0.], [1., 0.0], [1.0, 1.0], [1., 2.], [0.5, 2.], [0.5, 1.], [0., 1.0]],
    "lines":[[0, 1, 10], [1, 2, 10], [2, 3, 10], [3, 4, 5], [4, 5, 10], [5, 6, 5], [6, 0, 10]],
    "bounds":{"edge":[0, 2], "inlet":[3], "outlet":[1]}
}
mesh = gen_mesh(commands);

console.log(mesh);
data = gen_data_nodes(mesh);
data = gen_datasets(mesh);
myChart["data"]["datasets"]= data;
myChart.update();



