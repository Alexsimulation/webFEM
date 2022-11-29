var commands = {
    "points":[[0., 0.], [1., 0.0], [1.0, 1.0], [0.0, 1.0]],
    "lines":[[0, 1, 10], [1, 2, 10], [2, 3, 10], [3, 0, 10]],
    "bounds":{"edge":[0, 2], "inlet":[3], "outlet":[1]}
}
var mesh = gen_mesh(commands);
var data = gen_datasets(mesh);
console.log(data);

var meshChart = new Chart("meshChart", {
    type:'scatter',
    data:{
        datasets:data
    },
    options:{
        responsive: true,
        aspectRatio: 1.5,
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
});

function getv(s) {
    return document.getElementById(s).value;
}

function update_mesh_plot() {

    data = gen_datasets(mesh);
    meshChart["data"]["datasets"] = data;
    meshChart.update();
}


function get_mesh_commands() {
    var p0 = [parseFloat(getv("p0x")), parseFloat(getv("p0y"))];
    var p1 = [parseFloat(getv("p1x")), parseFloat(getv("p1y"))];
    var p2 = [parseFloat(getv("p2x")), parseFloat(getv("p2y"))];
    var p3 = [parseFloat(getv("p3x")), parseFloat(getv("p3y"))];
    commands = {
        "points":[p0, p1, p2, p3],
        "lines":[[0, 1, 10], [1, 2, 10], [2, 3, 10], [3, 0, 10]],
        "bounds":{"edge":[0, 2], "inlet":[3], "outlet":[1]}
    }
}

function remesh() {
    get_mesh_commands();
    mesh = gen_mesh(commands);
    update_mesh_plot();
}



