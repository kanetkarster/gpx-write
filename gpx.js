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
        .node('time',(new Date()).toISOString()).substr(0, 10)
    ;

    this.write(doc.toString());
    return doc;
  }

GPX.prototype.write =
  function(xmlstring){
    fs.writeFileSync(this.FILE, xmlstring)
  }

//Track
GPX.prototype.addTrk =
  function(TRACK_NAME){
    this.doc.root()
      .node('trk')
        .node('name', config.TRACK_NAME)  //TODO
      .parent()
        .node('trkseg').attr({name: TRACK_NAME || (new Date).toISOString().substr(0, 10)})
    ;

    this.write(this.doc.toString());
    return this.doc;
  }

GPX.prototype.addTrkpt =
  function (latitude, longitude, properties, root){
    var child = root
      .node('trkpt').attr({
        lat: latitude,
        long: longitude
      .parent()
        .node('time', (new Date).toISOString().substr(0, 19))
    });

    for (var key in properties){
      child.node(key, properties[key].toString());
    }

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

GPX.prototype.addWpt =
  function(latitude, longitude, properties, root){
    var child = root
      .node('wpt').attr({
        lat: latitude,
        long: longitude
    });

    for (var key in properties){
      child
        .node(key, properties[key].toString());
    }

  this.write(this.doc.toString());
  return this.doc;
  }

GPX.prototype.toString =
  function(){
    return this.doc.toString();
  }

module.exports = GPX;
