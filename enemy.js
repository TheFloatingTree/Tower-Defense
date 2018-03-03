class Enemy {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.dim = { w: mapAreaSize.width, h: mapAreaSize.height };

        this.speedOff = 0.2;
        this.dead = false;
        this.targetPoint = 1;

        this.trigger = false;
        this.speed = 1;

        this.startPoint = { x: 20, y: this.dim.h / 4 };
        this.pos = this.startPoint;
    }

    spawnEnemy(type) {
        if (type == 0) {
            enemies.push(new BasicEnemy());
        } else if (type == 1) {
            enemies.push(new MediumEnemy());
        }
    }

    cullEnemies() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            if (enemies[i].dead) {
                enemies.splice(i, 1);
            }
        }
    }

    reachEndCheck() {
        let len = map.points.length - 1;
        let point = map.points[len];
        if (this.pos.x === point.x && this.pos.y === point.y) {
            this.speed = 0;
            two.remove(this.group);
            this.dead = true;

            game.removeHealth(1);
        }
    }

    moveToPoint(point) {
        let speed = this.speed;
        let vec = getVector(this.pos.x, this.pos.y, point.x, point.y);

        this.pos.x += vec.x * speed;
        this.pos.y += vec.y * speed;

        if (vec.x < 0 || vec.y < 0) {
            this.pos.x = point.x;
            this.pos.y = point.y;
        }

        this.group.translation.set(this.pos.x, this.pos.y);
    }

    reachPointCheck(point) {
        if (this.pos.x === point.x && this.pos.y === point.y) {
            // console.log("Reached " + point.x + ", " + point.y);
            this.targetPoint++;
        }
    }

    move() {
        this.moveToPoint(map.points[this.targetPoint]);
        this.reachPointCheck(map.points[this.targetPoint]);
        this.reachEndCheck();
    }

    death() {
        this.speed = 0;
        two.remove(this.group);
        this.dead = true;

        game.addMoney(Math.floor(random(3, 8)));
    }

    getTarget(posx, posy, range, type) {
        if (enemies.length === 0) {
            return 'null';
        }

        if (type === 'newest') {
            for (let i = enemies.length - 1; i >= 0; i--) {
                let e = enemies[i];
                let overlap = collision(posx, posy, range, e.pos.x, e.pos.y, e.size);

                if (overlap) {
                    return e;
                }
            }
        } else if (type === 'oldest') {
            for (let i = 0; i < enemies.length; i++) {
                let e = enemies[i];
                let overlap = collision(posx, posy, range, e.pos.x, e.pos.y, e.size);

                if (overlap) {
                    return e;
                }
            }
        }
        return 'null';
    }

    checkDead() {
        if (this.health <= 1) {
            this.death();
        }
    }

    updateHealthBar() {
        this.group.remove(this.healthBar);
        this.healthBar = two.makeRoundedRectangle(0, -this.size - 5, (this.size * 2) * (this.health / this.healthConst), 4, 2);
        this.healthBar.fill = 'red';
        this.healthBar.noStroke();
        this.group.add(this.healthBar);
    }

    update() {
        for (let i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
        }
        enemy.cullEnemies();
    }
}

class BasicEnemy extends Enemy {
    constructor() {
        super();

        //Changeable

        this.health = 10;
        this.color = 'blue';
        this.size = 10;

        //Don't touch

        this.healthConst = this.health;
        this.active = false;
        this.iPos = 0;

        

        //Appearance 

        this.circle = two.makeCircle(0, 0, this.size);
        this.circle.fill = this.color;
        this.circle.noStroke();

        this.healthBar = two.makeRoundedRectangle(0, -this.size - 5, this.size * 2, 4, 2);
        this.healthBar.fill = 'red';
        this.healthBar.noStroke();

        this.group = two.makeGroup(this.circle, this.healthBar);
        this.group.translation.set(this.pos.x, this.pos.y);
        this.group.center();
    }

    update() {
        this.checkDead();
        this.move();
        
        this.updateHealthBar();
    }
}


class MediumEnemy extends Enemy {
    constructor() {
        super();

        //Changeable

        this.health = 16;
        this.color = 'green';
        this.size = 15;

        //Don't touch

        this.healthConst = this.health;
        this.active = false;
        this.iPos = 0;

        //Appearance 

        this.circle = two.makeCircle(0, 0, this.size);
        this.circle.fill = this.color;
        this.circle.noStroke();

        this.healthBar = two.makeRoundedRectangle(0, -this.size - 5, this.size * 2, 4, 2);
        this.healthBar.fill = 'red';
        this.healthBar.noStroke();

        this.group = two.makeGroup(this.circle, this.healthBar);
        this.group.translation.set(this.pos.x, this.pos.y);
        this.group.center();
    }

    update() {
        this.checkDead();
        this.move();

        this.updateHealthBar();
    }
}
