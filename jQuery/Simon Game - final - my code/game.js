var buttonColors = ["red", "blue", "green", "yellow"]
var gamePattern = [];
var userClickedPattern = [];
var level = 0;
var started = false;

// Pattern Generator
function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
    
    // // make the button flash
    // flashButton(randomChosenColor);

    // // play the sound of the button
    // playSound(randomChosenColor);
    repeatPattern();
}

// Button click detector and handler
$(".btn").click(function() {
    if(started) {
        // get the id of the button the player clicked
        var userChosenColor = $(this).attr("id");

        userClickedPattern.push(userChosenColor);

        // animate the button press
        animatePress(this);

        var answerIdx = userClickedPattern.length - 1;
        checkAnswer(answerIdx);

        // play the sound of the button
        playSound(userChosenColor);
    }
});


/* Sound Section */
function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}


/* Animation Section */
function animatePress(currentColor) {
    var delayInMilliseconds = 10;

    $(currentColor).addClass("pressed");

    setTimeout(function() {
        $(currentColor).removeClass("pressed");
    }, delayInMilliseconds);
}

function flashButton(color) {
    $("#" + color).fadeOut(100).fadeIn(100);
}

function repeatPattern() {
    console.log("level: " + level);
    console.log("game: " + gamePattern);
    gamePattern.forEach(function(buttonColor, i) {
        setTimeout(function() {
            // make the button flash
            flashButton(buttonColor);

            // play the sound of the button
            playSound(buttonColor);
        }, i * 500);
    });
}


/* Game management Section */

// detect 'a' key to start the game
$(document).keypress(function (event) {
    if(!started) {
        if(event.key == 'a') {
            started = true;
            nextSequence();
        }
    }
});

// check if the click button is correct or not
function checkAnswer(currentLevel) {
    if(started) {
        if(userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
            // answer is correct
            // check if we reached the end of the current pattern
            if(currentLevel === gamePattern.length - 1) {
                setTimeout(nextSequence, 1000);
            }
        } else {
            // answer is wrong
            gameOver();
            startOver();
        }
    }
}

function gameOver() {
    started = false;
    //play worng answer sound
    playSound("wrong");

    // show game over screen
    $("body").addClass("game-over");

    setTimeout(function() {
        $("body").removeClass("game-over");
    }, 200);

}

function startOver() {
    //reset the level
    level = 0;

    //reset the game pattern
    gamePattern = [];
    
    // change title
    $("#level-title").text("Game Over, Press any key to Restart");

    if(!started) {
        $(document).one("keypress" ,function (event) {
            started = true;
            nextSequence();
        });
    }
}