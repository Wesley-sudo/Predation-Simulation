class Creature {
    constructor(heading) {
        this.heading = heading;
        this.speedLimit = heading.magnitude;
        this.color = Math.round(rand(0, 1));
        this.size = 1/heading.magnitude;
        this.sight = {
            span: rand(0.4363, pi - 0.2),
            radius: undefined
        }    
        this.sight.radius = 75 * this.sight.span;
        this.position = {
            x: mouse.x + rand(-50, 50),
            y: mouse.y + rand(-50, 50)
            
            // x: rand(0, canvas.width),
            // y: rand(0, canvas.height)
        }
        this.boundingBox = new Boundary(this.position.x + 10 * Math.cos(this.heading.angle),
                                        this.position.y + 10 * Math.sin(this.heading.angle),
                                        this.sight.radius * 2, this.sight.radius * 2);
        this.creaturesInRange = [];
        this.seenCreatures = [];
    }

    detectInRange(qtree, creatureData) {
        this.creaturesInRange = [];
        
        // Get's the list of Creatures within range
        this.creaturesInRange = qtree.query(this.boundingBox);
        if (!this.creaturesInRange.length) return;
        this.seenCreatures = [];

        for (let creature of this.creaturesInRange) {
            // Checks every creature that is detectable by sight radius
            if (creatureData !== creature && dist(creatureData.position, creature.position) < creatureData.sight.radius) {
                let leftView = creatureData.heading.angle - (pi - creatureData.sight.span);
                if (leftView <= -360) leftView += 360;
                
                let rightView = creatureData.heading.angle + (pi - creatureData.sight.span);
                if (rightView >= 360) rightView -= 360;
                
                // Add the creature to the list if it's within the sight span
                if (angleBetween(creatureData.position, creature.position) > leftView &&
                    angleBetween(creatureData.position, creature.position) < rightView) {
                        this.seenCreatures.push(creature);
                    }
            }
        }
    }

    enableSeparation(creatureData) {
        if (!this.creaturesInRange.length) return;

        // Using inverse square law for the distance from nearby creatures
        for (let creature of this.creaturesInRange) {
            if (creatureData !== creature) {
                this.heading = this.heading.subtract(new Vector(20/Math.pow(dist(this.position, creature.position),2), angleBetween(this.position, creature.position)));
            }
        }
    }

    enableCohesion() {
        if (!this.seenCreatures.length) return;
        let groupAverageX = 0;
        let groupAverageY = 0;

        for (let creature of this.seenCreatures) {
            if (this.color === creature.color) {
                // Get the average position of a group of creatures
                groupAverageX += creature.position.x;
                groupAverageY += creature.position.y;
            }
        }
        let localPosition = {
            x: groupAverageX,
            y: groupAverageY
        }
        // Move towards the average position
        this.heading = this.heading.add(new Vector(0.05, angleBetween(this.position, localPosition)));
    }

    enableAlignment() {
        if (!this.seenCreatures.length) return;
        let groupAverageHeading = 0;

        for (let creature of this.seenCreatures) {
            if (this.color === creature.color) {
                // Get the average heading angle of the group
                groupAverageHeading += creature.heading.angle;
            }
        }
        // Rotate heading with according to the heading of the group
        this.heading = this.heading.add(new Vector(0.05, groupAverageHeading));
    }

    checkBorders() {
        if (this.position.x < 0)                this.position.x = canvas.width;
        if (this.position.x > canvas.width)     this.position.x = 0;
        if (this.position.y < 0)                this.position.y = canvas.height;
        if (this.position.y > canvas.height)    this.position.y = 0;

        if (this.position.x < 10)                   this.heading = this.heading.add(new Vector(0.2, rad(0)));
        if (this.position.x > canvas.width - 10)    this.heading = this.heading.add(new Vector(0.2, rad(180)));
        if (this.position.y < 10)                   this.heading = this.heading.add(new Vector(0.2, rad(90)));
        if (this.position.y > canvas.height - 10)   this.heading = this.heading.add(new Vector(0.2, rad(-90)));
    }

    updatePosition() {
        if (this.heading.magnitude > this.speedLimit) {
            // Speed limit depends on their size
            this.heading.magnitude = this.speedLimit;
            // Updates the x and y of the heading vector
        }
        this.position.x += this.heading.magnitude * Math.cos(this.heading.angle);
        this.position.y += this.heading.magnitude * Math.sin(this.heading.angle);

        this.heading.update();

        this.boundingBox = new Boundary(this.position.x + 10 * Math.cos(this.heading.angle),
                                        this.position.y + 10 * Math.sin(this.heading.angle),
                                        this.sight.radius * 2, this.sight.radius * 2);
    }

    draw() {
        ctx.strokeStyle = 'green';
        ctx.strokeWeight = 5;
        ctx.beginPath();

        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.position.x + (this.size * 20) * Math.cos(this.heading.angle), this.position.y + (this.size * 20) * Math.sin(this.heading.angle));
        ctx.stroke();

        if (this.color == 1) ctx.fillStyle = 'red';
        else if (this.color == 2) ctx.fillStyle = 'white';
        else ctx.fillStyle = 'blue';

        ctx.moveTo(this.position.x + (this.size * 15) * Math.cos(this.heading.angle), this.position.y + (this.size * 15) * Math.sin(this.heading.angle));
        ctx.lineTo(this.position.x + (this.size * 10) * Math.cos(this.heading.angle - 2.2689), this.position.y + (this.size * 10) * Math.sin(this.heading.angle - 2.2689));
        ctx.lineTo(this.position.x + (this.size * 10) * Math.cos(this.heading.angle - 4.0143), this.position.y + (this.size * 10) * Math.sin(this.heading.angle - 4.0143));
        ctx.fill();
    }

    showSightRange() {
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.moveTo(this.position.x + 10 * Math.cos(this.heading.angle), this.position.y + 10 * Math.sin(this.heading.angle));
        ctx.arc(this.position.x + 10 * Math.cos(this.heading.angle), this.position.y + 10 * Math.sin(this.heading.angle), this.sight.radius, this.heading.angle - pi + this.sight.span, this.heading.angle + pi - this.sight.span, false);
        ctx.fill();
    }

    showBoundingBox() {
        ctx.strokeStyle = 'rgba(0,255,0,0.25)';
        ctx.strokeWeight = 5;
        ctx.beginPath();
        ctx.moveTo(this.boundingBox.x - this.boundingBox.w/2, this.boundingBox.y - this.boundingBox.h/2);
        ctx.lineTo(this.boundingBox.x + this.boundingBox.w/2, this.boundingBox.y - this.boundingBox.h/2);
        ctx.lineTo(this.boundingBox.x + this.boundingBox.w/2, this.boundingBox.y + this.boundingBox.h/2);
        ctx.lineTo(this.boundingBox.x - this.boundingBox.w/2, this.boundingBox.y + this.boundingBox.h/2);
        ctx.closePath();
        ctx.stroke();
    }
}

