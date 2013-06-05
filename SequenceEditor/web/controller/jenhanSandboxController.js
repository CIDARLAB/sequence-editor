$(document).ready(function() {
    var count = 0;
    $('#newButton').click(function() {
        $('#testArea').append('<div class="resizable sequenceWidget ui-widget-content" id="resizable' + count +
                '"><h4 class="ui-widget-header">Resizable</h4><div class="row-fluid"><div class="span6">left</div><div class="span6">right</div></div></div>'
                );
        $('#resizable' + count).resizable({
            maxHeight: 250,
            maxWidth: 350,
            minHeight: 150,
            minWidth: 200
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