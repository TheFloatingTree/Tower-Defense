class Map {
    constructor() {
        this.dim = { w: mapAreaSize.width, h: mapAreaSize.height };
        this.points = [
            { x: 20, y: this.dim.h / 4 },
            { x: this.dim.w / 2, y: this.dim.h / 4 },
            { x: this.dim.w / 2, y: (this.dim.h / 4) * 3 },
            { x: this.dim.w - 20, y: (this.dim.h / 4) * 3 }
        ];

        this.trackLineWidth = 2;

        this.drawTrack();
        this.drawPlaceAreas();
    }

    drawTrack() {
        let offset = this.trackLineWidth/2;
        for (let i = 0; i < this.points.length - 1; i++) {
            let line = two.makeLine(this.points[i].x, this.points[i].y, this.points[i + 1].x, this.points[i + 1].y);
            line.linewidth = this.trackLineWidth;
            line.stroke = "red";
        }
        let startpoint = two.makeCircle(this.points[0].x, this.points[0].y, 10);
        startpoint.noStroke();
        startpoint.fill = "red";
        let endpoint = two.makeCircle(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y, 10);
        endpoint.noStroke();
        endpoint.fill = "red";
    }

    drawPlaceAreas() {
        let scaleOffset = 20;
        let color = "blue";
        let opacity = 0.2;

        this.area1 = {
            h: (Math.abs(this.points[0].y - this.points[this.points.length - 1].y)) - scaleOffset, 
            w: ((this.dim.w / 2) - 20) - scaleOffset, 
            x: this.dim.w / 4 + 10 - scaleOffset / 2, 
            y: this.dim.h / 2 + scaleOffset / 2 
        };

        this.area2 = {
            h: (Math.abs(this.points[0].y - this.points[this.points.length - 1].y)) - scaleOffset, 
            w: ((this.dim.w / 2) - 20) - scaleOffset, 
            x: (((this.dim.w / 4) * 3) - 10) + (scaleOffset / 2), 
            y: this.dim.h / 2 - (scaleOffset / 2) 
        };

        let area1Shape = two.makeRectangle(this.area1.x, this.area1.y, this.area1.w, this.area1.h);
        area1Shape.noStroke();
        area1Shape.fill = color;
        area1Shape.opacity = opacity;

        let area2Shape = two.makeRectangle(this.area2.x, this.area2.y, this.area2.w, this.area2.h);
        area2Shape.noStroke();
        area2Shape.fill = color;
        area2Shape.opacity = opacity;
    }

    update() {

    }
}