// Canvas Set Up
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// Variables
const pi = Math.PI;
const qtCapacity = 4;
const creaturesArray = [];
let foundCreatures = [];
let logCreaturesFound = false;
let frameLoop = true;

// Mouse position variable
const mouse = {
    x: undefined,
    y: undefined
}

// Declaration of Initial Classes
let boundary = new Boundary(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height);
let mouseArea = new Boundary(canvas.width / 2 - 28, canvas.height / 2 - 50, 50, 50);
let qtree = new Quadtree(boundary, qtCapacity);

addEventListener('resize', function () {
    // Takes the new width and height due to resizing
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    // Updates the boundary sizes of the Quadtree
    boundary = new Boundary(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height)
    qtree = new Quadtree(boundary, qtCapacity);
});

addEventListener('click', function (event) {
    // Takes the current mouse position to the location of the click
    mouse.x = event.x;
    mouse.y = event.y;

    for (let i = 0; i < 5; i++){
        // Creates 5 new creatures for every click
        creaturesArray.push(new Creature(new Vector(rand(1, 2), rand(0, 2*pi))));
    }
});

addEventListener('mousemove', function (event) {
    // Updates the location of the green box ( For Observation )
    mouseArea = new Boundary(event.x, event.y, 50, 50);
});

document.addEventListener('keypress', (event) => {
    // Controls the Simulation during Runtime
    if (event.key == 'h') frameLoop = !frameLoop;
    else if (event.key == 'r') logCreaturesFound = !logCreaturesFound;
}, false);

let handleCreatures = function () {
    // Execution of functions for every creature that exists
    for (let creature of creaturesArray) {
        qtree.insert(creature);
    }
    // Checks the neighbors of every creature
    for (let creature of creaturesArray) {
        if (frameLoop) {
            creature.detectInRange(qtree, creature);
            creature.enableCohesion();
            creature.enableAlignment();
            creature.enableSeparation(creature);
            creature.checkBorders();
            creature.updatePosition();
        }
        creature.draw();
        creature.showSightRange();
        // creature.showBoundingBox();
    }
}

let showDebuggerMouse = function (mouseArea) {
    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,125,0,0.1)';
    ctx.strokeStyle = 'green';
    ctx.moveTo(mouseArea.x - mouseArea.w / 2, mouseArea.y - mouseArea.h / 2);
    ctx.lineTo(mouseArea.x + mouseArea.w / 2, mouseArea.y - mouseArea.h / 2);
    ctx.lineTo(mouseArea.x + mouseArea.w / 2, mouseArea.y + mouseArea.h / 2);
    ctx.lineTo(mouseArea.x - mouseArea.w / 2, mouseArea.y + mouseArea.h / 2);
    ctx.closePath()
    ctx.stroke();
}

let animate = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    qtree = new Quadtree(boundary, qtCapacity);

    handleCreatures();
    showDebuggerMouse(mouseArea);
    let foundCreatures = qtree.query(mouseArea);

    if (logCreaturesFound && foundCreatures.length > 0) console.log(foundCreatures[0].seenCreatures);
    // qtree.display();
    qtree.clear();
    requestAnimationFrame(animate);
}

animate();
