//global vars to store data
let time;
let tiles_clicked;
let tiles = [];
let background;
let empty = [];
let shuffle_order = [];
let board;
let size;
let num_shuffles
let shuffle_interval = 150;
let current_time;
let audio;

function choose_bg(num){

    for (let child of board.children){
        child.style.backgroundImage = `url(pics/b${num}.png)`;
    }

}

function gen_bg(option){

    var basedir = "pics/";
    
    //returns random background if no option selected i.e. first boot.
    //otherwise selects that number background
    if (option == undefined){

        var background_images = ["b1.png","b2.png","b3.png","b4.png"];
        var bg = background_images[Math.floor(Math.random() * background_images.length)];

    }
    else{
       var bg = background_images[option];
    }

    return basedir + bg;
}

//shuffle by inputting random nums to sort()
function shuffle_helper(array){
    
    return array[Math.floor(Math.random() * array.length)];


}
    
//starts the game when player presses button, initializes things, main funciton
function initial_load(s){

    //unlike HW4, start time from zero and increment in the timer() function
    //below
    time = 0;

    size = s;

    //set background image for grid
    background = gen_bg();

    //creates initial board
    create_board();
    

}

function shuffle_worker(){

        var movable = [];

        //find movable tiles
        for (let child of board.children){

            if(is_movable(child.dataset.index) && child.dataset.index != shuffle_order.slice(-1)){
                movable.push(child);
            }
        }

        var shuffled = shuffle_helper(movable);
        
        shuffle_order.push(shuffled.dataset.index);

        // setTimeout(() => swap_tile(shuffled), 100);
        swap_tile(shuffled);
        shuffle_counter++;
    
        if (shuffle_counter >= num_shuffles){
            clearInterval(shuffling);

            //refreshes the function every second, for timer to count up
            current_time = setInterval(timer, 1000);
            audio = new Audio('./dvu.mp3');
            audio.play();
        }
}

function shuffle(num){

    shuffle_order = [];

    num_shuffles = num;

    shuffle_counter = 0;
    shuffling = setInterval(shuffle_worker, shuffle_interval);

}

            

//similar to function created in HW4 but counts up and has no time=0 lose
//condition
function timer(){

    time++;

    //sets the timer
    var min = Math.floor(time / 60); //rounds down for round number
    var sec = time % 60; //remainder is seconds
    document.getElementById('time').textContent = min + ":" + sec;
}

//creates the game board
function create_board(){
    
    //gets the board object defined in index.html
    board = document.getElementById('board');

    //clear
    board.innerHTML = '';
    
    //create grid
    board.style.width = 100 * Math.sqrt(size) + "px";

    board.style.setProperty('--grid-rows', Math.sqrt(size));
    board.style.setProperty('--grid-cols', Math.sqrt(size));

    //creates divs for each number of tiles on board, minus 1 tile for the
    //empty
    for (let i = 0; i < size - 1; i++){
        var tile = document.createElement('div');
        tile.className = 'grid-item';
        tile.dataset.index = i;
        tile.addEventListener('click', tile_click);
        tile.addEventListener('mouseover', tile_hover);
        tile.addEventListener('mouseout', tile_hover_off);
        tile.style.border = "2px solid black";
        
        //intitial tile position
        var cd = array_index_to_grid_coord(i);
        tile.style.gridColumn = cd[0];
        tile.style.gridRow = cd[1];

        //set image
        tile.style.backgroundImage = `url(${background})`;

        //set image position
        var bg_string = String(-(100 * (cd[0] -1)))  + "px " + String(-((cd[1] -1) * 100)) + "px";
        console.log(bg_string);
        tile.style.backgroundPosition = bg_string;

        tile.textContent = String(i + 1);

        board.appendChild(tile);
        
    }

    //empty coords set to the bottom right tile
    empty = [Math.sqrt(size),Math.sqrt(size),15]; //15 is index


    //tiles clicked
    tiles_clicked = 0;
}

//handles the events created by create_board() for each tile click. Calls the
//is_movable() function
function tile_click(event){
    var tile = event.target;

    //if tile is movable, swaps it with the empty tile
    if (is_movable(tile.dataset.index)){

        swap_tile(tile);

        //tile click counter
        tiles_clicked++;
        document.getElementById('tc').textContent = tiles_clicked;

        //verifies if this is the last move
        verify_win();

    }

}

//handles the events created by create_board() for each tile hover. Calls the
//is_movable() function
function tile_hover(event){
    var tile = event.target;

    //if tile is movable, swaps it with the empty tile
    if (is_movable(tile.dataset.index)){

        tile.style.border = "2px solid #006600";


    }
    // setTimeout(() => tile.style.border = "2px solid black", 500);

}

function tile_hover_off(event){
    var tile = event.target;

    //if tile is movable, swaps it with the empty tile
    if (is_movable(tile.dataset.index)){

        tile.style.border = "2px solid black";


    }
    // setTimeout(() => tile.style.border = "2px solid black", 500);

}
function swap_tile(tile){

    var coords = array_index_to_grid_coord(tile.dataset.index);

    //swap index for coord calculation
    var temp;
    temp = empty[2];
    empty[2] = tile.dataset.index;
    tile.dataset.index = temp;

    tile.style.gridColumn = empty[0];
    tile.style.gridRow = empty[1];

    // tile.style.backgroundPosition = String(empty[0] * 100) + " " + String(empty[1] * 100);

    empty[0] = coords[0];
    empty[1] = coords[1];

}

function is_movable(index){

    var coords = array_index_to_grid_coord(index);

    if (coords === empty.slice(0,1)){
        return false;
    }

    //if tile is adjacent, reutrn true
    if (coords[0] === empty[0] && Math.abs(coords[1] - empty[1]) === 1){
        return true;
    }
    else if (Math.abs(coords[0] - empty[0]) === 1 && coords[1] === empty[1]){
        return true;
    }
    return false;
}

function array_index_to_grid_coord(index){

    var columns = Math.sqrt(size);

    var x = Math.floor(index / columns);
    var y = index % columns;

    return [y + 1,x + 1];
}

function verify_win(){
    
    var is_win = false;

    //loops through all elements and compares their number value to their index
    //in the grid
    for(let child of board.children){

        let label = parseInt(child.textContent);
        let index = parseInt(child.dataset.index);

        if (label != index + 1){
            return false;
        }

    }

    win();

}

function win(){

    //stop timer
    clearInterval(current_time);
    //set the award messag
    document.getElementById('award').textContent = 'U win!';

    setTimeout(() => choose_bg(5),500);

    audio.pause();

}


//checks for player to be ready upon button click
document.getElementById('4x4').addEventListener('click', () => initial_load(16));
document.getElementById('8x8').addEventListener('click', () => initial_load(64));
document.getElementById('10x10').addEventListener('click', () => initial_load(100));

//chose bg
document.getElementById('obama').addEventListener('click', () => choose_bg(1));
document.getElementById('biden').addEventListener('click', () => choose_bg(2));
document.getElementById('stallman').addEventListener('click', () => choose_bg(3));
document.getElementById('linus').addEventListener('click', () => choose_bg(4));

//times to shuffle

document.getElementById('shuffle5').addEventListener('click', () => shuffle(5));
document.getElementById('shuffle50').addEventListener('click', () => shuffle(50));



