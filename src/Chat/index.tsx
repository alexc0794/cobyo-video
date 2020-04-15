import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createChatMessage } from '../redux/chatActions';
// import { BASE_WS_URL } from '../config';
import {
  // ChatMessageRequest, 
  ChatMessage
} from './types';
import { transformChatMessage } from './transforms';
import MessageInput from './MessageInput';

type PropTypes = {
  userId: string,
  title: string,
  createChatMessage: (chatMessage: ChatMessage) => void,
};

type StateTypes = {
  connected: boolean,
  showRetry: boolean,
};

class Chat extends Component<PropTypes, StateTypes> {

  state = {
    connected: false,
    showRetry: false,
  };

  // ws = new WebSocket(`${BASE_WS_URL}`);

  async componentDidMount() {
    // this.ws.onopen = this.handleOpenConnection;
    // this.ws.onmessage = this.handleReceiveMessage;
    // this.ws.onclose = this.handleCloseConnection;
  }

  handleOpenConnection = () => {
    this.setState({ connected: true });
  };

  handleReceiveMessage = (event: any) => {
    const chatMessage = transformChatMessage(JSON.parse(event.data));
    this.props.createChatMessage(chatMessage);
  }

  handleCloseConnection = () => {
    this.setState({
      connected: false,
      showRetry: true,
    });
  }

  handleSendMessage = (message: string) => {
    // const chatMessage: ChatMessageRequest = {
    //   action: 'chat_message',
    //   user_id: this.props.userId,
    //   message,
    // }
    try {
      // this.ws.send(JSON.stringify(chatMessage));
    } catch {
      return false;
    }
    return true;
  };

  render() {
    const { title } = this.props;
    const { connected } = this.state;
    return (
      <div className="Chat">
        <MessageInput
          title={title}
          disabled={!connected}
          onSend={this.handleSendMessage}
        />
      </div>
    );
  }
}

const mapDispatchToProps = {
  createChatMessage,
};

export default connect(
  null,
  mapDispatchToProps,
)(Chat);
