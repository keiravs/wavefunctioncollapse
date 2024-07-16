// Attempt at Implementing the Wave Function Collapse.
var STOP = false;
var CanvasH = 4500;
var CanvasW = 4500;
var TileSize = 90;
var Rows = CanvasH / TileSize;
var Cols = CanvasW / TileSize;
var zoom = 2;
var angle = 0.1;
var centerX;
var centerY;

var TileShape = [3, 3];     // Refers to grid size of tiles. ie 3x3, 5x5 etc.
var Tilegrids = [TileSize/TileShape[0], TileSize/TileShape[1]];

var grid;
var tiles = [];

var sourceTiles = {
        8: [[0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]],

        10:  [[0, 0, 0],
            [1, 1, 0],
            [0, 1, 0]],

        9: [[0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]],
        
        3: [[0, 1, 0],
            [1, 1, 1],
            [0, 1, 0]],
        
        4: [[0, 0, 0],
            [0, 1, 1],
            [0, 1, 0]],
        
        5: [[0, 1, 0],
            [1, 1, 0],
            [0, 0, 0]],

        7: [[0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]],
        
        6: [[0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]],
        
        0: [[0, 1, 0],
            [1, 1, 0],
            [0, 1, 0]],
        
        2: [[0, 0, 0],
            [1, 1, 1],
            [0, 0, 0]],
        
        1: [[0, 1, 0],
            [0, 1, 1],
            [0, 0, 0]],
        
        11: [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]],
};

var TileRules = {
        "": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        "U": [0, 1, 3, 5, 7, 8, 9],
        "UR": [1, 3, 7, 8],
        "UD": [0, 3, 7, 9],
        "UL": [0, 3, 5, 8],
        "URD": [3, 7],
        "UDL": [0, 3],
        "URL": [3, 8],
        "URDL": [3],
        "R": [1, 2, 3, 4, 6, 7, 8],
        "RD": [3, 4, 6, 7],
        "RL": [2, 3, 6, 8],
        "RDL": [3, 6],
        "D": [0, 3, 4, 6, 7, 9, 10],
        "DL": [0, 3, 6, 10],
        "L": [0, 2, 3, 5, 6, 8, 10]
    };

var TileRules = {
    "": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    "UNNN": [],
    "R": []
}

//      UP -> BLANK, YES, NO
//      RIGHT ->
//      LEFT ->
//      DOWN ->
//      Every code is of length 4 to describe each direction.
//      Each direction could be:
//       - BLANK (Cell in that direction is uncollapsed)
//       - YES (Cell in that direction is collapsed and is connected from that side)
//       - NO (Cell in that direction is collapsed but isn't connected from that side)

//      RULES -> YYYY, BYYY, YBYY, YYBY, YYYB, 
var TileDirs = {
        0: ["U", "D" , "L"],
        1: ["U", "R"],
        2: ["R", "L"],
        3: ["U", "R", "D", "L"],
        4: ["R", "D"],
        5: ["U", "L"],
        6: ["R", "D", "L"],
        7: ["U", "R", "D"],
        8: ["U", "R", "L"],
        9: ["U", "D"],
        10: ["D", "L"],
        11: []
    };

class Tile{
    constructor(sourceTile, image){
        this.sourceTile = sourceTile;
        this.image = image;

    }

    setImage(image){
        this.image = image;
    }

    printDirs(){
        print(`U: ${this.up()}, R: ${this.right()}, D: ${this.down()}, L: ${this.left()}\n`);
    }

    up(){
        return this.sourceTile[0][1];
    }
    right(){
        return this.sourceTile[1][2];
    }
    down(){
        return this.sourceTile[2][1];
    }
    left(){
        return this.sourceTile[1][0];
    }

    draw(x_coords, y_coords){
        image(this.image, x_coords, y_coords);
    }
}

class TileGrid{
    constructor(x, y, options){
        this.x = x;
        this.y = y;
        this.x_coords = x * TileSize;
        this.y_coords = y * TileSize;
        this.tile = null;
        this.options = options;
        this.checked = false;
        this.collapsed = false;
    }

    isCollapsed(){
        return this.collapsed;
    }

    check(){
        this.checked = true;
    }

    uncheck(){
        this.checked = false;
    }

    // FIGURE OUT WHY SOMETIMES OPTIONS LIST IS EMPTY
    collapse(){
        // print(`Options length: ${this.options.length}`);
        if(this.options.length != 0){
            this.tile = random(this.options);
            this.options = [];
            this.collapsed = true;
        }else{
            print(`NO OPTIONS AVAILABLE`);
            this.printTile();
            STOP = true;
        }
    }

