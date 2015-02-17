var root = new RootNode();
var activeNode = new TempoNode();
var mode = null; // null | 'add' | 'bind-cubelet' | 'delete' | 'choose-value'
var codeTypes = ["loop", "play", "sleep", "fx", "synth", "sample"];
var selectedCodeType;
var selectedCubelet;
var selectedChoice;
var loopNumber = 1; //to uniquely name loops


//tests XXX
var loopA = new LoopNode("loop" + loopNumber++, root, 1);

//speech
var speechNode = document.createTextNode('');
document.getElementById('speech').appendChild(speechNode);

function say(message) {
	speechNode.textContent = ''; // clear first to make sure it *changes*
	speechNode.textContent = message;
	console.log(message);
}

//shortcut to make cubelet controlled
Mousetrap.bind(['command+c', 'ctrl+c'], function() {
	// return false to prevent default browser behaviour
	// and stop event from bubbling
	if (activeNode.name == "fx"
		|| activeNode.name == "play"
		|| activeNode.name == "sleep"
		|| activeNode.name == "sample"
		|| activeNode.name == "tempo") {
		selectCubelet = !selectCubelet;
		if (selectCubelet) {
			addCode = false;
			say("selecting cubelet");
			selectedCubelet = activeNode.cubelet;
		}
	}
	reGenerate();
	return false;
});

//shortcut to add a node
Mousetrap.bind(['command+a', 'ctrl+a', 'plus'], function() {
	mode = mode == 'add' ? null : 'add';
	if (mode == 'add') {
		selectedCodeType = 0;
		say("what do you want to add?");
	} else {
		say("adding code cancelled");
	}
	reGenerate();
	// return false to prevent default browser behaviour
	// and stop event from bubbling
	return false;
	
});

//shortcut to delete a node
Mousetrap.bind(['command+d', 'ctrl+d', 'minus'], function() {
	if(activeNode.name == "tempo" || activeNode.parent.children.length == 1) {
		say('You cannot delete this code. ' + activeNode.readName() + ' is currently selected');
	} else {
		mode = mode == 'delete' ? null : 'delete';
		if (mode == 'delete') {
			say("Are you sure you want to delete this bit of code? Press right to confirm or left to cancel.");
		} else {
			say("delete cancelled");
		}
		reGenerate();
	}
	// return false to prevent default browser behaviour
	// and stop event from bubbling
	return false;
	
});

//shortcut to save code
Mousetrap.bind(['command+s', 'ctrl+s'], function() {
	reGenerate();
	// return false to prevent default browser behaviour
	// and stop event from bubbling
	return false;
});

//shortcut to open code
Mousetrap.bind(['command+o', 'ctrl+o'], function() {
	reGenerate();
	// return false to prevent default browser behaviour
	// and stop event from bubbling
	return false;
});

//shortcut to run code
Mousetrap.bind(['command+r', 'ctrl+r'], function() {
	reGenerate();
	// return false to prevent default browser behaviour
	// and stop event from bubbling
	return false;
	
});

//shortcut to go out of list
Mousetrap.bind(['left', 'a', 'h'], function() {
	switch(mode) {
		case 'add':	// add code
			mode = null;
			say("adding code cancelled. the currently selected bit of code is " + activeNode.readFull());
			break;
		case 'bind-cubelet':	// select cubelet
			mode = null;
			say("cubelet selection cancelled. the currently selected bit of code is " + activeNode.readFull());
			break;
		case 'delete':	// delete
			mode = null;
			say("delete cancelled. the currently selected bit of code is " + activeNode.readFull());
			break;
		case 'choose-value': //choices
			say(activeNode.name + " not changed from " + activeNode.choice);
			mode = null;
			break;
		default:
			if(activeNode.parent != root) {
				activeNode = activeNode.parent;
				say("go out.   " + activeNode.readFull());
			}
			break;
	}
	reGenerate();
});

