# andante

Yet another music scheduler. Given an array of events with value, position and
duration (both in seconds), schedule the events to play:

```js
var ctx = new AudioContext();
var andante = require('andante')(ctx);

var instrument = ...;

var events = "c d e f g".split(' ').map(function(note, index) {
  return { value: note, position: index * 0.5, duration: 0.5 };
});
andante.schedule(events, function(event, time) {
  // time function maps from events time to WebAudio context time
  instrument.play(event.value, time(event.position), time(event.duration))
});
```

This is the scheduler of [ScoreJS](http://github.com/danigb/scorejs)
and works easy with [soundfont-player](http://github.com/danigb/soundfont-player)

```js
var ctx = new AudioContext();
var Score = require('scorejs');
var andante = require('andante')(ctx);
var soundfont = require('soundfont-player')(ctx);

var melody = Score('a b c d | e f g a4');
var reverse = melody.reverse().transpose('M3');
var score = Score.merge(melody, reverse).repeat(5).toTempo(90);

var piano = soundfont.instruent('acoustic_grand_piano');

andante.schedule(score, function(event, position, duration)) {
  piano.play(event.value, position, duration);
}
```

## Running the example

Clone this repo, start a server:
```bash
npm i -g http-server
http-server
```

And visit `http://localhost:8080/example`

## License

MIT License
