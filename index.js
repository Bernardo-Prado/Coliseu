const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// Proporção 16x9
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    offset: {
        x: 0,
        y: 0,
    },
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 10,
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0,
    },
});

// Teclas pressionadas juntas possam mover
const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
};

/* desenvolver: 
     SE o lado direito da caixa de ataque for maior ou igual ao lado esquerdo
     do inimigo, será atacado.
     SE o lado esquerdo da caixa de ataque for menor ou igual ao lado direito do inimigo
     ele não será atacado
     SE a base do eixo y da caixa de ataque for maior ou igual a parte superior do inimigo
     ele não será atacado */

function CollisionBetweenRectangular({
    rectangle1,
    rectangle2
}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
        rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({
    player,
    enemy,
    timerId
}) {
    clearTimeout(timerId);
    document.querySelector("#principalText").style.display = "flex";
    if (player.health === enemy.health) {
        document.querySelector("#principalText").innerHTML = "TIE";
    } else if (player.health > enemy.health) {
        document.querySelector("#principalText").innerHTML = "PLAYER 1 WINS";
    } else if (enemy.health > player.health) {
        document.querySelector("#principalText").innerHTML = "PLAYER 2 WINS";
    }
}

let timer = 60;
let timerId;

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 3000);
        timer--;
        document.querySelector("#timer").innerHTML = timer;
    }

    if (timer === 0) {
        determineWinner({
            player,
            enemy,
            timerId
        });
    }
}

decreaseTimer();

// loop infinito
function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // player movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5;
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5;
    }

    // detect for collision
    if (
        CollisionBetweenRectangular({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
        console.log("attacked");
    }

    if (
        CollisionBetweenRectangular({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }

    // gameover based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({
            player,
            enemy,
            timerId
        });
    }
}

animate();

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = true;
            player.lastKey = "d";
            break;
        case "a":
            keys.a.pressed = true;
            player.lastKey = "a";
            break;
        case "w":
            player.velocity.y = -20;
            break;
        case " ":
            player.attack();
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -20;
            break;
        case "ArrowDown":
            enemy.attack();
            break;
    }
    // console.log(event.key);
});

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
    }

    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
    }
    // console.log(event.key);
});