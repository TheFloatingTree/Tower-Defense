// This class contains global methods and variables used by every child Tower class

class Tower {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.rot = 0;

        this.debug = true;
        this.targeting = 'oldest';

        this.startPoint = {
            x: 150,
            y: 150
        };

        this.placeableAreas = [
            map.area1,
            map.area2
        ]

        this.pos = this.startPoint;
    }

    toggleRangeOverlay() {
        if (this.debug) {
            for (let i = towers.length - 1; i >= 0; i--) {
                towers[i].debug = this.debug;
                towers[i].group.remove(towers[i].circle);
                two.remove(towers[i].circle);
            }
            this.debug = !this.debug;
        } else {
            for (let i = towers.length - 1; i >= 0; i--) {
                towers[i].createRangeOverlay();
                towers[i].debug = this.debug;
            }
            this.debug = !this.debug;
        }
    }

    toggleTargeting(obj) {
        let output = "oldest";
            if (obj.targeting === "oldest") {
                obj.targeting = "newest";
                output = "newest";
            } else {
                obj.targeting = "oldest";
                output = "oldest";
            }
        return output;
    }

    spawnTower(type, x, y, interfaceElement, overlayTower, debug) {
        if (type === 0) {
            return new BasicTower(x, y, interfaceElement, overlayTower, debug);
        } else if (type == 1) {
            return new MediumTower(x, y, interfaceElement, overlayTower, debug);
        } else if (type == 2) {
            return new BestTower(x, y, interfaceElement, overlayTower, debug);
        }
    }
    
    friendlyTowerNames(type) {
        if (type === 0) {
            return "Basic";
        } else if (type == 1) {
            return "Sniper";
        } else if (type == 2) {
            return "Machine Gun";
        }
    }

    inRange() {
        let target = enemy.getTarget(this.pos.x, this.pos.y, this.range, this.targeting);

        if (target === 'null') {
            return false;
        }

        let dist = distance(this.pos.x, this.pos.y, target.pos.x, target.pos.y);

        if (dist > this.range) {
            return false;
        }

        return true;
    }

    lookAt() {
        let target = enemy.getTarget(this.pos.x, this.pos.y, this.range, this.targeting);

        if (this.inRange() === false) {
            return;
        }

        this.rot = getAngle(this.pos.x, this.pos.y, target.pos.x, target.pos.y) + 1.6;
    }

    shoot() {
        let target = enemy.getTarget(this.pos.x, this.pos.y, this.range, this.targeting);

        if (this.inRange() === false) {
            return;
        }

        target.health -= this.damage;
    }

    placeTower() {
        if (mpos.b === 1) {
            this.placeflag = true;
        }

        if (this.placeflag && mpos.b === 0 && game.money > 0 && this.checkPlace()) {
            let tempTower = this.spawnTower(this.towerID, mpos.x, mpos.y, false, false, tower.debug);

            if (tempTower.price <= game.money) {
                towers.push(tempTower);
                game.removeMoney(tempTower.price);
                this.cullOverlayTowers();
            } else {
                two.remove(tempTower.group);
            }

            this.placeflag = false;
        }

        if (!this.checkPlace() && this.placeflag && mpos.b === 0) {
            this.cullOverlayTowers();
        }
    }

    averageUpgradePrice(obj) {
        let sum = obj.range + obj.speed + obj.damage;
        return sum / 3;
    }
 
    upgrade(type) {
        switch(type) {
            case 0:
                if (this.upgradePrices.range <= game.money && this.upgradeAmounts.range < 3) {
                    game.removeMoney(this.upgradePrices.range);
                    this.range += 10;
                    this.upgradeAmounts.range++;
                    tower.toggleRangeOverlay();
                    tower.toggleRangeOverlay();
                    this.upgradePrices.range += Math.floor(this.averageUpgradePrice(this.upgradePrices) / 2);
                    this.price += Math.floor(this.averageUpgradePrice(this.upgradePrices) / 2)
                }
                break;
            case 1:
                if (this.shootSpeed > 1 && this.upgradeAmounts.speed < 3) {
                    if (this.upgradePrices.range <= game.money) {
                        game.removeMoney(this.upgradePrices.range);
                        this.shootSpeed -= 1;
                        this.upgradeAmounts.speed++;
                        this.upgradePrices.speed += Math.floor(this.averageUpgradePrice(this.upgradePrices) / 2);
                        this.price += Math.floor(this.averageUpgradePrice(this.upgradePrices) / 2)
                    }
                }
                break;
            case 2:
                if (this.upgradePrices.range <= game.money && this.upgradeAmounts.damage < 3) {
                    game.removeMoney(this.upgradePrices.range);
                    this.damage += 1;
                    this.upgradeAmounts.damage++;
                    this.upgradePrices.damage += Math.floor(this.averageUpgradePrice(this.upgradePrices) / 2);
                    this.price += Math.floor(this.averageUpgradePrice(this.upgradePrices) / 2)
                }
                break;
            default:
                break;
        }
    }

    sellTower(obj) {
        game.addMoney(Math.floor(obj.price * 0.5));

        let i = towers.indexOf(obj);
        two.remove(towers[i].group);
        two.remove(towers[i].circle);
        towers.splice(i, 1);
    }

    checkPlace() {
        let output;
        for (let i = 0; i < this.placeableAreas.length; i++) {
            if (collision2(this.placeableAreas[i].x, this.placeableAreas[i].y, this.placeableAreas[i].w, this.placeableAreas[i].h, mpos.x, mpos.y, 1, 1)) {
                return true;
            }
        }
        return false;
    }

    cullOverlayTowers() {
        for (let i = towers.length - 1; i >= 0; i--) {
            if (towers[i].overlayTower) {
                two.remove(towers[i].group);
                towers.splice(i, 1);
            }
        }
    }

    click() {
        if (mpos.b === 1) {
            this.clickflag = true;
        }
        
        if (this.clickflag && mpos.b === 0) {
            let arrayLen = towers.length;
            if (arrayLen === 0) {
                this.clickflag = false;
                return; 
            } 

            for (let i = 0; arrayLen > i; i++) {
                if (!towers[i].overlayTower && !towers[i].interfaceElement && collision2(mpos.x,mpos.y,1,1,towers[i].pos.x,towers[i].pos.y,towers[i].size*3,towers[i].size*3)) {
                    gui.switchView(1);
                    gui.loadInfoIntoContextView(towers[i]);
                } 
            }

            this.clickflag = false;
        }
    }

    update() {
        this.click();

        for (let i = towers.length - 1; i >= 0; i--) {
            towers[i].update();
        }
    }
}


