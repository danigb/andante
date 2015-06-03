(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var NOOP = function () {}

function Clock (ctx, options) {
  if (!(this instanceof Clock)) return new Clock(ctx, options)

  options = options || {}

  this.ctx = ctx
  this.lookahead = options.lookahead || 25.0
  this.scheduleAheadTime = options.scheduleAheadTime || 0.1
  this.ticksPerBeat = options.ticksPerBeat || 1
  this.tempo(options.tempo || 120)

  this.scheduler = NOOP
  this.nextTick = 0
  this.nextTickTime = 0

  this.timer = null
  this.running = false
}

Clock.prototype.schedule = function () {
  if (this.running) {
    var nextTime = this.ctx.currentTime + this.scheduleAheadTime
    while (this.nextTickTime < nextTime) {
      this.scheduler(this.nextTick, this.nextTickTime)
      this.nextTick++
      this.nextTickTime += this.tickInterval
    }
    setTimeout(this.schedule.bind(this), this.lookahead)
  }
}

Clock.prototype.tempo = function (newTempo) {
  if (arguments.length === 0) return this._tempo
  this._tempo = newTempo
  this.tickInterval = (60 / newTempo) / this.ticksPerBeat
  return this
}

Clock.prototype.start = function (tempo) {
  if (tempo) this.tempo(tempo)
  this.nextTick = 0
  this.nextTickTime = this.ctx.currentTime
  this.running = true
  this.schedule()
  return this
}

Clock.prototype.stop = function () {
  this.running = false
  if (this.timer) clearTimeout(this.timer)
  return this
}

module.exports = Clock

},{}],2:[function(require,module,exports){
'use strict'

var Clock = require('./clock.js')

/*
 * Andante
 *
 * Build an andante object
 */
function Andante (audioContext) {
  if (!(this instanceof Andante)) return new Andante(audioContext)

  this.ctx = audioContext
  this.clock = new Clock(audioContext)
}

Andante.prototype.play = function (sequence, tempo, player) {
  if (sequence.sequence) sequence = sequence.sequence
  var clock = this.clock
  clock.tempo(tempo)

  var timePerBeat = (60 / this.clock.tempo())
  var timePerTick = (timePerBeat / this.clock.ticksPerBeat) * 4
  var region = { lastIndex: 0 }
  clock.scheduler = function (tick, tickTime) {
    var begin = tick
    var end = (tick + 1)
    region = getRegion(region.lastIndex, sequence, begin, end)
    var time = function (t) { return t * timePerTick + 0.2 }
    region.events.forEach(function (event) {
      player(event, time, event)
    })
    if (region.lastIndex === sequence.length) clock.stop()
  }
  clock.start()
}

function getRegion (index, sequence, begin, end) {
  var region = { lastIndex: 0, events: []}
  for (var i = index, total = sequence.length; i < total; i++) {
    var event = sequence[i]
    if (event.position >= end) {
      region.lastIndex = i
      return region
    } else if (event.position >= begin) {
      region.events.push(event)
    }
  }
  region.lastIndex = i
  return region
}

if (typeof module === 'object' && module.exports) module.exports = Andante
if (typeof window !== 'undefined') window.Andante = Andante

},{"./clock.js":1}]},{},[2]);
