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
        this.questionBox.appendChild(this.textDiv);
        for (let i=0; i < this.answerBoxes.length; i++) {
            this.answerDiv.appendChild(answerBoxes[i].answerBox)
        }
        this.questionBox.appendChild(this.answerDiv);
        
    }

    addQuestionLabel() {
        this.label = document.createElement("label");
        this.label.id = "questionLabel" + this.question.id;
        this.label.for = "questionDescription" + this.question.id;
        this.label.style.display = "inline";
        this.label.innerHTML = "Question " + this.question.id;
    }

    addQuestionText() {
        this.textDiv = document.createElement("div");
        this.textDiv.id = "questionDescription" + this.question.id;
        this.textDiv.innerHTML = this.question.description;
        this.textDiv.style.padding="50px";
        this.textDiv.style.border="2px solid black";

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
        this.answerBox.appendChild(this.label);
        
    }

    addTextArea() {
        this.label = document.createElement("label");
        this.label.id = "answerLabel" + this.answer.id;
        this.label.innerHTML = this.answer.description;
        this.label.for = "answer" + this.answer.id;
    }

    addCheckbox() {
        this.checkbox = document.createElement("input");
        this.checkbox.type = "radio";
        this.checkbox.name = "question" + this.question.id;
        this.checkbox.id = "answer" + this.answer.id;
    }

    
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('warning').innerHTML="Please wait for the questions to load. If nothing gets displayed after this message disapperars please add questions."
    readAllQuestions()
    ;
})



function readAllQuestions() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://vladkubl.mywhc.ca/questions", true);
    xhttp.send();
    
    xhttp.onreadystatechange = function() {
        
        if (this.readyState==4 && this.status==200) {
            document.getElementById('warning').innerHTML="";
            let div = document.getElementById("questions_form");
            div.style.padding="20px";
            
            let submitBtn = document.getElementById("submit");
            submitBtn.onclick = () => {
                let correctCounter = 0;
                for (let i = 0; i < questionBoxes.length; i++) {
                    for (let j = 0; j < questionBoxes[i].answerBoxes.length; j++) {
                        if (questionBoxes[i].answerBoxes[j].checkbox.checked && questionBoxes[i].question.answers[j].correct){
                            correctCounter++;
                        }
                    }
                }
                let result = document.getElementById("results");
                window.alert("The result is " + correctCounter + " out of " + questionBoxes.length)
            }
            let response = this.response;
            let responses = JSON.parse(response);
            console.log(responses)
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


