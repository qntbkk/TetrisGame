define([
  "dojo/_base/declare",
  "mxui/widget/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dojo/_base/lang",
  "dojo/text!TetrisWidget/widget/template/TetrisWidget.html"
], function(
  declare,
  _WidgetBase,
  _TemplatedMixin,
  lang,
  /*_jQuery,*/ widgetTemplate
) {
  "use strict";
  // var $ = _jQuery.noConflict(true);
  return declare("TetrisWidget.widget.TetrisWidget", [_WidgetBase, _TemplatedMixin], {
    // _TemplatedMixin will create our dom node using this HTML template.
    templateString: widgetTemplate,
    // DOM elements
    canvas: null,
    // Parameters configured in the Modeler.
    messageString: "",
    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    _handles: null,
    _contextObj: null,

    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    constructor: function() {
      this._handles = [];
    },

    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    postCreate: function() {
      
      const I = [
        [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
        [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
        ],
        [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
        ],
        [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ]
      ];
      
      const J = [
        [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0]
        ],
        [
          [0, 1, 1],
          [0, 1, 0],
          [0, 1, 0]
        ],
        [
          [0, 0, 0],
          [1, 1, 1],
          [0, 0, 1]
        ],
        [
          [0, 1, 0],
          [0, 1, 0],
          [1, 1, 0]
        ]
      ];
      
      const L = [
        [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0]
        ],
        [
          [0, 1, 0],
          [0, 1, 0],
          [0, 1, 1]
        ],
        [
          [0, 0, 0],
          [1, 1, 1],
          [1, 0, 0]
        ],
        [
          [1, 1, 0],
          [0, 1, 0],
          [0, 1, 0]
        ]
      ];
      
      const O = [
        [
          [0, 0, 0, 0],
          [0, 1, 1, 0],
          [0, 1, 1, 0],
          [0, 0, 0, 0],
        ]
      ];
      
      const S = [
        [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0]
        ],
        [
          [0, 1, 0],
          [0, 1, 1],
          [0, 0, 1]
        ],
        [
          [0, 0, 0],
          [0, 1, 1],
          [1, 1, 0]
        ],
        [
          [1, 0, 0],
          [1, 1, 0],
          [0, 1, 0]
        ]
      ];
      
      const T = [
        [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0]
        ],
        [
          [0, 1, 0],
          [0, 1, 1],
          [0, 1, 0]
        ],
        [
          [0, 0, 0],
          [1, 1, 1],
          [0, 1, 0]
        ],
        [
          [0, 1, 0],
          [1, 1, 0],
          [0, 1, 0]
        ]
      ];
      
      const Z = [
        [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0]
        ],
        [
          [0, 0, 1],
          [0, 1, 1],
          [0, 1, 0]
        ],
        [
          [0, 0, 0],
          [1, 1, 0],
          [0, 1, 1]
        ],
        [
          [0, 1, 0],
          [1, 1, 0],
          [1, 0, 0]
        ]
      ];
      
      const cvs = document.getElementById("canvas");
        const ctx = cvs.getContext("2d");
        const scoreElement = document.getElementById("score");

        const ROW = 20;
        const COL = 10;
        const SQ = 20;
        const VACANT = "WHITE"; // color of an empty square

        // draw a square
        function drawSquare(x,y,color){
            ctx.fillStyle = color;
            ctx.fillRect(x*SQ,y*SQ,SQ,SQ);

            ctx.strokeStyle = "BLACK";
            ctx.strokeRect(x*SQ,y*SQ,SQ,SQ);
        }

        // create the board

        let board = [];
        
        for( var r = 0; r <ROW; r++){
            board[r] = [];
            for(var c = 0; c < COL; c++){
                board[r][c] = VACANT;
            }
        }

        // draw the board
        function drawBoard(){
            for( var r = 0; r <ROW; r++){
                for(var c = 0; c < COL; c++){
                    drawSquare(c,r,board[r][c]);
                }
            }
        }

        drawBoard();

        // the pieces and their colors

        const PIECES = [
            [Z,"red"],
            [S,"green"],
            [T,"yellow"],
            [O,"blue"],
            [L,"purple"],
            [I,"cyan"],
            [J,"orange"]
        ];

        // generate random pieces

        function randomPiece(){
            let r = Math.floor(Math.random() * PIECES.length) // 0 -> 6
            return new Piece( PIECES[r][0],PIECES[r][1]);
        }

        let p = randomPiece();

        // The Object Piece

        function Piece(tetromino,color){
            this.tetromino = tetromino;
            this.color = color;
            
            this.tetrominoN = 0; // we start from the first pattern
            this.activeTetromino = this.tetromino[this.tetrominoN];
            
            // we need to control the pieces
            this.x = 3;
            this.y = -2;
        }

        // fill function

        Piece.prototype.fill = function(color){
            for( var r = 0; r < this.activeTetromino.length; r++){
                for(var c = 0; c < this.activeTetromino.length; c++){
                    // we draw only occupied squares
                    if( this.activeTetromino[r][c]){
                        drawSquare(this.x + c,this.y + r, color);
                    }
                }
            }
        }

        // draw a piece to the board

        Piece.prototype.draw = function(){
            this.fill(this.color);
        }

        // undraw a piece


        Piece.prototype.unDraw = function(){
            this.fill(VACANT);
        }

        // move Down the piece

        Piece.prototype.moveDown = function(){
            if(!this.collision(0,1,this.activeTetromino)){
                this.unDraw();
                this.y++;
                this.draw();
            }else{
                // we lock the piece and generate a new one
                this.lock();
                p = randomPiece();
            }
            
        }

        // move Right the piece
        Piece.prototype.moveRight = function(){
            if(!this.collision(1,0,this.activeTetromino)){
                this.unDraw();
                this.x++;
                this.draw();
            }
        }

        // move Left the piece
        Piece.prototype.moveLeft = function(){
            if(!this.collision(-1,0,this.activeTetromino)){
                this.unDraw();
                this.x--;
                this.draw();
            }
        }

        // rotate the piece
        Piece.prototype.rotate = function(){
            let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
            let kick = 0;
            
            if(this.collision(0,0,nextPattern)){
                if(this.x > COL/2){
                    // it's the right wall
                    kick = -1; // we need to move the piece to the left
                }else{
                    // it's the left wall
                    kick = 1; // we need to move the piece to the right
                }
            }
            
            if(!this.collision(kick,0,nextPattern)){
                this.unDraw();
                this.x += kick;
                this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
                this.activeTetromino = this.tetromino[this.tetrominoN];
                this.draw();
            }
        }

        let score = 0;

        Piece.prototype.lock = function(){
            for( var r = 0; r < this.activeTetromino.length; r++){
                for(var c = 0; c < this.activeTetromino.length; c++){
                    // we skip the vacant squares
                    if( !this.activeTetromino[r][c]){
                        continue;
                    }
                    // pieces to lock on top = game over
                    if(this.y + r < 0){
                        alert("Game Over");
                        // stop request animation frame
                        gameOver = true;
                        break;
                    }
                    // we lock the piece
                    board[this.y+r][this.x+c] = this.color;
                }
            }
            // remove full rows
            for(var r = 0; r < ROW; r++){
                let isRowFull = true;
                for(var c = 0; c < COL; c++){
                    isRowFull = isRowFull && (board[r][c] != VACANT);
                }
                if(isRowFull){
                    // if the row is full
                    // we move down all the rows above it
                    for(var y = r; y > 1; y--){
                        for( c = 0; c < COL; c++){
                            board[y][c] = board[y-1][c];
                        }
                    }
                    // the top row board[0][..] has no row above it
                    for(var c = 0; c < COL; c++){
                        board[0][c] = VACANT;
                    }
                    // increment the score
                    score += 10;
                }
            }
            // update the board
            drawBoard();
            
            // update the score
            scoreElement.innerHTML = score;
        }

        // collision fucntion

        Piece.prototype.collision = function(x,y,piece){
            for(var r = 0; r < piece.length; r++){
                for(var c = 0; c < piece.length; c++){
                    // if the square is empty, we skip it
                    if(!piece[r][c]){
                        continue;
                    }
                    // coordinates of the piece after movement
                    let newX = this.x + c + x;
                    let newY = this.y + r + y;
                    
                    // conditions
                    if(newX < 0 || newX >= COL || newY >= ROW){
                        return true;
                    }
                    // skip newY < 0; board[-1] will crush our game
                    if(newY < 0){
                        continue;
                    }
                    // check if there is a locked piece alrady in place
                    if( board[newY][newX] != VACANT){
                        return true;
                    }
                }
            }
            return false;
        }

        // CONTROL the piece

        document.addEventListener("keydown",CONTROL);

        function CONTROL(event){
            if(event.keyCode == 37){
                p.moveLeft();
                dropStart = Date.now();
            }else if(event.keyCode == 38){
                p.rotate();
                dropStart = Date.now();
            }else if(event.keyCode == 39){
                p.moveRight();
                dropStart = Date.now();
            }else if(event.keyCode == 40){
                p.moveDown();
            }
        }

        // drop the piece every 1sec

        let dropStart = Date.now();
        let gameOver = false;
        function drop(){
            let now = Date.now();
            let delta = now - dropStart;
            if(delta > 1000){
                p.moveDown();
                dropStart = Date.now();
            }
            if( !gameOver){
                requestAnimationFrame(drop);
            }
        }

        drop();


      this._updateRendering();
      this._setupEvents();
    },

    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    update: function(obj, callback) {
      this._contextObj = obj;
      this._updateRendering(callback); // We're passing the callback to updateRendering to be called after DOM-manipulation
    },

    enable: function() {},
    disable: function() {},
    resize: function(box) {},
    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    uninitialize: function() {
      // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
    },

    // Attach events to HTML dom elements
    _setupEvents: function() {},

    // Rerender the interface.
    _updateRendering: function(callback) {
      if (this._contextObj !== null) {
      } else {
      }
      // The callback, coming from update, needs to be executed, to let the page know it finished rendering
      this._executeCallback(callback, "_updateRendering");
    },
    _executeCallback: function(cb, from) {
      if (cb && typeof cb === "function") {
        cb();
      }
    }
  });
});

require(["TetrisWidget/widget/TetrisWidget"]);
