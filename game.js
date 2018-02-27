//This class handles all the actual gameplay stuff such as health, money, difficulty, waves, etc.

class Game {
    constructor() {
        this.money = 100;
        this.health = 100;
        this.wave = 0;

        this.wavesData = [
            [
                {types: [0], amounts: [5], freq: 200}
            ],
            [
                {types: [0], amounts: [6], freq: 180}
            ],
            [
                {types: [0], amounts: [7], freq: 170}
            ],
            [
                {types: [0], amounts: [9], freq: 150}
            ],
            [
                {types: [0], amounts: [10], freq: 100}
            ],
            [
                {types: [0], amounts: [5], freq: 60},
                {types: [0, 1], amounts: [5, 2], freq: 60}
            ],
            [
                {types: [0], amounts: [5], freq: 60},
                {types: [0, 1], amounts: [5, 2], freq: 60}
            ],
            [
                {types: [0], amounts: [5], freq: 60},
                {types: [0, 1], amounts: [5, 2], freq: 60}
            ]
        ]

        this.waveManager = new WaveManager(this.wavesData);
    }

    removeHealth(amount) {
        this.health -= amount;
    }

    removeMoney(amount) {
        if (amount > this.money) {
            return false;
        }
        if (this.money <= 0) {
            this.money = 0;
            return false;
        }
        this.money -= amount;
        return true;
    }

    addMoney(amount) {
        this.money += amount;
    }
}

class WaveManager {
    constructor(data) {
        this.wave = 0;
        this.step = 0;
        this.wavesData = data;
        this.waveObjects = [];
        this.ready = true;
        this.fullyDone = false;
        this.gameEnd = false;

        this.timeBetween = 20;
        this.countdown;

        this.timeoutVar;
        
        for (let i = 0; i < this.wavesData.length; i++) {
            this.waveObjects.push(new Wave(this.wavesData[i]));
        }
    }

    incrementWave(force) {
        if (this.fullyDone || force) {
            this.waveObjects[this.wave].active = true;
            game.waveManager.wave++;
        }
        this.ready = false;
    }

    startCountdown(force) {
        if (this.fullyDone || force) {
            this.countdown = this.timeBetween;
            clearTimeout(this.timeoutVar);
            this.timeoutVar = setTimeout(() => {
                game.waveManager.countdownTimer();
            }, 1000);
        }
    }

    countdownTimer() {
        this.countdown--;
        if (this.countdown <= 0) {
            this.incrementWave(true);
            this.startCountdown(true);
            return;
        } else {
            this.timeoutVar = setTimeout(() => {
                game.waveManager.countdownTimer();
            }, 1000);
        }
    }
    
    update() {
        for (let i = 0; i < this.waveObjects.length; i++) {
            if (this.waveObjects[i].update() && this.waveObjects[i].active) {
                this.waveObjects[i].active = false;
                if (!(game.waveManager.wave > this.waveObjects.length - 1)) {
                    this.ready = true;
                }
            }
        }

        if (this.wave === this.waveObjects.length && enemies.length === 0) {
            this.gameEnd = true;
        } else {
            this.gameEnd = false;
        }

        if (this.ready && enemies.length === 0) {
            this.fullyDone = true;
        } else {
            this.fullyDone = false;
        }
    }
}

class Wave {
    constructor(wave) {
        this.wave = wave;
        this.steps = [];
        this.active = false;
        this.startFlag = true;
        this.finishedFlag = false;

        for (let i = 0; i < this.wave.length; i++) {
            this.steps.push(new Step(this.wave[i], this.index));
        }
    }

    incrementStep() {
        this.steps[game.waveManager.step].active = true;
    }

    start() {
        game.waveManager.step = 0;
        this.steps[0].active = true;
        this.startFlag = false;
    }

    update() {
        if (this.active) {
            if (this.startFlag) {
                this.start();
            }
            for (let i = 0; i < this.steps.length; i++) {
                if (this.steps[i].update()) {
                    game.waveManager.step++;
                    if (!(game.waveManager.step > this.steps.length - 1)) {
                        this.incrementStep();
                    } else {
                        this.finishedFlag = true;
                    }
                }
            }
        }
        return this.finishedFlag;
    }
}

class Step {
    constructor(step) {
        this.step = step;
        this.active = false;
        this.start = true;

        this.targetAmounts = this.step.amounts;
        this.currentAmounts = [];

        for(let i = 0; i < this.step.types.length; i++) {
            this.currentAmounts[i] = 0;
        }
    }

    update() {
        let finishedFlag = false;
        if (this.active) {
            if (this.start) {
                enemy.spawnEnemy(this.step.types[0]);
                this.currentAmounts[0]++;
                this.start = false;
            }
            if (two.frameCount % this.step.freq === 0) {
                for(let i = 0; i < this.step.types.length; i++) {
                    if (this.currentAmounts[i] < this.targetAmounts[i]) {
                        let type = this.step.types[i];
                        setTimeout(() => enemy.spawnEnemy(type), random(100, 600))
                        this.currentAmounts[i]++;
                    }
                }
            }
            for (let i = 0; i < this.step.types.length; i++) {
                if (this.targetAmounts[i] === this.currentAmounts[i]) {
                    finishedFlag = true;
                } else {
                    finishedFlag = false;
                    return;
                }
            }

            if (finishedFlag) {
                this.active = false;
            }
        }
        return finishedFlag;
    }
}