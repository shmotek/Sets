class Game {
    // This class holds all the information associated with the play of game.
    
    // numCards is passed in as a parameter to allow games with different sized decks
    numCards: number;
    
    score: number;
    // The chosen array holds three numbers that represent the current selection - each number being an index in game.myDeck.deck
    chosen: number[];
    // myDeck is a two-dimensional array to hold all available cards - unsorted
    // game.myDeck.deck[0]=[1,1,1,1]
    // game.myDeck.deck[80]=[3,3,3,3]
    myDeck: Deck;
    // The hand array holds the indeces from the game.myDeck.deck array
    hand: number[];
    // history is a two-dimensional array to hold a history of what was chosen
    history: number[][];
    
    constructor(numCards: number) {
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

    init() : number[] {
        // this returns a sorted array of numbers with a length equivalent to the number of cards in myDeck.deck
        let arr: number[] = [];
        for (let i: number = 0; i < this.myDeck.deck.length; i++) {
            arr.push(i);
        }
        return arr;
    }

    shuffle(arr: number[], chosen1: number | undefined, chosen2: number | undefined) : number[] {
        // this method accepts the game.hand array and two chosen numbers that represent the index of game.myDeck.deck which is held by game.hand[]
        // it returns an array that is randomly shuffled
        // we make sure that any chosen cards are not included in the shuffle using chosen1 and chosen2
        const shuffledArray = [...arr];
        for (let rounds: number = 0; rounds < 3; rounds++) {
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                // Check if chosen1 or chosen2 equals i, and skip swapping in that case
                if (chosen1 === shuffledArray[i] || chosen2 === shuffledArray[i]) {
                    continue;
                }
                // Check if chosen1 or chosen2 equals j, and skip swapping in that case
                else if (chosen1 === shuffledArray[j] || chosen2 === shuffledArray[j]) {
                    continue;
                }
                else {
                    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
                }
            }
        }
        return shuffledArray;
    }

    checkSolution(arr: number[]) : void {
        // the expected input here is game.chosen, an array of 3 numbers that represent the index in game.myDeck.deck[]
        // to evaluate the 3 cards, we look at game.myDeck.deck[i] where i is each element in game.chosen, represented by our parameter arr
        let result: boolean = true;
        let alreadyFound: boolean = false;
        let arrHistory: number[] = [];
        // compare the cards:
        let card1 = game.myDeck.deck[arr[0]].toString().replace(/,/g, '');
        let card2 = game.myDeck.deck[arr[1]].toString().replace(/,/g, '');
        let card3 = game.myDeck.deck[arr[2]].toString().replace(/,/g, '');

        for (let i: number = 0; i< 4; i++) {
            let test:boolean = (card1[i] == card2[i] && card2[i] == card3[i]) || (card1[i] !== card2[i] && card2[i] !== card3[i] && card1[i] !== card3[i]);
            if (!test) {                
                result = false;
            }
        }
        if (result) {
            // check to see if this solution was already found or not
            for (let i: number = 0; i < game.history.length; i++) {
                const historySorted: number[] = game.history[i].sort((a, b) => a - b);
                const chosenSorted: number[] = game.chosen.sort((a, b ) => a - b);
                alreadyFound = historySorted.every((value, index) => value === chosenSorted[index]);
                if (alreadyFound) {
                    break;
                }
            }

            if (!alreadyFound) {
                // this solution was not already found
                // increase the score
                game.score++;
                const scoreElem: HTMLElement | null = document.getElementById('score')
                if (scoreElem) {
                    scoreElem.innerHTML = `Score: ${this.score}`;
                }
                // attach this set to the history section
                arrHistory = [arr[0], arr[1], arr[2]];
                game.history.push(arrHistory);
                // add the cards to the history element
                game.showFeedback('greenCheck');
                for (let i: number = 0; i < arrHistory.length; i++) {
                    // here is where you find the historyContainer element and attach a div with all three cards in it...maybe
                    game.drawCard(arrHistory[i], 'historyContainer');

                }
                // trigger fun feedback for the user
            }
            else if (alreadyFound) {
                // trigger feedback to the user to let them know this was already found
                game.showFeedback('yellowCheck');
            }
            // whether found in the past or not, remove the chosen class from each card
            for (let i=0; i < 3; i++) {
                const index:number = game.chosen[i];
                const arr: number[] = game.myDeck.deck[index];
                const elemId = arr.join(',');
                const elem = document.getElementById(elemId);
                if (elem) {
                    setTimeout(function() {
                        elem.classList.remove('chosen');
                      }, 800);
                }
            }
            // clear out the chosen array
            for (let i:number = 0; i < 3; i++) {
                game.chosen.pop();
            }
        }
        else {
            // give feedback that this was not a set - animate a red x using showFeedback('red);
            game.showFeedback('redX');
            for (let i=0; i < 3; i++) {
                const index:number = game.chosen[i];
                const arr: number[] = game.myDeck.deck[index];
                const elemId = arr.join(',');
                const elem = document.getElementById(elemId);
                if (elem) {
                    elem.classList.toggle('chosen');
                }
            }
            // clear out the chosen array
            for (let i:number = 0; i < 3; i++) {
                game.chosen.pop();
            }
        }
    }
    
    removeCards(): void {
        // this method removes all the cards from the cardContainer element
        let cardContainer: HTMLElement | null = document.getElementById('cardContainer');
        if (cardContainer) {
            // loop through game.hand to remove all the card elements from the stage
            for (let i = 0; i < game.hand.length; i++) {
                const index = game.hand[i];
                const cardArr = game.myDeck.deck[index];
                const id = cardArr.toString();
                const divElem = document.getElementById(id);
                if (divElem) {
                    divElem.remove();
                }
            }
        }
        let historyContainer: HTMLElement | null = document.getElementById('historyContainer');
        // Check if the historyContainer exists
        if (historyContainer) {
            // Remove all child elements
            while (historyContainer.firstChild) {
                historyContainer.removeChild(historyContainer.firstChild);
            }
        }
    }

    showFeedback(feedbackType: string): void {
        let element = document.getElementById(feedbackType);
        if (element) {
            element.style.display = 'block'; // Show the element
            element.style.animation = 'growAndFade .8s forwards'; // Start animation

            element.addEventListener('animationend', function() {
                element.style.display = 'none'; // Hide after animation
            }, { once: true }); // Event listener will be removed after it runs once
        }
    }

    drawHowToPlay(): void {
        let elem = document.getElementById('instructions');
        let iElem = document.getElementById('instructionsButton');
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
    }

    drawCards(): void {
        // this method calls game.drawCard for game.numCards number of cards in the game.hand array (18 numCards for 3x6 grid)
        for (let i: number = 0; i < game.numCards; i++) {
            game.drawCard(game.hand[i], 'cardContainer');
        }
        // draw the history cards
        for (let i: number = 0; i < game.history.length; i++) {
            for (let j: number = 0; j < 3; j++) {
                game.drawCard(game.history[i][j], 'historyContainer');
            }
        }
    }

    drawCard(index: number, cardContainerName: string): void {
        // drawcard accepts the index of game.myDeck.deck
        // calculate cardWidth and cardHeight based on the window size and use them to define the size of the card
        let cardWidth: number = window.innerWidth/4;
        let cardHeight: number = window.innerWidth/8;
        if (window.innerWidth > 620) {
            cardWidth = 620/4;
            cardHeight = 620/8;
        }
        let cardContainer: HTMLElement | null = document.getElementById(cardContainerName);
        let shapeWidth: number = cardWidth/4.5;
        let shapeHeight: number = cardHeight/2.25;
        let svgStrokeWidth: number = cardWidth/45;
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
        let arr: number[] = game.myDeck.deck[index];
        let color: number = arr[2];
        let count: number = arr[0];
        let shape: number = arr[3];
        let shade: number = arr[1];

        let svgFill: string = '';
        let svgStroke: string = '';
        let svgShade: string = '';

        switch (shade) {
            case 1:
                // clear
                svgShade = `, 0)`;
                break;
            case 2:
                // shaded
                svgShade = `, .25)`;
                break;
            case 3:
                // filled
                svgShade = `, 1)`;
                break;
        }
        switch (color) {
            case 1:
                // blue
                svgStroke = `rgba(27, 58, 196)`;
                svgFill = `rgba(27, 58, 196`;
                break;
            case 2:
                // green
                svgStroke='rgba(62, 156, 40)';
                svgFill = `rgba(62, 156, 40`;
                break;
            case 3:
                // red
                svgStroke='rgba(196, 27, 37)';
                svgFill = `rgba(196, 27, 37`;
                break;
        }

        // add a card to cardContainer
        const cardElement: HTMLDivElement = document.createElement('div');
        cardElement.className = 'cardDiv';
        if (cardContainerName == 'historyContainer') {
            cardElement.className = 'historyCardDiv';
        }
        // if the card being drawn is in chosen[0] or chosen[1], then give it a class of chosen so the css highlights it
        // but only if it isn't going to the historyContainer
        if (cardContainerName !== 'historyContainer') {
            for (let j = 0; j < 2; j++) {
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
        cardElement.style.width = `${cardWidth}px`;
        cardElement.style.height = `${cardHeight}px`;

        if (cardContainer) {
            let tag: string = '';
            if (cardContainerName !== 'historyContainer') {
                tag = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}px" height="${cardHeight}px"><rect width="${cardWidth}px" height="${cardHeight}px" fill="white"/>`;
            }
            else {
                tag = `<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}px" height="${cardHeight}px"><rect width="${cardWidth}px" height="${cardHeight}px" fill="#d4d4d4"/>`;
            }
            // based on the count, color, shading and shape of the card, add the right card to the div element:
            for (let i: number = 0; i < count; i++) {
                
                if (shape == 1) {
                    // if the shape is a circle
                    let cirNudge = 0
                    if (count == 2) {
                        if (i == 1) {
                            cirNudge = -10;
                        }
                        else if (i == 0) {
                            cirNudge = 10;
                        }
                    }
                    tag += `<circle cx="${((cardWidth / (count) * (i + 1) - cardWidth / (count * 2))) + cirNudge}" cy="${cardHeight/2}" r="${cardHeight/4}" width = "${shapeWidth}px" height="${shapeHeight}px" stroke="${svgStroke}" fill="${svgFill}${svgShade}" stroke-width="${svgStrokeWidth}"/>`
                }

                else if (shape == 2) {
                    // else if the shape is a triangle
                    let centerX = cardWidth / 2;
                    let centerY = cardHeight / 2;

                    // let radius = cardWidth/7;
                    let radius = shapeWidth*(2/3);
                    let angleInRadians = Math.PI / 3;

                    // Calculate side length using the formula: side = 2 * radius * sin(60 degrees)
                    let sideLength = 2 * radius * Math.sin(angleInRadians);
                    // Calculate vertices of the equilateral triangle with the base down
                    
                    let nudge = (count - 1) * cardWidth/20;
                    let angle = -Math.PI / 2; // Starting angle (90 degrees clockwise from the positive x-axis)
                    let x1 = centerX + radius * Math.cos(angle) + ((0-i) * (sideLength + cardWidth/20))+ 3 * nudge;
                    let y1 = centerY + radius * Math.sin(angle) + (cardHeight/10);

                    angle += (2 * Math.PI / 3); // Move to the next vertex
                    let x2 = centerX + radius * Math.cos(angle) + ((0-i) * (sideLength + cardWidth/20))+ 3 * nudge;
                    let y2 = centerY + radius * Math.sin(angle) + (cardHeight/10);

                    angle += (2 * Math.PI / 3); // Move to the final vertex
                    let x3 = centerX + radius * Math.cos(angle) + ((0-i) * (sideLength + cardWidth/20))+ 3 * nudge;
                    let y3 = centerY + radius * Math.sin(angle) + (cardHeight/10);
                   
                    tag += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" stroke="${svgStroke}" fill="${svgFill}${svgShade}" stroke-width="${svgStrokeWidth}"/>`
                }

                else if (shape == 3) {
                    // else if the shape is a square
                    let sqNudge = 0
                    if (count == 2) {
                        if (i == 1) {
                            sqNudge = -10;
                        }
                        else if (i == 0) {
                            sqNudge = 10;
                        }   
                    }
                    tag += `<rect x="${(cardWidth/(count) * (i+1) - cardWidth/(count*2) - shapeWidth/2) + sqNudge}" y="${cardHeight/4}" width="${shapeWidth}px" height="${shapeHeight}px" stroke="${svgStroke}" fill="${svgFill}${svgShade}" stroke-width="${svgStrokeWidth}"/>`
                }       
            }
            cardElement.innerHTML += `${tag}`;   
            cardElement.innerHTML += `</svg>`;
            // append the SVG content to the innerHTML of the div 
            if (cardContainerName !== 'historyContainer') {
                cardContainer.appendChild(cardElement);
            }
            else {
                cardContainer.prepend(cardElement);
            }
            // if this card is for history, don't add an event listener. in other words, don't make history cards toggle in highlight
            if (cardContainerName !== 'historyContainer') {
                cardElement.addEventListener('click', () => {
                    game.toggleChosen(cardElement.id);
                });
            }
        }
    }

    toggleChosen(elemId: string):void {
        // we pass in a string representing the array elements, for example '1,1,1,1' and get the HTML element based on that id:
        const elem = document.getElementById(elemId);
        // if this element is not already in the game.chosen array, then add it's game.hand index to it and add the class style of 'chosen' to it so it's highlighted
        // if, by virtue of the user clicking this element, game.chosen.length equals 3, then check for a solution

        if (elem) {
            let index: number = -1;

            for (let i = 0; i < game.hand.length; i++) {
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
                for (let j=0; j< 3; j++) {
                    if (game.chosen[j] == index) {
                        game.chosen = game.chosen.filter(card => card !== game.chosen[j]);
                    }
                }
            }
        }
    }

}

class Deck {
    deck: number[][] = [];

    constructor() {
        this.deck = this.init();
    }

    init(): number[][] {
        // count:
        //      1: one, 2: two, 3: three
        //  shade
        //      1: clear, 2: shaded, 3: filled
        // color:
        //      1: blue, 2: green, 3: red
        // shape
        //      1: cirle, 2: triangle, 3: square
        let arr: number[][] = [];
        for (let count = 1; count <= 3; count++) {
            for (let shade = 1; shade <= 3; shade++) {
                for (let color = 1; color <= 3; color++) {
                    for (let shape = 1; shape <= 3; shape++) {
                        arr.push([count, shade, color, shape]);
                    }
                }    
            }
        }  
        return arr;

    }
}

function addListeners(): void {
        
    document.addEventListener('DOMContentLoaded', () => {
        let shuffleButton: HTMLElement | null = document.getElementById('shuffle');
        
        if (shuffleButton) {
            shuffleButton.addEventListener('click', () => {
                // When the user clicks on shuffle, keep any chosen cards in place and shuffle the rest of them
                // Use arrow functions to capture the correct 'this' value
                game.hand = game.shuffle(game.hand, game.chosen[0], game.chosen[1]);
                game.removeCards();
                game.drawCards();
            });
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        let instructionsButton: HTMLElement | null = document.getElementById('instructionsButton');
        
        if (instructionsButton) {
            instructionsButton.addEventListener('click', () => {
                // When the user clicks on instructions, show them the instructions on a cute window
                game.drawHowToPlay();
            });
        }
    });

    window.addEventListener('resize', () => {
        // Delete each card on the screen and redraw it at the right size
        game.removeCards();
        game.drawCards();
    });
}


const game = new Game(18);
game.drawCards();
addListeners();