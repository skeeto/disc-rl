/**
 * Exports: log
 */

var $log = $('#log');

function log(message) {
    var text = vsprintf(message, Array.prototype.slice.call(arguments, 1));
    var $message = $('<span/>').attr({'class': 'message'}).text(text);
    $log.prepend($message);
}
