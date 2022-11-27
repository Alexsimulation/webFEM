

function cround(value, index, values) { 
    var v = 0.;
    if (Math.abs(value) != 0.) {
        var k = 10;
        v = Math.round(value * k)/k;
        while (Math.abs(v - value) > 0.9*Math.abs(value)) {
            k *= 10;
            v = Math.round(value * k)/k;
        }
        k *= 10;
        v = Math.round(value * k)/k;
    }
    return v;
}


var myChart = new Chart("myChart", {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Chart",
            borderColor: "rgba(255,255,255,0.8)",
            pointRadius: 0,
            data: []
        }]
    },
    options:{
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            labels: {
                fontColor: "rgba(255, 255, 255, 1.0)",
                fontSize: 18
            }
        },
        scales: {
            xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                drawBorder: false,
                color: 'rgba(225,225,225,0.1)',
                zeroLineColor: "transparent",
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    padding: 20,
                    fontColor: "rgba(225,225,225,1.0)",
                    callback: cround
                }
            }],
            yAxes: [{
                barPercentage: 1.6,
                gridLines: {
                drawBorder: false,
                color: 'rgba(225,225,225,0.1)',
                zeroLineColor: "transparent",
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    padding: 20,
                    min: 0.,
                    max: 0.1,
                    fontColor: "rgba(225,225,225,1.0)",
                    callback: cround
                }
            }]
        }
    }
});


function updateThermalPlot() {

    var k = document.getElementById("fk").value;
    if (k == '') {
        k = '1.';
    }
    var q = document.getElementById("fq").value;
    if (q == '') {
        q = '0.';
    }
    var bilinear = "ux*vx*(" + k + ")"  ;
    var linear = "v*(" + q + ")";
    var bc0t = document.getElementById("bc0").value;
    var bc0v = document.getElementById("bc0v").value;
    var bc0 = "type = '" + bc0t + "'; value = " + bc0v + ";";
    var bc1t = document.getElementById("bc1").value;
    var bc1v = document.getElementById("bc1v").value;
    var bc1 = "type = '" + bc1t + "'; value = " + bc1v + ";";

    var x = linspace(0, 1, 120);

    var [xValues, yValues] = gen_system(bilinear, linear, bc0, bc1, x);

    var miny = Math.min.apply(null, yValues);
    var maxy = Math.max.apply(null, yValues);
    var yspan = maxy - miny;

    // Chart
    myChart["data"]["labels"] = xValues;
    myChart["data"]["datasets"][0]["label"] = 'T(x)';
    myChart["data"]["datasets"][0]["data"] = yValues;
    myChart["options"]["scales"]["yAxes"][0]["ticks"]["min"] = miny - yspan*0.1;
    myChart["options"]["scales"]["yAxes"][0]["ticks"]["max"] = maxy + yspan*0.1;
    myChart.update();

}

updateThermalPlot();
