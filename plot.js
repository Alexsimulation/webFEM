
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
                    callback: function(value, index, values) { 
                        return Math.round(value * 100)/100;
                    }
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
                    fontColor: "rgba(225,225,225,1.0)"
                }
            }]
        }
    }
});

function linspace(v0, v1, n) {
    var arr = [];
    var step = (v1 - v0)/(n - 1);
    for (var i=0; i<n; ++i) {
        arr.push(v0 + (step*i));
    }
    return arr;
}

function sin(x) { return Math.sin(x); }
function cos(x) { return Math.cos(x); }
function exp(x) { return Math.exp(x); }
function log(x) { return Math.log10(x); }
function ln(x) { return Math.log(x); }

function mult(x, s) {
    for (var i=0; i<x.length; ++i) {
        x[i] *= s;
    }
    return x;
}

function evalv(xv, s) {
    var arr = [];
    var pi = 3.141592653589793238;
    for (var i=0; i<xv.length; ++i) {
        var x = xv[i];
        var y = 0.;
        eval(s);
        arr.push(y);
    }
    return arr;
}


function updatePlot() {
    var [xValues, yValues] = gen_system();

    var miny = Math.min.apply(null, yValues);
    var maxy = Math.max.apply(null, yValues);
    var yspan = maxy - miny;

    // Chart
    myChart["data"]["labels"] = xValues;
    myChart["data"]["datasets"][0]["label"] = 'u(x)';
    myChart["data"]["datasets"][0]["data"] = yValues;
    myChart["options"]["scales"]["yAxes"][0]["ticks"]["min"] = miny - yspan*0.1;
    myChart["options"]["scales"]["yAxes"][0]["ticks"]["max"] = maxy + yspan*0.1;
    myChart.update();

}

updatePlot();