class BasicTower extends Tower {
    constructor(x, y, interfaceElement, overlayTower, debug) {
        super();
        this.towerID = 0;
        this.sides = 3;
        this.color = 'red';
        this.accentColor = 'darkred';
        this.size = 10;
        this.scale = 1;

        this.shootSpeed = 10;
        this.bulletdecay = 75;
        this.damage = 2;
        this.range = 100;
        this.price = 40;

        this.upgradePrices = {
            range: 15,
            speed: 30,
            damage: 25
        }

        this.upgradeAmounts = {
            range: 0,
            speed: 0,
            damage: 0
        }

        this.pos.x = x;
        this.pos.y = y;

        this.interfaceElement = false;
        this.overlayTower = false;
        this.debug = true;

        if (debug === undefined) {
            this.debug = true;
        } else {
            this.debug = debug;
        }

        if (interfaceElement === undefined) {
            this.interfaceElement = false;
        } else {
            this.interfaceElement = interfaceElement;
        }

        if (overlayTower === undefined) {
            this.overlayTower = false;
        } else {
            this.overlayTower = overlayTower;
        }

        if (this.interfaceElement) {
            this.debug = false;
        }

        if (this.debug) {
            this.createRangeOverlay();
        }

        this.tri = two.makePolygon(this.pos.x, this.pos.y, this.size, this.sides);
        this.tri.fill = this.color;
        this.tri.noStroke();

        this.tri2 = two.makeCircle(this.pos.x, this.pos.y - this.size + 1, this.size / 2.5);
        this.tri2.fill = this.accentColor;
        this.tri2.noStroke();

        this.group = two.makeGroup(this.tri, this.tri2, this.circle);
        this.group.translation.set(this.pos.x, this.pos.y);
        this.group.center();

    }

