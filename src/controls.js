$(window).keypress(function(event) {
    switch (event.which) {
    case 'h'.charCodeAt(0):
        PLAYER.change(-1, 0);
        break;
    case 'j'.charCodeAt(0):
        PLAYER.change(0, 1);
        break;
    case 'k'.charCodeAt(0):
        PLAYER.change(0, -1);
        break;
    case 'l'.charCodeAt(0):
        PLAYER.change(1, 0);
        break;
    case 'y'.charCodeAt(0):
        PLAYER.change(-1, -1);
        break;
    case 'u'.charCodeAt(0):
        PLAYER.change(1, -1);
        break;
    case 'b'.charCodeAt(0):
        PLAYER.change(-1, 1);
        break;
    case 'n'.charCodeAt(0):
        PLAYER.change(1, 1);
        break;
    }
    FOCUS.on(PLAYER);
    display();
});
