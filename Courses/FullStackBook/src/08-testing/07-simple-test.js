const assert = require("assert").strict;

const results = [];

module.exports = {
  isEqual,
  finish
};

function isEqual(actual, expected, msg) {
  try {
    assert.deepEqual(actual, expected);
    results.push({ msg, expected, actual, pass: true });
  } catch (error) {
    results.push({
      msg,
      expected,
      actual,
      pass: false,
      error
    });
  }
}

function finish() {
  const fails = results.filter(r => !r.pass);

  results.forEach(r => {
    const icon = r.pass ? "\u{2705}" : "\u{274C}";
    console.log(`${icon}  ${r.msg}`);
  });

  console.log("\n");
  console.log(`${results.length} Tests`);
  console.log(`${results.length - fails.length} Passed`);
  console.log(`${fails.length} Failed`);
  console.log("\n");

  fails.forEach(f => {
    console.log(`\u{274C}  ${f.msg}`);
    console.log(f.error.message);
  });

  process.exitCode = fails.length ? 1 : 0;
}
