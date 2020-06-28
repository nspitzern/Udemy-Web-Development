function randomDice() {
    var num = Math.random() * 6;
    num = Math.floor(num) + 1;
    return num;
}

var randomNum1 = randomDice();
firstDiceImgUrl = "images/dice" + randomNum1 + ".png";
document.querySelectorAll(".dice")[0].setAttribute("src", firstDiceImgUrl);

var randomNum2 = randomDice();
secondDiceImgUrl = "images/dice" + randomNum2 + ".png";
document.querySelectorAll(".dice")[1].setAttribute("src", secondDiceImgUrl);

if(randomNum1 < randomNum2) {
    // player 2 wins
    document.querySelector(".heading").textContent = "Player 2 wins! 🚩";
} else if(randomNum1 === randomNum2) {
    // a tie
    document.querySelector(".heading").textContent = "Draw!";
} else {
    // player 1 wins
    document.querySelector(".heading").textContent = "🚩 Player 1 wins!";
}