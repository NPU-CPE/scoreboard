/* global require console process Promise module */

'use strict';
var $ = require("jquery");

const DEBUG=false;

const express = require('express'),
  app = express();

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

var fs = require('fs');
var usersJSON = JSON.parse(fs.readFileSync('name.json', 'utf8'));

var current_data = {
    data: []
};

function getTail() {
  let c = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ];
  return `N${getRandomInt(9999)}${c[getRandomInt(c.length - 1)]}`;
}

function getFlight() {
  return getRandomInt(2000);
}

function getHeading() {
  return getRandomInt(359)
    .toString()
    .padStart(3, '0');
}

function getGate() {
  const t = ['A', 'B', 'C'][getRandomInt(2)];
  const g = getRandomInt(30);
  return `${t}${g}${g}`;
}

function getContestant(userID){

  for(var i = 0; i < usersJSON.length; i++)
  {

  if(usersJSON[i].ID == userID)
  {
    return [[usersJSON[i].FirstName+"."+usersJSON[i].SurName.charAt(0)],
           [usersJSON[i].Years],
           YearNum([usersJSON[i].Years]),
           ];
  }
 }
    return "No match";
}

function YearNum(year){
     if (year==2562) return("Y1");
     if (year==2561) return("Y2");
     if (year==2560) return("Y3");
     if (year==2559) return("Y4");
     else return("Y5");
}

function YearName(year){
     if (year==2562) return("First");
     if (year==2561) return("Second");
     if (year==2560) return("Third");
     if (year==2559) return("Fouth");
     else return("Fifth");
}

function getWPM() {
  let sec = getRandomInt(59)
    .toString()
    .padStart(2, '0');
  let mins = getRandomInt(59)
    .toString()
    .padStart(2, '0');
  return `${mins}${sec}`;
}


function myFunction(x) {
  alert("Row index is: " + x.rowIndex);
}

function getTime() {
  let hrs = getRandomInt(23)
    .toString()
    .padStart(2, '0');
  let mins = getRandomInt(59)
    .toString()
    .padStart(2, '0');
  return `${hrs}${mins}`;
}

// ========================================================================
// API

app.use('/api/arrivals', (req, res) => {
  let r = {
    data: []
  };

  var dataJSON = JSON.parse(fs.readFileSync('data.json', 'utf8'));

  for (let i = 0; i < dataJSON.length; i++) {
    // Create the data for a row.
    var contest=getContestant(dataJSON[i].users);
    let data = {
      ranking: i+1,
      exam: dataJSON[i].exam.charAt(7)+dataJSON[i].exam.charAt(8)+dataJSON[i].exam.charAt(9),
      name: contest[0],
      grade: contest[2],
      wpm: dataJSON[i].wpm,
      adj_wpm: dataJSON[i].adj_wpm,
      error: dataJSON[i].error,
      online: dataJSON[i].online,
    };

    if(DEBUG) console.log(data);

    // Let's set status online/offline

    if(dataJSON[i].online=='YES' ) {
	data.status = 'D';
    }else{
	data.status = 'B';
    }

    if(dataJSON[i].adj_wpm==0&&data.status==='A'&& data.exam.toString()==="L28") {
      data.remarks = 'Speed Drill';
    }else if(dataJSON[i].adj_wpm>=10 && data.status==='B' && data.exam.toString()==="L28" ) {
      data.status = 'A';
      data.remarks = 'PASS';
    }else if(dataJSON[i].adj_wpm<10 && data.status==='B' && data.exam.toString()==="L28" ) {
      data.remarks = 'Status 4';
    }else if(dataJSON[i].adj_wpm>=10 && data.exam.toString()==="L28" ) {
      data.remarks = 'PASS';
    }else if(dataJSON[i].adj_wpm<10 && data.status==='A' && data.exam.toString()==="L28" ) {
      data.remarks = 'try again';
    }else if(dataJSON[i].adj_wpm<10 && data.status==='B' && data.exam.toString()==="L28" ) {
      data.remarks = 'Status 1';
    }else if(dataJSON[i].adj_wpm<10 && data.status==='D' && data.exam.toString()==="L28" ) {
      data.remarks = 'Unqualified';
    }else if(dataJSON[i].adj_wpm<10 && data.status==='B' ) {
      data.remarks = 'Status 2';
    }else{
      data.remarks = 'Online';
    }

// Add the row the the response.
    r.data.push(data);
  }

  current_data=r.data;
  res.json(r);
});

// ========================================================================
// STATIC FILES
app.use('/', express.static('public'));

// ========================================================================
// WEB SERVER

const port = process.env.PORT || 8081;
app.listen(port);
console.log('split flap started on port ' + port);