//shortcut to go into a list
Mousetrap.bind(['right', 'd', 'l'], function() {
	switch(mode) {
		case 'add':	// add code
			switch(selectedCodeType) {
				case 0:	// loop
					activeNode = new LoopNode("loop" + loopNumber++, activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("new loop created");
					break;
				case 1:	// play
					activeNode = new PlayNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("new note created");
					break;
				case 2:	// sleep
					activeNode = new SleepNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("new rest created");
					break;
				case 3:	// fx
					activeNode = new FXNode(activeNode.parent);
					say("new FX created");
					break;
				case 4:	// synth
					activeNode = new SynthNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("new synth created");
					break;
				case 5:	// sample
					activeNode = new SampleNode(activeNode.parent, (activeNode.parent.children.indexOf(activeNode) + 1));
					say("new sample created");
				break;
				default:	// something's wrong
					say("ERROR when attempting to add code.");
					break;
			}
			say(activeNode.readFull());
			mode = null;
			break;
		case 'bind-cubelet':	// select cubelet
			activeNode.cubelet = selectedCubelet;
			if (selectedCubelet > 0) {
				say("Cubelet " + selectedCubelet + " selected.");
			} else {
				say("No cubelet selected.");
			}
			mode = null;
			break;
		case 'delete':	// delete
			// Determine the index of activeNode in the parent's array of children
			var index = activeNode.parent.children.indexOf(activeNode);
			if(index >= 0) {
				if(activeNode.name == "fx") {
					// Parent activeNode's children to activeNode's parent
					activeNode.children.reverse();
					while(activeNode.children.length > 0) {
						var childNode = activeNode.children.pop();
						if(!(childNode instanceof ValueNode || childNode instanceof ChoiceNode)) {
							parent.children.splice(index + 1, 0, childNode);
							childNode.parent = parent;
						}
					}
				}
				// Remove activeNode from its parent's list of children
				activeNode.parent.children.splice(index, 1);
				if(index > 0) {
					activeNode = activeNode.parent.children[index - 1];
				} else {
					activeNode = activeNode.parent.children[index];
				}
				say("Code deleted. the currently selected bit of code is " + activeNode.readFull());
			} else {
				say("ERROR: the currently selected bit of code is not recognised as a child by its parent.");
			}
			mode = null;
			break;
		case 'choose-value': //choices
			activeNode.choice = activeNode.choices[selectedChoice];
			say(activeNode.name + " set to " + activeNode.choices[selectedChoice]);
			mode = null;
			break;
		default:
			if(activeNode.children.length > 0) {
				var oldActive = activeNode;
				activeNode = activeNode.children[0];
                say("go into " + oldActive.readName() + ".   " + activeNode.readFull());
			} else if(activeNode instanceof ValueNode || activeNode instanceof ChoiceNode) {				
				selectedChoice = activeNode.choices.indexOf(activeNode.choice);
				mode = 'choose-value';
				say(activeNode.choices[selectedChoice]);
			}
			break;
	}
	reGenerate();
});

//shortcut to go to the next element in a list
Mousetrap.bind(['down', 's', 'j'], function() {
	switch(mode) {
		case 'add':	// add code
			if(selectedCodeType < (codeTypes.length - 1)) {
				selectedCodeType++;
			}
			say(codeTypes[selectedCodeType]);
			break;
		case 'bind-cubelet':	// select cubelet
			if(selectedCubelet > 0) {
				selectedCubelet--;
				say("Cubelet " + selectedCubelet);
			}
			break;
		case 'choose-value': //choices
			if(0 < selectedChoice) {
				selectedChoice--;
				say(activeNode.choices[selectedChoice]);
			} else {
				say(activeNode.choices[selectedChoice] + " This is the minimum possible value.");
			}
			break;
		case 'delete': //delete
			//do nothing
			break;
		default:
			var n = activeNode.parent.children.indexOf(activeNode);
			if((n + 1) < activeNode.parent.children.length) activeNode = activeNode.parent.children[n+1];
			say(activeNode.readFull());
			break;
	}
	reGenerate();
});

//shortcut to go to the previous element in a list
Mousetrap.bind(['up', 'w', 'k'], function() {
	switch(mode) {
		case 'add':	// add code
			if(selectedCodeType > 0) {
				selectedCodeType--;
			}
			say(codeTypes[selectedCodeType]);
			break;
		case 'bind-cubelet':	// select cubelet
			if(selectedCubelet < 6) {
				selectedCubelet++;
				say("Cubelet " + selectedCubelet);
			}
			break;
		case 'choose-value': //choices
			if((selectedChoice + 1) < activeNode.choices.length) {
				selectedChoice++;
				say(activeNode.choices[selectedChoice]);
			} else {
				say(activeNode.choices[selectedChoice] + " This is the maximum possible value.");
			}
			break;
		case 'delete': //delete
			//do nothing
			break;
		default:
			var n = activeNode.parent.children.indexOf(activeNode);
			if(n != 0) activeNode = activeNode.parent.children[n-1];
			say(activeNode.readFull());
			break;
	}
	reGenerate();
});

// called when tree is updated
function reGenerate() {
	document.getElementById("message").innerHTML = '';
	
	var code = root.generateCode();
	var node = document.createTextNode(code);
	document.getElementById('message').appendChild(node);
}

reGenerate();


// shortcut to stop all Sonic Pi loops
Mousetrap.bind(['*'], function() {
  request("POST", "/unvisual/rest/osc/stop", "", function() {
    console.log("Sent stop OSC");
  }, function(err) {
    console.log("This is a helpful error message");
  });
});

// shortcut to send code to Sonic Pi
Mousetrap.bind(['return', 'enter'], function() {
  var code = root.generateCode();

  request("POST", "/unvisual/rest/osc/run", code, function() {
    console.log("Sent run OSC");
  }, function(err) {
    console.log("This is a helpful error message");
  });
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


function handleKey(e) {
  console.log(e.keyCode);
  switch (e.keyCode) {
    case 50:
    case 98:
      Mousetrap.trigger('down');
      break;
    case 52:
    case 55:
    case 100:
    case 121:
    case 122:
      Mousetrap.trigger('left');
      break;
    case 54:
    case 102:
      Mousetrap.trigger('right');
      break;
    case 56:
    case 104:
      Mousetrap.trigger('up');
      break;
    case 45:
      Mousetrap.trigger('minus');
      break;
    case 43:
      Mousetrap.trigger('plus');
      break;
    default:
  }
}
document.body.addEventListener('keypress', handleKey);

