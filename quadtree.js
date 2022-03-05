class Quadtree{
    constructor(boundary, capacity) {
        this.boundary = boundary,
        this.capacity = capacity || 4,
        this.creaturesContainedList = []
        this.divided = false;
    }

    contains(boundary, creaturePosition) {
        let x = boundary.x;
        let y = boundary.y;
        let w = boundary.w / 2;
        let h = boundary.h / 2;

        // Checks if the creatures position is within the boundary
        return (creaturePosition.x > x - w
            && creaturePosition.x < x + w
            && creaturePosition.y > y - h
            && creaturePosition.y < y + h);
    }

    subdivide() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let nw = new Boundary(x - w / 4, y - h / 4, w / 2, h / 2);
        let ne = new Boundary(x + w / 4, y - h / 4, w / 2, h / 2);
        let se = new Boundary(x - w / 4, y + h / 4, w / 2, h / 2);
        let sw = new Boundary(x + w / 4, y + h / 4, w / 2, h / 2);

        this.northWest = new Quadtree(nw, this.capacity);
        this.northEast = new Quadtree(ne, this.capacity);
        this.southWest = new Quadtree(sw, this.capacity);
        this.southEast = new Quadtree(se, this.capacity);
        this.divided = true;
    }

    insert(creatureData) {
        // Checks if the boundary does not contain a creature
        if (!this.contains(this.boundary, creatureData.position)) return;

        // Adds to the List while container is not full
        if (this.creaturesContainedList.length < this.capacity) {
            this.creaturesContainedList.push(creatureData)
        }
        else {
            // Divides into 4 sections if it has not divided yet
            if (!this.divided) this.subdivide();

            this.northWest.insert(creatureData);
            this.northEast.insert(creatureData);
            this.southWest.insert(creatureData);
            this.southEast.insert(creatureData);
        }
    }

    query(range, foundCreatures) {
        if (!foundCreatures) foundCreatures = [];
        if (!range.intersects(this.boundary)) return;
        
        else {
            for (let creature of this.creaturesContainedList) {
                // Adds the creature to the query if it is within the Area specified
                if (this.contains(range, creature.position)) {
                    foundCreatures.push(creature);
                }
            }
            if (this.divided) {
                this.northWest.query(range, foundCreatures);
                this.northEast.query(range, foundCreatures);
                this.southWest.query(range, foundCreatures);
                this.southEast.query(range, foundCreatures);
            }
        }
        return foundCreatures;
    }

    clear() {
        this.creaturesContainedList = [];
        if (this.divided) {
            this.northWest.clear();
            this.northEast.clear();
            this.southWest.clear();
            this.southEast.clear();
        }
    }

    display() {
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        // ctx.beginPath();
        // ctx.strokeWeight = 2;
        // ctx.moveTo(x, y);
        // ctx.arc(x, y, 5, 0, 2*pi);
        // ctx.fill();
        // ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = 'rgba(0,0,255,1)';
        ctx.strokeStyle = 'white';
        ctx.moveTo(x - w / 2, y - h / 2);
        ctx.lineTo(x + w / 2, y - h / 2);
        ctx.lineTo(x + w / 2, y + h / 2);
        ctx.lineTo(x - w / 2, y + h / 2);
        ctx.closePath()
        ctx.stroke();

        if (this.divided) {
            this.northWest.display();
            this.northEast.display();
            this.southWest.display();
            this.southEast.display();
        }
    }
}