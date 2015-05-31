'use strict';

var Clock = require('./clock.js');

/*
 * Andante
 *
 * Build an andante object
 */
function Andante(audioContext) {
  if(!(this instanceof Andante)) return new Andante(audioContext);

  this.ctx = audioContext;
  this.clock = new Clock(audioContext);
}

Andante.prototype.play = function (sequence, tempo, player) {
  if(sequence.sequence) sequence = sequence.sequence;
  var clock = this.clock;
  clock.tempo(tempo);

  var timePerBeat = (60 / this.clock.tempo());
  var timePerTick = (timePerBeat / this.clock.ticksPerBeat) * 4;
  var region = { lastIndex: 0 };
  clock.scheduler = function(tick, tickTime) {
    console.log("TICK", tick, tickTime);
    var begin = tick;
    var end = (tick + 1);
    region = getRegion(region.lastIndex, sequence, begin, end);
    var time = function(t) { return t * timePerTick + 0.2; }
    console.log("SCHEDULE", tick, tickTime, begin, end, region, sequence.length);
    region.events.forEach(function(event) {
      player(event, time);
    });
    if(region.lastIndex === sequence.length) clock.stop();
  }
  clock.start();
};

function getRegion(index, sequence, begin, end) {
  var region = { lastIndex: 0, events: []};
  for(var i = index, total = sequence.length; i < total; i++) {
    var event = sequence[i];
    if(event.position >= end) {
      region.lastIndex = i;
      return region;
    } else if(event.position >= begin) {
      region.events.push(event);
    }
  }
  region.lastIndex = i;
  return region;
}

if (typeof define === "function" && define.amd) define(function() { return Andante; });
if (typeof module === "object" && module.exports) module.exports = Andante;
if (typeof window !== "undefined") window.Andante = Andante;
