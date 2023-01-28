class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    is_spawning: boolean;
    is_dying: boolean;
    opacity: number;
    trail_length_delta: number;
    is_dead: boolean;

    constructor(x: number, y: number, speed: number, direction: number) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.radius = 0;
        this.is_spawning = true;
        this.is_dying = false;
        this.is_dead = false;
        this.opacity = 0;
        this.trail_length_delta = 0;

        this.create(x, y, speed, direction);
    }

    create(x: number, y: number, speed: number, direction: number) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
    }

    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    setSpeed(speed: number) {
        var heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    getHeading() {
        return Math.atan2(this.vy, this.vx);
    }

    setHeading(heading: number) {
        var speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

const canvas = document.createElement("canvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
document.body.appendChild(canvas);

const stars: Particle[] = [];
const shootingStars: Particle[] = [];
const layers = [
    { speed: 0.015, scale: 0.2, count: 320 },
    { speed: 0.03, scale: 0.5, count: 50 },
    { speed: 0.05, scale: 0.75, count: 30 },
];
const starsAngle = 145;
const shootingStarSpeed = {
    min: 15,
    max: 20,
};
const shootingStarOpacityDelta = 0.01;
const trail_length_delta = 0.01;
const shootingStarLifeTime = 500;
const maxTrailLength = 300;
const starBaseRadius = 2;
const shootingStarRadius = 3;
const paused = false;

// Allstars
layers.forEach((l) => {
    for (let i = 0; i < l.count; i += 1) {
        const star = new Particle(
            randomRange(0, width),
            randomRange(0, height),
            0,
            0
        );
        star.radius = starBaseRadius * l.scale;
        star.setSpeed(l.speed);
        star.setHeading(degreesToRads(starsAngle));
        stars.push(star);
    }
});

//Helpers
function lineToAngle(x1: number, y1: number, length: number, radians: number) {
    var x2 = x1 + length * Math.cos(radians),
        y2 = y1 + length * Math.sin(radians);
    return { x: x2, y: y2 };
}

function randomRange(min: number, max: number) {
    return min + Math.random() * (max - min);
}

function degreesToRads(degrees: number) {
    return (degrees / 180) * Math.PI;
}

function createShootingStar() {
    const shootingStar = new Particle(
        randomRange(width / 2, width),
        randomRange(0, height / 2),
        0,
        0
    );
    shootingStar.setSpeed(
        randomRange(shootingStarSpeed.min, shootingStarSpeed.max)
    );
    shootingStar.setHeading(degreesToRads(starsAngle));
    shootingStar.radius = shootingStarRadius;
    shootingStar.opacity = 0;
    shootingStar.trail_length_delta = 0;
    shootingStar.is_spawning = true;
    shootingStar.is_dying = false;
    shootingStars.push(shootingStar);
}

function killShootingStar(shootingStar: Particle) {
    setTimeout(function () {
        shootingStar.is_dying = true;
    }, shootingStarLifeTime);
}

function update() {
    if (!paused) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#282a3a";
        ctx.fillRect(0, 0, width, height);
        ctx.fill();

        stars.forEach((s) => {
            s.update();
            drawStar(s);
            if (s.x > width) {
                s.x = 0;
            }
            if (s.x < 0) {
                s.x = width;
            }
            if (s.y > height) {
                s.y = 0;
            }
            if (s.y < 0) {
                s.y = height;
            }
        });

        shootingStars.forEach((s) => {
            if (s.is_spawning) {
                s.opacity += shootingStarOpacityDelta;
                if (s.opacity >= 1.0) {
                    s.is_spawning = false;
                    killShootingStar(s);
                }
            }
            if (s.is_dying) {
                s.opacity -= shootingStarOpacityDelta;
                if (s.opacity <= 0.0) {
                    s.is_dying = false;
                    s.is_dead = true;
                }
            }
            s.trail_length_delta += trail_length_delta;

            s.update();
            if (s.opacity > 0.0) {
                drawShootingStar(s);
            }
        });

        //Delete dead shooting shootingStars
        for (let i = shootingStars.length - 1; i >= 0; i--) {
            if (shootingStars[i].is_dead) {
                shootingStars.splice(i, 1);
            }
        }
    }
    requestAnimationFrame(update);
}

function drawStar(star: Particle) {
    ctx.fillStyle = "rgb(255, 221, 157)";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2, false);
    ctx.fill();
}

function drawShootingStar(p: Particle) {
    const x = p.x;
    const y = p.y;
    const currentTrailLength = maxTrailLength * p.trail_length_delta;
    const pos = lineToAngle(x, y, -currentTrailLength, p.getHeading());

    ctx.fillStyle = "rgba(255, 255, 255, " + p.opacity + ")";
    let starLength = 5;
    ctx.beginPath();
    ctx.moveTo(x - 1, y + 1);

    ctx.lineTo(x, y + starLength);
    ctx.lineTo(x + 1, y + 1);

    ctx.lineTo(x + starLength, y);
    ctx.lineTo(x + 1, y - 1);

    ctx.lineTo(x, y + 1);
    ctx.lineTo(x, y - starLength);

    ctx.lineTo(x - 1, y - 1);
    ctx.lineTo(x - starLength, y);

    ctx.lineTo(x - 1, y + 1);
    ctx.lineTo(x - starLength, y);

    ctx.closePath();
    ctx.fill();

    //trail
    ctx.fillStyle = "rgba(255, 221, 157, " + p.opacity + ")";
    ctx.beginPath();
    ctx.moveTo(x - 1, y - 1);
    ctx.lineTo(pos.x, pos.y);
    ctx.lineTo(x + 1, y + 1);
    ctx.closePath();
    ctx.fill();
}

function set(interval = 2000) {
    update();
    //Shooting stars
    setInterval(function () {
        if (paused) return;
        createShootingStar();
    }, interval);
}

export { set };
