const fs = require('fs')
const md5 = require('md5')
const path = require('path')
const tape = require('tape')
const http = require('http')
const concat = require('concat-stream')
const { fork } = require('child_process')

if (process.env.RUN_ALL) {
  tape('./01-set-timeout.js', function (t) {
    testFile('./01-set-timeout.js', function (err, out) {
      t.deepEqual(out, [
        '1 mississippi',
        '2 mississippi',
        '3 mississippi',
        '4 mississippi',
        '5 mississippi',
        'hello from the past!'
      ])
      t.end()
    })
  })

  tape('./02-set-timeout-sync.js', function (t) {
    testFile('./02-set-timeout-sync.js', function (err, out) {
      t.deepEqual(out, [ 'hello from the past!' ])
      t.end()
    })
  })
}

tape('./03-read-file-callback.js', function (t) {
  testFile('./03-read-file-callback.js', function (err, out) {
    const [ file, count ] = out[0].split(': ')
    t.equal(file, '03-read-file-callback.js')
    t.ok(Number(count) > 100)
    t.end()
  })
})

tape('./04-read-dir-callback.js', function (t) {
  testFile('./04-read-dir-callback.js', function (err, out) {
    t.ok(out.length >= 24)
    t.ok(out.some(l => l === "  '03-read-file-callback.js',"))
    t.end()
  })
})

tape('./05-read-dir-callbacks-broken.js', function (t) {
  testFile('./05-read-dir-callbacks-broken.js', function (err, out) {
    t.equal(out[0], 'done!')
    t.ok(out.length >= 24)

    t.ok(out.some(function (l) {
      const [ file, count ] = l.split(': ')
      return (file === '03-read-file-callback.js') && Number(count) > 100
    }))

    t.end()
  })
})

tape('./06a-read-dir-callbacks.js', function (t) {
  testFile('./06a-read-dir-callbacks.js', function (err, out) {
    t.ok(out.length >= 24)

    t.ok(out.some(function (l) {
      const [ file, count ] = l.split(': ')
      return (file === '03-read-file-callback.js') && Number(count) > 100
    }))

    t.end()
  })
})

// This file will throw an error if there are subdirectories (e.g. this test directory)
// tape.only('./06b-read-dir-callbacks-direct.js', function (t) {
//   testFile('./06b-read-dir-callbacks-direct.js', function (err, out) {
//     console.log(out)
//     t.end()
//   })
// })

tape('./06c-read-dir-callbacks-cli.js', function (t) {
  testFile('./06c-read-dir-callbacks-cli.js', function (err, out) {
    t.equal(out[out.length - 1], 'done!')
    t.ok(out.length >= 24)

    t.ok(out.some(function (l) {
      const [ file, count ] = l.split(': ')
      return (file === '03-read-file-callback.js') && Number(count) > 100
    }))

    t.end()
  })
})

tape('./07-read-file-promises.js', function (t) {
  testFile('./07-read-file-promises.js', function (err, out) {
    const [ file, count ] = out[0].split(': ')
    t.equal(file, '07-read-file-promises.js')
    t.ok(Number(count) > 100)
    t.end()
  })
})

tape('./08-read-dir-promises-broken.js', function (t) {
  testFile('./08-read-dir-promises-broken.js', function (err, out) {
    t.equal(out[0], 'done!')
    t.ok(out.length >= 24)

    t.ok(out.some(function (l) {
      const [ file, count ] = l.split(': ')
      return (file === '03-read-file-callback.js') && Number(count) > 100
    }))

    t.end()
  })
})

// This file will throw an error if there are subdirectories (e.g. this test directory)
// tape.only('./09a-read-dir-promises.js', function (t) {
//   testFile('./09a-read-dir-promises.js', function (err, out) {
//     console.log(out)
//     t.end()
//   })
// })

tape('./09b-read-dir-promises-fn.js', function (t) {
  testFile('./09b-read-dir-promises-fn.js', function (err, out) {
    t.equal(out[out.length - 1], 'done!')
    t.ok(out.length >= 24)

    t.ok(out.some(function (l) {
      const [ file, count ] = l.split(': ')
      return (file === '03-read-file-callback.js') && Number(count) > 100
    }))

    t.end()
  })
})

tape('./10-read-file-await.js', function (t) {
  testFile('./10-read-file-await.js', function (err, out) {
    const [ file, count ] = out[0].split(': ')
    t.equal(file, '10-read-file-await.js')
    t.ok(Number(count) > 100)
    t.end()
  })
})

tape('./11-read-dir-await-broken.js', function (t) {
  testFile('./11-read-dir-await-broken.js', function (err, out) {
    t.ok(out.length >= 24)

    t.ok(out.some(function (l) {
      const [ file, count ] = l.split(': ')
      return (file === 'undefined') && (count === 'undefined')
    }))

    t.end()
  })
})

// This file will throw an error if there are subdirectories (e.g. this test directory)
// tape.only('./12a-read-dir-await.js', function (t) {
//   testFile('./12a-read-dir-await.js', function (err, out) {
//     console.log(out)
//     t.end()
//   })
// })

