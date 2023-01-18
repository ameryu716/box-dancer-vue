class Bubble {
    id: number;
    radius: number;
    size: number;
    x: number;
    y: number;
    float_speed: number;
    opacity: number;
    constructor(
        id: number,
        size: number,
        x: number,
        y: number,
        float_speed: number
    ) {
        this.id = id;
        this.radius = 10;
        this.size = size;
        this.x = x;
        this.y = y;
        this.float_speed = float_speed;
        this.opacity = 0.3;
    }

    float() {
        this.float_speed *= 1.0005;
        this.y -= this.float_speed;
        this.radius *= 1.05;
        if (this.y < 500) {
            this.opacity *= 0.995;
        }
    }
}

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
let bubbles = <Bubble[]>[];

function draw() {
    console.count("draw");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(100,150,255,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    bubbles.forEach((b) => {
        b.float();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = `rgba(255,255,255,${b.opacity})`;
        ctx.fill();

        if (b.y < 0) {
            bubbles = bubbles.filter((bubble) => bubble.id !== b.id);
        }
    });
    requestAnimationFrame(draw);
}

let bubbles_count = 1;

function add() {
    bubbles_count++;
    bubbles.push(
        new Bubble(
            bubbles_count,
            Math.floor(Math.random() * 70) + 10,
            Math.floor(Math.random() * canvas.width),
            Math.floor(canvas.height - (Math.random() * 50 - 200)),
            Math.random() * 1.1 + 0.3
        )
    );
}

setInterval(() => {
    add();
}, 2000);

draw();
