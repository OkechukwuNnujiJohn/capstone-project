import pbkdf2 from 'pbkdf2';
// import pbkdf2 from 'pbkdf2-browser';
// import crypto, { pbkdf2 } from 'crypto';
// import { SHA256, enc } from 'crypto-js';

function getAuthenticationHeader(public_key, secret_key) {
  // json=false
  let time =  parseInt(Date.now() / 1000);
  // const crypto = require('crypto')
  var derivedKey = pbkdf2.pbkdf2Sync(secret_key, time.toString(), 128, 32, 'sha256');
  derivedKey = derivedKey.toString('hex');
  // var derivedKey = SHA256(secret_key + time.toString()).toString(enc.Hex);

  return new Headers({
    "public_key": public_key,
    "one_time_code": derivedKey,
    "timestamp": time,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });

}


export default getAuthenticationHeader;
