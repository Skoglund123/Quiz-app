let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15;  
let totalStartTime;
let totalEndTime;

// Startar quizet och hämtar frågorna från vald kategori från API
function startQuiz(category) {
    fetch(`https://opentdb.com/api.php?amount=5&category=${category}&difficulty=medium&type=multiple`)
        .then(response => response.json())
        .then(data => {
            questions = data.results.map(q => ({
                question: q.question,
                options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
                correct: q.correct_answer
            }));
            document.querySelector('header').style.display = 'none';
            document.getElementById('start-page').style.display = 'none';
            document.getElementById('quiz-page').style.display = 'block';
            document.getElementById('question-counter').style.display = 'block';
            totalStartTime = performance.now();
            showQuestion();
        });
}

// Visar en fråga och starta nedräkningen
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        endQuiz();
        return;
    }

    document.getElementById('question-counter').textContent = `Fråga ${currentQuestionIndex + 1} av ${questions.length}`;

    const questionData = questions[currentQuestionIndex];
    document.getElementById('question-text').innerHTML = questionData.question;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = ''; 
    questionData.options.forEach(option => {
        const button = document.createElement('button');
        button.innerHTML = option; 
        button.onclick = () => checkAnswer(option, button);
        optionsDiv.appendChild(button);
    });

    document.getElementById('feedback').textContent = '';

    startTimer();
}

// Starta nedräkningen för frågan
function startTimer() {
    timeLeft = 15; 
    document.getElementById('timer').textContent = `Tid kvar: ${timeLeft}s`;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Tid kvar: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            checkAnswer(null);  // Om tiden går ut innan du har hunnit svara
        }
    }, 1000);
}

// Kontrollerar svaret och visar feedback
function checkAnswer(selectedOption, selectedButton) {
    clearInterval(timerInterval);
    const correctAnswer = questions[currentQuestionIndex].correct;


    // Highlightar rätt och fel svar
    const optionButtons = document.querySelectorAll('.options button');
    optionButtons.forEach(button => {
        if (button.innerHTML === correctAnswer) {
            button.classList.add('correct');  // Markera rätt svar som grönt, styleas is css
        }
        if (selectedButton && button === selectedButton && selectedButton.innerHTML !== correctAnswer) {
            selectedButton.classList.add('incorrect');  // Markera fel svar som rött, styleas is css
        }
        button.disabled = true; 
    });


    if (selectedOption === correctAnswer) {
        score++;
        document.getElementById('feedback').textContent = 'Rätt svar!';
    } else {
        document.getElementById('feedback').textContent = `Fel svar! Rätt svar är ${correctAnswer}`;
    }
    currentQuestionIndex++;
    setTimeout(showQuestion, 2000);  // Gör så att användaren går vidare till nästa fråga efter feedback
}

// Avslutar quizzet och visar resultatet som du fick
function endQuiz() {
    totalEndTime = performance.now();
    const totalTime = ((totalEndTime - totalStartTime) / 1000).toFixed(2);

    document.getElementById('quiz-page').style.display = 'none';
    document.getElementById('question-counter').style.display = 'none';
    document.getElementById('result-page').style.display = 'block';
    document.getElementById('result-text').textContent = `Du fick ${score} av ${questions.length} rätt!`;
    document.getElementById('time-text').textContent = `Tid: ${totalTime} sekunder`;
}

// Startar om quizzet
function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-page').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    document.querySelector('header').style.display = 'block';
    document.getElementById('question-counter').style.display = 'none';
}

