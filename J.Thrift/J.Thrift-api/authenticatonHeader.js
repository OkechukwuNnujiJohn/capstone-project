import React from 'react';
import pbkdf2 from 'pbkdf2'; // Make sure to install the pbkdf2 package

class AuthenticationHeader extends React.Component {
  getAuthenticationHeader(public_key={0db0d858eb1cc62201820ae7f6a25791}, secret_key = {1ddb176476f114e870ab48745d3375d4}) {
    let time = parseInt(Date.now() / 1000);
    var derivedKey = pbkdf2.pbkdf2Sync(secret_key, time.toString(), 128, 32, 'sha256');
    derivedKey = derivedKey.toString('hex');

    return new Headers({
      "public_key": public_key,
      "one_time_code": derivedKey,
      "timestamp": time,
    });
  }

  render() {
    const { public_key, secret_key } = this.props;
    const header = this.getAuthenticationHeader(public_key, secret_key);

    return (
      <div>
        <p>public_key: {header.get('public_key')}</p>
        <p>one_time_code: {header.get('one_time_code')}</p>
        <p>timestamp: {header.get('timestamp')}</p>
      </div>
    );
  }
}

// dresing room address: 30e16d35aeb020e05867fe49d5dd7011a8a74489994ac6bc4036ab0f5d63f856

export default AuthenticationHeader;
