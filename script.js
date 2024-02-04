document.addEventListener('DOMContentLoaded', () => {
    // const questions = ["1. I have the ability to organize ideas, resources, time, and people effectively. ", "Question 2", "Question 3"]; // Replace with actual questions
    var questions=[]
    var q_scores=[[]]
    giftsMapping = {
	"Leadership": [6, 16, 27, 43, 65],
	"Administration": [1, 17, 31, 47, 59],
	"Teaching": [2, 18, 33, 61, 73],
	"Knowledge": [9, 24, 39, 68, 79],
	"Wisdom": [3, 19, 48, 62, 74],
	"Prophecy": [10, 25, 40, 54, 69],
	"Discernment": [11, 26, 41, 55, 70],
	"Exhortation": [20, 34, 49, 63, 75],
	"Shepherding": [4, 21, 35, 50, 76],
	"Faith": [12, 28, 42, 56, 80],
	"Evangelism": [5, 36, 51, 64, 77],
	"Apostleship": [13, 29, 44, 57, 71],
	"Service/Helps": [14, 30, 46, 58, 72],
	"Mercy": [7, 22, 37, 52, 66],
	"Giving": [8, 23, 38, 53, 67],
	"Hospitality": [15, 32, 45, 60, 78]
    }
    const scores = {};

    var debugging = [ false ];

    // Initialize scores object
    for (const gift in giftsMapping) {
        scores[gift] = 0;
    }

    const questionsContainer = document.getElementById('questions-container');
    const resultsContainer = document.getElementById('results-container');
    const surveyForm = document.getElementById('survey-form');


    function loadQuestionsFromFile(filePath) {
	fetch(filePath)
	    .then(response => response.text())
	    .then(text => {
		// Split the text into lines and then process each line
		const lines = text.split('\n');
		console.log(lines)
		questions = lines.map(line => line.trim()).filter(line => line.length > 0);

		// Now that we have the questions, we can create the questions form
		createQuestions(questions);
		initializeDefaultAnswers(questions); 
	    })
	    .catch(error => {
		console.error('Error fetching the questions text file:', error);
	    });
    }

    function createQuestions() {
        questions.forEach((question, index) => {
            const questionItem = document.createElement('div');
            questionItem.className = 'question-item';
            questionItem.innerHTML = `
                <label>${question}</label><br>
                ${[1, 2, 3, 4, 5].map(number => `
                    <input type="radio" name="question${index}" value="${number}" class="survey-option" required>
                    <label>${number}</label>
                `).join('')}
            `;
            questionsContainer.appendChild(questionItem);
        });

	    const inputs = document.querySelectorAll('.survey-option');
    inputs.forEach(input => {
        input.addEventListener('click', handleInputChange);
    });

    }

    function calculateScores() {
	// Reset scores
	for (const gift in giftsMapping) {
	    scores[gift] = 0;
	}

	if (debugging[0]){
	    q_scores[0].forEach((selectedOption, questionIndex) => {
		surveyForm[`question${questionIndex}`].value = selectedOption;

		for (const gift in giftsMapping) {
		    if (giftsMapping[gift].includes(questionIndex + 1)) {
			scores[gift] += parseInt(selectedOption, 10);
		    }
		}
	    });
	    return

	}



	// Calculate new scores
	questions.forEach((question, questionIndex) => {
	    const selectedOption = surveyForm[`question${questionIndex}`].value;
	    q_scores[0][questionIndex]=(parseInt(selectedOption, 10))
	    for (const gift in giftsMapping) {
		if (giftsMapping[gift].includes(questionIndex + 1)) {
		    scores[gift] += parseInt(selectedOption, 10);
		}
	    }
	});
    }



    function handleInputChange(event) {
	const questionItem = event.target.closest('.question-item');
	if (questionItem) {
	    questionItem.classList.add('user-modified');
	}
    }

    function displayResults_txt() {
	// Sort the gifts based on scores from highest to lowest
	const sortedGifts = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

	let resultsHTML = '<h2>Your Spiritual Gifts Scores:</h2>';
	sortedGifts.forEach((gift) => {
	    // Start with the gift and its total score
	    resultsHTML += `<h3>${gift}: ${scores[gift]}</h3>`;

	    // Get the questions and scores for this gift, sorted by score
	    const giftQuestions = giftsMapping[gift]
	    .map(questionNumber => {
		const questionIndex = questionNumber - 1;
		const questionText = questions[questionIndex];
		const selectedOption = surveyForm[`question${questionIndex}`].value;
		return { text: questionText, score: parseInt(selectedOption, 10) };
	    })
	    .sort((a, b) => b.score - a.score); // Sort by score, descending

	    // Add each question and its score
	    giftQuestions.forEach(question => {
		resultsHTML += `<p>Question: ${question.text}<br>Score: ${question.score}</p>`;
	    });
	});

	resultsContainer.innerHTML += resultsHTML;
    }

    function displayResults() {
    // Sort the gifts based on scores from highest to lowest
    const sortedGifts = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);

    // Set some dimensions and padding for the SVG
    const svgWidth = 600;
    const svgHeight = sortedGifts.length * 50 + 20; // 50px per bar + 20px padding
    const barHeight = 30;
    const padding = { top: 20, right: 20, bottom: 20, left: 150 }; // Increase left padding for text

    let resultsHTML = '<h2>Your Spiritual Gifts Scores in Sorted Graph:</h2>';
    resultsHTML += `<svg width="${svgWidth}" height="${svgHeight}">`;

    sortedGifts.forEach((gift, index) => {
        const barWidth = scores[gift] * 10; // Scale the bar width
        const yPosition = index * 50 + padding.top; // 50px per bar

        resultsHTML += `
            <rect width="${barWidth}" height="${barHeight}" x="${padding.left}" y="${yPosition}" style="fill:steelblue;" />
            <text x="${padding.left - 5}" y="${yPosition + barHeight / 2 + 5}" fill="black" text-anchor="end">${gift}</text>
            <text x="${barWidth + padding.left + 5}" y="${yPosition + barHeight / 2 + 5}" fill="black">${scores[gift]}</text>
        `;
    });

    resultsHTML += '</svg>';
    resultsContainer.innerHTML += resultsHTML;
}

    // Function to initialize default answers to 3
    function initializeDefaultAnswers() {
	questions.forEach((question, questionIndex) => {
	    surveyForm[`question${questionIndex}`].value = 3;
	    q_scores[0].push(3);
	    // input.classList.remove('user-modified');
	});
    }




    surveyForm.addEventListener('submit', (event) => {
	event.preventDefault();
	resultsContainer.innerHTML = '';
	calculateScores();
	displayResults(); // This will display the bar chart
	displayResults_txt(); // This will display the text results with sorted scores
    });

    // Create the questions form
    const filePath = 'questions.txt';
    loadQuestionsFromFile(filePath);
    window.debug = {
	questions: questions,
	giftsMapping: giftsMapping,
	scores: scores,
	debugging: debugging,
	q_scores: q_scores,
    };
});
