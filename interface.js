class Interface {
    constructor() {
        //This is the main interface display that will be shown at all times.

        //EDITABLE
        this.width = 400;
        this.height = params.height;
        this.pos = {
            x: params.width - (this.width/2),
            y: this.height/2
        };

        //DONT TOUCH
        this.elements = [];
        this.clickflag = false;
        this.focusTower;

        //backing
        this.backing = two.makeRectangle(this.pos.x, this.pos.y, this.width, params.height);
        this.backing.fill = 'darkgrey';
        this.backing.noStroke();

        //header
        this.headerheight = 90;
        this.header = two.makeRectangle(this.pos.x, this.pos.y - (params.height / 2) + (this.headerheight / 2), this.width, this.headerheight);
        this.header.fill = 'grey';
        this.header.noStroke();

        //text
        this.moneyText = two.makeText("moneyText", this.pos.x - (this.width / 2) + 20, 30);
        this.moneyText.size = 20;
        this.moneyText.alignment = 'left';
        this.moneyText.fill = 'white';

        this.waveText = two.makeText("waveText", this.pos.x - (this.width / 2) + 260, 30);
        this.waveText.size = 20;
        this.waveText.alignment = 'left';
        this.waveText.fill = 'white';

        this.healthText = two.makeText("healthText", this.pos.x - (this.width / 2) + 20, 60);
        this.healthText.size = 20;
        this.healthText.alignment = 'left';
        this.healthText.fill = 'white';

        this.createMainViewElements();
    }
    
    updateInterfaceElements() {
        for (let i = this.elements.length - 1; i >= 0; i--) {
            this.elements[i].update();
        }
    }

    click() {
        if (mpos.b === 1) {
            this.clickflag = true;
        }
        
        if (this.clickflag && mpos.b === 0) {
            let arrayLen = this.elements.length;
            for (let i = 0; arrayLen > i; i++) {
                if (this.elements[i] === undefined) {
                    return;
                }
                if (collision2(mpos.x,mpos.y,1,1,this.elements[i].pos.x,this.elements[i].pos.y,this.elements[i].boundingw,this.elements[i].boundingh)) {
                    switch (this.elements[i].type) {
                        //ADD BUTTON FUNCTION
                        case "TowerButton":
                            towers.push(tower.spawnTower(this.elements[i].towerID, mpos.x, mpos.y, true, true));
                            break;
                        case "ToggleRange":
                            tower.toggleRangeOverlay();
                            break;
                        case "ToggleTargeting":
                            this.elements[i].text.value = capitalizeFirstLetter(tower.toggleTargeting(this.focusTower));
                            break;
                        case "SwitchViewToContext":
                            this.switchView(1);
                            break;
                        case "SwitchViewToMain":
                            this.switchView(0);
                            break;
                        case "NextWave":
                            game.skipReward();
                            game.waveManager.incrementWave();
                            game.waveManager.startCountdown();
                            break;
                        case "SellTower":
                            tower.sellTower(this.focusTower);
                            this.switchView(0);
                            break;
                        case "UpgradeRange":
                            this.focusTower.upgrade(0);
                            break;
                        case "UpgradeSpeed":
                            this.focusTower.upgrade(1);
                            break;
                        case "UpgradeDamage":
                            this.focusTower.upgrade(2);
                            break;
                        case "Null":
                            break;
                        default:
                            console.log("clicked!");
                    }
                } 
            }

            this.clickflag = false;
        }
    }

    switchView(view) {
        this.unloadAllElements();
        switch(view) {
            case 0: 
                this.createMainViewElements();
                break;
            case 1: 
                this.createContextViewElements();
                break;
            default:
                this.createMainViewElements();
        }
    }

    hover() {
        for (let i = 0; this.elements.length > i; i++) {
            if (this.elements[i].type !== "Null") {
                if (collision2(mpos.x,mpos.y,1,1,this.elements[i].pos.x,this.elements[i].pos.y,this.elements[i].boundingw,this.elements[i].boundingh)) {
                    this.elements[i].backing.fill = 'white'; //TODO, change all colors to hex or rgb, and just highlight instead of full white.
                } else {
                    this.elements[i].backing.fill = this.elements[i].backingColor; 
                }
            };
        }
    }

    update() {
        //check for mouse events
        this.click();
        this.hover();

        //update interface elements
        this.updateInterfaceElements();

        //update text
        this.moneyText.value = "Money: $" + game.money;
        this.healthText.value = "Health: " + game.health;
        this.waveText.value = "Wave: " + game.waveManager.wave + " of " + game.waveManager.waveObjects.length;
    }

    createMainViewElements() {
        //ADD INTERFACE BUTTONS
        let ie1 = new TowerButton(this.pos.x - (this.width/2) + 70, this.pos.y - (this.height/2) + this.headerheight + 70, 0);
        this.elements.push(ie1);
        let ie2 = new TowerButton(this.pos.x, this.pos.y - (this.height/2) + this.headerheight + 70, 1);
        this.elements.push(ie2);
        let ie3 = new TowerButton(this.pos.x + (this.width/2) - 70, this.pos.y - (this.height/2) + this.headerheight + 70, 2);
        this.elements.push(ie3);
        let ie4 = new Button("Toggle Range", "ToggleRange", this.pos.x - (this.width/2) + 80, this.pos.y - (this.height/2) + this.headerheight + 200, 120, 50);
        this.elements.push(ie4);
        let ie5 = new Button("Next Wave", "NextWave", this.pos.x - (this.width/2) + 80, mapAreaSize.height - 25, 120, 50, 'blue');
        this.elements.push(ie5);

        this.elements[4].updateFunction = function () {
            if (!game.waveManager.fullyDone || game.waveManager.countdown > 0) {
                this.text.value = game.waveManager.countdown;
                if (game.waveManager.fullyDone) {
                    this.text.value = "Skip? " + game.waveManager.countdown;
                    game.skipFlag = true;
                }
            } else {
                this.text.value = "Start";
            }

            if (game.waveManager.gameEnd) {
                this.text.value = "End";
            }
        }
        // let ie5 = new Button("Oldest", "ToggleTargeting", this.pos.x - (this.width/2) + 80, this.pos.y - (this.height/2) + this.headerheight + 260, 120, 50);
        // this.elements.push(ie5);
        // let ie6 = new Button("Switch View", "SwitchViewToContext", this.pos.x - (this.width/2) + 80, this.pos.y - (this.height/2) + this.headerheight + 320, 120, 50);
        // this.elements.push(ie6);
    }
    
    createContextViewElements() {
        //ADD INTERFACE BUTTONS
        // let ie1 = new TowerButton(this.pos.x, this.pos.y - (this.height/2) + this.headerheight + 55, gui.width - 50, 0);
        // this.elements.push(ie1);
        let g1Off = {
            x: 7,
            y: 20
        }

        let ie1 = new Title("Title", "Null", this.pos.x - (this.width/2) + 130, this.pos.y - (this.height/2) + this.headerheight + 106, 23);
        this.elements.push(ie1);
        let ie2 = new Button("Range", "UpgradeRange", g1Off.x + this.pos.x - (this.width/2) + 80, g1Off.y + this.pos.y - (this.height/2) + this.headerheight + 200, 120, 50);
        this.elements.push(ie2);
        let ie3 = new Button("Speed", "UpgradeSpeed", g1Off.x + this.pos.x - (this.width/2) + 80, g1Off.y + this.pos.y - (this.height/2) + this.headerheight + 260, 120, 50);
        this.elements.push(ie3);
        let ie4 = new Button("Damage", "UpgradeDamage", g1Off.x + this.pos.x - (this.width/2) + 220, g1Off.y + this.pos.y - (this.height/2) + this.headerheight + 200, 120, 50);
        this.elements.push(ie4);
        let ie5 = new Button("Null", "Upgrade4", g1Off.x + this.pos.x - (this.width/2) + 220, g1Off.y + this.pos.y - (this.height/2) + this.headerheight + 260, 120, 50);
        this.elements.push(ie5);
        let ie6 = new Button("Sell", "SellTower", g1Off.x + this.pos.x - (this.width/2) + 80, g1Off.y + this.pos.y - (this.height/2) + this.headerheight + 320, 120, 50, 'red');
        this.elements.push(ie6);
        let ie7 = new Button("Back", "SwitchViewToMain", g1Off.x + this.pos.x - (this.width/2) + 80, g1Off.y + this.pos.y - (this.height/2) + this.headerheight + 440, 120, 50);
        this.elements.push(ie7);
        let ie8 = new Button("Oldest", "ToggleTargeting", g1Off.x + this.pos.x - (this.width/2) + 220, g1Off.y + this.pos.y - (this.height/2) + this.headerheight + 320, 120, 50, 'blue');
        this.elements.push(ie8);
        let ie9 = new Title("Damage", "Null", this.pos.x - (this.width/2) + 27, this.pos.y - (this.height/2) + this.headerheight + 135, 15);
        this.elements.push(ie9);
        let ie10 = new Title("ShootSpeed", "Null", this.pos.x - (this.width/2) + 27, this.pos.y - (this.height/2) + this.headerheight + 155, 15);
        this.elements.push(ie10);
        let ie11 = new Title("Range", "Null", this.pos.x - (this.width/2) + 27, this.pos.y - (this.height/2) + this.headerheight + 175, 15);
        this.elements.push(ie11);
    }

    loadInfoIntoContextView(obj) {
        this.focusTower = obj;

        let displayTower = new DisplayCaseTower(this.pos.x - (this.width/2) + 70, this.pos.y - (this.height/2) + this.headerheight + 70, this.focusTower.towerID);
        this.elements.push(displayTower);

        gui.elements[1].updateFunction = function () {
            this.text.value = "Range $" + gui.focusTower.upgradePrices.range;
        }

        gui.elements[2].updateFunction = function () {
            this.text.value = "Speed $" + gui.focusTower.upgradePrices.speed;
        }

        gui.elements[3].updateFunction = function () {
            this.text.value = "Damage $" + gui.focusTower.upgradePrices.damage;
        }

        gui.elements[5].updateFunction = function () {
            this.text.value = "Sell $" + Math.floor(gui.focusTower.price * 0.5);
        }

        gui.elements[8].updateFunction = function () {
            this.text.value = "Damage: " + gui.focusTower.damage;
        }

        gui.elements[9].updateFunction = function () {
            this.text.value = "ShootSpeed: " + gui.focusTower.shootSpeed;
        }

        gui.elements[10].updateFunction = function () {
            this.text.value = "Range: " + gui.focusTower.range;
        }

        gui.elements[0].text.value = tower.friendlyTowerNames(this.focusTower.towerID);
        gui.elements[7].text.value = capitalizeFirstLetter(this.focusTower.targeting);
    }

    unloadAllElements() {
        for (let i = this.elements.length - 1; i >= 0; i--) {
            this.elements[i].delete();
        }
        this.elements = [];
    }
}


