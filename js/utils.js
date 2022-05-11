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