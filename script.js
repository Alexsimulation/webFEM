function getWriteBoxText() {
    var b = document.getElementById("bilinear").value;
    var l = document.getElementById("linear").value;
    var bc0 = document.getElementById("bc-left").value;
    var bc1 = document.getElementById("bc-right").value;
    return [b, l, bc0, bc1];
}


function updateWriteBox() {
    updatePlot();
}


function onTestChange() {
    var event = window.event;
    var key = event.keyCode;

    // If the user has pressed enter
    if ((key === 13) && (event.shiftKey)) {
        updateWriteBox();
        event.preventDefault();
        return false;
    }
    else {
        return true;
    }
}

