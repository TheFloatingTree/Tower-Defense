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


// draw tracking rect at xy
function getLineXYatPercent(startPt, endPt, percent) {
    let dx = endPt.x - startPt.x;
    let dy = endPt.y - startPt.y;
    let X = startPt.x + dx * percent;
    let Y = startPt.y + dy * percent;
    return ({
        x: X,
        y: Y
    });
}

// quadratic bezier: percent is 0-1
function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    let x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
    let y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
    return ({
        x: x,
        y: y
    });
}

// cubic bezier percent is 0-1
function getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
    let x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    let y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return ({
        x: x,
        y: y
    });
}

// cubic helper formula at percent distance
function CubicN(pct, a, b, c, d) {
    let t2 = pct * pct;
    let t3 = t2 * pct;
    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
}