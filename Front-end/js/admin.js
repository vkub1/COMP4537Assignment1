let answerIndex = 0;
let questionIndex = 0;
let questionBoxes = []

class Question {
    constructor (id, description, answers) {
        this.id = id;
        this.description = description;
        this.answers = answers;
    }
    
}

class Answer {
    constructor (id, description, correct) {
        this.description = description;
        this.id = id;
        this.correct = correct;
    }
}

class QuestionBox {
    constructor (question, answerBoxes) {
        this.question = question;
        this.answerDiv = document.createElement("div");
        this.answerBoxes = answerBoxes;
        this.questionBox = document.createElement("div")
        this.questionBox.id = "questionBox" + this.question.id;
        this.addQuestionLabel();
        this.addQuestionText();
        this.questionBox.appendChild(this.label);
        this.questionBox.appendChild(document.createElement("br"))
        this.questionBox.appendChild(this.textarea);
        this.addButton = document.createElement("button");
        this.addButton.innerHTML = "Add Answer"
        this.addButton.onclick = () => {
            if (this.question.answers.length >= 4) {
                window.alert("Can't have more than 4 answers")
            }
            else {
            answerIndex++;
            let answer = new Answer(answerIndex, "", false);
            this.question.answers.push(answer);
            let answerBox = new AnswerBox(answer, this.question);
            this.answerBoxes.push(answerBox)
            let questionBox = document.getElementById("questionBox" + this.question.id);
            this.answerDiv.appendChild(answerBox.answerBox); 
            }
        }
        this.updateButton = document.createElement("button");
        this.updateButton.innerHTML = "Update Question"
        this.updateButton.onclick = () => {
            this.question.description = this.textarea.value;
            for (let i = 0;  i < this.question.answers.length; i++) {
                this.question.answers[i].description = this.answerBoxes[i].textarea.value;
                this.question.answers[i].correct = this.answerBoxes[i].checkbox.checked;
            }
            let xhttp = new XMLHttpRequest();
            xhttp.open("PUT", "https://vladkubl.mywhc.ca/questions");
            xhttp.setRequestHeader('X-PINGOTHER', 'pingpong');
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify({"question":question}))
        };
        for (let i=0; i < this.answerBoxes.length; i++) {
            this.answerDiv.appendChild(answerBoxes[i].answerBox)
        }
        this.questionBox.appendChild(this.answerDiv);
        this.questionBox.appendChild(this.addButton);
        this.questionBox.appendChild(this.updateButton);
        
    }

    addQuestionLabel() {
        this.label = document.createElement("label");
        this.label.id = "questionLabel" + this.question.id;
        this.label.for = "questionDescription" + this.question.id;
        this.label.style.display = "inline";
        this.label.innerHTML = "Question " + this.question.id;
    }

    addQuestionText() {
        this.textarea = document.createElement("textarea");
        this.textarea.cols = 80;
        this.textarea.rows = 3;
        this.textarea.id = "questionDescription" + this.question.id;
        this.textarea.value = this.question.description;
    }

}


class AnswerBox {
    constructor (answer, question){
        this.answer = answer;
        this.question = question;
        this.answerBox = document.createElement("div");
        this.addTextArea();
        this.addCheckbox();
        this.answerBox.appendChild(this.checkbox);
        this.answerBox.appendChild(this.textarea);
        
    }

    addTextArea() {
        this.textarea = document.createElement("textarea");
        this.textarea.id = "answerLabel" + this.answer.id;
        this.textarea.cols=80;
        this.textarea.rows=1;
        this.textarea.value = this.answer.description;
    }

    addCheckbox() {
        this.checkbox = document.createElement("input");
        this.checkbox.type = "radio";
        this.checkbox.name = "question" + this.question.id;
        this.checkbox.id = "answer" + this.answer.id;
        this.checkbox.checked = this.answer.correct;
    }

    
}

function addQuestionForm() {
    questionIndex = questionIndex + 1;
    let question = new Question(questionIndex, "", []);
    let answerBoxes = [];
    for (let i=0; i < 2; i++) {
        answerIndex++
        let answer = new Answer(answerIndex, "", false);
        let answerBox = new AnswerBox(answer, question);
        question.answers.push(answer);
        answerBoxes.push(answerBox);
        question.answers.push(answer);
    }
    let questionBox = new QuestionBox(question, answerBoxes);
    let form = document.getElementById("questions_form");
    form.appendChild(questionBox.questionBox);
    console.log(question)
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://vladkubl.mywhc.ca/questions", true);
    xhttp.setRequestHeader('X-PINGOTHER', 'pingpong');
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({"question": question}));
}





document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('warning').innerHTML="Please wait for the questions to load. If nothing gets displayed after this message disapperars please add questions."
    readAllQuestions()
    ;
})

let div = document.getElementById("questions_form");
div.style.padding="20px";



function readAllQuestions() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://vladkubl.mywhc.ca/questions", true);
    xhttp.send();
    
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let add = document.getElementById("add");
            add.onclick = addQuestionForm;
            document.getElementById('warning').innerHTML="";
            let response = this.response;
            let responses = JSON.parse(response);
            let form = document.getElementById("questions_form");
            let questionIds = []
            let questions = []
            for (let i=0; i <responses.length; i++) {
                if (! questionIds.includes(responses[i]["questionId"])) {
                    questionIndex++;
                    
                    questionIds.push(responses[i]["questionId"])
                    let question = new Question(responses[i]["questionId"], responses[i]["questionsText"], [])
                    
                    questions.push(question)
                }
            }
            for (let i=0; i < questions.length; i++) {
                let answerBoxes = [];
                for (let j=0; j < responses.length; j++) {
                    if (questions[i].id == responses[j]["questionId"] ) {
                        answerIndex++;
                        let answer = new Answer(responses[j]["answerId"], responses[j]["answersText"], 
                        responses[j]["correct"])
                        let answerBox = new AnswerBox(answer, questions[i]);
                        answerBoxes.push(answerBox);
                        questions[i].answers.push(answer)
                    }
                }
                let questionBox = new QuestionBox(questions[i], answerBoxes);
                questionBoxes.push(questionBox);
                form.appendChild(questionBox.questionBox);
            }
        }
    } 
}

