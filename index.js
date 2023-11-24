//global vars to store data
let time;
let remaining;
let visible = [];
let matches = [];
let images = [];

//returns a shuffled array of images to put in a grid
function gen_images(num_pics){

    var images_array = ["image001.gif","image002.gif","image003.gif","image004.gif",
                       "image005.gif","image006.gif","image007.gif","image008.gif",
                       "image009.gif","image0010.gif","image0011.gif","image0012.gif"];

    //remove extras if using less pics. I added the 4* after the fact and am
    //not sure what is going on with my math but it works so im keeping it.
    //thought just length - num_pics should work.
    for (let i = 0; i < (images_array.length - num_pics);i++){
        images_array.pop();
    }

    //make array of all options, then shuffle like deal or no deal
    return shuffle(images_array.concat(images_array));
}

//shuffle by inputting random nums to sort()
function shuffle(array){
    
    return array.sort(()=>Math.random()-0.5);

}
    
//gets time of each picture amount
function get_pic_time(num_pics){
    if (num_pics === 8){
        return 120;
    }
    else if (num_pics === 10){
        return 150;
    }
    else{
        return 180;
    }
}

//starts the game when player presses button, initializes things
function ready(num_pics, diff){

    //get round time
    time = get_pic_time(num_pics);

    //create images for grid
    images = gen_images(num_pics);
    visible = [];
    pairs = [];

    //creates initial board
    create_board();
    
    //refreshes the function every second
    remaining = setInterval(timer, 1000);

}

//checks for timer to be 0, compares current time to max time and
//sets
function timer(){

    time--;

    //checks for time to be up
    if(time === 0){
        //stop timer function from running again
        clearInterval(timer);
        document.getElementById('award').textContent = 'Loser! You\'re a Loser! Baby want a bottle, a big dirt bottle?';
    }

    //sets the timer
    var min = Math.floor(time / 60); //rounds down for round number
    var sec = time % 60; //remainder is seconds
    document.getElementById('remaining').innerHTML = min + ":" + sec;
}

//creates the game board
function create_board(){
    
    //gets the board object defined in index.html
    var board = document.getElementById('board');

    //loops through number of images to add each shuffled image to the board,
    //and adds click event listeners for each
    for (let i = 0; i < images.length; i++){
        var tile = document.createElement('div');
        tile.className = 'tile';
        tile.dataset.index = i;
        tile.addEventListener('click', tile_click);

        tile.style.backgroundImage = `url(pics/${images[tile.dataset.index]})`;
        board.appendChild(tile);
        
    }
    //after the seconds set in difficulty, board sets all tiles to the
    //default
    setTimeout(set_default, difficulty * 1000);
}

function set_default(){
    for (let i = 0; i < board.children.length; i++){
        board.children[i].style.backgroundImage = `url(pics/${board.children[i].dataset.index}.gif)`;
    }
}

//handles the events created by create_board() for each tile click
function tile_click(event){
    var tile = event.target;

    //stores a clicked tile in visible if there is room
    if(!visible.includes(tile) && visible.length < 2){
        tile.style.backgroundImage = `url(pics/${images[tile.dataset.index]})`;
        visible.push(tile);

        //check for second tile
        if (visible.length === 2){
            //waits slightly before setting match so the user can still see
            //what they clicked
            setTimeout(verify_match,250);
        }
    }
}

//verifies if the two visible tiles are matching
function verify_match(){

    //if the indexes of both visible images return the same object from
    //images[],
    //they are matches

    if (images[visible[0].dataset.index] === images[visible[1].dataset.index]){

        //valid match, push to matches list
        matches.push(visible[0]);
        matches.push(visible[1]);

        //all images are matched, win condition
        if (matches.length >= images.length){
        
            //stop timer
            clearInterval(timer);
            //set the award message as per the outline
            document.getElementsByClassName('award').textContent = 'U win!';
        }
        else {
            //no win, remove the two matches from play
            visible[0].style.backgroundImage = `url(pics/match.png)`;
            visible[1].style.backgroundImage = `url(pics/match.png)`;
        }
    }
    //reset images
    else{
        visible[0].style.backgroundImage = `url(pics/${visible[0].dataset.index}.gif)`;
        visible[1].style.backgroundImage = `url(pics/${visible[1].dataset.index}.gif)`;
    }


    //always clear the visible array or pieces will remain on board
    visible = []; 
}

//prompts for pic num and difficulty
var num = parseInt(prompt("Enter number of pictures (8,10,12): "));
var difficulty = parseInt(prompt("Enter difficulty (3,5,8): "));
//checks for player to be ready upon button click
document.getElementById('ready').addEventListener('click', () => ready(num,difficulty));



