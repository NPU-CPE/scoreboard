/* global require console process Promise module */

'use strict';
var $ = require("jquery");

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
 const users= [
  'b613110310018',
  'b613110310042',
  'b613110310083',
  'b623110310017',
  'b623110310025',
  'b623110310033',
  'b623110310041',
  'b623110310058',
  'b623110310066',
  'b623110310074',
  'b623110310082',
  'b623110310090',
  'b623110310108',
  'b623110310124',
  'b623110310132',
  'b623110310140',
  'b623110310157',
  'b623110310165',
  'b623110310173',
  'b623110310181',
  'b623110310199',
  'b623110310215',
  'b623110310223',
  'b624110310023',
  'b624110310031',
  'b624110310049',
  'b603110310019',
  'b603110310027',
  'b603110310035',
  'b603110310043',
  'b603110310050',
  'b603110310076',
  'b603110310084',
  'b603110310092',
  'b603110310100',
  'b603110310118',
  'b603110310126',
  'b603110310134',
  'b603110310142',
  'b603110310159',
  'b603110310167',
  'b603110310175',
  'b593030710011',
  'b593030710028',
  'b593030710036',
  'b593030710044',
  'b593030710051',
  'b593030710085',
  'b593030710127',
  'sk',
  'songrit'
 ];

  //var userID=users[getRandomInt(users.length)];

  for(var i = 0; i < users.length; i++)
  {

  if(usersJSON[i].ID == userID)
  {
    return [[usersJSON[i].FirstName+"."+usersJSON[i].SurName.charAt(0)],
           [usersJSON[i].Years],
           YearNum([usersJSON[i].Years]),
           ];
  }
 }
//    console.log(i +":"+usersJSON[i].ID+":"+userID);
    return "No match";
}

function YearNum(year){
     if (year==2562) return("Y1");
     if (year==2561) return("Y2");
     if (year==2560) return("Y3");
     if (year==2559) return("Y4");
     else return("YX");
}

function YearName(year){
    switch(year){
     case 2562: return("Freshie");break;
     case 2561: return("Sophomore");break;
     case 2560: return("Senior");break;
     case 2559: return("Super Senior");break;
     default: return("Super Senior");
    }
 return(-1);
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
      ranking: dataJSON.length-i,
      exam: dataJSON[i].exam.charAt(7)+dataJSON[i].exam.charAt(8)+dataJSON[i].exam.charAt(9),
      name: contest[0],
      grade: contest[2],
      wpm: dataJSON[i].adj_wpm
    };

    // Let's add an occasional delayed exam.
    data.status = getRandomInt(10) > 7 ? 'B' : 'A';
    if (data.status === 'B') {
      data.remarks = `Delayed ${getRandomInt(50)}M`;
    }

    // Add the row the the response.
   console.log(data);
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
const port = process.env.PORT || 8080;
app.listen(port);
console.log('split flap started on port ' + port);