    createRangeOverlay() {
        this.circle = two.makeCircle(this.pos.x, this.pos.y, this.range);
        this.circle.fill = this.color;
        this.circle.opacity = 0.2;
        this.circle.noStroke();
    }

    bullet() {
        let target = enemy.getTarget(this.pos.x, this.pos.y, this.range, this.targeting);

        if (this.inRange() === false) {
            return;
        }

        let line = two.makeLine(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        line.stroke = this.color;
        line.linewidth = 2;


        setTimeout(function () {
            two.remove(line);
        }, this.bulletdecay * (this.shootSpeed/8));
    }

    update() {
        if (this.interfaceElement === false) {
            this.lookAt();

            if ((two.frameCount % (60 * (this.shootSpeed/10))) === 0) {
                this.bullet();
                this.shoot();
            }

            this.group.rotation = this.rot;
        } else {
            this.group.scale = this.scale;
            this.group.translation.set(this.pos.x, this.pos.y);
        }

        if (this.overlayTower === true) {
            this.group.translation.set(mpos.x, mpos.y);
            this.pos.x = mpos.x;
            this.pos.y = mpos.y;

            this.lookAt();

            this.placeTower();
        }
    }
}

class MediumTower extends Tower {
    constructor(x, y, interfaceElement, overlayTower, debug) {
        super();
        this.towerID = 1;
        this.sides = 4;
        this.color = 'blue';
        this.accentColor = 'darkblue';
        this.size = 10;
        this.scale = 1;

        this.shootSpeed = 40;
        this.bulletdecay = 100;
        this.damage = 7;
        this.range = 200;
        this.price = 60;

        this.upgradePrices = {
            range: 30,
            speed: 50,
            damage: 50
        }

        this.upgradeAmounts = {
            range: 0,
            speed: 0,
            damage: 0
        }

        this.pos.x = x;
        this.pos.y = y;

        this.interfaceElement = false;
        this.overlayTower = false;
        this.debug = true;

        if (debug === undefined) {
            this.debug = true;
        } else {
            this.debug = debug;
        }

        if (interfaceElement === undefined) {
            this.interfaceElement = false;
        } else {
            this.interfaceElement = interfaceElement;
        }

        if (overlayTower === undefined) {
            this.overlayTower = false;
        } else {
            this.overlayTower = overlayTower;
        }

        if (this.interfaceElement) {
            this.debug = false;
        }

        if (this.debug) {
            this.createRangeOverlay();
        }


        this.tri = two.makePolygon(this.pos.x, this.pos.y, this.size, this.sides);
        this.tri.fill = this.color;
        this.tri.noStroke();

        this.tri2 = two.makeCircle(this.pos.x, this.pos.y - this.size + 1, this.size / 2.5);
        this.tri2.fill = this.accentColor;
        this.tri2.noStroke();

        this.group = two.makeGroup(this.tri, this.tri2, this.circle);
        this.group.translation.set(this.pos.x, this.pos.y);
        this.group.center();

    }

    createRangeOverlay() {
        this.circle = two.makeCircle(this.pos.x, this.pos.y, this.range);
        this.circle.fill = this.color;
        this.circle.opacity = 0.2;
        this.circle.noStroke();
    }


