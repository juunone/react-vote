var fs = require('fs');
var path = require('path');
var Q = require('q');
// const cors = require('cors');

var express = require('express');
var bodyParser = require('body-parser');

var port = 9999;

var voteFile = path.join(__dirname, 'votes.json');

var app = express();

app.use('/', express.static(path.join(__dirname, 'src')));
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var readData = function () {
  var defer = Q.defer();

  fs.readFile(voteFile, function (error, data) {
    if (error) {
      return defer.reject(error);
    }
    
    return defer.resolve(JSON.parse(data));
  });

  return defer.promise;
};

var writeData = function (data) {
  var defer = Q.defer();

  fs.writeFile(voteFile, JSON.stringify(data, null, 2), function (error) {
    if (error) {
      return defer.reject(error);
    }

    return defer.resolve();
  });

  return defer.promise;
};

var getVotes = function (id, method = 'get', newData) {
  if(id && method !== "put") {
    return readData().then(function (data) {
      return getDataById(data, id);
    });
  } else if(method === 'get') {
    return readData().then(function (data) {
      return data;
    });
  } else {
    return readData().then(function (data) {
      return pushDataById(data, id, newData);
    });
  }
};

var getDeleteVotes = function (id) {
  return readData().then(function (data) {
    return deleteVote(id,data);
  });
};

var deleteVote = function(id,data) {
  var getDataIdx = data.findIndex(v => {
    return String(v.id) === id;
  });
  data.splice(getDataIdx, 1);
  return data;
}

var getDataById = function (data, id) {
  var getDataIdx = data.findIndex(v => {
    if(String(v.id) === id) return v;
  });
  return data[getDataIdx];
};

var pushDataById = function (data, id, newData) {
  var getDataIdx = data.findIndex(v => {
    if(String(v.id) === id) return v;
  });
  data[getDataIdx].title = newData.title;
  data[getDataIdx].author = newData.author;
  data[getDataIdx].startedAt = Number(newData.startedAt);
  data[getDataIdx].endedAt = Number(newData.endedAt);
  data[getDataIdx].id = Number(id);
  return data;
};

app.use(function (req, res, next) {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// list
app.get('/api/votes', function (req, res) {
  getVotes().then(function (data) {
    res.json(data);
  }).fail(function (error) {
    console.error(error);
    res.sendStatus(500);
  });
});

// write
app.post('/api/votes', function (req, res) {
  readData().then(function (data) {
    var newComment = {
      id: Date.now(),
      author: req.body.author,
      title: req.body.title,
      startedAt: Number(req.body.startedAt),
      endedAt: Number(req.body.endedAt)
    };

    data.unshift(newComment);

    return writeData(data).then(function () {
      res.json(data);
    }).fail(function (error) {
      console.error(error);
      res.sendStatus(500);
    });
  });
});

// delete
app.delete('/api/votes/:id', function (req, res) {
  var id = req.params.id;
  
  getDeleteVotes(id).then(function(newData){
    return writeData(newData).then(function () {
      res.json(newData);
    }).fail(function (error) {
      console.error(error);
      res.sendStatus(500);
    });
  }).fail(function (error) {
    console.error(error);
    res.sendStatus(500);
  });
});

// get by id
app.get('/api/votes/:id', function (req, res) {
  var id = req.params.id;

  getVotes(id).then(function (data) {
    res.json(data);
  }).fail(function (error) {
    console.error(error);
    res.sendStatus(500);
  });
});

// put
app.put('/api/votes/:id', function (req, res) {
  var id = req.params.id;
  var newData = req.body;

  getVotes(id,'put', newData).then(function (r) {
    return writeData(r).then(function () {
      res.json(r);
    }).fail(function (error) {
      console.error(error);
      res.sendStatus(500);
    });
  }).fail(function (error) {
    console.error(error);
    res.sendStatus(500);
  });
});



app.listen(port, function () {
  console.log('Server started: http://localhost:' + port + '/');
});