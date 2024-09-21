import { shuffle } from './helpers.js'

// Set global variables 
let board = [];
let lastFlip, countdownTimer, timer = null;
let matches = 0, secs = 0, min = 0, moves = 0;
let countdown = 3;
let level = 4;
let gameStatus = 'notStarted';

// Define html texts
const texts = {
    play: 'Time to Play',
    countdown: 'The game will start in ',
    memorize: 'Time to memorize',
    win: 'Congratulations!',
    timeout: 'Sorry, your time is up. Try again'
}


const flipCard = (e,obj) => {

    if(gameStatus === 'onGoing'){
        // change moves counter
        moves++;
        $('#moves').val(moves);

        // handle match
        const cardId = $(e.target).data('id');
        console.log({
            flip: lastFlip,
            matches: matches,
            moves: moves,
            cardId: cardId,
        })

        if(!lastFlip){
            //  set lastFlip to compare to next click
            lastFlip = cardId;
        } else if (lastFlip === cardId){
            //  change bkg color to success and change match count
            // make more smooth
            $(`div[data-id="${cardId}"]`).removeClass('bg-gray-700');
            $(`div[data-id="${cardId}"]`).addClass('bg-yellow-600');
                
            matches++;
            $('#matches').val(`${matches}/${level}`);

            // check if over
            lastFlip = null;
            
        } else {
            lastFlip = null;
            //  unflip current and last flipped card

        }

        $(e.target).toggleClass('flip');
        setTimeout(function() {
            $(e.target).children('div.front').toggleClass('hidden');
            $(e.target).children('div.back').toggleClass('hidden');
            console.log('Flip effect completed!');
        }, 2000);
    }
}

const runTimer = () => {
    timer = setInterval(()=> {
        if (min === 5) {
            clearInterval(timer);
            $('#banner-title').text(texts.timeout);
            gameStatus='end';
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
            clearInterval(countdownTimer);
            $('#banner-title').text(texts.play);
            $('#banner-timer').text('');
            runTimer();
            return;
        };

        countdown--;
        $('#banner-timer').text(texts.countdown + countdown);
    }, 1000)
}

const startNewGame = () => {
    $('#banner-title').text(texts.memorize);
    $('#banner-timer').text(texts.countdown + countdown)
    runCountDown();
}

const endGame = () => {

}

const restartSettings = () => {
    // variables
    moves = 0;
    matches = 0;
    secs = 0;
    min = 0;
    countdown = 3;
    lastFlip = null;

    clearInterval(timer);
    clearInterval(countdownTimer);
    // HTML texts
    $('#board').empty();
    $('#moves').val(moves);
    $('#timer').val('0:00');
    $('#matches').val(`${matches}/${level}`);
}

const createBoard = (status='empty') => {
    restartSettings();
    
    const boardDiv = $(`<div class="grid gap-4 grid-cols-${level} justify-items-center"></div>`);
    let options = [];
    if (
        status === 'new' ||
        status === 'empty' ||
        board.length === 0 && status === 'restart'
    ){
        for (let index = 1; index < level + 1; index++) {
            let content = status === 'empty' ? '' : index;
            let id = status === 'empty' ? '' : index;
            // duplicate for match
            options.push({content: content, id: id});
            options.push({content: content, id: id});
        } 
        // mix positions
        board = shuffle(options);
    }

    board.forEach( obj => {
        const card = $(`<div class="
         rounded-full w-[100px] h-[100px] flex items-center justify-center
         ${status !== 'empty' ? 'hover:cursor-pointer' : ' '}
         flip-container
         bg-gray-700 text-white text-center">
            <div class="front hidden">${obj.content}</div>
         </div>`
        );

        card.attr('data-id', obj.id);
        const content = $(`<div class="back">${obj.content}</div>`);
        card.append(content);

        if(status !== 'empty') card.on('click', (e) => flipCard(e,obj));
        boardDiv.append(card);
    })

    $('#board').append(boardDiv);

    if(status === 'new' || status === 'restart') startNewGame();
    if(status !== 'empty') gameStatus = 'onGoing'; 

    if(status !== 'empty' && $('button[data-game="restart"]').is(':disabled')){
        $('button[data-game="restart"]').addClass('hover:text-blue-950 hover:bg-yellow-100')
        $('button[data-game="restart"]').removeClass('cursor-not-allowed opacity-50');
        $('button[data-game="restart"]').attr('disabled',false)
    }
}

$('button[data-game="new"]').on('click', () => createBoard('new'))
$('button[data-game="restart"]').on('click', () => createBoard('restart'))
createBoard();
