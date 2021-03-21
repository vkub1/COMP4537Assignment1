const http = require('http');
const url = require('url');
const express = require('express');
const app = express();
app.use(function(res, req, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});
app.use(express.json())
const mysql = require('mysql');
const con = mysql.createConnection({
    host: "localhost",
    user: "vladkubl_webappuser1",
    password: "OCzjfu*mV0yI",
    database: "vladkubl_4537quiz",
    multipleStatements: true
});

app.get('/questions', (req, res)=>{
    con.query(
        'SELECT questions.id as questionId, questions.descrip as questionsText,' + 
        'answers.id as answerId, answers.descrip as answersText, answers.correct ' +
        'FROM questions LEFT JOIN answers_to_questions ' +
        'ON questions.id = answers_to_questions.question_id ' +
        'LEFT JOIN answers ON answers_to_questions.answer_id = answers.id'
        , (err, rows, fields)=>{
        if (!err) {
            res.writeHead(200, {
                "Content-type": "text/html",
                "Access-Control-Allow-Origin": "*"
            });
            res.write(JSON.stringify(rows));
        }
        else {
            console.log(err);
        }
    })
});

app.post('/questions', (req, res) => {
    let query = "INSERT into questions(id, descrip) VALUES (" + req.body.question.id + ",'" 
    + req.body.question.description + "');";
    console.log(req.body.question.answers);
    for (let i=0; i < 2; i++) {
        query = query + 'INSERT INTO answers(id, descrip, correct) VALUES (' + req.body.question.answers[i].id 
        + ",'" +  req.body.question.answers[i].description + "'," + req.body.question.answers[i].correct + ");"
        query = query + 'INSERT INTO answers_to_questions(question_id, answer_id) VALUES (' 
        + req.body.question.id + ',' + req.body.question.answers[i].id + ');'
    }
    
    con.query(
        query,
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    )
    res.end();
    
})

app.put('/questions', (request, response) => {
    let count = 0;
    con.query(
        'SELECT id FROM `questions` WHERE id=' + request.body.question.id + ";",
        (err, rows, fields)=>{
            if (!err) {
                count = rows;
                if (count[0]["COUNT(id)"] == 0) {
                    con.query(
                            "INSERT INTO questions(id, descrip) VALUES (" + request.body.question.id + ",'" + request.body.question.description + "')",
                            (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                    for (let i = count[0]["COUNT(id)"]; i < request.body.question.answers.length; i++) {
                        let query ='INSERT INTO answers(id, descrip, correct) VALUES (' 
                        + request.body.question.answers[i].id 
                        + ",'" +  request.body.question.answers[i].description 
                        + "'," + request.body.question.answers[i].correct + ");";
                        con.query(
                            query,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        );
                        query = 'INSERT INTO answers_to_questions(question_id, answer_id) VALUES (' 
                        + request.body.question.id + ',' + request.body.question.answers[i].id + ');'
                        con.query(
                            query,
                            (err) => {
                                if (err) {
                                    console.log(err);
                                }
                            }
                        )
                    }
            }
            else {
                console.log(err);
            }
            
            }
        }
    )
    let query = "UPDATE questions " +
        "SET descrip='" + request.body.question.description + "'" 
        + " WHERE id=" + request.body.question.id + ";";
    con.query(
        query,
        (err) => {
            if (err) {
                console.log(err);
            }
        }
    )
    for (let i=0; i < request.body.question.answers.length; i++) {
        let query ="UPDATE answers SET descrip='" + request.body.question.answers[i].description + "'," 
        + "correct=" + request.body.question.answers[i].correct + " WHERE id=" 
        + request.body.question.answers[i].id + ";";
        con.query(
            query,
            (err) => {
                if (err) {
                    console.log(err);
                }
            }
        )
    }
})

app.listen();
