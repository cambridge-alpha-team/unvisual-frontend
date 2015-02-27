var codeTypes = ["loop", "play", "sleep", "fx", "synth", "sample"];
var addFromLoopChoices = ["after the loop", "at the start of the loop"];
var inLoop = false;

var loopNumber = 1; // to uniquely name loops

var root = new RootNode();
var activeNode = new TempoNode();

var mode = null; // null | 'add' | 'bind-cubelet' | 'delete' | 'choose-value' | 'add-loop'
var selectedCodeType;
var selectedCodePosition = 0;
var selectedCubelet;
var selectedChoice;
var loopNumber = 1; //to uniquely name loops
var actionIndex = -1;
var actions = [];
var actionRefs = [];

// make initial loop
var loopA = new LoopNode("loop" + loopNumber++, root, 1);

// speech
var speechNode = document.createTextNode('');
document.getElementById('speech').appendChild(speechNode);

function say(message) {
	speechNode.textContent = ''; // clear first to make sure it *changes*
	speechNode.textContent = message;
	console.log(message);
}

function unparentNode(childNode) {
	var index = childNode.parent.children.indexOf(childNode);
	if (index >= 0) {
		// Remove childNode from its parent's list of children
		childNode.parent.children.splice(index, 1);
	}
	childNode.parent = null;
}

function addChildNode(childNode, parentNode, index) {
	if (childNode.name == 'fx') {
		for (var i = 0; i < childNode.children.length; i++) {
			childNode.children[i].parent = childNode;
			var childIndex = childNode.parent.children.indexOf(childNode.children[i]);
			if (childIndex >= 0) {
				childNode.parent.children.splice(childIndex, 1);
			}
		}
	}
	unparentNode(childNode);
	childNode.parent = parentNode;
	if (index < 0) index = 0;
	if (index < parentNode.children.length) {
		parentNode.children.splice(index, 0, childNode);
	} else {
		parentNode.children.push(childNode);
	}
}

function bindCubelet(currentNode, cubelet) {
	currentNode.cubelet = cubelet;
	if (cubelet > 0) {
		say("Cubelet " + cubelet + " selected.");
	} else {
		say("No cubelet selected.");
	}
}

function deleteNode(currentNode) {
	// Determine the index of currentNode in the parent's array of children
	var index = currentNode.parent.children.indexOf(currentNode);
	if(index >= 0) {
		if(currentNode.name == "fx") {
			// Parent currentNode's children to currentNode's parent
			for(var i = 1; i < currentNode.children.length; i++) {
				var childNode = currentNode.children[i];
				currentNode.parent.children.splice(index + i, 0, childNode);
				childNode.parent = currentNode.parent;
			}
		}
		// Remove currentNode from its parent's list of children
		currentNode.parent.children.splice(index, 1);
		if(index > 0) {
			activeNode = currentNode.parent.children[index - 1];
		} else if (currentNode.parent.children.length > 0) {
			activeNode = currentNode.parent.children[index];
		} else {
			activeNode = currentNode.parent;
		}
		say("Code deleted. The currently selected bit of code is " + activeNode.readFull());
		return true;
	} else {
		say("ERROR: index = " + index + ". Node \"" + currentNode.name + "\" could not be deleted because it is not recognised as a child by node \"" + currentNode.parent.name + "\".");
		return false;
	}
}

function modValue(currentNode, currentChoice, delta) {
	if(0 <= currentChoice + delta && currentChoice + delta <= currentNode.choices.length) {
		currentChoice += delta;
		selectedChoice = currentChoice;
		currentNode.choice = currentNode.choices[selectedChoice];
		say(currentNode.choices[selectedChoice]);
		return true;
	} else {
		say("You have reached the bottom of the list of choices. " + currentNode.choice);
		return false;
	}
}

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
		mode = (mode == 'add' || mode == 'add-loop') ? null : activeNode.name.substr(0, 4) == 'loop' ? 'add-loop' : 'add';
		codeTypes = activeNode.parent.name.substr(0, 4) == 'loop' ? [ "play", "sleep", "fx", "synth", "sample" ] : [ "loop", "play", "sleep", "fx", "synth", "sample" ];
		if (mode == 'add') {
			var ancestor = activeNode.parent;
			if (ancestor instanceof RootNode) {
				codeTypes = [ "loop", "play", "sleep", "synth", "sample" ];
			}
			while (!(ancestor instanceof RootNode)) {
				if (ancestor instanceof LoopNode){
					inLoop = true;
					codeTypes = [ "play", "sleep", "fx", "synth", "sample" ];
				} else {
					inLoop = false;
					codeTypes = [ "loop", "play", "sleep", "fx", "synth", "sample" ];
				}		
				ancestor = ancestor.parent;
			}
			selectedCodeType = 0;
			say("What do you want to add? " + codeTypes[selectedCodeType] + "; " + (selectedCodeType + 1) + " of " + codeTypes.length);
		} else if (mode == 'add-loop') {
			selectedCodePosition = 0;
			say("Where do you want to add the code? " + addFromLoopChoices[selectedCodePosition] + "; " + (selectedCodePosition + 1) + " of " + addFromLoopChoices.length);
		} else {
			say("Adding code cancelled. " + activeNode.readName());
		}
		regenerate();
	}
	return false;
});