    printTile(){
        print(`x: ${this.x}, y: ${this.y}, collapsed: ${this.collapsed}, options length: ${this.options.length}`);
    }
    setTile(tile){
        this.tile = tile;
        this.collapsed = true;
    }

    up(){
        return this.tile.up();
    }
    right(){
        return this.tile.right();
    }
    down(){
        return this.tile.down();
    }
    left(){
        return this.tile.left();
    }

    draw(){
        if(this.collapsed) this.tile.draw(this.x_coords, this.y_coords);
    }

    getdownrule(){
        if(this.collapsed) return this.down();
        let rules = new Set();
        let i = 0;
        while(i < this.options.length && rules.size < 2){
            rules.add(this.options[i].down());
            i++;
        }
        if(rules.size == 1) return rules[0];        // Return only possible rule. Either 0 or 1
        if(rules.size == 2) return 2;               // Return 2 which indicates both 0 or 1 are possible
        // Return -1. An inconsistency has been reached.
        if(rules.size == 0){
            print("-1 Returned. No options Available");
            this.printTile();
            return -1;              
        }
    }

    getleftrule(){
        if(this.collapsed) return this.left();
        let rules = new Set();
        let i = 0;
        while(i < this.options.length && rules.size < 2){
            rules.add(this.options[i].left());
            i++;
        }
        if(rules.size == 1) return rules[0];
        if(rules.size == 2) return 2;
        if(rules.size == 0){
            print("-1 Returned. No options Available");
            this.printTile();
            return -1;              
        }
    }

    getuprule(){
        if(this.collapsed) return this.up();
        let rules = new Set();
        let i = 0;
        while(i < this.options.length && rules.size < 2){
            rules.add(this.options[i].up());
            i++;
        }
        if(rules.size == 1) return rules[0];
        if(rules.size == 2) return 2;
        if(rules.size == 0){
            print("-1 Returned. No options Available");
            this.printTile();
            return -1;              
        }
    }

    getrightrule(){
        if(this.collapsed) return this.right();
        let rules = new Set();
        let i = 0;
        while(i < this.options.length && rules.size < 2){
            rules.add(this.options[i].right());
            i++;
        }
        if(rules.size == 1) return rules[0];
        if(rules.size == 2) return 2;
        if(rules.size == 0){
            print("-1 Returned. No options Available");
            this.printTile();
            return -1;              
        }
    }
}

class Grid{
    constructor(rows, cols){
        this.tiles = [];
        this.gridEntropies = [];
        this.lowestEntropies = [];             // Updated each cycle. Refers to tile(s) in grid with the lowest entropy
        this.generateTiles();
    }

    generateTiles(){
        for(let x=0; x < Cols; x++){
            for(let y=0; y < Rows; y++){
                this.tiles[x*Cols + y] = new TileGrid(x, y, tiles);
            }
        }
    }

