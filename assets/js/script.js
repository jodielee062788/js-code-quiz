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

var questionIndex = 0;
var score = 0;
var time = 30;
var timer;

startButton.addEventListener('click', startQuiz);
submitButton.addEventListener('click', saveScore);
resetLeaderboardButton.addEventListener('click', resetLeaderboard);
restartLeaderboardButton.addEventListener('click', restartQuiz);

// Fisher-Yates shuffle algorithm
function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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

function resetchoicesButtons() {
    while (choicesButtons.firstChild) {
        choicesButtons.removeChild(choicesButtons.firstChild);
    }
}

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

    setTimeout(() => {
        questionIndex++;

        if (questionIndex < questions.length) {
            showQuestion(questions[questionIndex]);
        } else {
            endQuiz();
        }
    }, 1200); // Adjust the delay time as needed
}


function endQuiz() {
    clearInterval(timer);
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    
    if (score === 0) {
        resultText.innerText = 'You Lost! Better luck next time. \nFinal Score: ' + score;
    } else if (score === questions.length) {
        resultText.innerText = 'Congratulations! You got a perfect score! \nFinal Score: ' + score;
    } else if (score >= 1 && score <= 4) {
        resultText.innerText = 'You did well! Keep practicing. \nFinal Score: ' + score;
    }
}

function updateTimer() {
   time --;
   timerElement.innerText = `Timer: ${time}`;

   if (time <= 0) {
    endQuiz();
  }
}

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

function resetLeaderboard() {
    var isConfirmed = confirm('Are you sure you want to reset the leaderboard? This action cannot be undone.');

    if (isConfirmed) {
        // Clear the leaderboard data from localStorage
        localStorage.removeItem('highScores');
        
        // Display a message indicating the reset
        alert('Leaderboard has been reset!');
        
        // Optionally, reload the page to reflect the changes
        location.reload();
    } else {
        return;
    }
}

function saveScore() {
    var initials = initialsInput.value.trim();

    if (initials !== '') {
        var highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        var newScore = { initials: initials, score: score };
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score); // Sort scores in descending order

        localStorage.setItem('highScores', JSON.stringify(highScores));
        
        // Display the leaderboard
        displayLeaderboard();
    } else {
        alert('Please enter your initials.');
    }
}

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