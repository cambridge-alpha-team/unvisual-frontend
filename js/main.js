var codeTypes = ["loop", "play", "sleep", "fx", "synth", "sample"];

var loopNumber = 1; // to uniquely name loops

var root = new RootNode();
var activeNode = new TempoNode();

var mode = null; // null | 'add' | 'bind-cubelet' | 'delete' | 'choose-value'
var selectedCodeType;
var selectedCubelet;
var selectedChoice;


// make initial loop
var loopA = new LoopNode("loop" + loopNumber++, root, 1);

// speech

function textify(el) {
  var textNode = document.createTextNode('');
  el.appendChild(textNode);
  return textNode;
}

var say = (function() {
  var speechNode = textify(document.getElementById('speech'));
  var displayNode = textify(document.getElementById('display'));

  var lastAnnounced = 0;

  var currentSpeech = null;
  var speakTimeout = null;

  var say = function(message, kind) {
    // always *display* message
    displayNode.textContent = message;

    // we might have been planning to say something
    if (speakTimeout) clearTimeout(speakTimeout);

    // if we're changing a value, don't speak it too often
    if (kind == 'value') {
      if (new Date() - lastAnnounced < 400) {
        if (message == currentSpeech) return;

        // make sure we speak the last value
        // after the current thing has "finished"
        speakTimeout = setTimeout(function() {
          announce(message);
        }, 400);
        return;
      }
      lastAnnounced = new Date();
    }

    announce(message);
  };

  function announce(message) {
    speechNode.textContent = ''; // clear first to make sure it *changes*
    speechNode.textContent = message;
    console.log(message);
  }

  return say;
})();

//shortcut to make cubelet controlled
Mousetrap.bind(['c'], function() {
	if (activeNode instanceof ValueNode) {
		if (mode != 'bind-cubelet') {
			mode = 'bind-cubelet';
			selectedCubelet = activeNode.cubelet;
			say("Selecting cubelet. Cubelet " + selectedCubelet);
		} else {
			mode = null;
			say("Stop selecting cubelet. " + activeNode.readFull());
		}
	} else {
		say("You cannot control this with the cubelets. Please select a number. " + activeNode.readFull());
	}
	regenerate();
	return false;
});

//shortcut to add a node
Mousetrap.bind(['plus', '+'], function() {
	if (['root', 'fx'].indexOf(activeNode.parent.name) < 0 && activeNode.parent.name.substr(0, 4) != 'loop') {
		say('You cannot add code here. ' + activeNode.readName() + ' is currently selected');
		mode = null;
	} else {
		mode = mode == 'add' ? null : 'add';
		if (mode == 'add') {
			selectedCodeType = 0;
			say("What do you want to add? " + codeTypes[selectedCodeType] + "; " + (selectedCodeType + 1) + " of " + codeTypes.length);
		} else {
			say("Adding code cancelled. " + activeNode.readName());
		}
		regenerate();
	}
	return false;

});

//shortcut to delete a node
Mousetrap.bind(['minus', '-'], function() {
	if (activeNode.name == "tempo" || (activeNode.parent.children.length == 1 && activeNode.name != 'fx') || activeNode instanceof ChoiceNode || activeNode.parent instanceof PlayNode) {
		say('You cannot delete this code. ' + activeNode.readName() + ' is currently selected');
		mode = null;
	} else {
		mode = mode == 'delete' ? null : 'delete';
		if (mode == 'delete') {
			say("Are you sure you want to delete this bit of code? Press right to confirm or left to cancel.");
		} else {
			say("Delete cancelled");
		}
		regenerate();
	}
	return false;

});

