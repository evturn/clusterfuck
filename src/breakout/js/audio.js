import Rx from 'rx'

const audio = new (window.AudioContext || window.webkitAudioContext)()
const beeper = new Rx.Subject()

beeper.sample(100)
  .subscribe(
    key => {
      let oscillator = audio.createOscillator()

      oscillator.connect(audio.destination)
      oscillator.type = 'square'
      oscillator.frequency.value = Math.pow(2, (key - 49) / 12) * 440
      oscillator.start()
      oscillator.stop(audio.currentTime + 0.100)
    }
  )