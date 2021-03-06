var tetras = {
  "T":{
    'type': "T",
    "orientations":{
      
     "top":[[1,1,1],
      [0,1,0],
      [0,0,0]],
     
     "right":[[0,0,1],
              [0,1,1],
              [0,0,1]],
     
     "bottom":[[0,0,0],
               [0,1,0],
               [1,1,1]],
     
     "left":[[1,0,0],
      [1,1,0],
      [1,0,0]]
 
    }
    ,
    
    "order":null
    
    
},

   "L":{
     'type': "L",
    "orientations":{
      
    'top': [[1,1,1],
            [1,0,0],
            [0,0,0]],
     
    'right' : [[0,1,1],
              [0,0,1],
              [0,0,1]],
     
    'bottom' : [[0,0,0],
               [0,0,1],
               [1,1,1]],
     
    'left' : [[1,0,0],
             [1,0,0],
             [1,1,0]]
 
    }
    ,
    
    "order":null
    
    
},

    "O":{
    'type': "O",
    "orientations":{
      
    'top':[[1,1,0],
            [1,1,0],
            [0,0,0]],
     
    'right':[[0,1,1],
              [0,1,1],
              [0,0,0]],
     
    'bottom':[[0,0,0],
               [0,1,1],
               [0,1,1]],
     
    'left':[[0,0,0],
             [1,1,0],
             [1,1,0]]
 
    }
    ,
    
    "order":null
    
    
},

    "S":{
      'type': "S",
    
    "orientations":{
      
    'top':[[0,1,1],
            [1,1,0],
            [0,0,0]],
     
    'right':[[0,1,0],
              [0,1,1],
              [0,0,1]],
     
    'bottom':[[0,0,0],
               [0,1,1],
               [1,1,0]],
     
    'left':[[1,0,0],
             [1,1,0],
             [0,1,0]]
 
    }
    ,
    
    "order":null
    
    
},

    "Z":{
      'type': "Z",
    "orientations":{
      
    'top':[[1,1,0],
            [0,1,1],
            [0,0,0]],
     
    'right':[[0,0,1],
              [0,1,1],
              [0,1,0]],
     
    'bottom':[[0,0,0],
               [1,1,0],
               [0,1,1]],
     
    'left':[[0,1,0],
             [1,1,0],
             [1,0,0]]
 
    }
    ,
    
    "order":null
},

    "J":{
    'type': "J",
    "orientations":{
      
    'top':[[1,1,1],
            [0,0,1],
            [0,0,0]],
     
    'right':[[0,0,1],
              [0,0,1],
              [0,1,1]],
     
    'bottom':[[0,0,0],
               [0,0,1],
               [1,1,1]],
     
    'left':[[1,0,0],
             [1,0,0],
             [1,1,0]]
 
    }
    ,
    
    "order":null
    
},
    "W": {
        
        "position":{
          "x":null,
          "y":null
        }
    
    
}
  
};


function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      row.push(tile ? new Tile(tile.position, tile.type) : null);
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    if(this.cells[cell.x][cell.y]){
    if(this.cells[cell.x][cell.y].type !== "G"){
    return this.cells[cell.x][cell.y];
    }
    return null;
  }
  }else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.addTetramino = function(type,pos,orientation){
  var piece = {}; //adds a tile with the upper left of the tile matrix in "position" and with orientation specified
  
  piece = tetras[type];
  var matrix = [];
  matrix = tetras[type].orientations[orientation];


  var xpos = pos.x;
  var ypos = pos.y;
  
  for(var n = 0;n<matrix.length;n++){
    for(var m = 0; m< matrix[n].length;m++){
      var location = {};
      location.x = xpos + m;
      location.y = ypos + n;
      if(matrix[n][m] !== 0){
      tile = new Tile(location,piece.type);
      this.insertTile(tile);
      }
    }
  }
  
};
Grid.prototype.addWall = function(pos){
  tile = new Tile(pos,"W");
  this.insertTile(tile);
};

Grid.prototype.addBall = function(pos){
  tile = new Tile(pos,"B");
  this.insertTile(tile);
};


Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};
