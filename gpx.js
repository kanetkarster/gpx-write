var libxml = require('libxmljs'),
  fs = require('fs'),
  config = require('./config.js'),
  FILE = process.argv[2] || config.FILE;

if(!fs.existsSync(FILE)){
  createGPXFile(FILE);
}
else console.log('good');

//var xml = libxml.parseXmlString(fs.readFileSync(FILE).toString());

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
  //Track
      .node('trk')
        .node('name', config.TRACK_NAME)  //TODO
      .parent()
        .node('trkseg')
  ;
  fs.writeFileSync(FILE, doc.toString());
}
