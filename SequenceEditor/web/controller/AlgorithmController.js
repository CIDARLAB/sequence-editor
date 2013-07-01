            var _sequence = ""; //store sequence to compare if insert or delete happened
            var samples = [];
            //Create dummy Genbank sequence/feature samples
            var sample1 = {sequence: "aaaagctacaggggccaatgacgcccctagacagtttttaacccaaaa",
                features: [{name: "feature1", sequence: "aaaa", color: "red"},
                    {name: "feature2", sequence: "cccc", color: "cyan"},
                    {name: "feature3", sequence: "gggg", color: "green"},
                    {name: "feature4", sequence: "tttt", color: "yellow"},
                    ]};
//                {name: "feature4", sequence: "aaaag", color: "brown"}
            var sample2 = {sequence: "ATGGAGCATACATATCAATATTCATGGATCATACCGTTTGTGCCACTTCCAATTCCTATTTTAATAGGAATTGGACTCCTACTTTTTCCGACGGCAACAAAAAATCTTCGTCGTATGTGGGCTCTTCCCAATATTTTATTGTTAAGTATAGTTATGATTTTTTCGGTCGATCTGTCCATTCAGCAAATAAATAAAAGTTCTATCTATCAATATGTATGGTCTTGGACCATCAATAATGATTTTTCTTTCGAGTTTGGCTACTTTATTGATTCGCTTACCTAGTTCGAATTTGATAAAATTTATATTTTTTGGGAATTAGTTGGAATGTGTTCTTATCTATTAATAGGGTTTTGGTTCACACGACCCGCTGCGGCAAACGCCTGTCAAAAAGCATTTGTAACTAATCGGATAGGCGATTTTGGTTTATTATTAGGAATCTTAGGTTTTTATTGGATAACGGGAAGTTTCGAATTTCAAGATTTGTTCGAAATATTTAATAACTTGATTTATAATAATGAGGTTCAGTTTTTATTTGTTACTTTATGTGCCTCTTTATTA",
                features: [{name: "feature1", sequence: "TTGTGCCACTTCCAATTCCTATTTTAATAGGAATTGGAC", color: "red"},
                    {name: "feature2", sequence: "AATTCC", color: "cyan"},
                    {name: "feature3", sequence: "CAACAAAAAATCTTCGTCGTATGTGGGCTCTTCCCAATAT", color: "green"},
                    {name: "feature4", sequence: "TTGTTAAGTATAGTTATGATTTTTTCGGTCGATCTGTCCATTCAGCAAATAAATAAAAGTTCTATCTATCAATATGTATGGTCTTGGACCATCAATAATGATTTTTCTTTCGAGTTTGGCTACTTTATTGATTCGCTTACCTAGTTCGAATTTGATAAAATTTATATTTTTTGGGAATTAGTTGGAATGTGTTCTTATCTATTAATAGGGTTTTGGTTCACACGACCCGCTGCGGCAAACGCCTGTCAAAAAGCATTTGTAACTAATCGGATAGGCGATTTTGGTTTATTATTAGGAATCTTAGGTTTTTATTGGATAACGGGAAGTTTCGAATTTCAAGATTTGTTCGAAATATTTAATAACTTGATTTATAATAA", color: "yellow"}]
            };
            var sample3 = {sequence: "TCAATAAAACTATGGGGTAAAGAAGAACAAAAAATAATTAACAGAAATTTTCGTTTATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAATGTAAAAAAAGGGGCTCTTATTACTATTACGAGTTTTGGCTACAAGAAGGCTTTTTCTTATCCTCATGAATCGGATAATACTATGCTATTTCCTATGCTTATATTGGCTCTATTTACTTTTTTTGTTGGAGCCATAGCAATTCCTTTTAATCAAGAAGGACTACATTTGGATATATTATCCAAATTATTAACTCCATCTATAAATCTTTTACATCAAAATTCAAATGATTTTGAGGATTGGTATCAATTTTTAACAAATGCAACTCTTTCAGTGAGTATAGCCTGTTTCGGAATATTTACAGCATTCCTTTTATATAAGCCTTTTTATTCATCTTTACAAAATTTGAACTTACTAAATTTATTTTCGAAAGGGGGTCCTAAAAGAATTTTTTTGGATAAAATAATATACTTGATATACGATTGGTCATATAATCGTGGTTACATAGATACGTTTTATTCAGTATCCTTAACAAAAGGTATAAGAGGATTGGCCGAACTAACTCATTTTTTTGATAGGCGAGTAATCGATGGAATTACAAATGGAGTACGCATCACAAGTTTTTTTATAGGCGAAGGTATCAAATATT",
                features: [{name: "feature1", sequence: "ATAATTAACAGAAATTTTCGTTTATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAA", color: "red"},
                    {name: "feature2", sequence: "TATCTCCTTTATTAATATTAACGATGAATAATAATGAGAAGCCATATAGAATTGGTGATAATGTAAAAAAAGGGGCTCTTATTAC", color: "cyan"},
                    {name: "feature3", sequence: "TCCAAATTATTAACTCCATCTATAAATCTTTTACATCAAAA", color: "green"},
                    {name: "feature4", sequence: "ACTTGATATACGATTGGTCATATAATCGTGGTTACATAGATACGTTTTATTCAGTATCCTTAACAAAAGGTATAAGAGGATTGGCCGAACTAACTC", color: "yellow"}]
            };
            samples.push(sample1);
            samples.push(sample2);
            samples.push(sample3);


            $(document).ready(function() {
                Array.prototype.remove = function(from, to) {
                    var rest = this.slice((to || from) + 1 || this.length);
                    this.length = from < 0 ? this.length + from : from;
                    return this.push.apply(this, rest);
                };

                $('#seqTextArea').filter_input({regex: '[actguryswkmbdhvnACTGURYSWKMBDHVN]'});

                $('#seqTextArea').scroll(function() {
                    $('#highlight').scrollTop($(this).scrollTop());
                });
                ////////////////////////////////////////////////////////////////
                $('#seqTextArea').mousedown(function() {
                    $('#highlight').css("z-index", -1);
//                    $('#highlight span').css("color", "transparent");
                    $('#seqTextArea').css("color", "black");
                });
                $('#highlight').mousedown(function() {
                    $('#highlight').css("z-index", -1);
//                    $('#highlight span').css("color", "transparent");
                    $('#seqTextArea').css("color", "black");
                });
                $('#seqTextArea').mouseleave(function() {
                    $('#highlight').css("z-index", 1);
                    $('#highlight span').css("color", "black");
                });
                ////////////////////////////////////////////////////////////////

                //generate feature list
                var _features = []; //stores current features
                var _annotations = [];
                for (var i = 0; i < samples.length; i++) {
                    for (var j = 0; j < samples[i]["features"].length; j++) {
                        var currentFeature = samples[i].features[j];
                        _features.push({name: currentFeature.name, sequence: currentFeature.sequence, color: currentFeature.color});
                    }
                }

                function getIndicesOf(searchStr, str, caseSensitive) {
                    var startIndex = 0, searchStrLen = searchStr.length;
                    var index, indices = [];
                    if (!caseSensitive) {
                        str = str.toLowerCase();
                        searchStr = searchStr.toLowerCase();
                    }
                    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
                        indices.push(index);
                        startIndex = index + searchStrLen;
                    }
                    return indices;
                }

                //generates annotations: {featureName, start, end, color}
                var generateAnnotations = function(sequence, features) {
                    var unresolvedAnnotations = []; //annotations with potential overlaps
                    for (var i = 0; i < features.length; i++) {
                        var matches = getIndicesOf(features[i].sequence, sequence, false);
                        if (matches.length > 0) {
                            for (var j = 0; j < matches.length; j++) {
                                var startIndex = matches[j];
                                var endIndex = startIndex + features[i].sequence.length;
                                unresolvedAnnotations.push({features: features[i].name, sequence: features[i].sequence, start: startIndex, end: endIndex, color: features[i].color});
                            }
                        }
                    }
                    unresolvedAnnotations = unresolvedAnnotations.sort(function(a, b) {
                        if (a.start < b.start) {
                            return -1;
                        }
                        else if (a.start > b.start) {
                            return 1;
                        }
                        return 0;
                    });
                    unresolvedAnnotations = unresolvedAnnotations.sort(function(a, b) {
                        if (a.end < b.end) {
                            return -1;
                        }
                        else if (a.end > b.end) {
                            return 1;
                        }
                        return 0;
                    });
//                    var toshow = "";
                    for (var i = 0; i < unresolvedAnnotations.length; i++) {
//                        toshow = toshow + "\n" + unresolvedAnnotations[i].start + " " + unresolvedAnnotations[i].end;
                    }
//                    alert(toshow);
//                    var resolvedAnnotations = resolveFeatureOverlap(unresolvedAnnotations);

                    return unresolvedAnnotations;
                };

                //resolve overlaps between annotations
                var resolveFeatureOverlap = function(unresolvedAnnotations) {
                    for (var i = 0; i < unresolvedAnnotations.length; i++) {
                        var current = unresolvedAnnotations[i];
                        var j = i + 1;
                        var compared = unresolvedAnnotations[j];
                        alert(compared)
                        while (current.end > compared.start) {
                            
                            compared = unresolvedAnnotations[j];
                        }
                    }

                };

                var updateAnnotationIndices = function(index, annotations, changeLength) {
                    var updatedAnnotations = [];
                    if (changeLength !== 0) {
                        for (var i = 0; i < annotations.length; i++) {
                            var start = annotations[i].start;
                            var end = annotations[i].end;
                            if (start + changeLength >= index) {
                                //change is before annotation
                                annotations[i].start = start + changeLength;
                                annotations[i].end = end + changeLength;

                            }
                            if (index > start + changeLength && index < end + changeLength) {
                                //ignore features that should be removed
                            } else {
                                updatedAnnotations.push(annotations[i]);
                            }
                        }
                        return updatedAnnotations;
                    }
                    return annotations;

                };



                var generateHighlights = function(sequence, annotationsToDraw) {
                    var toReturn = "";
                    //iterate through each feature and append regular text or a span
                    if (annotationsToDraw.length > 0) {
                        //append start of string
                        toReturn = sequence.substring(0, annotationsToDraw[0].start) + '<span title="' + annotationsToDraw[0].features + '" style="background-color:' + annotationsToDraw[0].color + '">' + sequence.substring(annotationsToDraw[0].start, annotationsToDraw[0].end) + '</span>';
                        var prevEnd = annotationsToDraw[0].end; //ending of the previous annotation
                        for (var i = 1; i < annotationsToDraw.length; i++) {
                            var start = annotationsToDraw[i].start;
                            var end = annotationsToDraw[i].end;
                            var features = annotationsToDraw[i].features;
                            var color = annotationsToDraw[i].color;
                            toReturn = toReturn + sequence.substring(prevEnd, start);
                            toReturn = toReturn + '<span title="' + features + '" style="background-color:' + color + '">' + sequence.substring(start, end) + '</span>';
                            prevEnd = end;
                        }
                        //append end of string
                        toReturn = toReturn + sequence.substring(annotationsToDraw[annotationsToDraw.length - 1].end, sequence.length);
                    } else {
                        toReturn = sequence;
                    }
                    return toReturn;
                };
                var changeLength = 0;
                $('#seqTextArea').keydown(function() {
                    _sequence = $('#seqTextArea').val();
                    $('#highlight span').css("color","transparent");
                    changeLength++;
                });

                $('#seqTextArea').keyup(function() {
                    var textArea = $('#seqTextArea')[0];
                    var unparsed = $('#seqTextArea').val();
                    changeLength = (unparsed.length - _sequence.length) * changeLength;
                    if (changeLength !== 0) {
                        _annotations = updateAnnotationIndices(textArea.selectionEnd, _annotations, changeLength);
                    }
                    changeLength = 0;
                    var parsed = generateHighlights(unparsed, _annotations);

                    //set the html of the highlight layer
                    $('#highlight').html(parsed);
                    $('#highlight').css("z-index", -1);
                    $('#highlight span').css("color", "transparent");
                    $('#seqTextArea').css("color", "black");
                });


                // test page event handlers
                $('#sample1').click(function() {
                    $('#seqTextArea').val(samples[0].sequence);
                });
                $('#sample2').click(function() {
                    $('#seqTextArea').val(samples[1].sequence);
                });
                $('#sample3').click(function() {
                    $('#seqTextArea').val(samples[2].sequence);
                });
                $('#clear').click(function() {
                    $('#seqTextArea').val("");
                    $('#highlight').html("");
                });
                $('#annotate').click(function() {
                    _annotations = generateAnnotations($('#seqTextArea').val(), _features);
                    var parsed = generateHighlights($('#seqTextArea').val(), _annotations);
                    $('#highlight').html(parsed);
                    $('#highlight').css("z-index", -1);
                    $('#highlight span').css("color", "transparent");
                    $('#seqTextArea').css("color", "black");
                });
            });