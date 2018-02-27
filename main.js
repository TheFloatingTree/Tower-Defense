//TOWER DEFENSE
//Jacob Perry
//1,600 lines of code 2/26/2018

//Global Variables
var enemies = [];
var towers = [];

//get HTML element
const elem = document.getElementById('content');

//setup and start Two.js
const params = { width: window.innerWidth - 4, height: window.innerHeight - 4};
const two = new Two(params).appendTo(elem);

let background = two.makeRectangle(params.width/2, params.height/2, params.width, params.height);
background.fill = 'darkgrey';
background.noStroke();

const mapAreaSize = {
    width: params.width - 400,
    height: (params.width - 400) * (3/4)
};

let mapArea = two.makeRectangle(mapAreaSize.width/2, mapAreaSize.height/2, mapAreaSize.width, mapAreaSize.height);
mapArea.fill = 'white';
mapArea.noStroke();

//Create managers
var map = new Map();
var game = new Game();
var enemy = new Enemy();
var tower = new Tower();
var gui = new Interface();

//Update
two.bind('update', function(frameCount) {
    //UPDATES
    gui.update();
    tower.update();
    enemy.update();
    game.waveManager.update();
    map.update();

    //GAMEPLAY
    //spawn enemies
    // if (frameCount % 100 === 0) {
    //     enemies.push(new BasicEnemy());
    // }
}).play();