const canvas = document.querySelector("canvas");
//contexto do canvas
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

const audio = new Audio('../assets/audio.mp3')

const size = 30;

const initialPosition = {x: 270, y: 240};

let snake = [
    initialPosition
];

const updateScore = () => {
    //o "+" antes do score.innerText transforma ele(string) em um int.
    score.innerText = +score.innerText + 1;
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) * 30;
};

const randomColor = () =>{
    const r = randomNumber(0, 255)
    const g = randomNumber(0, 255)
    const b = randomNumber(0, 255)

    return `rgb(${r}, ${g}, ${b})`
}

const food = {
    x : randomPosition(),
    y: randomPosition(),    
    color: randomColor()
};

let direction, loopId;

const drawFood = () => {
    const {x, y, color} = food
    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0  
};



const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if(index == snake.length - 1){
            ctx.fillStyle = "white";
        }
        ctx.fillRect(position.x, position.y, size, size); 
    })
}

const moveSnake = () => {
    //se direction não tiver valor, não roda o código, se tiver, vai pra proxima validação
    if(!direction) return;

    //armazena a "cabeça da cobra, sendo ela o último objeto"
    const head = snake[snake.length - 1];

    //exclui o primeiro elemento do array
    snake.shift();

    if(direction == "right"){
        //se a direção for "direita", vai criar um elemento na frente da cabeça, e na msm altura.
        snake.push({x : head.x + size, y : head.y});
    }

    if(direction == "left"){
        //se a direção for "esquerda", vai criar um elemento atrás, e na msm altura.
        snake.push({x : head.x - size, y : head.y});
    }

    if(direction == "up"){
        //se a direção for "cima", vai criar um elemento em cima da cabeça, e na msm altura.
        snake.push({x : head.x, y : head.y - 30});
    }

    if(direction == "down"){
        //se a direção for "baixo", vai criar um elemento em baixo da cabeça, e na msm altura.
        snake.push({x : head.x, y : head.y + 30});
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for(let i = 30; i < canvas.width; i += 30){
        ctx.beginPath();
        //a linha vai comer em i(30), 0. E terminar em i(600-30),600. ou seja, começa de cima até em baixo, de 30 em 30 px
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600)
        ctx.stroke();

        ctx.beginPath();
        //a linha vai comer em i(30), 0. E terminar em i(600-30),600. ou seja, começa de cima até em baixo, de 30 em 30 px
        ctx.lineTo(0, i);
        ctx.lineTo(600, i)
        ctx.stroke();
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if(head.x == food.x && head.y == food.y){
        updateScore();
        snake.push(head)
        audio.play()

        let x = randomPosition();
        let y = randomPosition();

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition();
            y = randomPosition()
        };

        food.x = x;
        food.y = y;
        food.color = randomColor();
    };
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const headIndex =  snake.length - 2;
        
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < headIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

const gameLoop = () =>{
    clearInterval(loopId);
    //limpa o canvas desde a cordeenada 0,0  até a 600,600. Para a cobra não simplesmente esticar, em vez de mover
    ctx.clearRect(0, 0, 600,600);
    
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop()
    }, 200);
}

gameLoop();


document.addEventListener("keydown", ({key}) =>{
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";

    snake = [initialPosition];
})