    bullet() {
        let target = enemy.getTarget(this.pos.x, this.pos.y, this.range, this.targeting);

        if (this.inRange() === false) {
            return;
        }

        let line = two.makeLine(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        line.stroke = this.color;
        line.linewidth = 2;


        setTimeout(function () {
            two.remove(line);
        }, this.bulletdecay * (this.shootSpeed/8));
    }

    update() {
        if (this.interfaceElement === false) {
            this.lookAt();

            if ((two.frameCount % (60 * (this.shootSpeed/10))) === 0) {
                this.bullet();
                this.shoot();
            }

            this.group.rotation = this.rot;
        } else {
            this.group.scale = this.scale;
            this.group.translation.set(this.pos.x, this.pos.y);
        }

        if (this.overlayTower === true) {
            this.group.translation.set(mpos.x, mpos.y);
            this.pos.x = mpos.x;
            this.pos.y = mpos.y;

            this.lookAt();

            this.placeTower();
        }
    }
}

class BestTower extends Tower {
    constructor(x, y, interfaceElement, overlayTower, debug) {
        super();
        this.towerID = 2;
        this.sides = 5;
        this.color = 'green';
        this.accentColor = 'darkgreen';
        this.size = 10;
        this.scale = 1;

        this.shootSpeed = 3;
        this.bulletdecay = 75;
        this.damage = 2;
        this.range = 50;
        this.price = 100;

        this.upgradePrices = {
            range: 15,
            speed: 30,
            damage: 25
        }

        this.upgradeAmounts = {
            range: 0,
            speed: 0,
            damage: 0
        }

        this.pos.x = x;
        this.pos.y = y;

        this.interfaceElement = false;
        this.overlayTower = false;
        this.debug = true;

        if (debug === undefined) {
            this.debug = true;
        } else {
            this.debug = debug;
        }

        if (interfaceElement === undefined) {
            this.interfaceElement = false;
        } else {
            this.interfaceElement = interfaceElement;
        }

        if (overlayTower === undefined) {
            this.overlayTower = false;
        } else {
            this.overlayTower = overlayTower;
        }

        if (this.interfaceElement) {
            this.debug = false;
        }

        if (this.debug) {
            this.createRangeOverlay();
        }


        this.tri = two.makePolygon(this.pos.x, this.pos.y, this.size, this.sides);
        this.tri.fill = this.color;
        this.tri.noStroke();

        this.tri2 = two.makeCircle(this.pos.x, this.pos.y - this.size + 1, this.size / 2.5);
        this.tri2.fill = this.accentColor;
        this.tri2.noStroke();

        this.group = two.makeGroup(this.tri, this.tri2, this.circle);
        this.group.translation.set(this.pos.x, this.pos.y);
        this.group.center();

    }

    createRangeOverlay() {
        this.circle = two.makeCircle(this.pos.x, this.pos.y, this.range);
        this.circle.fill = this.color;
        this.circle.opacity = 0.2;
        this.circle.noStroke();
    }


    bullet() {
        let target = enemy.getTarget(this.pos.x, this.pos.y, this.range, this.targeting);

        if (this.inRange() === false) {
            return;
        }

        let line = two.makeLine(this.pos.x, this.pos.y, target.pos.x, target.pos.y);
        line.stroke = this.color;
        line.linewidth = 2;


        setTimeout(function () {
            two.remove(line);
        }, this.bulletdecay * (this.shootSpeed/8));
    }

    update() {
        if (this.interfaceElement === false) {
            this.lookAt();

            if ((two.frameCount % (60 * (this.shootSpeed/10))) === 0) {
                this.bullet();
                this.shoot();
            }

            this.group.rotation = this.rot;
        } else {
            this.group.scale = this.scale;
            this.group.translation.set(this.pos.x, this.pos.y);
        }

        if (this.overlayTower === true) {
            this.group.translation.set(mpos.x, mpos.y);
            this.pos.x = mpos.x;
            this.pos.y = mpos.y;

            this.lookAt();

            this.placeTower();
        }
    }
}