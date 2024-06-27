var html = require('choo/html')

var TITLE = 'clap.sh'

module.exports = view

function view(state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center">
        <section class="vh-100 flex flex-column items-center justify-between">
          <header class="tc">
            <h1 onclick=${clap} class="clap f-headline">👏</h1>
          </header>

          <input type='text' onkeyup=${keyup} value=${state.text} placeholder='Enter 👏 Your 👏 Text'/>

          <aside>
            <nav>
              <a href='https://github.com/jekrb/clap.sh' target="_blank">here is the source code!</a>
            </nav>
          </aside>
        </section>
      </main>
    </body>
  `

  function keyup (e) {
    var value = e.target.value
    if (e.keyCode === 8) return emit('backspace', value)
    emit('input', value)
  }

  // On clap button click, sploot claps everywhere
  function clap (e) {
    var clap = document.querySelector('header h1')
    const isDesktop = window.innerWidth > 768
    var claps = isDesktop ? 50 : 15
    var i = 0

   // Add 'clicked' class on click
    e.target.classList.add('clicked');
    // Remove 'clicked' class after 200 ms
    setTimeout(function() {
      e.target.classList.remove('clicked');
    }, 200);

    // Keyframes for pop-in animation
    var keyframes = [
      { transform: 'scale(0)', opacity: 0 },
      { transform: 'scale(1.5)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1 }
    ];

    var keyframesOut = [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0)', opacity: 0 }
    ];

    // Animation options
    var options = {
      duration: 300,
      easing: 'ease-out',
      fill: 'both'
    };

    while (i < claps) {
      const clone = clap.cloneNode(true)

      clone.style.position = 'absolute'
      clone.style.top = Math.floor(Math.random() * 100) + 'vh'
      clone.style.left = Math.floor(Math.random() * 100) + 'vw'
      clone.style.fontSize = Math.floor(Math.random() * 100) + 'px'

      document.body.appendChild(clone)

      // Animate the clone with a staggered delay
      const animateIn = clone.animate(keyframes, Object.assign({}, options, {
        delay: i * (30 + Math.random() * 15) * (isDesktop ? 0.5 : 1.0)
      }));

      animateIn.onfinish = function() {
        var animateOut = clone.animate(keyframesOut, Object.assign({}, options, {
            duration: 600,
          })
        );

        animateOut.onfinish = function() {
          document.body.removeChild(clone);
        };
      };

      // Increment the counter
      i++
    }
  }
}
