//global vars to store data
let time;
let tiles_clicked;
let tiles = [];
let background;
let empty = [];
let size;

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
    
    return array.sort(()=>Math.random()-0.5);

}
    
//starts the game when player presses button, initializes things, main funciton
function shuffle(s){

    //unlike HW4, start time from zero and increment in the timer() function
    //below
    time = 0;

    size = s;

    //set background image for grid
    background = gen_bg();

    //creates initial board
    create_board();
    
    //refreshes the function every second, for timer to count up
    current_time = setInterval(timer, 1000);

}

//similar to function created in HW4 but counts up and has no time=0 lose
//condition
function timer(){

    time++;

    //sets the timer
    var min = Math.floor(time / 60); //rounds down for round number
    var sec = time % 60; //remainder is seconds
    document.getElementById('time').innerHTML = min + ":" + sec;
}

//creates the game board
function create_board(){
    
    //gets the board object defined in index.html
    var board = document.getElementById('board');
    
    //create grid
    board.style.setProperty('--grid-rows', Math.sqrt(size));
    board.style.setProperty('--grid-cols', Math.sqrt(size));

    //board.style.backgroundImage = `url(${background})`;

    //creates divs for each number of tiles on board, minus 1 tile for the
    //empty
    for (let i = 0; i < size - 1; i++){
        var tile = document.createElement('div');
        tile.className = 'grid-item';
        tile.dataset.index = i;
        tile.addEventListener('click', tile_click);

        //used as index
        tile.textContent = (i + 1);

        board.appendChild(tile);
        
    }

    //empty coords set to the bottom right tile
    empty = [Math.sqrt(size),Math.sqrt(size)];


    //tiles clicked
    tiles_clicked = 0;
}

//handles the events created by create_board() for each tile click. Calls the
//is_movable() function
function tile_click(event){
    var tile = event.target;
    var temp_x = tile.style.gridColumn;
    var temp_y = tile.style.gridRow;


    //if tile is movable, swaps it with the empty tile
    if (is_movable(tile)){

        tile.style.gridColumn = empty[0];
        tile.style.gridRow = empty[1];

        empty[0] = temp_x;
        empty[1] = temp_y;

        //tile click counter
        tiles_clicked++;
        document.getElementById('tc').innerHTML = tiles_clicked;

        //verifies if this is the last move
        verify_win();

    }

}

function is_movable(tile){

    var coords = array_index_to_grid_coord(tile.dataset.index);

    //if tile is adjacent, reutrn true
    if (coords[0] === empty[0] && Math.abs(coords[1] - empty[1]) === 1){
        return true;
    }
    else if (Math.abs(coords[0] - empty[0]) === 1 && coords[1] === empty[1]){
        return true;
    }
    return true;
    return false;
}

function array_index_to_grid_coord(index){

    var columns = Math.sqrt(size);

    var x = Math.floor(index / columns);
    var y = index % columns;

    return [x,y];
}

function verify_win(){
    
    var is_win = false;

    //loops through all elements and compares their number value to their index
    //in the grid
    let i = 0;
    for(let child of board.children){
        if (child.textContent === i + 1){
            is_win = true;
        }
        else{
            is_win = false;
            break;
        }

        i++;
    }

    if (is_win){
        //stop timer
        clearInterval(timer);
        //set the award messag
        document.getElementsByClassName('award').textContent = 'U win!';
    }
}


//checks for player to be ready upon button click
document.getElementById('shuffle').addEventListener('click', () => shuffle(16));



