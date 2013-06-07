$(document).ready(function() {
    var count = 0;
    $('#newButton').click(function() {
        $('#testArea').append('<div class="resizable sequenceWidget ui-widget-content" id="resizable' + count +
                '" style="width:650px;height:400px"><h4 class="ui-widget-header">Resizable</h4><div class="row-fluid"><div class="offset1 span5"><ul><li class="btn-group"><a class="btn dropdown-toggle" data-toggle="dropdown" href="#"><i class="icon-align-justify"></i><span class="caret"></span></a><ul class="dropdown-menu"><li><a href="#">New Sequence</a></li><li><a href="#">Save Sequence</a></li><li><a href="#">Close</a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown"><i class="icon-edit"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#">Undo</a></li><li><a href="#">Redo</a></li><li><a href="#">Cut</a></li><li><a href="#">Copy</a></li><li><a href="#">Paste</a></li><li><a href="#">Delete</a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown"><i class="icon-search"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#">Next Forward ORF</a></li><li><a href="#">Previous Forward ORF</a></li><li><a href="#">Next Reverse ORF</a></li><li><a href="#">Previous Reverse ORF</a></li><li><a href="#">Search</a></li></ul></li><li class="btn-group" style="margin-left:0px"><button class="btn dropdown-toggle" data-toggle="dropdown"><i class="icon-pencil"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#">Features</a></li><li><a href="#">Selection</a></li></ul></li></ul></div><div class="span3"><div class="btn-group"><button id="revComp" class="btn"><i class="icon-backward"></i></button><button id="translate" class="btn"><i class="icon-text-width"></i></button><button id="uppercase" class="btn"><i class="icon-arrow-up"></i></button><button id="lowercase" class="btn"><i class="icon-arrow-down"></i></button></div></div><div class="span2"><div class="btn-group pull-right"><button class="btn"><i class="icon-fullscreen"></i></button><button class="btn"><i class="icon-remove"></i></button></div></div></div><div class="row-fluid"><div class="offset1 span10"><textarea id="seqTextArea" class="textBox" style="resize:none;height:250px;width:100%">atgaccccgtggta</textarea></div></div><div class="row-fluid"><div class="offset3 span2"><div><dl class="dl-horizontal"><dt>Position:</dt><dd>0(0)</dd><dt>Length:</dt><dd>10</dd></dl></div></div><div class="span2"><dl class="dl-horizontal"><dt>Temp:</dt><dd>0C</dd><dt>%GC:</dt><dd>50</dd></dl> </div><div class="span2"><dl class="dl-horizontal"><dt>Feature</dt><dd>XbaI</dd></dl> </div></div></div>'
                );
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