Sequence Editor
===============
Purpose
---------------
Sequence Editor is a lightweight jQuery plugin that allows developers to quicky generate a viewer for DNA sequences. Sequence Editor was built as a proof-of-concept Clotho 3 application, and it provides several convenience methods for accessing data via the Clotho 3 api.

Key features of Sequence Editor include the following:
* Common calculations:
  * Melting Temperature
  * Reverse Complement
  * GC Content
* Feature highlighting with features pulled directly from Clotho3
* Sequence Alignment
* Drag and drop widgets
* Save and pull parts from Clotho 3

Usage
---------------
This section should describe how to use code.

Sequence Editor allows users to create many Sequence Editor widgets at once.

<code>
var sequenceEditorSession = SequenceEditor.newSession(); //starts a new session and connect to the default Clotho3 server
sequenceEditorSession.createNewWidget(); //create a new empty widget
</code>

All of Sequence Editor's functions can be accessed through its user interface. These functions can also be triggered programmatically. 

*Save a sequence*
<code>
var window = sequenceEditorSession.getWindow(0); //grab the first window
window.save();
</code>

*Reverse complement a sequence*
<code>
var window = sequenceEditorSession.getWindow(0); //grab the first window
window.revComp();
</code>

Development Guide
---------------
Describe the procedure we used to make sequence editor. 
* How do other people make clotho 3 apps like this?
* What is a clotho 3 app? Describe our philosophy

Installation Requirements
---------------
* jQuery 1.9+
* Twitter Bootstrap (css/javascript)
* Servlet Container (for sequence alignment functions)

Contact
---------------
Sequence Editor is created by:
* [Kevin Leshane][link to your homepage]
* [Jenhan Tao][Link to my nonexistant homepage]

API
---------------
Find a javadoc. Describe the following functions in that manner. 
* method name
* what method does
* inputs and what they are
* outputs

### WindowManager ###
- Represents a window manager that contains all sequence editor windows.

#### WindowManager() ####
- Constructs a window manager. 

#### .setConnection() ####

#### .closeConnection() ####

#### .newWindow() ####

#### .getWindow(Int id) ####
- Gets sequence editor window associated with parameter id.
- Example: For id = **2**, "sequenceWindow_**2**" will be selected.
- **Parameter(s):** _id_ - Integer representing desired window with associated id value.

---

### Window ###
- Represents a resizable sequence editor window.

#### Window() ####
- Constructs a resizable sequence editor window.

#### .changeTheme(Int color) ####
- Enables user to select sequence editor window background color (theme).
- **Parameter(s):** _color_ - Color (Hex RGB). 

#### .newSequence(String newFileName) ####
- Opens a new file in a sequence editor window.
- **Parameter(s):** _newFileName_ - User-specified file name for new sequence.

#### .openSequence(String fileOpenPath) ####
- Loads an existing sequence in the current sequence editor window from the path specified by the user.
- **Parameter(s):** _fileOpenPath_ - Path of existing GenBank or FASTA file. 

#### .saveSequence(String fileSavePath) ####
- Saves current sequence to the file path specified by the user.
- **Parameter(s):** _fileSavePath_ - Path to store the sequence file. 

#### .close(String sequenceFileName) ####
- Closes the sequence editor window associated with a user-specified file name.
- **Parameter(s):** _sequenceFileName_

#### .translate() ####
- Outputs an alert containing the translation sequence. If a substring of the full sequence is selected when translate is chosen, only that selection will be translated. If nothing is selected the full sequence contained in the text area will be translated.

#### .revComp() ####
- Replaces the current selection (or the entire sequence if nothing is selected) in place with its reverse complement.

#### .lowercase() ####
- Replaces the current selection (or the entire sequence if nothing is selected) in place with lowercase characters.

#### .uppercase() ####
- Replaces the current selection (or the entire sequence if nothing is selected) in place with its uppercase characters.

#### .features() ####
- Highlights all features represented in the sequence contained within the text area based upon a continually updated list.

#### .selection() ####
- Highlights the current selection.

#### .nextForwardORF() ####
- Selects the next forward Open Reading Frame.

#### .previousForwardORF() ####
- Selects the previous forward Open Reading Frame.

#### .nextReverseORF() ####
- Selects the next reverse Open Reading Frame.

#### .previousReverseORF() ####
- Selects the previous reverse Open Reading Frame.

#### .sequencePosition() ####
- Returns the position of the cursor within the sequence.

#### .currentFeature() ####
- Returns the name of the current selected feature.

---

### Sequence ###
- Represents a DNA sequence.

#### Sequence( sequence ) ####
- **Parameter(s):** _sequence_ - A sequence string.
- Constructs a sequence object.

#### .meltingTemp() ####
- **Returns:** Melting temperature of the sequence.

#### .gcContent() ####
- **Returns:** GC-content (guanine-cytosine content) of the sequence.

#### .sequenceLength() ####
- **Returns:** The sequence length.

#### .cursorPosition() ####
- **Returns:** String representing cursor position and selection if one exists.

---