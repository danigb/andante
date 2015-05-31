# andante

__This is work in progress. Do not use ... yet__

Yet another music scheduler. Given an array of events with value, position and
duration (both in seconds), schedule the events to play:

```js
var ctx = new AudioContext();
var andante = require('andante')(ctx);

var events = "c d e f g".split(' ').map(function(note, index) {
  return { value: note, position: index * 0.5, duration: 0.5 };
});
andante.schedule(events, function(event, position, duration) {
  // play instrument
});
```

This scheduler works great with [ScoreJS](http://github.com/danigb/scorejs)
and any audio instrument (like [soundfont-player](http://github.com/danigb/soundfont-player))

```js
var ctx = new AudioContext();
var Score = require('scorejs');
var andante = require('andante')(ctx);
var soundfont = require('soundfont-player')(ctx);

var melody = Score('a b c d | e f g a4');
var reverse = melody.reverse().transpose('M3');
var score = Score.merge(melody, reverse).repeat(5).toTempo(90);

var piano = soundfont.instruent('grand_piano');

andante.schedule(score, function(event, position, duration)) {
  piano.play(event.value, position, duration);
}
```

## License

MIT License
