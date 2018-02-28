var mpos = {x: 0, y:0, b:0, xd: 0, yd: 0};

$( "#content" ).mousemove(function( event ) {
    mpos.xd = mpos.x - event.pageX;
    mpos.yd = mpos.y - event.pageY;

    mpos.xd = -mpos.xd;
    mpos.yd = -mpos.yd;

    mpos.x = event.pageX;
    mpos.y = event.pageY;
});

$( "#content" ).mousedown(function( event ) {
    mpos.b = 1;
});

$( "#content" ).mouseup(function( event ) {
    mpos.b = 0;
});

function collision(x1, y1, r1, x2, y2, r2) {
    let dist = distance(x1, y1, x2, y2);
    
    if (dist < r1 + r2) {
        return true;
    } else {
        return false;
    }
}

function collision2(x1, y1, w1, h1, x2, y2, w2, h2) {
    if ((Math.abs(x1 - x2) * 2 < (w1 + w2)) && (Math.abs(y1 - y2) * 2 < (h1 + h2))) {
        return true;
    } else {
        return false;
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
  }

function distance(x1, y1, x2, y2) {
    let a = x1 - x2
    let b = y1 - y2

    return Math.sqrt( a*a + b*b );
}

function getAngle(x1, y1, x2, y2) {
    let dy = y2 - y1;
    let dx = x2 - x1;

    return Math.atan2(dy, dx);
}

function getVector(x1, y1, x2, y2) {
        let x = x1 - x2;
        let y = y1 - y2;

        if (x === 0 && y === 0) {
            return {x: x, y: y};
        }

        let hyp = Math.sqrt(x * x + y * y);

        x /= hyp;
        y /= hyp;

        return {x: -x, y: -y};
}