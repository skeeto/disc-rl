/**
 * Exports: log
 */

var $log = $('#log');

function log(message) {
    var $message = $('<span/>').attr({'class': 'message'}).text(message);
    $log.prepend($message);
}
