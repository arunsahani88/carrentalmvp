import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  // test setup
  global.TextEncoder = require('util').TextEncoder;

  // @ts-expect-error
  global.TextDecoder = TextDecoder;

}
