import React, { Component } from 'react';
import { BASE_WS_URL } from '../config';
import { ChatMessageRequest, ChatMessage } from './types';
import { fetchChatMessages } from './services';
import { transformChatMessage } from './transforms';
import MessageInput from './MessageInput';
import cx from 'classnames';

type PropTypes = {
  userId: string,
  title: string,
};

type StateTypes = {
  chatMessages: Array<ChatMessage>,
  connected: boolean,
  showRetry: boolean,
};

class Chat extends Component<PropTypes, StateTypes> {

  state = {
    chatMessages: [],
    connected: false,
    showRetry: false,
  };

  ws = new WebSocket(`${BASE_WS_URL}`);

  async componentDidMount() {
    this.ws.onopen = this.handleOpenConnection;
    this.ws.onmessage = this.handleReceiveMessage;
    this.ws.onclose = this.handleCloseConnection;
    const chatMessages = await fetchChatMessages();
    this.setState({ chatMessages });
  }

  handleOpenConnection = () => {
    this.setState({ connected: true });
  };

  handleReceiveMessage = (event: any) => {
    const chatMessage = transformChatMessage(JSON.parse(event.data))
    this.setState(prevState => ({
      chatMessages: [...prevState.chatMessages, chatMessage]
    }));
  }

  handleCloseConnection = () => {
    this.setState({
      connected: false,
      showRetry: true,
    });
  }

  handleSendMessage = (message: string) => {
    const chatMessage: ChatMessageRequest = {
      action: 'chat_message',
      user_id: this.props.userId,
      message,
    }
    try {
      this.ws.send(JSON.stringify(chatMessage));
    } catch {
      return false;
    }
    return true;
  };

  render() {
    const { userId, title } = this.props;
    const { chatMessages, connected } = this.state;
    return (
      <div className="chat">
        <div className="messages">
          {chatMessages.map((chatMessage: ChatMessage) => (
            <div key={chatMessage.messageId} className={cx('message', {
              'message--me': userId === chatMessage.userId
            })}>
              {chatMessage.message}
            </div>
          ))}
        </div>
        <MessageInput title={title} disabled={!connected} onSend={this.handleSendMessage} />
      </div>
    );
  }
}

export default Chat;
