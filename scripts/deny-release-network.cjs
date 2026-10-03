// Verification preload: ordinary builds must never contact release infrastructure.
const blocked = /^(?:api\.github\.com|github\.com|.*\.githubusercontent\.com)$/i;
function check(input) {
  let hostname;
  if (typeof input === 'string' || input instanceof URL) hostname = new URL(input).hostname;
  else hostname = input?.hostname ?? input?.host;
  if (hostname && blocked.test(hostname)) throw new Error('Release network forbidden during website build');
}
const originalFetch = globalThis.fetch;
globalThis.fetch = function (input, ...args) {
  check(input instanceof Request ? input.url : input);
  return originalFetch(input, ...args);
};
for (const transport of [require('node:http'), require('node:https')]) {
  for (const method of ['request', 'get']) {
    const original = transport[method];
    transport[method] = function (input, ...args) {
      check(input);
      return original.call(this, input, ...args);
    };
  }
}
