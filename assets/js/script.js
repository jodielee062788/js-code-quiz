var startButton = document.getElementById('start-btn');
var instructions = document.getElementById('instructions');
var questionContainer = document.getElementById('question-container');
var answerButtons = document.getElementById('answer-buttons');
var resultContainer = document.getElementById('result-container');
var resultText = document.getElementById('result-text');
var initialsInput = document.getElementById('initials');
var submitButton = document.getElementById('submit-btn');
var timerElement = document.getElementById('timer');
var restartButton = document.getElementById('restart-btn');

var questionIndex = 0;
var score = 0;
var time = 30;
var timer;

startButton.addEventListener('click', startQuiz);
submitButton.addEventListener('click', saveScore);
restartButton.addEventListener('click', restartQuiz);

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

    shuffleQuestions(questions);

    // Start the timer interval
    timer = setInterval(updateTimer, 1000);
    timerElement.innerText = `Timer: ${time}`;
    
    showQuestion(questions[questionIndex]);
}

function showQuestion(question) {
    document.getElementById('question').innerText = `${question.question}`;
    resetAnswerButtons();
    question.choices.forEach(choice => {
        var button = document.createElement('button');
        button.innerText = choice;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(choice, question.answer));
        answerButtons.appendChild(button);
    });
}

function resetAnswerButtons() {
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(selectedChoice, correctAnswer) {
    if (selectedChoice === correctAnswer) {
        score++;
    } else {
        // Deduct 10 seconds for an incorrect answer
        time -= 7;

        // Ensure the time does not go below 0
        time = Math.max(0, time);

        // Update the timer display
        timerElement.innerText = `Timer: ${time}`;
    }

    questionIndex++;

    if (questionIndex < questions.length) {
        showQuestion(questions[questionIndex]);
    } else {
        endQuiz();
    }
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

function saveScore() {
    var initials = initialsInput.value.trim();

    if (initials !== '') {
        // Here you can save the initials and score to your desired storage (e.g., localStorage)
        console.log(`Initials: ${initials}, Score: ${score}`);
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
    resultText.innerText = '';
    initialsInput.value = '';

    startQuiz();
}