//shortcut to go out of list
Mousetrap.bind(['left', 'a', 'h'], function() {
	switch (mode) {
		case 'add': // add code
			mode = null;
			say("Adding code cancelled. The currently selected bit of code is " + activeNode.readFull());
			break;
		case 'bind-cubelet': // select cubelet
			mode = null;
			say("Cubelet set to " + activeNode.cubelet + ". The currently selected bit of code is " + activeNode.readFull());
			break;
		case 'delete': // delete
			mode = null;
			say("Delete cancelled. The currently selected bit of code is " + activeNode.readFull());
			break;
		case 'choose-value': //choices
			say("Go out.   " + activeNode.readFull());
			mode = null;
			break;
		default:
			if (activeNode.parent != root) {
				activeNode = activeNode.parent;
				say("Go out.   " + activeNode.readFull());
			}
			break;
	}
	regenerate();
	return false;
});

//shortcut to go into a list
Mousetrap.bind(['right', 'd', 'l'], function() {
	switch (mode) {
		case 'add': // add code
			switch (selectedCodeType) {
				case 0: // loop
					activeNode = new LoopNode("loop" + loopNumber++, activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("New loop created");
					break;
				case 1: // play
					activeNode = new PlayNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("New note created");
					break;
				case 2: // sleep
					activeNode = new SleepNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("New rest created");
					break;
				case 3: // fx
					activeNode = new FXNode(activeNode.parent);
					say("New FX created");
					break;
				case 4: // synth
					activeNode = new SynthNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("New synth created");
					break;
				case 5: // sample
					activeNode = new SampleNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("New sample created");
					break;
				default: // something's wrong
					say("ERROR When attempting to add code.");
					break;
			}
			say(activeNode.readFull());
			mode = null;
			break;
		case 'bind-cubelet': // select cubelet
			//Do nothing
			break;
		case 'delete': // delete
			// Determine the index of activeNode in the parent's array of children
			var index = activeNode.parent.children.indexOf(activeNode);
			if (index >= 0) {
				if (activeNode.name == "fx") {
					// Parent activeNode's children to activeNode's parent
					for (var i = 1; i < activeNode.children.length; i++) {
						var childNode = activeNode.children[i];
						activeNode.parent.children.splice(index + i, 0, childNode);
						childNode.parent = activeNode.parent;
					}
				}
				// Remove activeNode from its parent's list of children
				activeNode.parent.children.splice(index, 1);
				if (index > 0) {
					activeNode = activeNode.parent.children[index - 1];
				} else {
					activeNode = activeNode.parent.children[index];
				}
				say("Code deleted. The currently selected bit of code is " + activeNode.readFull());
			} else {
				say("ERROR: The currently selected bit of code is not recognised as a child by its parent.");
			}
			mode = null;
			break;
		case 'choose-value': //choices
			//Do nothing 
			break;
		default:
			if (activeNode.children.length > 0) {
				var oldActive = activeNode;
				activeNode = activeNode.children[0];
				say("Go into " + oldActive.readName() + ".   " + activeNode.readFull());
			} else if (activeNode instanceof ValueNode || activeNode instanceof ChoiceNode) {
				selectedChoice = activeNode.choices.indexOf(activeNode.choice);
				mode = 'choose-value';
				if (activeNode.name == "sleep") {
					say("How many beats do you want to sleep for? Choose a value between 0.125 and 4: " + activeNode.choices[selectedChoice]);
				} else if (activeNode.name == "note") {
					say("Choose a value between 40 and 100 for your note: " + activeNode.choices[selectedChoice]);
				} else if (activeNode.name == "amp") {
					say("How loud do you want this to be? Choose a value between 0 and 1: " + activeNode.choices[selectedChoice]);
				} else if (activeNode.name == "release") {
					say("How slowly do you want to go from full amplitude to silence? Choose a value between 0 and 5: " + activeNode.choices[selectedChoice]);
				} else if (activeNode.name == "tempo") {
					say("Choose a tempo for your piece between 60 and 180: " + activeNode.choices[selectedChoice]);
				} else if (activeNode.name == "synth") {
					say("Choose a synth: " + activeNode.choices[selectedChoice]);
				} else if (activeNode.name == "fx name") {
					say("Choose an effect: " + activeNode.choices[selectedChoice]);
				} else if (activeNode.name == "sample") {
					say("Choose a sample: " + activeNode.choices[selectedChoice]);
				}
			}
			break;
	}
	regenerate();
	return false;
});

//shortcut to go to the next element in a list
Mousetrap.bind(['down', 's', 'j'], function() {
	switch (mode) {
		case 'add': // add code
			if (selectedCodeType < (codeTypes.length - 1)) {
				selectedCodeType++;
			}
			say(codeTypes[selectedCodeType] + "; " + (selectedCodeType + 1) + " of " + codeTypes.length);
			break;
		case 'bind-cubelet': // select cubelet
			if (0 < selectedCubelet) {
				selectedCubelet--;
				activeNode.cubelet = selectedCubelet;
				say("Cubelet " + selectedCubelet);
			}
			break;
		case 'choose-value': //choices
			if (0 < selectedChoice) {
				selectedChoice--;
				activeNode.choice = activeNode.choices[selectedChoice];
				say(activeNode.choices[selectedChoice], 'value');
			} else {
				say("You have reached the bottom of the list of choices.");

			}
			break;
		case 'delete': //delete
			//do nothing
			break;
		default:
			var n = activeNode.parent.children.indexOf(activeNode);
			if ((n + 1) < activeNode.parent.children.length) activeNode = activeNode.parent.children[n + 1];
			say(activeNode.readFull());
			break;
	}
	regenerate();
	return false;
});

//shortcut to go to the previous element in a list
Mousetrap.bind(['up', 'w', 'k'], function() {
	switch (mode) {
		case 'add': // add code
			if (selectedCodeType > 0) {
				selectedCodeType--;
			}
			say(codeTypes[selectedCodeType] + "; " + (selectedCodeType + 1) + " of " + codeTypes.length);
			break;
		case 'bind-cubelet': // select cubelet
			if (selectedCubelet < 6) {
				selectedCubelet++;
				activeNode.cubelet = selectedCubelet;
				say("Cubelet " + selectedCubelet);
			}
			break;
		case 'choose-value': //choices
			if ((selectedChoice + 1) < activeNode.choices.length) {
				selectedChoice++;
				activeNode.choice = activeNode.choices[selectedChoice];
				say(activeNode.choices[selectedChoice], 'value');
			} else {
				say("You have reached the top of the list of choices.");
			}
			break;
		case 'delete': //delete
			//do nothing
			break;
		default:
			var n = activeNode.parent.children.indexOf(activeNode);
			if (n != 0) activeNode = activeNode.parent.children[n - 1];
			say(activeNode.readFull());
			break;
	}
	regenerate();
	return false;
});

// called when tree is updated
function regenerate() {
	document.getElementById("message").innerHTML = root.generateHTML();
}

regenerate();


// shortcut to stop all Sonic Pi loops
Mousetrap.bind(['*'], function() {
	request("POST", "osc/stop", "", function() {
		console.log("Sent stop OSC");
	}, function(err) {
		console.log("This is a helpful error message");
	});
	return false;
});

// shortcut to send code to Sonic Pi
Mousetrap.bind(['return', 'enter'], function() {
	var code = root.generateCode();

	request("POST", "osc/run", code, function() {
		console.log("Sent run OSC");
	}, function(err) {
		console.log("This is a helpful error message");
	});
	return false;
});

// helper for making HTTP requests
var request = function(method, url, body, resolve, reject) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);

	xhr.onload = function() {
		if (xhr.status === 200) {
			resolve(xhr.response);
		} else {
			reject(new Error("Status code was " + xhr.status));
		}
	};

	xhr.onerror = function() {
		reject(new Error("Can't XHR " + JSON.stringify(url)));
	};

	xhr.responseType = 'text';

	xhr.send(body);
};


// hack numpad key support into mousetrap

var numpadKeys = {
  98: 'down',
  100: 'left',
  102: 'right',
  104: 'up',
};

document.body.addEventListener('keypress', function(e) {
  var name = numpadKeys[e.keyCode];
  if (name) {
	Mousetrap.trigger(name);
	e.preventDefault();
	return false;
  }
});

