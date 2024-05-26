let recognition;
let shouldRestart = true;

function appendToDisplay(value) {
    const display = document.getElementById('display');
    display.value += value;
}

function updateDisplayForm(value) {
    const displayForm = document.getElementById('displayForm');
    displayForm.value = value;
}

function calculate() {
    const display = document.getElementById('display');
    try {
        const result = eval(display.value);
        updateDisplayForm(result); // Update the displayForm with the calculated result
        localStorage.setItem('ANS', result);
        updateHistoryList(display.value, result); // Pass the calculation expression and result to updateHistoryList
    } catch (error) {
        updateDisplayForm('Error');
    }
}
function clearDisplay() {
    const display = document.getElementById('display');
    display.value = '';
}

function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; // Set the language
        recognition.interimResults = false; // Set to true if you want interim results
        recognition.maxAlternatives = 1; // Set the maximum number of alternatives

        recognition.onresult = function(event) {
            const result = event.results[0][0].transcript.trim().toLowerCase();
            switch (result) {
                case 'equal':
                    calculate(); // Trigger the calculation function
                    break;
                case 'into':
                case 'multiply':
                case '*':
                    appendToDisplay('*');
                    break;
                case 'dot':
                case 'point':
                    appendToDisplay('.');
                    break;
                case 'stop':
                    shouldRestart = false;
                    stopVoiceRecognition();
                    break;
                default:
                    // Check if the result is a number or mathematical operation
                    const isNumeric = !isNaN(parseFloat(result));
                    if (isNumeric || '+-/%'.includes(result)) {
                        appendToDisplay(result);
                    }
                    break;
            }
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = function() {
            if (shouldRestart) {
                recognition.start(); // Restart recognition if shouldRestart is true
            }
        };

        recognition.start(); // Start speech recognition
    } else {
        alert("Speech recognition is not supported in this browser.");
    }
}

function stopVoiceRecognition() {
    if (recognition) {
        recognition.stop(); // Stop speech recognition
        shouldRestart = false;
    }
}


function removeLastCharacter() {
    const display = document.getElementById('display');
    const currentValue = display.value;

    // Check if the last character is an operator
    const lastCharacter = currentValue.slice(-1);
    const isOperator = ['+', '-', '*', '/'].includes(lastCharacter);

    // Remove the last character or operator
    display.value = isOperator ? currentValue.slice(0, -1) : currentValue.slice(0, -1);
}

function togglePage(page) {
    const calculatorPage = document.getElementById('calculatorPage');
    const historyPage = document.getElementById('historyPage');
    const btn = document.getElementById('btn');
    
    // Set the same gradient for both pages
    btn.style.background = 'orange';

    // Toggle between pages
    if (page === 'calculator') {
        calculatorPage.style.display = 'block';
        historyPage.style.display = 'none';
        // Adjust left position for the left click
        btn.style.left = '0';
    } else if (page === 'history') {
        calculatorPage.style.display = 'none';
        historyPage.style.display = 'block';
        // Adjust left position for the right click
        btn.style.left = '57%';
    }
}
function updateHistoryList(expression, result) {
    const historyList = document.getElementById('historyList');
    const currentDate = new Date(); // Get the current date and time
    const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })}`; // Format the date
    const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format the time

    // Create a new list item with the calculation details including date and time
    const listItem = document.createElement('li');
    listItem.textContent = `[${formattedDate} ${formattedTime}]: ${expression} = ${result}`;

    // Prepend the new list item to the history list
    if (historyList.firstChild) {
        historyList.insertBefore(listItem, historyList.firstChild);
    } else {
        historyList.appendChild(listItem);
    }

    // Save the calculation to local storage
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.unshift(`[${formattedDate} ${formattedTime}]: ${expression} = ${result}`); // Add the new calculation to the beginning of the array
    localStorage.setItem('history', JSON.stringify(history));
}



window.onload = function() {
    togglePage('calculator');
   
    // Retrieve the history from local storage
        const history = JSON.parse(localStorage.getItem('history')) || [];
        console.log(history)
    // Render the history list
      //history.forEach(entry => {
     //   const [expression, result] = entry.split(' = ');
     //   updateHistoryList(expression, result);
  //  });
};


