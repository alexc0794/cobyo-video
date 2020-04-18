import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectToken } from 'redux/appSelectors';
import Button from 'react-bootstrap/Button';
import { fetchSpotifyToken } from 'services';
import { SpotifyToken } from 'types';
import cx from 'classnames';
import './index.css';

type SpotifyPlayer = any;

type CurrentlyPlaying = {
  trackName: string|null,
  position: number,
  duration: number,
  artistName: string|null,
  paused: boolean,
};

type PropTypes = {
  userId: string,
  tableId: string,
  ws: WebSocket,
  token: string|null,
};

type StateTypes = {
  authorizeAttempted: boolean,
  currentlyPlaying: CurrentlyPlaying,
  deviceId: string|null,
  spotifyToken: SpotifyToken|null,
};

class Player extends Component<PropTypes, StateTypes> {

  state = {
    authorizeAttempted: false,
    currentlyPlaying: {
      trackName: null,
      position: 0,
      duration: 0,
      artistName: null,
      paused: true,
    },
    deviceId: null,
    spotifyToken: null,
  }

  player: SpotifyPlayer;

  async componentDidMount() {
    const { Player }: SpotifyPlayer = await this.waitForSpotifyWebPlaybackSDKToLoad()
    this.player = new Player({
      name: 'Virtual Club Dance Floor 🔥',
      volume: .2,
      getOAuthToken: (callback: any) => {
        const token: any = this.state.spotifyToken; // Stupid typescript error idk how to fix
        callback(token.accessToken);
      }
    });

    // Error handling
    type CallbackParamType = { message: string };
    this.player.addListener('initialization_error', ({ message }: CallbackParamType) => {
      alert(message);
    });
    this.player.addListener('authentication_error', ({ message }: CallbackParamType) => {
      alert(message);
    });
    this.player.addListener('account_error', ({ message }: CallbackParamType) => {
      alert(message);
    });
    this.player.addListener('playback_error', ({ message }: CallbackParamType) => {
      alert(message);
    });

    // Playback status updates
    this.player.addListener('player_state_changed', (state: any) => {
      const track = state.track_window.current_track;
      this.setState({
        currentlyPlaying: {
          trackName: track.name,
          artistName: track.artists[0].name,
          position: state.position,
          duration: state.duration,
          paused: state.paused,
        }
      });
      this.props.ws.send(JSON.stringify({
        action: 'CHANGE_SONG',
        userId: this.props.userId,
        channelId: this.props.tableId,
        trackId: track.id,
        trackUri: track.uri,
        trackName: track.name,
      }));
    });

    type ReadyParamType = { device_id: string };
    // Ready
    this.player.addListener('ready', ({ device_id }: ReadyParamType) => {
      this.setState({ deviceId: device_id });
    });
    // Not Ready
    this.player.addListener('not_ready', ({ device_id }: ReadyParamType) => {
      this.setState({ deviceId: null });
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.disconnect();
    }
  }

  async waitForSpotifyWebPlaybackSDKToLoad() {
    return new Promise(resolve => {
      const windowSpotify = (window as any).Spotify;
      if (windowSpotify) {
        resolve(windowSpotify);
      } else {
        (window as any).onSpotifyWebPlaybackSDKReady = () => {
          resolve(windowSpotify);
        };
      }
    });
  }

  handleSpotifyAuthorization = () => {
    window.open(
      `https://localhost:8080/spotify/authorize?userId=${this.props.userId}`,
      '_blank',
      'width=600,height=400'
    );
    this.setState({ authorizeAttempted: true });
  };

  handleSpotifyConnect = async () => {
    const spotifyToken: SpotifyToken = await fetchSpotifyToken(this.props.token || '');
    await new Promise((resolve, reject) => {
      this.setState({ spotifyToken }, () => {
        return resolve();
      });
    });
    // Connect to the player!
    await this.player.connect();
  }

  render() {
    const { authorizeAttempted, currentlyPlaying, deviceId } = this.state;
    const { trackName, artistName, paused } = currentlyPlaying;
    return (
      <div className="Player">
        <div className={cx("Player-discHolder", {
          'Player-discHolder--playing': !paused,
        })}>
          <div className="Player-disc" />
        </div>
        <div className="Player-content">
          {(() => {
            if (deviceId) {
              if (!trackName) {
                return <p>Waiting for DJ</p>;
              } else {
                return (
                  <>
                    <p>{trackName}</p>
                    <p>by {artistName}</p>
                  </>
                );
              }
            } else {
              // No device connected
              if (authorizeAttempted) {
                return (
                  <Button variant="success" onClick={this.handleSpotifyConnect}>Connect Spotify</Button>
                );
              } else {
                return (
                  <Button variant="success" onClick={this.handleSpotifyAuthorization}>Link Spotify</Button>
                )
              }
            }
          })()}
        </div>
        <div className={cx("Player-discHolder", {
          'Player-discHolder--playing': !paused,
        })}>
          <div className="Player-disc" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  token: selectToken(state)
});

export default connect(
  mapStateToProps
)(Player);
