let rand = function (minRange, maxRange) { return Math.random() * (maxRange - minRange) + minRange }

let rad = function (angle) { return angle * pi / 180 } 
let angl = function (radian) { return radian * 180 / pi }

let dist = function (pos1, pos2) { return Math.sqrt((pos2.x-pos1.x)*(pos2.x-pos1.x) + (pos2.y-pos1.y)*(pos2.y-pos1.y)) }
let hyp = function (xComponent, yComponent) { return Math.sqrt(xComponent * xComponent + yComponent * yComponent) }

let atann = function (xComponent, yComponent) {
    let temp = Math.atan2(yComponent, xComponent);
    
    if (temp < 0) return temp = pi + Math.abs(pi + temp);
    return temp;
}
let angleBetween = function (pos1, pos2) {
    return atann((pos2.x - pos1.x), (pos2.y - pos1.y));
}

class Vector {
    constructor(magnitude, angle) {
        this.magnitude = magnitude;
        this.angle = angle;
        this.x = magnitude * Math.cos(this.angle),
        this.y = magnitude * Math.sin(this.angle)
    }

    subtract(vector) {
        let x = this.x - vector.x;
        let y = this.y - vector.y;
        return new Vector(hyp(x, y), atann(x, y));
    }
    
    add(vector) {
        let x = this.x + vector.x;
        let y = this.y + vector.y;
        return new Vector(hyp(x, y), atann(x, y));
    }

    update() {
        this.x = this.magnitude * Math.cos(this.angle);
        this.y = this.magnitude * Math.sin(this.angle);
    }

    show(location) {
        ctx.strokeStyle = 'white';
        ctx.strokeWeight = 5;
        ctx.beginPath();

        ctx.moveTo(location.x, location.y);
        ctx.lineTo(location.x+this.x*50, location.y+this.y*50);
        ctx.stroke();
    }
}

class Boundary{
    constructor(x, y, w, h) {
        this.x = x,
        this.y = y,
        this.w = w,
        this.h = h
    }

    intersects(boundary) {
        return !(this.x - this.w > boundary.x + boundary.w
            || this.x + this.w < boundary.x - boundary.w
            || this.y - this.h > boundary.y + boundary.h
            || this.y + this.h < boundary.y - boundary.h);
    }
}