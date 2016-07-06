var fs = require('fs');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var readFiles = function(dirname, db, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content, db);
      });
    });
  });
};

var onFileContent = function(filename, content, db) {
  var ObjectId = require('mongodb').ObjectID;

  var document = {
    "filename": filename,
    "content": content
  };

  db.collection('document').insertOne(document);
  console.log("Document saved: " + filename);
};

var onError = function(err) {
  console.log("Error on read file: " + err);
}

var url = 'mongodb://localhost:27017/document';
mongo.connect(url, function(err, db) {
  readFiles("/tmp/evaluation-news-txt/", db, onFileContent, onError);
});
