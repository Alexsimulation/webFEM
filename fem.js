

function grad(f) {
    function gf(x) {
        return (f(x+1e-5) - f(x-1e-5))/2e-5;
    }
    return gf;
}
function dot(a, b) {
    function d_ab(x) {
        return a(x)*b(x);
    }
    return d_ab;
}

function add(a, b) {
    function d_ab(x) {
        return a(x) + b(x);
    }
    return d_ab;
}

function sub(a, b) {
    function d_ab(x) {
        return a(x) - b(x);
    }
    return d_ab;
}


function integrate(f, x0, x1) {
    var k0 = (x1 - x0)/2;
    var k1 = (x0 + x1)/2;
    var dk = (x1 - x0)/2;

    var t = [-0.57735, 0.57735];
    var w = [1., 1.];
    var L = 0.;
    for (var i=0; i<t.length; ++i) {
        L += f(k0*t[i] + k1)*dk*w[i];
    }
    return L;
}

function eval_weak(phi0, phi1, x0, x1, bilinear, linear) {
    function constant(x) {
        function f_(t) { return x; }
        return f_;
    }

    var u = phi0; var v = phi0;
    var b = 0.;
    eval("b = " + bilinear);
    b00 = integrate(b, x0, x1);

    var u = phi0; var v = phi1;
    var b = 0.;
    eval("b = " + bilinear);
    b01 = integrate(b, x0, x1);

    var u = phi1; var v = phi0;
    var b = 0.;
    eval("b = " + bilinear);
    b10 = integrate(b, x0, x1);

    var u = phi1; var v = phi1;
    var b = 0.;
    eval("b = " + bilinear);
    b11 = integrate(b, x0, x1);

    var v = phi0;
    var l = 0.;
    eval ("l = " + linear);
    l0 = integrate(l, x0, x1)

    var v = phi1;
    var l = 0.;
    eval ("l = " + linear);
    l1 = integrate(l, x0, x1)
    return {b00, b01, b10, b11, l0, l1};
}


function linspace(v0, v1, n) {
    var arr = [];
    var step = (v1 - v0)/(n - 1);
    for (var i=0; i<n; ++i) {
        arr.push(v0 + (step*i));
    }
    return arr;
}

function zeros(n) {
    var arr = [];
    for (var i=0; i<n; ++i) {
        arr.push(0.);
    }
    return arr;
}


function setRow(A, k, v) {
    var s = A.size();
    for (var i=0; i<s[1]; ++i) {
        A.set([k, i], v);
    }
    return A;
}


function gen_system() {

    //var bilinear = "dot(grad(u), grad(v))";
    //var linear = "dot(constant(1.), v)";

    var [bilinear, linear, bc0, bc1] = getWriteBoxText();

    function phi0(t) {
        return (1 - t)/2;
    }
    function phi1(t) {
        return (1 + t)/2;
    }

    var N = 40;
    var x = linspace(0, 1, N);
    var A = math.zeros(N, N);
    var b = math.zeros(N);
    

    for (var i=0; i<x.length-1; ++i) {
        // Fill matrix
        var x0 = x[i];
        var x1 = x[i+1];
        var h = x1 - x0;

        function tf(x) {
            return 2.*(x - x0)/(x1 - x0) - 1.;
        }

        function phi0x(x) { return phi0(tf(x)); }
        function phi1x(x) { return phi1(tf(x)); }

        var {
            b00, b01,
            b10, b11,
        l0, l1} = eval_weak(phi0x, phi1x, x0, x1, bilinear, linear);

        A.set([i, i], A.get([i, i]) + b00);
        A.set([i, i+1], A.get([i, i+1]) + b01);
        A.set([i+1, i], A.get([i+1, i]) + b10);
        A.set([i+1, i+1], A.get([i+1, i+1]) + b11);

        b.set([i], b.get([i]) + l0);
        b.set([i+1], b.get([i+1]) + l1);
    }

    // Apply BCs
    type = '';
    value = 0.;
    eval(bc0);
    if (type == 'dirichlet') {
        A = setRow(A, 0, 0.);
        A.set([0, 0], 1.);
        b.set([0], value);
    }

    type = '';
    value = 0.;
    eval(bc1);
    if (type == 'dirichlet') {
        i = math.size(A).toArray()[0] - 1;
        A = setRow(A, i, 0.);
        A.set([i, i], 1.);
        b.set([i], value);
    }

    var u = math.multiply(math.inv(A), b);

    var ua = u.toArray();

    return [x, ua];
}


