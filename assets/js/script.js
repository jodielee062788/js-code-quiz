// DOM elements
// These variables store references to various HTML elements using their IDs
var startButton = document.getElementById('start-btn');
var instructions = document.getElementById('instructions');
var questionContainer = document.getElementById('question-container');
var choicesButtons = document.getElementById('choices-btns');
var resultContainer = document.getElementById('result-container');
var resultText = document.getElementById('result-text');
var initialsInput = document.getElementById('initials');
var submitButton = document.getElementById('submit-btn');
var timerElement = document.getElementById('timer');
var leaderboardContainer = document.getElementById('leaderboard-container');
var resetLeaderboardButton = document.getElementById('reset-leaderboard-btn');
var restartLeaderboardButton = document.getElementById('restart-leaderboard-btn');

// Quiz state variables
// These variables keep track of the quiz state
var questionIndex = 0;
var score = 0;
var time = 30;
var timer;

// Event listeners
// These event listeners handle user interactions and trigger corresponding functions
startButton.addEventListener('click', startQuiz);
submitButton.addEventListener('click', saveScore);
resetLeaderboardButton.addEventListener('click', resetLeaderboard);
restartLeaderboardButton.addEventListener('click', restartQuiz);

// This function shuffles an array using the Fisher-Yates algorithm
function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Quiz initialization
function startQuiz() {
    startButton.classList.add('hidden');
    instructions.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    leaderboardContainer.classList.add('hidden');

    shuffleQuestions(questions);

    // Start the timer interval
    timer = setInterval(updateTimer, 1000);
    timerElement.innerText = `Timer: ${time}`;
    
    showQuestion(questions[questionIndex]);
}

// Displaying a question
function showQuestion(question) {
    document.getElementById('question').innerText = `${question.question}`;
    resetchoicesButtons();
    question.choices.forEach(choice => {
        var button = document.createElement('button');
        button.innerText = choice;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(choice, question.answer));
        choicesButtons.appendChild(button);
    });
}

// Resetting choice buttons
// This function clears the choicesButtons container to prepare for displaying the next question
function resetchoicesButtons() {
    while (choicesButtons.firstChild) {
        choicesButtons.removeChild(choicesButtons.firstChild);
    }
}

// Handling user's answer selection
// This function is called when a user clicks on a choice button and handles the logic for correct and incorrect answers
function selectAnswer(selectedChoice, correctAnswer) {
    var buttons = document.querySelectorAll('#choices-btns .btn');
    buttons.forEach(button => {
        button.classList.remove('correct', 'incorrect');
    });

    if (selectedChoice === correctAnswer) {
        // Correct answer
        score++;
        var selectedButton = Array.from(buttons).find(button => button.innerText === selectedChoice);
        selectedButton.classList.add('correct');
    } else {
        // Incorrect answer
        time -= 6;
        time = Math.max(0, time);
        timerElement.innerText = `Timer: ${time}`;
        var correctButton = Array.from(buttons).find(button => button.innerText === correctAnswer);
        correctButton.classList.add('correct');
        var selectedButton = Array.from(buttons).find(button => button.innerText === selectedChoice);
        selectedButton.classList.add('incorrect');
    }
    
    // Sets delay before moving to the next question
    setTimeout(() => {
        questionIndex++;

        if (questionIndex < questions.length) {
            showQuestion(questions[questionIndex]);
        } else {
            endQuiz();
        }
    }, 1200); // Adjust the delay time as needed
}

// Ending the quiz
function endQuiz() {
    clearInterval(timer);
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    // Possible outcomes based on scores
    if (score === 0) {
        resultText.innerText = 'You Lost! Better luck next time. \nFinal Score: ' + score;
    } else if (score === questions.length) {
        resultText.innerText = 'Congratulations! You got a perfect score! \nFinal Score: ' + score;
    } else if (score >= 1 && score <= 4) {
        resultText.innerText = 'You did well! Keep practicing. \nFinal Score: ' + score;
    }
}

// Updating the timer
function updateTimer() {
   time --;
   timerElement.innerText = `Timer: ${time}`;

   if (time <= 0) {
    endQuiz();
  }
}

// Displaying the leaderboard
function displayLeaderboard() {
    leaderboardContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden')
    var highScores = JSON.parse(localStorage.getItem('highScores')) || '';
    
    var leaderboardHTML = '';
    highScores.forEach((entry, index) => {
        leaderboardHTML += `<li class="leaderboard-item">${index + 1}. ${entry.initials}: ${entry.score}</li>`;
    });

    document.getElementById('leaderboard-list').innerHTML = leaderboardHTML;
}

// Resetting the leaderboard
function resetLeaderboard() {
    var isConfirmed = confirm('Are you sure you want to reset the leaderboard? This action cannot be undone.');

    if (isConfirmed) {
        // Clear the leaderboard data from localStorage
        localStorage.removeItem('highScores');
        alert('Leaderboard has been reset!');
        location.reload();
    } else {
        return;
    }
}

// Saving the user's score
function saveScore() {
    var initials = initialsInput.value.trim();

    if (initials !== '') {
        var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        var newScore = { initials: initials, score: score };
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score); // Sort scores in descending order

        localStorage.setItem('highScores', JSON.stringify(highScores));
        displayLeaderboard();
    } else {
        alert('Please enter your initials.');
    }
}

// Restarting the quiz
function restartQuiz() {
    questionIndex = 0;
    score = 0;
    time = 30;

    // Clear existing HTML content
    resultContainer.classList.add('hidden');
    leaderboardContainer.classList.add('hidden');
    resultText.innerText = '';
    initialsInput.value = '';

    startQuiz();
}