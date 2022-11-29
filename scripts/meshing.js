

function force(ni, nj, h) {
    var dx = nj[0] - ni[0];
    var dy = nj[1] - ni[1];
    var dist = Math.sqrt(dx**2 + dy**2);
    var k = -(h - dist)/h*Math.exp(-1*dist**2);
    return [
        dx/dist * k,
        dy/dist * k
    ];
}

function dotV(a, b) {
    return a[0]*b[0] + a[1]*b[1];
}
function norm(a) {
    return Math.sqrt(a[0]**2 + a[1]**2);
}
function subV(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}
function addV(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
function multV(a, b) {
    return [a[0]*b, a[1]*b];
}

function dist_point_line(p0, p1, p2) {
    var dist = Math.abs((p2[0] - p1[0])*(p1[1] - p0[1]) - (p1[0] - p0[0])*(p2[1] - p1[1]));
    dist /= Math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2);
    // Also check if point is within bounds
    var line_dir = [p2[0] - p1[0], p2[1] - p1[1]];
    line_dir = multV(line_dir, 1/norm(line_dir)**2);
    var v = subV(p0, p1);
    var d = dotV(v, line_dir);

    var inBounds = true;
    if ((d > 1)|(d < 0)) {
        inBounds = false;
    }
    return [dist, inBounds];
}

function project_point_line(p0, p1, p2) {
    var line_dir = [p2[0] - p1[0], p2[1] - p1[1]];
    line_dir = multV(line_dir, 1/norm(line_dir));
    var v = subV(p0, p1);
    var d = dotV(v, line_dir);
    return addV(p1, multV(line_dir, d));
}

function project_x_line(p0, p1, p2) {
    var line_dir = [p2[0] - p1[0], p2[1] - p1[1]];
    var d = (p0[1] - p1[1])/(p2[1] - p1[1]);
    return addV(p1, multV(line_dir, d));
}

function point_in_line(p0, p1, p2) {
    if (p2[1] > p1[1]) {
        if ((p0[1] >= p1[1])&(p0[1] <= p2[1])) {
            return true;
        }
    } else {
        if ((p0[1] <= p1[1])&(p0[1] >= p2[1])) {
            return true;
        }
    }
    return false;
}

function sign (p1, p2, p3)
{
    return (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]);
}

function PointInTriangle (pt, v1, v2, v3) {
    var d1; var d2; var d3;
    var has_neg; var has_pos;

    d1 = sign(pt, v1, v2);
    d2 = sign(pt, v2, v3);
    d3 = sign(pt, v3, v1);

    if ((d1 ==0)&(d2 == 0)&(d3 == 0)) {
        return -1;
    }

    has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);

    if (!(has_neg && has_pos)) {
        
        return 1;
    } else { return 0; } 
}

function equal_edge(t0, t1) {
    var e0 = [[t0[0], t0[1]], [t0[1], t0[2]], [t0[2], t0[0]]];
    var e1 = [[t1[0], t1[1]], [t1[1], t1[2]], [t1[2], t1[0]]];
    
    for (var i=0; i<e0.length; ++i) {
        for (var j=0; j<e1.length; ++j) {
            if (
                ((e0[i][0] == e1[j][0])&(e0[i][1] == e1[j][1]))|
                ((e0[i][0] == e1[j][1])&(e0[i][1] == e1[j][0]))
            ) {
                return [i, j];
            }
        }
    }

    return [-1, -1];
}

function anticlockwise(t) {
    var M = math.matrix([
        [t[0][0], t[0][1], 1],
        [t[1][0], t[1][1], 1],
        [t[2][0], t[2][1], 1]
    ]);
    return (math.det(M) > 0);
}

function make_anticlockwise(t, nt) {
    if (!anticlockwise(nt)) {
        var temp = t[1];
        t[1] = t[0];
        t[0] = temp;
    }
    return t;
}

