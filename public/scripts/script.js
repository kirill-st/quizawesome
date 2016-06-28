var viewList = document.getElementsByClassName('view');
var removeList = document.getElementsByClassName('remove');

// DELETE QUIZ
for (var i = 0; i < removeList.length; i++) {
    removeList[i].addEventListener('click', function() {
        if (confirm('This would delete your quiz completely. Are you sure you want to proceed?')) {
            var deleteForm = this.firstElementChild.nextElementSibling;
            deleteForm.submit();
        } else {
            return;
        }
    });
}

// VIEW QUIZ
for (var i = 0; i < viewList.length; i++) {
    viewList[i].addEventListener('click', function() {
        var viewForm = this.firstElementChild.nextElementSibling;
        viewForm.submit();
    });
}

// ============================
//     NEW QUIZ VALIDATION
// ============================

var submitQuiz = document.getElementById('submitQuiz');

submitQuiz.addEventListener('click', function(e) {

    var counter = null;

    var emptyElems = [];

    // Validate quiz name
    var quizName = document.getElementById('quizName');
    var elem = quizName.parentNode.firstElementChild;
    if (quizName.value === '') {
        if (elem.firstElementChild === null) {
            var span = document.createElement('span');
            span.textContent = 'Specify the quiz name';
            span.classList.add('alert');
            elem.appendChild(span);
            counter++;
            emptyElems.push(quizName);
            quizName.addEventListener('input', function() {
                elem.removeChild(elem.firstElementChild);
            });
        } else if (elem.firstElementChild.tagName === 'SPAN') {
            counter++;
            emptyElems.push(quizName);
        }
    } else if (quizName.value !== '' && elem.firstElementChild) {
        elem.removeChild(elem.firstElementChild);
    }

    // Validate quiz questions
    var quizUnits = document.getElementsByClassName('new-quiz-unit');

    for (var i = 0; i < quizUnits.length; i++) {
        var selector = '#quizQuestion' + (i + 1);
        function validateQuestion(select) {
            var question = document.querySelector(select);
            var elem = question.parentNode.firstElementChild;
            if (question.value === '') {
                if (elem.firstElementChild === null) {
                    var span = document.createElement('span');
                    span.textContent = 'You need to enter the question';
                    span.classList.add('alert');
                    question.parentNode.firstElementChild.appendChild(span);
                    counter++;
                    emptyElems.push(question);
                    question.addEventListener('input', function() {
                        elem.removeChild(elem.firstElementChild);
                    });
                } else if (elem.firstElementChild.tagName === 'SPAN') {
                    counter++;
                    emptyElems.push(question);
                }
            } else if (question.value !== '' && elem.firstElementChild) {
                elem.removeChild(elem.firstElementChild);
            }
        }
        validateQuestion(selector);
    }

    // Validate quiz answers
    var quizAnswers = document.getElementsByClassName('quiz-answer-input');

    for (var i = 1; i <= quizUnits.length; i++) {
        for (var k = 1; k <= 3; k++) {
            var selector = '#answer' + i + '_' + k;
            var answer = document.querySelector(selector);
            function validateAnswer(answer) {
                var elem = answer.parentNode.firstElementChild;
                if (answer.value === '') {
                    if (elem.firstElementChild === null) {
                        var span = document.createElement('span');
                        span.textContent = 'You need enter the answer';
                        span.classList.add('alert');
                        answer.parentNode.firstElementChild.appendChild(span);
                        counter++;
                        emptyElems.push(answer);
                        answer.addEventListener('input', function() {
                            elem.removeChild(elem.firstElementChild);
                        });
                    } else if (elem.firstElementChild.tagName === 'SPAN') {
                        counter++;
                        emptyElems.push(answer);
                    }
                } else if (answer.value !== '' && elem.firstElementChild) {
                    elem.removeChild(elem.firstElementChild);
                }
            }
            validateAnswer(answer);
        }
    }

    // Validate correct answers
    for (var i = 1; i <= quizUnits.length; i++) {
        var selector = 'input[name="correctAnswer' + i + '"]';
        var answersList = document.querySelectorAll(selector);
        var checked = false;
        for (var k = 0; k < answersList.length; k++) {
            if (answersList[k].checked) {
                checked = true;
            }
        }
        var targetElement = answersList[0].parentNode.parentNode.parentNode.firstElementChild.lastElementChild;
        if (checked === false) {
            if (targetElement.lastElementChild.tagName === 'LABEL') {
                var span = document.createElement('span');
                span.textContent = 'You need to choose the correct answer';
                span.classList.add('alert', 'alert-inline');
                targetElement.appendChild(span);
                counter++;
                for (var k = 0; k < answersList.length; k++) {
                    answersList[k].addEventListener('click', function() {
                        answersList[k].parentNode.removeChild(answersList[k].lastElementChild);
                    });
                }
            } else if (targetElement.lastElementChild.tagName === 'SPAN') {
                counter++;
            }
            
        } else if (checked = true && targetElement.lastElementChild.tagName === 'SPAN') {
            targetElement.removeChild(targetElement.lastElementChild);
        }
    }

    if (counter > 0) {
        e.preventDefault();
        emptyElems[0].focus();
    }
});




