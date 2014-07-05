var libxml = require('libxmljs'),
    fs = require('fs');

var config = require('./config.js');
var FILE = process.argv[2] || config.FILE;

if(!fs.existsSync(FILE)){
  createGPXFile(FILE);
}
//else addTrackPoint(65.4321, 12.3456, 4321, '7/4/14');
else addTrackSeg();
function createGPXFile(FILE){
  var doc = new libxml.Document();
  doc
  //Header
  .node('gpx').attr
  ({
    version : 1.1,
    creator : 'www.github.com/kanetkarster/gpx-js'
  })
  //Metadata
    .node('metadata')
      .node('owner')
        .node('name', config.NAME)
      .parent()
        .node('email').attr(config.EMAIL)
      .parent()
    .parent()
      .node('time',(new Date()).toISOString())
    .parent()
  .parent()  //Track
    .node('trk')
      .node('name', config.TRACK_NAME)  //TODO
    .parent()
      .node('trkseg', (new Date).toISOString())
    .parent()
  ;
  fs.writeFileSync(FILE, doc.toString());
}

function addTrackPoint(latitude, longitude, elevation, time){
  var doc = libxml.parseXmlString(fs.readFileSync(FILE).toString());
  var trkseg = doc.get('//trkseg');
  trkseg
    .node('trkpt').attr({lat: latitude, long: longitude})
      .node('ele', elevation)
    .parent()
      .node('time', time)
  fs.writeFileSync(FILE, doc.toString());
}

function addTrackSeg(){
  var doc = libxml.parseXmlString(fs.readFileSync(FILE).toString());
  var trk = doc.get('//trk');
  trk
    .node('trkseg', 'my track seg');
  fs.writeFileSync(FILE, doc.toString());
}
