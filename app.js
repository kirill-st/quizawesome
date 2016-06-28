var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// MongoDB connection
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/quizAwesome';
var objectId = require('mongodb').ObjectId;
var assert = require('assert');

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/assets', express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));



app.post('/new-quiz-created', function(req, res) {
     
    MongoClient.connect(url, function(err, db) {
        
        insertStuff(db, function() {
            db.close();
        });
        
        function insertStuff(db, callback) {

            // The main array which contains question objects, should be outside the for loop
            var questionArray = [];
            
            // Filling out data for each question
            for (var i = 1; i <= req.body.questionNum; i++) {
                // The array with answers, should be inside the loop
                var answerArray = [];
                // Filling out the answers array
                for (var k = 1; k <= req.body.answerNum; k++) {
                    answerArray.push({
                        "answer": req.body['quizAnswer' + i + '_' + k]
                    });
                }
                // Pushing a question, array with answers, and correct answer
                questionArray.push({
                    "questionContent": req.body['quizQuestion' + i],
                    "answers": answerArray,
                    "correctAnswer": req.body['correctAnswer' + i]
                });
            }

            // Insert quiz data into the database
            db.collection('quizzes').insertOne({
                    "quizName": req.body.quizName,
                    "questions": questionArray
                }, function (err, data) {
                    callback();
                });
        }
        
        res.render('new-quiz-created');

    });
});




app.get('/', function(req, res) {
    
    MongoClient.connect(url, function(err, db) {
        
        assert.equal(null, err);
        // console.log('Connected successfully!');
        
        showQuizzes(db);
        
    });
    
    var showQuizzes = function (db, callback) {
        
        var collection = db.collection('quizzes');
        
        collection.find({})
        .toArray(function(err, quizzes) {
            var quizNames = [];
            quizzes.forEach(function(quiz) {
                quizNames.push(quiz.quizName);
            });
            res.render('index', {quizzes: quizzes});
            db.close();
        });
    }
    
});


app.post('/remove', function(req, res) {
    
    var id = objectId(req.body.id);
    
    MongoClient.connect(url, function(err, db) {
        
        assert.equal(err, null);
        
        var collection = db.collection('quizzes');
        
        collection.deleteOne({"_id": id}, function(err, result) {
            assert.equal(err, null);
            // console.log(result);
            db.close();
        });
        
    });
    
    res.redirect('/');
    
});


app.post('/quiz', function(req, res) {
    var id = objectId(req.body.viewid);
    
    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        db.collection('quizzes').findOne({"_id": id}, function (err, quiz) {
            res.render('quiz', {"data": quiz});
            console.log(quiz);
            db.close();
        });
    });
    
});


app.get('/quiz/:id', function (req, res) {
    var id = objectId(req.params.id);

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        db.collection('quizzes').findOne({"_id": id}, function (err, quiz) {
            res.render('quiz', {"data": quiz});
            console.log(quiz);
            db.close();
        });
    });
});


/**
 *
 * QUIZ SCORE
 *
 */

app.post('/quiz/score', function (req, res) {
    var id = objectId(req.params.id);

    MongoClient.connect(url, function(err, db) {
        assert.equal(err, null);
        db.collection('quizzes').findOne({"_id": id}, function (err, quiz) {
            res.render('quiz', {"data": quiz});
            console.log(quiz);
            db.close();
        });
    });
});





app.post('/new', function(req, res) {
    var questionNum = req.body.questionNum,
        answerNum = req.body.answerNum;
    res.render('new', {
        "questionNum": questionNum,
        "answerNum": answerNum
    });
});


app.get('/new-settings', function(req, res) {
    res.render('new-settings');
});


app.listen(port, function() {
    console.log('Listening on port ' + port);
});