class TowerButton {
    constructor(x, y, towerID) {
        //This creates the buttons that let you buy and place towers.

        //EDITABLE
        this.boundingw = 85;
        this.boundingh = 85;

        //DONT TOUCH
        this.pos = {x: x, y: y};
        this.type = "TowerButton";
        this.towerID = towerID;

        //Create backing & tower
        this.backing = two.makeRectangle(this.pos.x, this.pos.y, this.boundingw, this.boundingh);
        //SUPPORTED TOWER TYPES

        this.tower = tower.spawnTower(this.towerID, 0, 0, true, false, false);
        
        //beautify backing
        this.backingColor = 'grey';
        this.backing.fill = this.backingColor;
        this.backing.noStroke();

        //beautify display tower
        this.tower.debug = false;
        this.tower.scale = 2;
        this.tower.pos = this.pos;

        //text
        this.priceText = two.makeText("priceText", this.pos.x, this.pos.y + 60);
        this.priceText.fill = 'white';
        this.priceText.size = 15;
        this.priceText.weight = 550;

        this.group = two.makeGroup(this.tower, this.priceText);
    }

    delete() {
        two.remove(this.backing);
        two.remove(this.group);
        two.remove(this.tower.group);
    }

    update() {
        this.tower.update();
        this.priceText.value = "$" + this.tower.price;
    }

}