tape('./12b-read-dir-await-fn.js', function (t) {
  testFile('./12b-read-dir-await-fn.js', function (err, out) {
    t.equal(out[out.length - 1], 'done!')
    t.ok(out.length >= 24)

    t.ok(out.some(function (l) {
      const [ file, count ] = l.split(': ')
      return (file === '03-read-file-callback.js') && Number(count) > 100
    }))

    t.end()
  })
})

tape('./13-ee-readline.js', function (t) {
  const child = fork('./13-ee-readline.js', {silent: true })
  child.stdout.on('data', function (msg) {
    t.equal(msg.toString(), 'UPPERCASE ME\n')
    child.kill()
    t.end()
  })
  child.stdin.write('uppercase me\n')
})

tape('./15-ee-readline-chat-send.js', function (t) {
  const child = fork('./15-ee-readline-chat-send.js', {silent: true })

  const server = http.createServer(function (req, res) {
    t.equal(req.url, '/chat?message=chat%20message')
    child.kill()
    server.close()
    t.end()
  }).listen(1337)

  child.stdin.write('chat message\n')
})

tape('./16-ee-readline-chat-receive.js', function (t) {
  const child = fork('./16-ee-readline-chat-receive.js', {silent: true })

  const server = http.createServer(function (req, res) {
    if (req.url.match(/^\/sse/)) res.end('data: msg\n\n')
    if (req.url.match(/^\/chat/)) {
      t.equal(req.url, '/chat?message=chat%20message')
      child.kill()
      server.close()
      t.end()
    }
  }).listen(1337)

  child.stdout.once('data', (msg) => t.equal(msg.toString(), 'data: msg\n'))
  child.stdin.write('chat message\n')
})

tape('./17-ee-create-emitter.js', function (t) {
  const child = fork('./17-ee-create-emitter.js', {silent: true })

  const server = http.createServer(function (req, res) {
    if (req.url.match(/^\/sse/)) res.end('data: msg\n\n')
    if (req.url.match(/^\/chat/)) {
      t.equal(req.url, '/chat?message=chat%20message')
      child.kill()
      server.close()
      t.end()
    }
  }).listen(1337)

  child.stdout.once('data', (msg) => t.equal(msg.toString(), 'msg\n'))
  child.stdin.write('chat message\n')
})

tape('./18-ee-create-emitter-custom-events.js', function (t) {
  const child = fork('./18-ee-create-emitter-custom-events.js', {silent: true })

  const server = http.createServer(function (req, res) {
    if (req.url.match(/^\/sse/)) res.end('data: msg?\n\n')
    if (req.url.match(/^\/chat/)) {
      t.equal(req.url, '/chat?message=chat%20message')
      child.kill()
      server.close()
      t.end()
    }
  }).listen(1337)


  child.stdout.once('data', (msg) => t.equal(msg.toString(), 'Someone asked, "msg?"\n'))
  child.stdin.write('chat message\n')
})

if (process.env.RUN_ALL) {
  tape('./20-streams-download-book-cover-batch.js', function (t) {
    testFile('./20-streams-download-book-cover-batch.js', function (err, out) {
      t.equal(out[0], 'file saved!')
      t.equal(md5(fs.readFileSync('book.png')), '4406717ee27c435a5714c02b3514a77b')
      fs.unlinkSync('book.png')
      t.end()
    })
  })

  tape('./20-streams-download-book-cover-write-stream.js', function (t) {
    testFile('./20-streams-download-book-cover-write-stream.js', function (err, out) {
      t.equal(out[0], 'file saved!')
      t.equal(md5(fs.readFileSync('book.png')), '4406717ee27c435a5714c02b3514a77b')
      fs.unlinkSync('book.png')
      t.end()
    })
  })

  tape('./21-streams-download-book-cover.js', function (t) {
    testFile('./21-streams-download-book-cover.js', function (err, out) {
      t.equal(out[0], 'file saved!')
      t.equal(md5(fs.readFileSync('book.png')), '4406717ee27c435a5714c02b3514a77b')
      fs.unlinkSync('book.png')
      t.end()
    })
  })
}

tape('./23-streams-shout.js', function (t) {
  testFile('./23-streams-shout.js', function (err, out) {
    const loud = fs.readFileSync('loud-code.txt').toString()
    t.ok(loud.length > 100)
    t.equal(loud, loud.toUpperCase())
    fs.unlinkSync('loud-code.txt')
    t.end()
  })
})

tape('./24-transform-csv-error.js', function (t) {
  testFile('./24-transform-csv-error.js', function (err, out) {
    t.ok(err.some(l => l.match('ERR_INVALID_ARG_TYPE')))
    t.end()
  })
})

tape('./24-transform-csv.js', function (t) {
  testFile('./24-transform-csv.js', function (err, out) {
    t.equal(out.length, 100)
    t.equal(out[20], '{"firstName":"Paul","lastName":"DuBuque","age":40}')
    t.end()
  })
})

function testFile (filename, env, cb) {
  if (!cb) (cb = env) && (env = {})
  const child = fork(filename, { env, silent: true })
  let stderr, stdout

  child.on('close', function () {
    cb(stderr, stdout)
  })

  child.stderr.pipe(
    concat(function (out) {
      stderr = out
        .toString()
        .split('\n')
        .filter(l => l)
    })
  )

  child.stdout.pipe(
    concat(function (out) {
      stdout = out
        .toString()
        .split('\n')
        .filter(l => l)
    })
  )
}
