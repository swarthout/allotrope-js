function GameManager(size, InputManager, Actuator, StorageManager) {
  this.size           = size; // Size of the grid
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;

  this.startTiles     = 2;

  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.inputManager.on("keepPlaying", this.keepPlaying.bind(this));

  this.setup();
}

// Restart the game
GameManager.prototype.restart = function () {
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  this.setup();
};

// Keep playing after winning (allows going over 2048)
GameManager.prototype.keepPlaying = function () {
  this.keepPlaying = true;
  this.actuator.continueGame(); // Clear the game won/lost message
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  return this.over || (this.won && !this.keepPlaying);
};

// Set up the game
GameManager.prototype.setup = function () {
  var previousState = this.storageManager.getGameState();

  // Reload the game from a previous game if present
  if (false) {
    this.grid        = new Grid(previousState.grid.size,
                                previousState.grid.cells); // Reload grid
    this.score       = previousState.score;
    this.over        = previousState.over;
    this.won         = previousState.won;
    this.keepPlaying = previousState.keepPlaying;
  } else {
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;

    // Add the initial tiles
    this.addStartTiles();
  }

  // Update the actuator
  this.actuate();
};

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  // for (var i = 0; i < this.startTiles; i++) {
  //   this.addRandomTile();
  // }
  // tile = new Tile({ x: 4, y: 3 },"T")
  // this.grid.insertTile(tile)
  
  // tile = new Tile({ x: 4, y: 4 },"L")
  // this.grid.insertTile(tile)
  
  // tile = new Tile({ x: 4, y: 2 },"S")
  // this.grid.insertTile(tile)
  
  // tile = new Tile({ x: 3, y:  3},"O")
  // this.grid.insertTile(tile)
  
  // tile = new Tile({ x: 3, y:  2},"Z")
  // this.grid.insertTile(tile)
  
  // tile = new Tile({ x: 3, y:  4},"J")
  // this.grid.insertTile(tile)
  
  // tile = new Tile({ x: 2, y:  2},"W")
  // this.grid.insertTile(tile)
  
  // tile = new Tile({ x: 2, y:  1},"B")
  // this.grid.insertTile(tile)
  
  // this.grid.addTetramino("T",{x:0,y:0},"top");
  this.grid.addTetramino("Z",{x:4,y:3},"left");
  // this.grid.addTetramino("O",{x:0,y:4},"top");
};




// // Adds a tile in a random position
// GameManager.prototype.addRandomTile = function () {
//   if (this.grid.cellsAvailable()) {
//     // var value = Math.random() < 0.9 ? 2 : 4;
//     var tile = new Tile(this.grid.randomAvailableCell(), type);

//     this.grid.insertTile(tile);
//   }
// };

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
  if (this.storageManager.getBestScore() < this.score) {
    this.storageManager.setBestScore(this.score);
  }

  // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  0,//this.storageManager.getBestScore(),
    terminated: this.isGameTerminated()
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
};


GameManager.prototype.distanceCompare = function(cell1, cell2, vector){ //returns the farther cell based on which direction the board is shifting
  
  switch(vector){
    
    case {x:0,y:-1}:
      if(cell1.y > cell2.y){
        return cell1;
      }else{
        return cell2;
      }
      break;
      
    case {x:0,y:1}:
      if(cell1.y < cell2.y){
        return cell1;
      }else{
        return cell2;
      }
      break;
      
    case {x:-1,y:0}:
      if(cell1.x > cell2.x){
        return cell1;
      }else{
        return cell2;
      }
      break;
      
    case {x:1,y:0}:
      if(cell1.y < cell2.y){
        return cell1;
      }else{
        return cell2;
      }
      break;
    
  }
  
};
// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;
  
  inList = function(item,list){
    return !!list[item];
  };


  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;

  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();
  
  getDistance = function(a,b){
  
  return(a==0?b:a);
};
  // Traverse the grid in the right direction and move tiles
  
  var distanceList = {};
  var count = 0;
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);
      

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        
        var next  = self.grid.cellContent(positions.next);
        
        var deltaX =positions.farthest.x - cell.x;
        var deltaY =positions.farthest.y - cell.y;
        
        var maxDisplacement = getDistance(deltaX,deltaY);
        console.log(maxDisplacement,tile.type);
        
        if(!inList(tile.type,distanceList)){
          
          distanceList[tile.type] = maxDisplacement;
          
          
          
        }
        
        else{
          if(next && tile.type !== next.type || !next){
          distanceList[tile.type] = Math.abs(maxDisplacement) <= Math.abs(distanceList[tile.type])? maxDisplacement:distanceList[tile.type];
          }
          
          
        }
      }
      

        
});
});
console.log(distanceList['T']);
traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      newcell = { x: x, y: y };
      newtile = self.grid.cellContent(newcell);
      
      if(newtile){
      var newPosition = {};
      
      var shiftlength = distanceList[newtile.type];
      
      newPosition.x = (Math.abs(shiftlength)*vector.x) + newcell.x;
      newPosition.y = (Math.abs(shiftlength)*vector.y) + newcell.y;
      
      self.moveTile(newtile, newPosition);
      if (!self.positionsEqual(newcell, newPosition)) {
          moved = true; // The tile moved from its original cell!
        }
        if (moved) {
    // this.addRandomTile();

    if (!self.movesAvailable()) {
      this.over = true; // Game over!
    }

    self.actuate();
  }
        
      }
    });
});


  
  };


// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable(); //|| this.tileMatchesAvailable();
};

// Check for available matches between tiles (more expensive check)
// GameManager.prototype.tileMatchesAvailable = function () {
//   var self = this;

//   var tile;

//   for (var x = 0; x < this.size; x++) {
//     for (var y = 0; y < this.size; y++) {
//       tile = this.grid.cellContent({ x: x, y: y });

//       if (tile) {
//         for (var direction = 0; direction < 4; direction++) {
//           var vector = self.getVector(direction);
//           var cell   = { x: x + vector.x, y: y + vector.y };

//           var other  = self.grid.cellContent(cell);

//           if (other && other.value === tile.value) {
//             return true; // These two tiles can be merged
//           }
//         }
//       }
//     }
//   }

//   return false;
// };

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
