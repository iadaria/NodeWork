const html = window.nanohtml

const offset = 0
const limit = 10
listPrints({ offset, limit }).then(prints => render({ prints, offset, limit }))

function listPrints ({ offset = 0, limit = 25 }) {
  const endpoint = 'http://localhost:1337/products'
  const qs = `?offset=${offset}&limit=${limit}`
  return fetchJSON(endpoint + qs)
}

function fetchJSON (url) {
  return window.fetch(url).then(res => res.json())
}

function render ({ prints, offset, limit }) {
  document.body.innerHTML = ''
  document.body.appendChild(html`
    <article>
      <h2 class="f3 fw4 pa3 mv0">Prints</h2>
      <div>${renderButtons({ offset, limit })}</div>
      <div class="cf pa2">
        ${prints.map(renderPrint)}
      </div>
    </article>
  `)
}

function renderButtons ({ offset, limit }) {
  return html`
    <div class="flex items-center justify-center pa4">
      ${renderPrev({ offset, limit })}
      ${renderNext({ offset, limit })}
    </div>
  `

  function renderPrev ({ offset, limit }) {
    if (!offset) return

    offset = offset - limit
    return html`
      <a
        href="#"
        class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box mr4"
        onclick=${onclick}
        >

        <span class="pl1">Previous</span>
      </a>
    `

    function onclick () {
      listPrints({ offset, limit }).then(prints =>
        render({ prints, offset, limit })
      )
    }
  }

  function renderNext ({ offset, limit }) {
    offset = offset + limit
    return html`
      <a
        href="#"
        class="f5 no-underline black bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box"
        onclick=${onclick}
      >
        <span class="pr1">Next</span>
      </a>
    `

    function onclick () {
      listPrints({ offset, limit }).then(prints =>
        render({ prints, offset, limit })
      )
    }
  }
}

function renderPrint (print) {
  console.log(print)
  return html`
    <div class="fl w-50 w-25-m w-20-l pa2">
      <a href="${print.link}" target="_blank" class="db link dim tc">
        <div
          style="background: url(${print.imgThumb})"
          class="w-100 db outline black-10 h4 cover"
          alt="${print.description}"
        >
        </div>
        <dl class="mt2 f6 lh-copy">
          <dt class="clip">Title</dt>
          <dd class="ml0 black truncate w-100">
            ${print.tags.slice(0, 3).join(', ')}
          </dd>
          <dt class="clip">Artist</dt>
          <dd class="ml0 gray truncate w-100">${print.userName}</dd>
        </dl>
      </a>
    </div>
  `
}
