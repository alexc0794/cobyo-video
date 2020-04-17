import React, { Component } from 'react';
import { RTC, joinCall, leaveCall, playRemoteUsers } from 'src/agora';
import Video from 'src/video/Video';
import Modal from 'react-bootstrap/Modal';

type LocalVideoPropTypes = {
  userId: string,
  tableId: string,
  audioMuted: boolean,
  rtc: RTC,
}

class LocalVideo extends Component<LocalVideoPropTypes> {

  state = {
    error: null,
  };

  async componentDidMount() {
    const { userId, tableId, rtc } = this.props;
    try {
      await joinCall(rtc, userId, tableId);
      playRemoteUsers(rtc); // Gawd this is such a hack but I want to see how this behaves on prod
    } catch (e) {
      this.setState({ error: e.message });
    }
  }

  async componentWillUnmount() {
    const { rtc } = this.props;
    await leaveCall(rtc);
  }

  render() {
    const { audioMuted, userId } = this.props;
    const { error } = this.state;
    return (
      <>
        <Video userId={userId} audioMuted={audioMuted} />
        {!!error && (
          <Modal show backdrop={"static"}>
            <Modal.Header>
              <Modal.Title>
                An error has occurred <span role="img" aria-label="Sweat">😓</span>.
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer>
              {error}
            </Modal.Footer>
          </Modal>
        )}
      </>
    );
  }
}

export default LocalVideo;