//shortcut to delete a node
Mousetrap.bind(['minus', '-'], function() {
	if (activeNode.name == "tempo" || (activeNode.parent.children.length == 1 && activeNode.name != 'fx') || activeNode.name == 'fx name' || activeNode.parent instanceof PlayNode || (activeNode instanceof FXNode && activeNode.parent.children.length == 1 && activeNode.children.length == 1)) {
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

// shortcut to undo last action
Mousetrap.bind(['command+z', 'ctrl+z'], function() {
	if (actions.length > 0 && actionIndex >= 0) {
		switch(actions[actionIndex]) {
			case 'add':	// add code
				if (deleteNode(actionRefs[actionIndex][0])) {
					say("Adding code undone. The currently selected bit of code is " + activeNode.readFull());
				} else {
					console.log("ERROR: deleteNode(" + actionRefs[actionIndex].name + ") failed.");
				}
				actionIndex--;
				break;
			case 'bind-cubelet':	// select cubelet
				bindCubelet(actionRefs[actionIndex][0], actionRefs[actionIndex][1]);
				actionIndex--;
				say("Cubelet selection undone. The currently selected bit of code is " + activeNode.readFull());
				break;
			case 'delete':	// delete
				addChildNode(actionRefs[actionIndex][0], actionRefs[actionIndex][1], actionRefs[actionIndex][2]);
				actionIndex--;
				say("Delete undone. The currently selected bit of code is " + activeNode.readFull());
				break;
			case 'choose-value': //choices
				if (modValue(actionRefs[actionIndex][0], actionRefs[actionIndex][2], actionRefs[actionIndex][1] - actionRefs[actionIndex][2])) {
					actionIndex--;
					say("Choose value undone. The currently selected bit of code is " + activeNode.readFull());
				}
				break;
			default:
				console.log("ERROR: Action not recognised.");
				if(activeNode.parent != root) {
					activeNode = activeNode.parent;
				}
				break;
		}
	} else {
		say("There's nothing to undo.");
	}
	regenerate();
	return false;
});

// shortcut to redo the last action to be undone
Mousetrap.bind(['command+y', 'ctrl+y'], function() {
	if (actions.length > 0 && actionIndex + 1 < actions.length) {
		switch(actions[actionIndex + 1]) {
			case 'add':	// add code
				actionIndex++;
				addChildNode(actionRefs[actionIndex][0], actionRefs[actionIndex][1], actionRefs[actionIndex][2]);
				say("Adding code redone. The currently selected bit of code is " + activeNode.readFull());
				break;
			case 'bind-cubelet':	// select cubelet
				actionIndex++;
				bindCubelet(actionRefs[actionIndex][0], actionRefs[actionIndex][2]);
				say("Cubelet selection redone. The currently selected bit of code is " + activeNode.readFull());
				break;
			case 'delete':	// delete
				actionIndex++;
				if (deleteNode(actionRefs[actionIndex][0])) {
					say("Delete redone. The currently selected bit of code is " + activeNode.readFull());
				} else {
					actionIndex--;
				}
				break;
			case 'choose-value': //choices
				actionIndex++;
				if (modValue(actionRefs[actionIndex][0], actionRefs[actionIndex][1], actionRefs[actionIndex][2] - actionRefs[actionIndex][1])) {
					say("Choose value redone. The currently selected bit of code is " + activeNode.readFull());
				} else {
					actionIndex--;
				}
				break;
			default:
				console.log("ERROR: Action not recognised.");
				if(activeNode.parent != root) {
					activeNode = activeNode.parent;
				}
				break;
		}
	} else {
		say("There's nothing to redo.");
	}
	regenerate();
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
		case 'choose-value': // choices
			say("Go out.   " + activeNode.readFull());
			mode = null;
			break;
		case 'add-loop': // choose where to add code relative to a loop
			mode = null;
			say("Adding code cancelled. The currently selected bit of code is " + activeNode.readFull());
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
	var response = '';
	switch (mode) {
		case 'add': // add code
			var newNodeMsg = selectedCodePosition == 1 ? "at the start of " : "after ";
			var newNodeParent = selectedCodePosition == 1 ? activeNode : activeNode.parent;
			var newNodeIndex = selectedCodePosition == 1 ? 0 : (activeNode.parent.children.indexOf(activeNode) + 1);
			if (inLoop) {
				switch (selectedCodeType) {
					case 0: // play
						response += "New note added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new PlayNode(newNodeParent, newNodeIndex);
						break;
					case 1: // sleep
						response += "New rest added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new SleepNode(newNodeParent, newNodeIndex);
						break;
					case 2: // fx
						// This shouldn't behave any differently depending on the value of selectedCodePosition.
						response += "New FX added around " ;
						for (var i = 0; i < activeNode.parent.children.length; i++){
							response += activeNode.parent.children[i].readName();
							if ( i == (activeNode.parent.children.length - 2))
								response += " and ";
							else if ( i == (activeNode.parent.children.length - 1))
								response += ". ";
							else 
								response += ", ";
						}
						
						activeNode = new FXNode(activeNode.parent);
						break;
					case 3: // synth
						response += "New synth added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new SynthNode(newNodeParent, newNodeIndex);
						break;
					case 4: // sample
						response += "New sample added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new SampleNode(newNodeParent, newNodeIndex);
						break;
					default: // something's wrong
						say("ERROR When attempting to add code.");
						break;
				}
			} else {
				switch (selectedCodeType) {
					case 0: // loop
						response += "New loop added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new LoopNode("loop" + loopNumber++, newNodeParent, newNodeIndex);
						break;
					case 1: // play
						response += "New note added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new PlayNode(newNodeParent, newNodeIndex);
						break;
					case 2: // sleep
						response += "New rest added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new SleepNode(newNodeParent, newNodeIndex);
						break;
					case 3: // fx
						// This shouldn't behave any differently depending on the value of selectedCodePosition.
						response += "New FX added around " ;
						for (var i = 0; i < activeNode.parent.children.length; i++){
							response += activeNode.parent.children[i].readName();
							if ( i == (activeNode.parent.children.length - 2))
								response += " and ";
							else if ( i == (activeNode.parent.children.length - 1))
								response += ". ";
							else 
								response += ", ";
						}
						
						activeNode = new FXNode(activeNode.parent);
						break;
					case 4: // synth
						response += "New synth added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new SynthNode(newNodeParent, newNodeIndex);
						break;
					case 5: // sample
						response += "New sample added " + newNodeMsg + activeNode.readName() + '. ';
						activeNode = new SampleNode(newNodeParent, newNodeIndex);
						break;
					default: // something's wrong
						say("ERROR When attempting to add code.");
						break;
				}
			}
			if (actions.length > 0) {
				actions.splice(actionIndex + 1, actions.length - actionIndex, mode);
				actionRefs.splice(actionIndex + 1, actionRefs.length - actionIndex, [activeNode, activeNode.parent, activeNode.parent.children.indexOf(activeNode)]);
			} else {
				actions.push(mode);
				actionRefs.push([activeNode, activeNode.parent, activeNode.parent.children.indexOf(activeNode)]);
			}
			actionIndex++;
			say(response + activeNode.readFull());
			selectedCodePosition = 0;
			mode = null;
			break;
		case 'bind-cubelet': // select cubelet
			//Do nothing
			break;
		case 'delete': // delete
		// Determine the index of activeNode in the parent's array of children
			var index = activeNode.parent.children.indexOf(activeNode);
			if (actions.length > 0) {
				actions.splice(actionIndex + 1, actions.length - actionIndex, mode);
				actionRefs.splice(actionIndex + 1, actionRefs.length - actionIndex, [activeNode, activeNode.parent, index]);
			} else {
				actions.push(mode);
				actionRefs.push([activeNode, activeNode.parent, index]);
			}
			actionIndex++;
			if(index >= 0) {
				if(activeNode.name == "fx") {
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
				} else if (activeNode.parent.children.length > 0) {
					activeNode = activeNode.parent.children[index];
				} else {
					activeNode = activeNode.parent;
				}
			}
			say("Code deleted. The currently selected bit of code is " + activeNode.readFull());
			mode = null;
			break;
		case 'choose-value': //choices
			//Do nothing 
			break;
		case 'add-loop': // choose where to add code relative to a loop
			selectedCodeType = 0;
			if (selectedCodePosition == 1 && activeNode.name.substr(0, 4) == 'loop') {
				codeTypes = [ "play", "sleep", "fx", "synth", "sample" ];
			} else {
				codeTypes = [ "loop", "play", "sleep", "synth", "sample" ];
			}
			say("What do you want to add? " + codeTypes[selectedCodeType] + "; " + (selectedCodeType + 1) + " of " + codeTypes.length);
			mode = 'add';
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

// shortcut to go to the next element in a list
Mousetrap.bind([ 'down', 's', 'j' ], function() {
	switch (mode) {
		case 'add': // add code
			if (selectedCodeType < (codeTypes.length - 1)) {
				selectedCodeType++;
				say(codeTypes[selectedCodeType] + "; " + (selectedCodeType + 1)
						+ " of " + codeTypes.length);
			} else {
				say("You are at the bottom of the list. " + codeTypes[selectedCodeType]);
			}
			break;
		case 'bind-cubelet': // select cubelet
			if (0 < selectedCubelet) {
				selectedCubelet--;
				activeNode.cubelet = selectedCubelet;
				say("Cubelet " + selectedCubelet);
			}
			break;
		case 'choose-value': //choices
			if (activeNode.name == 'sample') {
				if ((selectedChoice + 1) < activeNode.choices.length) {
					if (actionRefs.length > 0 && actionIndex >= 0 && actions[actionIndex] == mode && actionRefs[actionIndex][0] == activeNode) {
						actionRefs[actionIndex][2] = selectedChoice + 1;
					} else if (actions.length > 0) {
						actions.splice(actionIndex + 1, actions.length - actionIndex, mode);
						actionRefs.splice(actionIndex + 1, actionRefs.length - actionIndex, [activeNode, selectedChoice, selectedChoice + 1]);
						actionIndex++;
					} else {
						actions.push(mode);
						actionRefs.push([activeNode, selectedChoice, selectedChoice + 1]);
						actionIndex++;
					}
					selectedChoice++;
					activeNode.choice = activeNode.choices[selectedChoice];
					say(activeNode.choices[selectedChoice]);
				} else {
					say("You have reached the bottom of the list of choices. " + activeNode.choice);

				}
			} else {
				if(0 < selectedChoice) {
					if (actionRefs.length > 0 && actionIndex >= 0 && actions[actionIndex] == mode && actionRefs[actionIndex][0] == activeNode) {
						actionRefs[actionIndex][2] = selectedChoice - 1;
					} else if (actions.length > 0) {
						actions.splice(actionIndex + 1, actions.length - actionIndex, mode);
						actionRefs.splice(actionIndex + 1, actionRefs.length - actionIndex, [activeNode, selectedChoice, selectedChoice - 1]);
						actionIndex++;
					} else {
						actions.push(mode);
						actionRefs.push([activeNode, selectedChoice, selectedChoice - 1]);
						actionIndex++;
					}
					selectedChoice--;
					activeNode.choice = activeNode.choices[selectedChoice];
					say(activeNode.choices[selectedChoice]);
				} else {
					say("You have reached the bottom of the list of choices. " + activeNode.choice);
				}
			}
			break;
		case 'delete': // delete
			// do nothing
			break;
		case 'add-loop': // choose where to add code relative to a loop
			if (selectedCodePosition < (addFromLoopChoices.length - 1)) {
				selectedCodePosition++;
				say(addFromLoopChoices[selectedCodePosition] + "; " + (selectedCodePosition + 1)
						+ " of " + addFromLoopChoices.length);
			} else {
				say("You are at the bottom of the list.");
			}
			break;
		default:
			var n = activeNode.parent.children.indexOf(activeNode);
			if ((n + 1) < activeNode.parent.children.length) {
				activeNode = activeNode.parent.children[n + 1];
				say(activeNode.readFull());
			} else{
				if (activeNode.parent.name == 'root')
					say("You are at the bottom of the page. " + activeNode.readFull());
				else
					say("You can only go up, in or out from this point. " + activeNode.readFull());
			}
			break;
	}
	regenerate();
	return false;
});

// shortcut to go to the previous element in a list
Mousetrap.bind([ 'up', 'w', 'k' ], function() {
	switch (mode) {
		case 'add': // add code
			if (selectedCodeType > 0) {
				selectedCodeType--;
				say(codeTypes[selectedCodeType] + "; " + (selectedCodeType + 1)
						+ " of " + codeTypes.length);
			} else {
				say("You are at the top of the list. " + codeTypes[selectedCodeType]);
			}
			break;
		case 'bind-cubelet': // select cubelet
			if (selectedCubelet < 6) {
				selectedCubelet++;
				activeNode.cubelet = selectedCubelet;
				say("Cubelet " + selectedCubelet);
			}
			break;
		case 'choose-value': //choices
			if (activeNode.name == 'sample') {
				if (0 < selectedChoice) {
					if (actionRefs.length > 0 && actionIndex >= 0 && actions[actionIndex] == mode && actionRefs[actionIndex][0] == activeNode) {
						actionRefs[actionIndex][2] = selectedChoice - 1;
					} else if (actions.length > 0) {
						actions.splice(actionIndex + 1, actions.length - actionIndex, mode);
						actionRefs.splice(actionIndex + 1, actionRefs.length - actionIndex, [activeNode, selectedChoice, selectedChoice - 1]);
						actionIndex++;
					} else {
						actions.push(mode);
						actionRefs.push([activeNode, selectedChoice, selectedChoice - 1]);
						actionIndex++;
					}
					selectedChoice--;
					activeNode.choice = activeNode.choices[selectedChoice];
					say(activeNode.choices[selectedChoice]);
				} else {
					say("You have reached the top of the list of choices. " + activeNode.choice);
				}
			} else {
				if((selectedChoice + 1) < activeNode.choices.length) {
					if (actionRefs.length > 0 && actionIndex >= 0 && actions[actionIndex] == mode && actionRefs[actionIndex][0] == activeNode) {
						actionRefs[actionIndex][2] = selectedChoice + 1;
					} else if (actions.length > 0) {
						actions.splice(actionIndex + 1, actions.length - actionIndex, mode);
						actionRefs.splice(actionIndex + 1, actionRefs.length - actionIndex, [activeNode, selectedChoice, selectedChoice + 1]);
						actionIndex++;
					} else {
						actions.push(mode);
						actionRefs.push([activeNode, selectedChoice, selectedChoice + 1]);
						actionIndex++;
					}
					selectedChoice++;
					activeNode.choice = activeNode.choices[selectedChoice];
					say(activeNode.choices[selectedChoice]);
				} else {
					say("You have reached the top of the list of choices. " + activeNode.choice);
				}
			}	
			break;
		case 'delete': // delete
			// do nothing
			break;
		case 'add-loop': // choose where to add code relative to a loop
			if (selectedCodePosition > 0) {
				selectedCodePosition--;
				say(addFromLoopChoices[selectedCodePosition] + "; " + (selectedCodePosition + 1)
						+ " of " + addFromLoopChoices.length);
			} else {
				say("You are at the top of the list.");
			}
			break;
		default:
			var n = activeNode.parent.children.indexOf(activeNode);
			if (n != 0) {
				activeNode = activeNode.parent.children[n - 1];
				say(activeNode.readFull());
			} else {
				if (activeNode.parent.name == 'root')
					say("You are at the top of the page. " + activeNode.readFull());
				else 
					say("You can only go down, in or out  from this point. " + activeNode.readFull());
			}
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
Mousetrap.bind([ '*' ], function() {
	request("POST", "osc/stop", "", function() {
		console.log("Sent stop OSC");
	}, function(err) {
		console.log("This is a helpful error message");
	});
	return false;
});

// shortcut to send code to Sonic Pi
Mousetrap.bind([ 'return', 'enter' ], function() {
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

