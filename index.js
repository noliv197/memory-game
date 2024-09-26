import { shuffle } from './helpers.js'

// Set global constants
const TIMER_LIMIT = 3;
const INIT = {
    countdown: 3,
    zero: 0,
    null: null,
    gameStatus: 'notStarted',
    grid: { 
        'easy': { col: 4, numPairs: 6},
        'medium': { col: 4, numPairs: 8},
        'hard': { col: 5, numPairs: 10}
    }
}

const TEXT = {
    play: 'Time to Play',
    countdown: 'The game will start in ',
    memorize: 'Time to memorize',
    win: 'Congratulations!',
    timeout: 'Sorry, your time is up. Try again'
}

// From google fonts
const ICON = [
    // lamp
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="lamp" role="img"
    ><title id="lamp">Lamp</title><path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z"/></svg>`,
    // pet paw
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="petpaw" role="img"
    ><title id="petpaw">Paw</title><path d="M180-475q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180-160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm240 0q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29Zm180 160q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM266-75q-45 0-75.5-34.5T160-191q0-52 35.5-91t70.5-77q29-31 50-67.5t50-68.5q22-26 51-43t63-17q34 0 63 16t51 42q28 32 49.5 69t50.5 69q35 38 70.5 77t35.5 91q0 47-30.5 81.5T694-75q-54 0-107-9t-107-9q-54 0-107 9t-107 9Z"/></svg>`,
    // sun
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="sun" role="img"
    ><title id="sun">Sun</title><path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/></svg>`,
    // diamond
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="diamond" role="img"
    ><title id="diamond">Diamond</title><path d="M480-120 80-600l120-240h560l120 240-400 480Zm-95-520h190l-60-120h-70l-60 120Zm55 347v-267H218l222 267Zm80 0 222-267H520v267Zm144-347h106l-60-120H604l60 120Zm-474 0h106l60-120H250l-60 120Z"/></svg>`,
    // trees
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="trees" role="img"
    ><title id="trees">Trees</title><path d="M280-80v-160H0l154-240H80l280-400 120 172 120-172 280 400h-74l154 240H680v160H520v-160h-80v160H280Zm389-240h145L659-560h67L600-740l-71 101 111 159h-74l103 160Zm-523 0h428L419-560h67L360-740 234-560h67L146-320Zm0 0h155-67 252-67 155-428Zm523 0H566h74-111 197-67 155-145Zm-149 80h160-160Zm201 0Z"/></svg>`,
    // rocket
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="rocket" role="img"
    ><title id="rocket">Rocket</title><path d="m240-198 79-32q-10-29-18.5-59T287-349l-47 32v119Zm160-42h160q18-40 29-97.5T600-455q0-99-33-187.5T480-779q-54 48-87 136.5T360-455q0 60 11 117.5t29 97.5Zm80-200q-33 0-56.5-23.5T400-520q0-33 23.5-56.5T480-600q33 0 56.5 23.5T560-520q0 33-23.5 56.5T480-440Zm240 242v-119l-47-32q-5 30-13.5 60T641-230l79 32ZM480-881q99 72 149.5 183T680-440l84 56q17 11 26.5 29t9.5 38v237l-199-80H359L160-80v-237q0-20 9.5-38t26.5-29l84-56q0-147 50.5-258T480-881Z"/></svg>`,
    // house
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="house" role="img"
    ><title id="house">House</title><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>`,
    // bolt
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="bolt" role="img"
    ><title id="lamp">Lamp</title><path d="m422-232 207-248H469l29-227-185 267h139l-30 208ZM320-80l40-280H160l360-520h80l-40 320h240L400-80h-80Zm151-390Z"/></svg>`,
    // skull
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="skull" role="img"
    ><title id="skull">Skull</title><path d="M240-80v-170q-39-17-68.5-45.5t-50-64.5q-20.5-36-31-77T80-520q0-158 112-259t288-101q176 0 288 101t112 259q0 42-10.5 83t-31 77q-20.5 36-50 64.5T720-250v170H240Zm80-80h40v-80h80v80h80v-80h80v80h40v-142q38-9 67.5-30t50-50q20.5-29 31.5-64t11-74q0-125-88.5-202.5T480-800q-143 0-231.5 77.5T160-520q0 39 11 74t31.5 64q20.5 29 50.5 50t67 30v142Zm100-200h120l-60-120-60 120Zm-80-80q33 0 56.5-23.5T420-520q0-33-23.5-56.5T340-600q-33 0-56.5 23.5T260-520q0 33 23.5 56.5T340-440Zm280 0q33 0 56.5-23.5T700-520q0-33-23.5-56.5T620-600q-33 0-56.5 23.5T540-520q0 33 23.5 56.5T620-440ZM480-160Z"/></svg>`,
    // flower
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" aria-labelledby="flower" role="img"
    ><title id="flower">Flower</title><path d="M426-160q-9-26-23-48t-33-41q-19-19-41-33.5T281-306q2 29 14 54t32 45q20 20 45 32.5t54 14.5Zm108 0q29-3 54-15t45-32q20-20 32-45t15-54q-26 9-48.5 23T590-250q-19 19-33 41.5T534-160Zm-54-360q66 0 113-47t47-113v-48l-70 59-90-109-90 109-70-59v48q0 66 47 113t113 47ZM440-80q-100 0-170-70t-70-170v-80q71-1 134 29t106 81v-153q-86-14-143-80.5T240-680v-136q0-26 23-36.5t43 6.5l74 64 69-84q12-14 31-14t31 14l69 84 74-64q20-17 43-6.5t23 36.5v136q0 90-57 156.5T520-443v153q43-51 106-81t134-29v80q0 100-70 170T520-80h-80Zm40-569Zm127 416Zm-253 0Z"/></svg>`,
]

// Set global variables 
let board = [];
let lastFlip, countdownTimer, timer, countdown, numPairs, gridCols = null;
let matches = 0, moves = 0, secs = 0, min = 0;
let level = 'hard';
let gameStatus = 'notStarted';
////////////////////////////////////////////////////////

/* Change game variable functions */
const changeMatches = () => {
    lastFlip = null;
    matches++;
    $('#matches').val(`${matches}/${numPairs}`);
}

const changeMoves = () => {
    moves++;
    $('#moves').val(moves);
}

/* Game setup functions */
const startNewGame = () => {
    // change banner text
    $('#banner-title').text(TEXT.memorize);
    $('#banner-timer').text(TEXT.countdown + countdown)
    
    // start countdown
    runCountDown();
}

const setOnGoingGame = () => {
    // stop interval function
    clearInterval(countdownTimer);

    // change banner text
    $('#banner-title').text(TEXT.play);
    $('#banner-timer').text('');

    // unflip cards
    $('.flip-container').each( (id, el) => flipCard($(el), 'backwards'));
    
    // start game changing status and starting timer
    gameStatus = 'onGoing';
    runTimer();
}

const endGame = (text) => {
    clearInterval(timer);
    $('#banner-title').text(text);
    gameStatus='end';
}

const handleCorrectMatch = (cardId) => {
    //  change bkg color to success and change match count
    disableCard(cardId, 1);
    disableCard(cardId, 2);
    changeMatches();
    // check if over
    if(matches === numPairs) endGame(TEXT.win);
}

const restartSettings = () => {
    // reset variables
    moves = INIT.zero, matches = INIT.zero, 
    secs = INIT.zero, min = INIT.zero;
    countdown = INIT.countdown;
    lastFlip = INIT.null;
    numPairs = INIT.grid[level].numPairs;
    gridCols = INIT.grid[level].col;

    // stop interval functions
    clearInterval(timer);
    clearInterval(countdownTimer);

    // reset HTML TEXT
    $('#board').empty();
    $('#moves').val(moves);
    $('#timer').val('0:00');
    $('#matches').val(`${matches}/${numPairs}`);
}

const setBoard = (status='empty') => {
    restartSettings();
    createBoard(status);

    if(status === 'new' || status === 'restart') startNewGame();
    console.log($('button[data-game="restart"]').is(':disabled'))
    if(
        status !== 'empty' && 
        $('button[data-game="restart"]').is(':disabled')
    ) toggleBtnDisable('enable');
    
}

/* Functions with interval */
const runTimer = () => {
    timer = setInterval(()=> {
        if (min === TIMER_LIMIT) {
            endGame(TEXT.timeout);
            return;
        };

        if(secs === 59){
            min++;
            secs = 0;
        } else secs++;

        $('#timer').text(`${min}:${secs < 10 ? `0${secs}`: secs}`);
    }, 1000)
}

const runCountDown = () => {
    countdownTimer = setInterval(()=> {
        if (countdown <= 0) {
            setOnGoingGame();
            return;
        };
        
        countdown--;
        $('#banner-timer').text(TEXT.countdown + countdown);
    }, 1000);

    // flip all cards
    $('.flip-container').each( (id, el) => flipCard($(el), 'forward'));
}

/* Change html functions */
const toggleBtnDisable = (state) => {
    switch (state) {
        case 'enable':
            $('button[data-game="restart"]').addClass('hover:text-blue-950 hover:bg-yellow-100')
            $('button[data-game="restart"]').removeClass('cursor-not-allowed opacity-50');
            $('button[data-game="restart"]').attr('disabled',false)
        break;
        default:
            $('button[data-game="restart"]').addClass('cursor-not-allowed opacity-50')
            $('button[data-game="restart"]').removeClass('hover:text-blue-950 hover:bg-yellow-100');
            $('button[data-game="restart"]').attr('disabled',true)
        break;
    }
}

const disableCard = (cardId, num) => {
    $(`div[data-id="${cardId}-${num}"]`).removeClass('bg-gray-700 hover:cursor-pointer');
    $(`div[data-id="${cardId}-${num}"]`).addClass('bg-yellow-600');
    $(`div[data-id="${cardId}-${num}"]`).data("match", true)
}

const createBoard = (status) => {
    let options = [];
    if (
        status === 'new' ||
        status === 'empty' ||
        board.length === 0 && status === 'restart'
    ){
        for (let index = 0; index < numPairs; index++) {
            let content = (status === 'empty' ? '' : ICON[index]);
            let id = (status === 'empty' ? '' : index);
            // duplicate for match
            options.push({content: content, id: id + '-1'});
            options.push({content: content, id: id + '-2'});
        } 
        // mix positions
        board = shuffle(options);
    }
    
    const boardDiv = $(`<div class="grid gap-2 grid-cols-${gridCols} justify-items-center md:w-2/3 mx-auto"></div>`);
    board.forEach( obj => {
        const card = $(`<div class="
            rounded-full w-[75px] h-[75px] md:w-[100px] md:h-[100px] 
            flex items-center justify-center
            ${status !== 'empty' ? 'hover:cursor-pointer' : ' '}
            bg-gray-700 text-white text-center
            flip-container
            ">
            <div class="back">${obj.content}</div>
            <div class="front">${obj.content}</div>
            </div>`
        );

        // set icon classes
        $(card).children().children('svg').addClass("fill-white w-[24px] h-[24px] md:w-[50px] md:h-[50px]");
        $(card).children('div').addClass("absolute rounded-full w-full h-full flex items-center justify-center");
        
        card.attr('data-id', obj.id);
        
        if(status !== 'empty') card.on('click', (e) => handleCardClick(e,obj));
        
        boardDiv.append(card);
    })

    $('#board').append(boardDiv);
}

/* Handle flip functions */
const flipCard = (element) => {
    $(element).toggleClass('flipped');
}

const handleCardClick = (e,obj) => {

    if(gameStatus === 'onGoing'){
        // change moves counter
        const cardId = obj.id;
        const currentCard = $(`div[data-id="${cardId}"]`);
        
        // no action if card is already a correct match or the same as before
        if(currentCard.data("match") || lastFlip === cardId) return;

        changeMoves();
        flipCard(currentCard);
        
        if(!lastFlip){
            //  set lastFlip to compare to next click
            lastFlip = cardId;
            return;
        } 

        const [cardMatch, cardNum] = obj.id.split('-');
        const [lastCardMatch, lastCardNum] = lastFlip.split('-');
        if (lastCardMatch === cardMatch && cardNum !== lastCardNum){
            // handle a match
            handleCorrectMatch(cardMatch);
        } else {
            //  unflip current and last flipped card
            setTimeout(() => {
                flipCard(currentCard);
                flipCard($(`div[data-id="${lastFlip}"]`));
                lastFlip = null;
            }, 500);
            
        }
    }
}


$('button[data-game="new"]').on('click', () => setBoard('new'))
$('button[data-game="restart"]').on('click', () => setBoard('restart'))
setBoard();
