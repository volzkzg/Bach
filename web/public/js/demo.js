Demo = {
    // DOM:
    board     : undefined,
    floatChess: undefined,
    demoText  : undefined,
    btnNext   : undefined,
    btnPlay   : undefined,
    btnPrev   : undefined,
    btnRestart : undefined,
    spanNext  : undefined,
    spanPlay  : undefined,
    spanPrev  : undefined,

    //Demo Runtime Data
    jsonURL    : undefined,
    data       : undefined,
    boards     : undefined,
    step       : undefined,
    interval   : undefined,
    pause      : undefined,
    runningFlag  : undefined,

    //Size of Table
    rowSize : 17,
    columnSize : 5,

    //Funtion...


    getBox: function getBox(i, j) {
        return Demo.board.find('#box-' + i + '-' + j);
    },

    getImg : function getImg(chess) {
        switch(chess) {
            case -1: return 'img-red-chess img-1'; break;
            case -2: return 'img-red-chess img-2'; break;
            case -3: return 'img-red-chess img-3'; break;
            case -4: return 'img-red-chess img-4'; break;
            case -5: return 'img-red-chess img-5'; break;
            case -6: return 'img-red-chess img-6'; break;
            case -7: return 'img-red-chess img-7'; break;
            case -8: return 'img-red-chess img-8'; break;
            case -9: return 'img-red-chess img-9'; break;
            case -10: return 'img-red-chess img-10'; break;
            case -11: return 'img-red-chess img-11'; break;
            case -12: return 'img-red-chess img-12'; break;
            case 1: return 'img-blue-chess img-1'; break;
            case 2: return 'img-blue-chess img-2'; break;
            case 3: return 'img-blue-chess img-3'; break;
            case 4: return 'img-blue-chess img-4'; break;
            case 5: return 'img-blue-chess img-5'; break;
            case 6: return 'img-blue-chess img-6'; break;
            case 7: return 'img-blue-chess img-7'; break;
            case 8: return 'img-blue-chess img-8'; break;
            case 9: return 'img-blue-chess img-9'; break;
            case 10: return 'img-blue-chess img-10'; break;
            case 11: return 'img-blue-chess img-11'; break;
            case 12: return 'img-blue-chess img-12'; break;
            default:
                return '';
        }
    },

    flushBoard : function flushBoard() {
        var table = $('<table id="chess-board">');
        for (var i = 0; i < Demo.rowSize; ++i) {
            var tr = $('<tr id="row-' + (Demo.rowSize - i - 1) + '">');
            for (var j = 0; j < Demo.columnSize; ++j) {
                var td = $('<td id="box-' + (Demo.rowSize - i - 1)  + '-' + j + '">');
                td.data('row', i);
                td.data('col', j);
                tr.append(td);
            }
            table.append(tr);
        }
        Demo.board.replaceWith(table);
        Demo.board = $('#chess-board');
        for (var i = 0; i < Demo.rowSize; ++i) {
            for (var j = 0; j < Demo.columnSize; ++j) {
                var img = Demo.getImg(Demo.boards[Demo.step][i][j]);
                Demo.getBox(i, j).attr('class', img);
            }
        }
    },

    cloneObject : function cloneObject(objectToBeCloned) {
        // Basis.
        if (!(objectToBeCloned instanceof Object)) {
            return objectToBeCloned;
        }

        var objectClone;

        var Constructor = objectToBeCloned.constructor;
        switch (Constructor) {
            case RegExp:
                objectClone = new Constructor(objectToBeCloned);
                break;
            case Date:
                objectClone = new Constructor(objectToBeCloned.getTime());
                break;
            default:
                objectClone = new Constructor();
        }

        for (var prop in objectToBeCloned) {
            objectClone[prop] = Demo.cloneObject(objectToBeCloned[prop]);
        }
        return objectClone;
    },
	
    abs : function abs(tem){
        if(tem > 0) return tem;
        return -tem;
    },
    
    eat : function eat(a, b) {
        if(b == 0) return 1;
        a = Demo.abs(a);
        b = Demo.abs(b);
        if(a == 11 || b == 11 || a == b) return 0;
        if(b == 10) {
            if (a == 9) return 1;
            else return -1;
        }
        if (a < b) {
            return 1;
        } else {
            return -1;
        }
    },
    
    makeBoards : function makeBoards() {
        var curBoard = [];
        for (var i = 0; i < Demo.rowSize; ++i) {
            curBoard.push([]);
        }
        for (var i = 0; i < Demo.rowSize; ++i) {
            for (var j = 0; j < Demo.columnSize; ++j) {
                if (Demo.data["init-board"][i][j].color == 1) {
                    curBoard[i].push( Demo.data["init-board"][i][j].kind + 1);
                } else if (Demo.data["init-board"][i][j].color == 0) {
                    curBoard[i].push(-Demo.data["init-board"][i][j].kind - 1);
                } else {
                    curBoard[i].push(0);		 
}}
        }
        Demo.boards = [];
        Demo.boards.push(Demo.cloneObject(curBoard));
        for (var i = 0; i < Demo.data.step.length; ++i) {
            if (!('err' in Demo.data.step[i])) {
                var start_x = Demo.data.step[i].posx;
                var start_y = Demo.data.step[i].posy;
                var end_x = Demo.data.step[i].tox;
                var end_y = Demo.data.step[i].toy;
                if(start_x != end_x || start_y != end_y) {
               //     curBoard[end_x][end_y] = Demo.cloneObject(curBoard[start_x][start_y]);
               //     curBoard[start_x][start_y] = 0;
                    var flag = Demo.eat(curBoard[start_x][start_y], curBoard[end_x][end_y]);
                    if(flag == 1) {
                        curBoard[end_x][end_y] = Demo.cloneObject(curBoard[start_x][start_y]);
                        curBoard[start_x][start_y] = 0;
                    }
                    if(flag == 0) {
                        curBoard[end_x][end_y] = 0
                        curBoard[start_x][start_y] = 0;
                    }
                    if(flag == -1) {
                        curBoard[start_x][start_y] = 0;
                    }
		 }
            }
            Demo.boards.push(Demo.cloneObject(curBoard));
        }
    },

    getData : function getData() {
        Demo.board      = $('#chess-board');
        Demo.floatChess = $('#float-chess');
        Demo.demoText   = $("#demo-text");
        Demo.btnPrev    = $('#btn-prev');
        Demo.btnPlay    = $("#btn-play");
        Demo.btnNext    = $('#btn-next');
        Demo.btnRestart = $('#btn-restart');
        Demo.spanPrev   = $('#span-prev');
        Demo.spanPlay   = $('#span-play');
        Demo.spanNext   = $('#span-next');


        Demo.makeBoards();
    },

    setControls: function setControls() {
        var i = Demo.step;
        var temLength = Demo.data.step.length;
        if (Demo.pause) {
            Demo.spanPlay.html('Start');
            if (i < temLength) {
                Demo.btnNext.prop('disabled', false);
            } else {
                Demo.btnNext.prop('disabled', true);
            }
            if (0 < i) {
                Demo.btnPrev.prop('disabled', false);
            } else {
                Demo.btnPrev.prop('disabled', true);
            }
        } else {
            Demo.spanPlay.html('Stop');
            Demo.btnPrev.prop('disabled', true);
            Demo.btnNext.prop('disabled', true);
        }

        if(i >= temLength) {
            Demo.btnPlay.prop('disabled', true);
        } else {
            Demo.btnPlay.prop('disabled', false);
        }
    },

    updateText: function updateText() {
        var i = Demo.step;
        if (i < 0) {
           // Demo.demoText.attr('class', 'bg-primary');
            Demo.demoText.html("Total Step : " + Demo.data.step.length);
            return ;
        }
        var step = Demo.data.step[i];

        if ('err' in step) {
            Demo.demoText.html('<strong>[Step ' + (i+1) + ']AI' + ((i + Demo.data.first) % 2) + '</strong> Error: ' + step.err);
          //  Demo.demoText.attr('class', 'bg-warning');
        } else {
            Demo.demoText.html('<strong>[Step ' + (i+1) + ']AI' + ((i + Demo.data.first) % 2) + '</strong> Moved (' + step.posx + ',' + step.posy + ') to (' + step.tox + ',' + step.toy + ')');
        }
    },

    moveStep: function moveStep() {
        if (Demo.step === Demo.data.step.length) {
            Demo.pause = true;
            Demo.setControls();
            return;
        }

        var tem = Demo.data.step[Demo.step];
        var sx = tem.posx, sy = tem.posy;
        var tx = tem.tox, ty = tem.toy;
        if(sx == tx && sy == ty) {
        Demo.updateText();     
	++Demo.step;
             Demo.runningFlag = setTimeout(Demo.moveStep, Demo.interval);
             return;
        }

        var source = Demo.getBox(sx, sy);
        var target = Demo.getBox(tx, ty);

        var flag = Demo.eat(Demo.boards[Demo.step][sx][sy], Demo.boards[Demo.step][tx][ty]);
        Demo.floatChess.attr('class', source.attr('class'));
        Demo.floatChess.offset(source.offset());
        source.attr('class', '');
        Demo.floatChess.animate(target.offset(), Demo.interval, function() {
	    if(flag == 1) {
                target.attr('class', Demo.floatChess.attr('class'));
            }
            if(flag == 0){
                target.attr('class', '');
            }
            if(flag == -1){

            }
            Demo.floatChess.addClass('hidden');
            Demo.setControls();
            Demo.updateText();
            ++Demo.step;
            if (!Demo.pause) {
                Demo.runningFlag = setTimeout(Demo.moveStep, Demo.interval);
            }
        });
    },

    prevClick: function prevClick(e) {
        e.preventDefault();
        Demo.step -= 2;
        Demo.setControls();
        Demo.updateText();
        Demo.step += 1;
        Demo.flushBoard();
        $(this).blur();
        return false;
    },

    playClick: function playClick(e) {
        e.preventDefault();
        if(Demo.pause == true) {
            Demo.pause = false;
            Demo.runningFlag = setTimeout(Demo.moveStep, Demo.interval);
        } else {
            Demo.pause = true;
            clearTimeout(Demo.runningFlag);
        }
        Demo.setControls();
        $(this).blur();
        return false;
    },

    nextClick: function nextClick(e) {
        e.preventDefault();
        Demo.runningFlag = setTimeout(Demo.moveStep, Demo.interval);
        $(this).blur();
        return false;
    },

    restartClick: function restartClick(e) {
        e.preventDefault();
        Demo.step = -1;
        Demo.interval = 200;
        Demo.setControls();
        Demo.updateText();
        Demo.step = 0;
        Demo.flushBoard();
        $(this).blur();
        return false;
    },

    bindEvents : function bindEvents() {
        Demo.btnPrev.on('click', Demo.prevClick);
        Demo.btnPlay.on('click', Demo.playClick);
        Demo.btnNext.on('click', Demo.nextClick);
        Demo.btnRestart.on('click', Demo.restartClick);

        $("#btn-speed-slow")  .on('click', function(){Demo.interval *= 2});
        $("#btn-speed-normal").on('click', function(){Demo.interval = 200});
        $("#btn-speed-fast")  .on('click', function(){Demo.interval /= 2});

    },

    prepare : function prepare() {
        function set_ai_color_span(id, jdom) {
            if (id == 0) {
                jdom.attr('class', 'tag tag-danger').html('Red');
            } else {
		jdom.attr('class', 'tag tag-primary').html('Blue');
            }
        }
        set_ai_color_span(Demo.data.id[0], $('#span-ai0-color'));
        set_ai_color_span(Demo.data.id[1], $('#span-ai1-color'));

        var ul = $('#invalid-list');
        if (Demo.data.err[0])
            ul.append('<li class="list-group-item"><strong>AI0 Err:</strong> ' + Demo.data.err[0] + '</li>');
        if (Demo.data.err[1])
            ul.append('<li class="list-group-item"><strong>AI1 Err:</strong> ' + Demo.data.err[1] + '</li>');
        for (var i = 0; i < Demo.data.step.length; ++i) {
            var step = Demo.data.step[i];
            if ('err' in step) {
                var info = step.err || 'Invalid Operation! (No Details)';
                ul.append('<li class="list-group-item"><strong>[Step ' + (i+1) + ']AI' + (i%2) + '</strong> ' + info + '</li>');
            }
        }
        var table = $('<table id="chess-board">');
        for (var i = 0; i < Demo.rowSize; ++i) {
            var tr = $('<tr id="row-' + i + '">');
            for (var j = 0; j < Demo.columnSize; ++j) {
                var td = $('<td id="box-' + i + '-' + j + '">');
                td.data('row', i);
                td.data('col', j);
                tr.append(td);
            }
            table.append(tr);
        }

        Demo.board.replaceWith(table);
        Demo.board = $('#chess-board');
    },

    ready : function ready() {
        Demo.step = 0;
        Demo.interval = 200;
        Demo.pause = true;
        Demo.btnRestart.prop('disabled', false);
        Demo.setControls();
        Demo.flushBoard();
    },

    setup: function setup(jsonURL) {
        Demo.jsonURL  = jsonURL;
        $.getJSON(Demo.jsonURL, function(temData) {
            Demo.data = temData;
//	alert(Demo.data.step.length);	
            Demo.getData();
            Demo.prepare();
            Demo.bindEvents();
            Demo.ready();
        });
//	alert(Demo.data.step.length);
    }
}
