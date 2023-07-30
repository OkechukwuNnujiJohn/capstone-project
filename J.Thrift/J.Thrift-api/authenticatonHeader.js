import pbkdf2 from 'pbkdf2';

function getAuthenticationHeader(public_key, secret_key) {
  let time = parseInt(Date.now() / 1000);
  var derivedKey = pbkdf2.pbkdf2Sync(secret_key, time.toString(), 128, 32, 'sha256');
  derivedKey = derivedKey.toString('hex');

  return new Headers({
    "public_key": public_key,
    "one_time_code": derivedKey,
    "timestamp": time,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
}

export default getAuthenticationHeader;