function flip_elements(nodes, elements) {
    var non_delaunay = 0;
    for (var i=0; i<elements.length; ++i) {
        for (var j=0; j<elements.length; ++j) {
            var ei = elements[i];
            var ej = elements[j];
            if (i != j) {
                // Check if triangles share an edges
                var [cei, cej] = equal_edge(ei, ej);
                if (cej != -1) {
                    // Triangles share an edge, flipping algorithm
                    var non_shared_node = 0;
                    if (cej == 0) {non_shared_node = 2;} 
                    else if (cej == 1) {non_shared_node = 0;} 
                    else {non_shared_node = 1;}
                    var A = nodes[ei[0]];
                    var B = nodes[ei[1]];
                    var C = nodes[ei[2]];
                    var D = nodes[ej[non_shared_node]];

                    var M = math.matrix([
                        [A[0], A[1], A[0]**2+A[1]**2, 1],
                        [B[0], B[1], B[0]**2+B[1]**2, 1],
                        [C[0], C[1], C[0]**2+C[1]**2, 1],
                        [D[0], D[1], D[0]**2+D[1]**2, 1]
                    ]);
                    var det = math.det(M);
                    if (det > 0) {
                        // Flip the triangle
                        var tri0 = [];
                        var tri1 = [];
                        if (cei == 0) {
                            tri0 = [ei[1], ei[2], ej[non_shared_node]];
                            tri1 = [ei[2], ei[0], ej[non_shared_node]];
                        } else if (cei == 1) {
                            tri0 = [ei[0], ei[1], ej[non_shared_node]];
                            tri1 = [ei[2], ei[0], ej[non_shared_node]];
                        } else {
                            tri0 = [ei[0], ei[1], ej[non_shared_node]];
                            tri1 = [ei[1], ei[2], ej[non_shared_node]];
                        }

                        tri0 = make_anticlockwise(tri0, [nodes[tri0[0]], nodes[tri0[1]], nodes[tri0[2]]]);
                        tri1 = make_anticlockwise(tri1, [nodes[tri1[0]], nodes[tri1[1]], nodes[tri1[2]]]);
                        
                        elements[i] = tri0;
                        elements[j] = tri1;

                        non_delaunay += 1;
                    }
                }
            }
        }
    }

    return [elements, non_delaunay];
}


function split_xy(arr) {
    data = [];
    for (var i=0; i<arr.length; ++i) {
        data.push({
            "x":arr[i][0],
            "y":arr[i][1]
        });
    }
    return data;
}



