$(document).ready(function() {
    var count = 0;
    $('#newButton').click(function() {
        $('#testArea').append();
        $('#resizable' + count).resizable({
            minHeight: 400,
            minWidth: 650
        });
        $('#resizable' + count).draggable({
            stack:".resizable"
        });
        $('#resizable' + count).droppable({
            drop: function(event, ui) {
                alert("aligning sequence " + $(this).attr("id") + " and " + ui.draggable.attr("id"));
            },
            accept: ".sequenceWidget"
        });
        count++;
    });
});