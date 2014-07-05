var libxml = require('libxmljs'),
    fs = require('fs');
var config = require('./config.js');

function GPX (FILE_NAME){
  this.FILE = FILE_NAME;
  this.doc = fs.existsSync(this.FILE)
              ? libxml.parseXmlString(fs.readFileSync(this.FILE).toString())
              : this.make();
}

GPX.prototype.make =
  function (){
    console.log('making new document')
    var doc = new libxml.Document();
    doc
    //Header
    .node('gpx').attr
    ({
      version : 1.1,
      creator : 'www.github.com/kanetkarster/gpx-write'
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
    .parent()
    //Track
      .node('trk')
        .node('name', config.TRACK_NAME)  //TODO
      .parent()
        .node('trkseg').attr({name: (new Date).toISOString()})
      .parent()
    ;
    this.write(doc.toString());
    return doc;
  }

GPX.prototype.write =
  function(xmlstring){
    fs.writeFileSync(this.FILE, xmlstring)
  }

GPX.prototype.addTrkpt =
  function (latitude, longitude, elevation, time){
    var trksegs = this.doc.get('//trk').childNodes();
    trksegs[trksegs.length - 1]
    //Trkseg
      .node('trkpt').attr({lat: latitude, long: longitude})
        .node('ele', elevation.toString())
      .parent()
        .node('time', time.toString())
    this.write(this.doc.toString());
    return this.doc;
  }

GPX.prototype.addTrkseg =
  function(){
    var trk = this.doc.get('//trk');
    trk
      .node('trkseg').attr({name: (new Date).toISOString()})
    this.write(doc.toString());
    return this.doc;
  }

GPX.prototype.toString =
  function(){
    return this.doc.toString();
  }

module.exports = GPX;