function gen_mesh(commands) {

    var points = commands["points"];
    var lines = commands["lines"];
    var bounds = commands["bounds"];

    var nodes = [];
    var elements = [];

    // First, discretize the boundaries
    console.log("Computing boundary points...");
    var hm = 0.;
    var center = [0., 0.];
    var line_start = 0;
    var maxP = multV(points[lines[0][0]], 1.);
    var minP = multV(points[lines[0][0]], 1.);
    for (var li=0; li<lines.length; ++li) {
        var p0 = points[lines[li][0]];
        var p1 = points[lines[li][1]];
        maxP = [
            Math.max(maxP[0], p0[0], p1[0]),
            Math.max(maxP[1], p0[1], p1[1]),
        ];
        minP = [
            Math.min(minP[0], p0[0], p1[0]),
            Math.min(minP[1], p0[1], p1[1]),
        ];
        center = addV(center, multV(addV(p0, p1), 0.5/lines.length));
        nodes.push(p0);
        line_start = nodes.length;
        for (var ti=1; ti<lines[li][2]; ++ti) {
            var t = ti / lines[li][2];
            var p = [
                p0[0] + (p1[0] - p0[0])*t,
                p0[1] + (p1[1] - p0[1])*t
            ];
            nodes.push(p);
        }
        hm += Math.sqrt(norm(subV(p1, p0))/lines[li][2])/lines.length;
    }
    var bound_nodes = nodes.length;

    var h = hm**2;

    // Init inner points
    console.log("Computing internal nodes...");
    var m_nodes = [];
    var n_points = Math.round(Math.min(maxP[0] - minP[0], maxP[1] - minP[1])/h);
    console.log(n_points, minP, maxP, h);
    for (var i=0; i<n_points; ++i) {
        for (var j=0; j<n_points; ++j) {
            var jj = j*1;
            if (i % 2 == 0) {
                jj += 0.5;
            }
            rng = h/10*(2*Math.random() - 1);
            m_nodes.push([
                minP[0] + (jj/(n_points-1))*(maxP[0] - minP[0]) + rng,
                minP[1] + (i/(n_points-1))*(maxP[1] - minP[1]) + rng
            ]);
        }
    }


    // Detect and correct particles that escaped box
    var i = 0;
    while (i<m_nodes.length) {

        var p0 = m_nodes[i];

        var intersects = 0;
        var tooClose = false;
        // Find Intersections & find if point too close to line
        for (var li=0; li<lines.length; ++li) {
            var p1 = points[lines[li][0]];
            var p2 = points[lines[li][1]];
            var p3 = project_x_line(p0, p1, p2);
            var p4 = project_point_line(p0, p1, p2);
            if ((norm(subV(p0, p4)) < h/2.5)&(!tooClose)) {
                tooClose = true;
            }
            if (point_in_line(p3, p1, p2)&(p3[0] > p0[0])) {
                intersects += 1;
            }
        }
        // Find if point too close to line

        // Check if point escaped
        if (((intersects % 2) == 0)|tooClose) {
            // Even intersections, outside
            m_nodes.splice(i, 1);
        } else {
            i += 1;
        }
    }
    nodes = nodes.concat(m_nodes);
    
    console.log("Computing initial triangulation...");
    // Initial triangulation goes from boundaries to node closest to centroid
    var node_centroid = 0;
    var min_dist = h*1e6;
    for (var i=0; i<nodes.length; ++i) {
        var dist = norm(subV(nodes[i], center));
        if (dist < min_dist) {
            min_dist = dist;
            node_centroid = i;
        }
    }
    // Fill triangles
    var c_node = 0;
    for (var li=0; li<lines.length; ++li) {
        for (var ti=0; ti<lines[li][2]; ++ti) {
            if (c_node != bound_nodes-1) {
                elements.push([c_node, c_node+1, node_centroid]);
            } else {
                elements.push([c_node, 0, node_centroid]);
            }
            c_node += 1;
        }
    }


    console.log("Computing delaunay triangulation...");
    // Loop over all points and split triangles to include them
    
    for (var i=bound_nodes; i<(nodes.length); ++i) {
        if (i != node_centroid) {
            var ni = nodes[i];
            // Loop over all triangles to check if point is in it
            for (var e=0; e<elements.length; ++e) {
                var nj0 = nodes[elements[e][0]];
                var nj1 = nodes[elements[e][1]];
                var nj2 = nodes[elements[e][2]];
                var intri = PointInTriangle(ni, nj0, nj1, nj2);
                if (intri == 1) {
                    // Element is well inside the triangle
                    var ei = elements[e];

                    var t0 = [ei[0], ei[1], i];
                    var t1 = [ei[1], ei[2], i];
                    var t2 = [ei[2], ei[0], i];

                    t0 = make_anticlockwise(t0, [nodes[t0[0]], nodes[t0[1]], nodes[t0[2]]]);
                    t1 = make_anticlockwise(t1, [nodes[t1[0]], nodes[t1[1]], nodes[t1[2]]]);
                    t2 = make_anticlockwise(t2, [nodes[t2[0]], nodes[t2[1]], nodes[t2[2]]]);

                    // Remove this triangle
                    elements.splice(e, 1, t0, t1, t2);
                    // Add three triangles

                    // Flip algorithm
                    [elements, n_flips] = flip_elements(nodes, elements);

                    e = elements.length;
                }
            }
        }
    }

    // Smooth mesh
    console.log("Smoothing mesh...")
    var dp = []
    var n_connected = [];
    for (var i=0; i<nodes.length; ++i) {
        dp.push([0., 0.]);
        n_connected.push(0);
    }
    for (var i=0; i<elements.length; ++i) {
        var e = elements[i];
        n_connected[e[0]] += 3;
        n_connected[e[1]] += 3;
        n_connected[e[2]] += 3;
    }
    for (var step=0; step<4; ++step) {
        for (var i=0; i<nodes.length; ++i) {
            dp[i][0] = 0.;
            dp[i][1] = 0.;
            n_connected[i] = 0;
        }
        for (var i=0; i<elements.length; ++i) {
            var e = elements[i];
            n_connected[e[0]] += 3;
            n_connected[e[1]] += 3;
            n_connected[e[2]] += 3;
        }
        for (var i=0; i<elements.length; ++i) {
            var e = elements[i];
            var ns = [
                nodes[e[0]], nodes[e[1]], nodes[e[2]]
            ];
            for (var j=0; j<ns.length; ++j) {
                for (var k=0; k<ns.length; ++k) {
                    dp[e[j]] = addV(dp[e[j]], multV(ns[k], 1/(n_connected[e[j]])));
                }
            }
        }
        for (var i=bound_nodes; i<nodes.length; ++i) {
            nodes[i][0] = dp[i][0];
            nodes[i][1] = dp[i][1];
        }

        [elements, n_flips] = flip_elements(nodes, elements);

    }
    
    


    var mesh = {
        "nodes":nodes,
        "elements":elements,
        "bounds":bounds
    };
    return mesh;
}


function gen_datasets(mesh) {
    datasets = [];
    for (var i=0; i<mesh["elements"].length; ++i) {
        var n0 = mesh["nodes"][mesh["elements"][i][0]];
        var n1 = mesh["nodes"][mesh["elements"][i][1]];
        var n2 = mesh["nodes"][mesh["elements"][i][2]];
        datasets.push({
            borderColor: "rgba(225, 225, 225, 1)",
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

