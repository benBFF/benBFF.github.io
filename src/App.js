(function () {
  var ROWS = 8;
  var COLUMNS = 24;
  var DELAY = 30;

  var board;
  var _listLines = [];
  var _index = 1;

  function init() {
    board = window.Board = new Solari;
    new SolariTexture().bind('load', function () {
      var alphaSet = this,
          row;

      document.getElementById('container').appendChild(board.el);

      // Set up the board
      _(ROWS).times(function () {
        row = new SolariRow(board.y);

        _(COLUMNS).times(function () {
          row.add(alphaSet);
        });
        board.add(row);
      });

      Board.start();
    }).load('img/chars.png', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-.#/$ '.split(''), 70, 63);
  }

  function setMessage() {
    // Set a message
    setTimeout(function () {
      Board.setMessage(_listLines)
    }, 2000);
  }

  function loadMessages() {
    var urlJSON = "https://spreadsheets.google.com/feeds/list/14C0carL9Bdhoti-5EwX6upb7EUyatpEYXI9lvMK1PXo/od6/public/basic?alt=json&random="+_index;

    $.ajax({
        type: 'GET',
        url: urlJSON,
        success: function(data){
            //var json = $.parseJSON(data);

            if (data.feed.entry.length > 0) {
               _listLines = [];

              $.each(data.feed.entry, function (i, obj) {
                if (i < ROWS) _listLines.push(obj.title["$t"].toUpperCase().substr(0, COLUMNS));
              });

              setMessage();

              loadNextMessages();
            }
        },
        error: function(error){
            // ERROR
            console.log("ERROR");

            loadNextMessages();
        }
    });
  }

  function loadNextMessages() {
    _index++;
    setTimeout(function () {
      loadMessages();
    }, DELAY * 1000);
  }

  init();
  loadMessages();

})();