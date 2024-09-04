var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Game = /** @class */ (function () {
    function Game(numCards) {
        this.score = 0;
        this.myDeck = new Deck();
        this.numCards = numCards;
        // we use values of null in the call to shuffle because they don't exist in the hand and
        //  therefore won't prohibit any card from being shuffled as we start this game.
        this.hand = this.shuffle(this.init(), undefined, undefined);
        // For debugging purposes - an unshuffled deck:
        //this.hand = this.init();
        this.chosen = [];
        this.history = [];
    }
    Game.prototype.init = function () {
        // this returns a sorted array of numbers with a length equivalent to the number of cards in myDeck.deck
        var arr = [];
        for (var i = 0; i < this.myDeck.deck.length; i++) {
            arr.push(i);
        }
        return arr;
    };
    Game.prototype.shuffle = function (arr, chosen1, chosen2) {
        var _a;
        // this method accepts the game.hand array and two chosen numbers that represent the index of game.myDeck.deck which is held by game.hand[]
        // it returns an array that is randomly shuffled
        // we make sure that any chosen cards are not included in the shuffle using chosen1 and chosen2
        var shuffledArray = __spreadArray([], arr, true);
        for (var rounds = 0; rounds < 3; rounds++) {
            for (var i = shuffledArray.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                // Check if chosen1 or chosen2 equals i, and skip swapping in that case
                if (chosen1 === shuffledArray[i] || chosen2 === shuffledArray[i]) {
                    continue;
                }
                // Check if chosen1 or chosen2 equals j, and skip swapping in that case
                else if (chosen1 === shuffledArray[j] || chosen2 === shuffledArray[j]) {
                    continue;
                }
                else {
                    _a = [shuffledArray[j], shuffledArray[i]], shuffledArray[i] = _a[0], shuffledArray[j] = _a[1];
                }
            }
        }
        return shuffledArray;
    };
    Game.prototype.checkSolution = function (arr) {
        // the expected input here is game.chosen, an array of 3 numbers that represent the index in game.myDeck.deck[]
        // to evaluate the 3 cards, we look at game.myDeck.deck[i] where i is each element in game.chosen, represented by our parameter arr
        var result = true;
        var alreadyFound = false;
        var arrHistory = [];
        // compare the cards:
        var card1 = game.myDeck.deck[arr[0]].toString().replace(/,/g, '');
        var card2 = game.myDeck.deck[arr[1]].toString().replace(/,/g, '');
        var card3 = game.myDeck.deck[arr[2]].toString().replace(/,/g, '');
        for (var i = 0; i < 4; i++) {
            var test = (card1[i] == card2[i] && card2[i] == card3[i]) || (card1[i] !== card2[i] && card2[i] !== card3[i] && card1[i] !== card3[i]);
            if (!test) {
                result = false;
            }
        }
        if (result) {
            var _loop_1 = function (i) {
                var historySorted = game.history[i].sort(function (a, b) { return a - b; });
                var chosenSorted = game.chosen.sort(function (a, b) { return a - b; });
                alreadyFound = historySorted.every(function (value, index) { return value === chosenSorted[index]; });
                if (alreadyFound) {
                    return "break";
                }
            };
            // check to see if this solution was already found or not
            for (var i = 0; i < game.history.length; i++) {
                var state_1 = _loop_1(i);
                if (state_1 === "break")
                    break;
            }
            if (!alreadyFound) {
                // this solution was not already found
                // increase the score
                game.score++;
                var scoreElem = document.getElementById('score');
                if (scoreElem) {
                    scoreElem.innerHTML = "Score: ".concat(this.score);
                }
                // attach this set to the history section
                arrHistory = [arr[0], arr[1], arr[2]];
                game.history.push(arrHistory);
                // add the cards to the history element
                game.showFeedback('greenCheck');
                for (var i = 0; i < arrHistory.length; i++) {
                    // here is where you find the historyContainer element and attach a div with all three cards in it...maybe
                    game.drawCard(arrHistory[i], 'historyContainer');
                }
                // trigger fun feedback for the user
            }
            else if (alreadyFound) {
                // trigger feedback to the user to let them know this was already found
                game.showFeedback('yellowCheck');
            }
            var _loop_2 = function (i) {
                var index = game.chosen[i];
                var arr_1 = game.myDeck.deck[index];
                var elemId = arr_1.join(',');
                var elem = document.getElementById(elemId);
                if (elem) {
                    setTimeout(function () {
                        elem.classList.remove('chosen');
                    }, 800);
                }
            };
            // whether found in the past or not, remove the chosen class from each card
            for (var i = 0; i < 3; i++) {
                _loop_2(i);
            }
            // clear out the chosen array
            for (var i = 0; i < 3; i++) {
                game.chosen.pop();
            }
        }
        else {
            // give feedback that this was not a set - animate a red x using showFeedback('red);
            game.showFeedback('redX');
            for (var i = 0; i < 3; i++) {
                var index = game.chosen[i];
                var arr_2 = game.myDeck.deck[index];
                var elemId = arr_2.join(',');
                var elem = document.getElementById(elemId);
                if (elem) {
                    elem.classList.toggle('chosen');
                }
            }
            // clear out the chosen array
            for (var i = 0; i < 3; i++) {
                game.chosen.pop();
            }
        }
    };
    Game.prototype.removeCards = function () {
        // this method removes all the cards from the cardContainer element
        var cardContainer = document.getElementById('cardContainer');
        if (cardContainer) {
            // loop through game.hand to remove all the card elements from the stage
            for (var i = 0; i < game.hand.length; i++) {
                var index = game.hand[i];
                var cardArr = game.myDeck.deck[index];
                var id = cardArr.toString();
                var divElem = document.getElementById(id);
                if (divElem) {
                    divElem.remove();
                }
            }
        }
        var historyContainer = document.getElementById('historyContainer');
        // Check if the historyContainer exists
        if (historyContainer) {
            // Remove all child elements
            while (historyContainer.firstChild) {
                historyContainer.removeChild(historyContainer.firstChild);
            }
        }
    };
    Game.prototype.showFeedback = function (feedbackType) {
        var element = document.getElementById(feedbackType);
        if (element) {
            element.style.display = 'block'; // Show the element
            element.style.animation = 'growAndFade .8s forwards'; // Start animation
            element.addEventListener('animationend', function () {
                element.style.display = 'none'; // Hide after animation
            }, { once: true }); // Event listener will be removed after it runs once
        }
    };
    Game.prototype.drawHowToPlay = function () {
        var elem = document.getElementById('instructions');
        var iElem = document.getElementById('instructionsButton');
        if (elem) {
            var styles = window.getComputedStyle(elem);
            // Check if the 'display' property is 'none'
            if (styles.display === 'none') {
                elem.style.display = 'block';
                if (iElem) {
                    iElem.innerHTML = 'Hide Instructions';
                }
            }
            else {
                elem.style.display = 'none';
                if (iElem) {
                    iElem.innerHTML = 'How to Play ';
                }
            }
        }
    };
    Game.prototype.drawCards = function () {
        // this method calls game.drawCard for game.numCards number of cards in the game.hand array (18 numCards for 3x6 grid)
        for (var i = 0; i < game.numCards; i++) {
            game.drawCard(game.hand[i], 'cardContainer');
        }
        // draw the history cards
        for (var i = 0; i < game.history.length; i++) {
            for (var j = 0; j < 3; j++) {
                game.drawCard(game.history[i][j], 'historyContainer');
            }
        }
    };
    Game.prototype.drawCard = function (index, cardContainerName) {
        // drawcard accepts the index of game.myDeck.deck
        // calculate cardWidth and cardHeight based on the window size and use them to define the size of the card
        var cardWidth = window.innerWidth / 4;
        var cardHeight = window.innerWidth / 8;
        if (window.innerWidth > 620) {
            cardWidth = 620 / 4;
            cardHeight = 620 / 8;
        }
        var cardContainer = document.getElementById(cardContainerName);
        var shapeWidth = cardWidth / 4.5;
        var shapeHeight = cardHeight / 2.25;
        var svgStrokeWidth = cardWidth / 45;
        if (svgStrokeWidth < 2.5) {
            svgStrokeWidth = 2.5;
        }
        if (svgStrokeWidth > 4) {
            svgStrokeWidth = 4;
        }
        // count:
        //      1: one, 2: two, 3: three
        //  shade
        //      1: clear, 2: shaded, 3: filled
        // color:
        //      1: blue, 2: green, 3: red
        // shape
        //      1: cirle, 2: triangle, 3: square
        var arr = game.myDeck.deck[index];
        var color = arr[2];
        var count = arr[0];
        var shape = arr[3];
        var shade = arr[1];
        var svgFill = '';
        var svgStroke = '';
        var svgShade = '';
        switch (shade) {
            case 1:
                // clear
                svgShade = ", 0)";
                break;
            case 2:
                // shaded
                svgShade = ", .25)";
                break;
            case 3:
                // filled
                svgShade = ", 1)";
                break;
        }
        switch (color) {
            case 1:
                // blue
                svgStroke = "rgba(27, 58, 196)";
                svgFill = "rgba(27, 58, 196";
                break;
            case 2:
                // green
                svgStroke = 'rgba(62, 156, 40)';
                svgFill = "rgba(62, 156, 40";
                break;
            case 3:
                // red
                svgStroke = 'rgba(196, 27, 37)';
                svgFill = "rgba(196, 27, 37";
                break;
        }
        // add a card to cardContainer
        var cardElement = document.createElement('div');
        cardElement.className = 'cardDiv';
        if (cardContainerName == 'historyContainer') {
            cardElement.className = 'historyCardDiv';
        }
        // if the card being drawn is in chosen[0] or chosen[1], then give it a class of chosen so the css highlights it
        // but only if it isn't going to the historyContainer
        if (cardContainerName !== 'historyContainer') {
            for (var j = 0; j < 2; j++) {
                if (index == game.chosen[j]) {
                    cardElement.className = 'cardDiv chosen';
                }
            }
        }
        // if we give a card in the historyContainer the same id as one on the stage, 
        // then we'll remove cards from the history when we actually only intend to remove cards from the stage
        if (cardContainerName !== 'historyContainer') {
            cardElement.id = arr.toString();
        }
        else {
            // give historic cards a different id
            cardElement.id = arr.toString() + ',' + game.history.length;
        }
        cardElement.style.width = "".concat(cardWidth, "px");
        cardElement.style.height = "".concat(cardHeight, "px");
        if (cardContainer) {
            var tag = '';
            if (cardContainerName !== 'historyContainer') {
                tag = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(cardWidth, "px\" height=\"").concat(cardHeight, "px\"><rect width=\"").concat(cardWidth, "px\" height=\"").concat(cardHeight, "px\" fill=\"white\"/>");
            }
            else {
                tag = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"".concat(cardWidth, "px\" height=\"").concat(cardHeight, "px\"><rect width=\"").concat(cardWidth, "px\" height=\"").concat(cardHeight, "px\" fill=\"#d4d4d4\"/>");
            }
            // based on the count, color, shading and shape of the card, add the right card to the div element:
            for (var i = 0; i < count; i++) {
                if (shape == 1) {
                    // if the shape is a circle
                    var cirNudge = 0;
                    if (count == 2) {
                        if (i == 1) {
                            cirNudge = -10;
                        }
                        else if (i == 0) {
                            cirNudge = 10;
                        }
                    }
                    tag += "<circle cx=\"".concat(((cardWidth / (count) * (i + 1) - cardWidth / (count * 2))) + cirNudge, "\" cy=\"").concat(cardHeight / 2, "\" r=\"").concat(cardHeight / 4, "\" width = \"").concat(shapeWidth, "px\" height=\"").concat(shapeHeight, "px\" stroke=\"").concat(svgStroke, "\" fill=\"").concat(svgFill).concat(svgShade, "\" stroke-width=\"").concat(svgStrokeWidth, "\"/>");
                }
                else if (shape == 2) {
                    // else if the shape is a triangle
                    var centerX = cardWidth / 2;
                    var centerY = cardHeight / 2;
                    // let radius = cardWidth/7;
                    var radius = shapeWidth * (2 / 3);
                    var angleInRadians = Math.PI / 3;
                    // Calculate side length using the formula: side = 2 * radius * sin(60 degrees)
                    var sideLength = 2 * radius * Math.sin(angleInRadians);
                    // Calculate vertices of the equilateral triangle with the base down
                    var nudge = (count - 1) * cardWidth / 20;
                    var angle = -Math.PI / 2; // Starting angle (90 degrees clockwise from the positive x-axis)
                    var x1 = centerX + radius * Math.cos(angle) + ((0 - i) * (sideLength + cardWidth / 20)) + 3 * nudge;
                    var y1 = centerY + radius * Math.sin(angle) + (cardHeight / 10);
                    angle += (2 * Math.PI / 3); // Move to the next vertex
                    var x2 = centerX + radius * Math.cos(angle) + ((0 - i) * (sideLength + cardWidth / 20)) + 3 * nudge;
                    var y2 = centerY + radius * Math.sin(angle) + (cardHeight / 10);
                    angle += (2 * Math.PI / 3); // Move to the final vertex
                    var x3 = centerX + radius * Math.cos(angle) + ((0 - i) * (sideLength + cardWidth / 20)) + 3 * nudge;
                    var y3 = centerY + radius * Math.sin(angle) + (cardHeight / 10);
                    tag += "<polygon points=\"".concat(x1, ",").concat(y1, " ").concat(x2, ",").concat(y2, " ").concat(x3, ",").concat(y3, "\" stroke=\"").concat(svgStroke, "\" fill=\"").concat(svgFill).concat(svgShade, "\" stroke-width=\"").concat(svgStrokeWidth, "\"/>");
                }
                else if (shape == 3) {
                    // else if the shape is a square
                    var sqNudge = 0;
                    if (count == 2) {
                        if (i == 1) {
                            sqNudge = -10;
                        }
                        else if (i == 0) {
                            sqNudge = 10;
                        }
                    }
                    tag += "<rect x=\"".concat((cardWidth / (count) * (i + 1) - cardWidth / (count * 2) - shapeWidth / 2) + sqNudge, "\" y=\"").concat(cardHeight / 4, "\" width=\"").concat(shapeWidth, "px\" height=\"").concat(shapeHeight, "px\" stroke=\"").concat(svgStroke, "\" fill=\"").concat(svgFill).concat(svgShade, "\" stroke-width=\"").concat(svgStrokeWidth, "\"/>");
                }
            }
            cardElement.innerHTML += "".concat(tag);
            cardElement.innerHTML += "</svg>";
            // append the SVG content to the innerHTML of the div 
            if (cardContainerName !== 'historyContainer') {
                cardContainer.appendChild(cardElement);
            }
            else {
                cardContainer.prepend(cardElement);
            }
            // if this card is for history, don't add an event listener. in other words, don't make history cards toggle in highlight
            if (cardContainerName !== 'historyContainer') {
                cardElement.addEventListener('click', function () {
                    game.toggleChosen(cardElement.id);
                });
            }
        }
    };
    Game.prototype.toggleChosen = function (elemId) {
        // we pass in a string representing the array elements, for example '1,1,1,1' and get the HTML element based on that id:
        var elem = document.getElementById(elemId);
        // if this element is not already in the game.chosen array, then add it's game.hand index to it and add the class style of 'chosen' to it so it's highlighted
        // if, by virtue of the user clicking this element, game.chosen.length equals 3, then check for a solution
        if (elem) {
            var index = -1;
            for (var i = 0; i < game.hand.length; i++) {
                if (game.myDeck.deck[game.hand[i]].toString() == elemId) {
                    index = game.hand[i];
                    break; // Stop the loop once a match is found
                }
            }
            if (!elem.classList.contains('chosen')) {
                if (game.chosen.length < 3) {
                    game.chosen.push(index);
                    elem.classList.toggle('chosen');
                    if (game.chosen.length == 3) {
                        game.checkSolution(game.chosen);
                    }
                }
            }
            //else if the element is already in the game.chosen array, remove it from the array and remove it's class style of 'chosen' so it's no longer highlighted
            else {
                elem.classList.toggle('chosen');
                var _loop_3 = function (j) {
                    if (game.chosen[j] == index) {
                        game.chosen = game.chosen.filter(function (card) { return card !== game.chosen[j]; });
                    }
                };
                for (var j = 0; j < 3; j++) {
                    _loop_3(j);
                }
            }
        }
    };
    return Game;
}());
var Deck = /** @class */ (function () {
    function Deck() {
        this.deck = [];
        this.deck = this.init();
    }
    Deck.prototype.init = function () {
        // count:
        //      1: one, 2: two, 3: three
        //  shade
        //      1: clear, 2: shaded, 3: filled
        // color:
        //      1: blue, 2: green, 3: red
        // shape
        //      1: cirle, 2: triangle, 3: square
        var arr = [];
        for (var count = 1; count <= 3; count++) {
            for (var shade = 1; shade <= 3; shade++) {
                for (var color = 1; color <= 3; color++) {
                    for (var shape = 1; shape <= 3; shape++) {
                        arr.push([count, shade, color, shape]);
                    }
                }
            }
        }
        return arr;
    };
    return Deck;
}());
function addListeners() {
    document.addEventListener('DOMContentLoaded', function () {
        var shuffleButton = document.getElementById('shuffle');
        if (shuffleButton) {
            shuffleButton.addEventListener('click', function () {
                // When the user clicks on shuffle, keep any chosen cards in place and shuffle the rest of them
                // Use arrow functions to capture the correct 'this' value
                game.hand = game.shuffle(game.hand, game.chosen[0], game.chosen[1]);
                game.removeCards();
                game.drawCards();
            });
        }
    });
    document.addEventListener('DOMContentLoaded', function () {
        var instructionsButton = document.getElementById('instructionsButton');
        if (instructionsButton) {
            instructionsButton.addEventListener('click', function () {
                // When the user clicks on instructions, show them the instructions on a cute window
                game.drawHowToPlay();
            });
        }
    });
    window.addEventListener('resize', function () {
        // Delete each card on the screen and redraw it at the right size
        game.removeCards();
        game.drawCards();
    });
}
var game = new Game(18);
game.drawCards();
addListeners();