class DisplayCaseTower {
    constructor(x, y, towerID) {
        //This creates the buttons that let you buy and place towers.

        //EDITABLE
        this.boundingw = 85;
        this.boundingh = 85;

        //DONT TOUCH
        this.pos = {x: x, y: y};
        this.type = "Null";
        this.towerID = towerID;

        //Create backing & tower
        this.backing = two.makeRectangle(this.pos.x, this.pos.y, this.boundingw, this.boundingh);
        //SUPPORTED TOWER TYPES

        this.tower = tower.spawnTower(this.towerID, this.pos.x, this.pos.y, true, false, false);
        
        //beautify backing
        this.backingColor = 'grey';
        this.backing.fill = this.backingColor;
        this.backing.noStroke();

        //beautify display tower
        this.tower.debug = false;
        this.tower.scale = 2;
        this.tower.pos = this.pos;
    }

    delete() {
        two.remove(this.backing);
        two.remove(this.tower.group);
    }

    update() {
        this.tower.update();
    }
}

class Button {
    constructor(text, type, x, y, w, h, color) {
        //this is a standard button.

        //DONT TOUCH
        this.type = type;
        this.pos = {x: x, y: y};
        this.boundingw = w;
        this.boundingh = h;
        this.text = text;

        //create backing
        this.backing = two.makeRectangle(this.pos.x, this.pos.y, this.boundingw, this.boundingh);
        
        //beautify backing
        this.backingColor = color;
        if (this.backingColor === undefined) {
            this.backingColor = 'grey';
        }
        this.backing.fill = this.backingColor;
        this.backing.noStroke();

        //text
        this.text = two.makeText(this.text, this.pos.x, this.pos.y);
        this.text.fill = "white";
        this.text.size = 15;
        this.text.weight = 550;

        this.group = two.makeGroup(this.text);

        this.updateFunction = function() {};
    }

    delete() {
        two.remove(this.backing);
        two.remove(this.group);
    }

    update() {
        this.updateFunction();
    }

}

class Title {
    constructor(text, type, x, y, s) {
        //text

        //DONT TOUCH
        this.type = type;
        this.pos = {x: x, y: y};
        this.textSize = s;
        this.text = text;

        //text
        this.text = two.makeText(this.text, this.pos.x, this.pos.y);
        this.text.fill = "white";
        this.text.size = this.textSize;
        this.text.weight = 550;
        this.text.alignment = 'left'

        this.group = two.makeGroup(this.text);

        this.updateFunction = function() {};
    }

    delete() {
        two.remove(this.group);
    }

    update() {
        this.updateFunction();
    }

}