    getNeighbours(tile, all=false){
        let output = [];
        let dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]];  // [Up, Right, Down, Left]
        dirs.forEach((dir) => {
            let nx = tile.x + dir[0];
            let ny = tile.y + dir[1];
            let neighbour = this.getTile(nx, ny);
            if(neighbour){
                if(!all){       // We only want uncollapsed and unchecked neighbours
                    if(!neighbour.isCollapsed() && !neighbour.checked) output.push(neighbour);      // if neighbour is uncollapsed add to output
                }else{
                    output.push(neighbour);         // We want all neighbours
                }
            }
        });
        return output;
    }

    // Collapses tile and updates entropies for all other tiles
    collapse(tile){
        tile.collapse();
        tile.check();
        // Update neighbours and their neighbours and so on.
        // In the recursive propagation, only add the  current cell's neighbours to
        // the stack if the current cell's entropy changes.
        let stack = [];
        stack = stack.concat(this.getNeighbours(tile));
        // print(`Num Neighbrs: ${this.getNeighbours(tile).length}`);
        // print(`Stack Length: ${stack.length}`);
        while(stack.length > 0){
            let stile = stack.pop()
            let newoptions = [];
            // Get all neighbouring tiles
            let uptile = this.getTile(stile.x, stile.y-1);
            let uprule = 0;
            let righttile = this.getTile(stile.x+1, stile.y);
            let rightrule = 0;
            let downtile = this.getTile(stile.x, stile.y+1);
            let downrule = 0;
            let lefttile = this.getTile(stile.x-1, stile.y);
            let leftrule = 0;

            // Check if any direction becomes 'compulsory' eg. tile HAS to have an up connection
            // If tile is null, it means boundary tile. Connection can be either 0 or 1. Hence set rule to 2.
            uptile ? uprule = uptile.getdownrule() : uprule = 2;
            righttile ? rightrule = righttile.getleftrule() : rightrule = 2;
            downtile ? downrule = downtile.getuprule() : downrule = 2;
            lefttile ? leftrule = lefttile.getrightrule() : leftrule = 2;
            
            // Once each direction's requirement has been evaluated. Check which options satisfy these.
            // Loop through current tile options and filter out options that do not adhere to rules
            // If a direction can be either 0 or 1 it will not cause any options to be excluded
            stile.options.forEach((option) => {
                let u = false;
                let r = false;
                let d = false;
                let l = false;
                uprule == 2 ? u = true : u = option.up() == uprule;
                rightrule == 2 ? r = true : r = option.right() == rightrule;
                downrule == 2 ? d = true : d = option.down() == downrule;
                leftrule == 2 ? l = true : l = option.left() == leftrule;
                if(u && r && d && l) newoptions.push(option);
            });
            
            // Check if tile's entropy has changed. If so, add neighbours to stack
            // to see if their entropies will also change
            if(stile.options.length != newoptions.length){
                if(newoptions.length != 0) stile.options = newoptions;
                stack = stack.concat(this.getNeighbours(stile));
            }
            stile.check();                              // Mark tile as checked
        }
    }

    chooseTile(){
        this.lowestEntropies = [];
        let lowestEntropy = 1000;
        // print(`Num Tiles: ${this.tiles.length}`);
        this.tiles.forEach((tile) => {
            if(!tile.isCollapsed()){
                tile.uncheck();
                let entropy = tile.options.length;
                if(entropy < lowestEntropy){
                    lowestEntropy = entropy;
                    this.lowestEntropies = [tile];
                }else if(entropy == lowestEntropy){
                    this.lowestEntropies.push(tile);
                }
            }
        });
        // print(`lowest entropy: ${lowestEntropy}`);
        return random(this.lowestEntropies);
    }

    getTile(x, y){
        if(x < 0 || x > Cols) return null;
        if(y < 0 || y > Rows) return null;
        return this.tiles[x*Cols + y];
    }

    setTile(x, y, tile){
        let gridTile = this.getTile(x, y);
        gridTile.setTile(tile);
    }

    drawTiles(){
        this.tiles.forEach((tile)=>{
            tile.draw();
        });
    }
}


function loadTiles(tile_dir){
    let output = [];
    let ext = '.png';
    for(let i=0; i < 12; i++){
        let image = loadImage(tile_dir+i+ext);
        let new_tile = new Tile(sourceTiles[i], image)
        output.push(new_tile);
    }
    return output;
}

function drawGridLines(){
    stroke(255, 0, 0);
    for(let x=0; x < CanvasH; x += TileSize){
        line(x, 0, x, CanvasH);
        line(0, x, CanvasW, x);
    }
}

function preload(){
    tiles = loadTiles('wfcollapse_tiles/set02/');
}

function setup(){
    createCanvas(CanvasW, CanvasH); //, WEBGL);

    // Create grid with tiles.
    grid = new Grid(Rows, Cols);

    // Choose random tile and set.
    let chosen_tile = grid.chooseTile();
    centerX = chosen_tile.x;
    centerY = chosen_tile.y;
    grid.collapse(chosen_tile);
}

function draw(){
    background(0);
    translate(centerX, centerY);
    // rotate(radians(frameCount));

    // translate(width/2, height/2);
    // scale(zoom);
    if(frameCount % 2 == 0 ){
        if(zoom > 0.5) zoom -= 0.001;
    }
    // camera();
    if(!STOP){
        let tile = grid.chooseTile();
        if(tile) grid.collapse(tile);
    }
    grid.drawTiles();
    // drawGridLines();
    angle += 0.01;
}


function generatePossibilityTable(tiles){
}

function paintPixels(row, col, colour, img){
    let pixCol = colour == 0 ? 0 : 255;

    let start = [row*Tilegrids[0], col*Tilegrids[1]];   // Top left corner of grid to draw from

    for(let x=start[0]; x < start[0] + Tilegrids[0]; x++){  // Colour pixels
        for(let y=start[1]; y < start[1] + Tilegrids[1]; y++){
            img.set(x, y, pixCol);
        }
    }
}

function generateTilesImages(sourceTiles){
    print("Creating Tiles");
    let ext = "png";

    for(let tileno=0; tileno<12 ; tileno++){
        print("Creating Tile " + tileno);
        let tile = tiles[tileno];
        let im = createImage(TileSize, TileSize);
        im.loadPixels();

        // Iterate through tile and retrieve colour values.
        for(let row=0; row<tile.length; row++){
            for(let col=0; col<tile[row].length; col++){
                let colour = tile[row][col];
                paintPixels(row, col, colour, im);
            }
        }
        im.updatePixels();
        im.save(""+tileno, ext);
        print("Tile " + tileno + " Created.");
    }
}