import { shuffle } from './helpers.js'

// Set global variables 
let board = [];
let lastFlip = null;
let moves = 0;
let matches = 0;
let timer = '';
let countdown = 3;
let level = 4;
let gameStatus = 'notStarted'

// code with jQuery
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

const createBoard = (n, status='empty') => {
    const boardDiv = $(`<div class="grid gap-4 grid-cols-${n} justify-items-center"></div>`);

    moves = 0;
    matches = 0;
    let options = [];

    if (
        status === 'new' ||
        status === 'empty' ||
        board.length === 0 && status === 'restart'
    ){
        for (let index = 1; index < n + 1; index++) {
            if(status === 'empty') {
                options.push({content: index, id: index});
                options.push({content: index, id: index});
            } else {
                options.push({content: index, id: index});
                options.push({content: index, id: index});
            }
        }

        board = shuffle(options);
    }

    board.forEach( obj => {
        const card = $(`<div class="
         rounded-full w-[100px] h-[100px] flex items-center justify-center
         hover:cursor-pointer
         flip-container
         bg-gray-700 text-white text-center">
            <div class="front hidden">${obj.content}</div>
         </div>`
        );

        card.attr('data-id', obj.id);

        const content = $(`<div class="back">${obj.content}</div>`);
        card.append(content);

        card.on('click', (e) => flipCard(e,obj));
        boardDiv.append(card);
    })

    $('#board').empty();
    $('#board').append(boardDiv);
    $('#moves').val(moves);
    $('#matches').val(`${matches}/${level}`);
    if(status !== 'empty') gameStatus = 'onGoing';
}

$('button[data-game="new"]').on('click', () => createBoard(level, 'new'))
$('button[data-game="restart"]').on('click', () => createBoard(level, 'restart'))
createBoard(level);
