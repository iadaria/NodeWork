const isPrime = require("./04-is-prime-sqrt");

const results = [];

isEqual(isPrime(2), true, "2 should be prime");
isEqual(isPrime(3), true, "3 should be prime");
isEqual(isPrime(4), false, "4 should not be prime");
isEqual(isPrime(5), true, "5 should be prime");
isEqual(isPrime(9), false, "9 should not be prime");
isEqual(isPrime(200), false, "200 should not be prime");
isEqual(isPrime(1489), true, "1489 should be prime");
isEqual(isPrime(2999), true, "2999 should be prime");

finish();

function isEqual(actual, expected, msg) {
  const pass = actual === expected;
  results.push({ msg, expected, actual, pass });
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
    console.log(`\u{274C}  ${f.msg}
      expected: ${f.expected}
      actual: ${f.actual}`);
  });

  process.exitCode = fails.length ? 1 : 0;
}
