import { Crisp } from 'crisp-sdk-web';
import React, { Component } from 'react';

class CrispChat extends Component {
  componentDidMount() {
    Crisp.configure('ec47df73-8959-41cd-b913-efdad5c5fd56');
  }

  render() {
    return null;
  }
}
export default CrispChat;
