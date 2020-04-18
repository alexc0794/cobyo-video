import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectToken } from 'redux/appSelectors';
import Button from 'react-bootstrap/Button';
import { fetchSpotifyToken, transferUserPlayback } from 'services';
import { SpotifyToken } from 'types';
import { BASE_API_URL } from 'config';
import cx from 'classnames';
import './index.css';

const DEFAULT_NAME = 'Virtual Club Dance Floor 🔥';

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
  spotifyAccessToken: string,
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
    spotifyAccessToken: '',
  }

  player: SpotifyPlayer;

  async componentDidMount() {
    const { Player }: SpotifyPlayer = await this.waitForSpotifyWebPlaybackSDKToLoad()
    this.player = new Player({
      name: DEFAULT_NAME,
      volume: .2,
      getOAuthToken: (callback: any) => {
        callback(this.state.spotifyAccessToken);
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
      if (!state) { return; }
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
    this.player.addListener('ready', async ({ device_id: deviceId }: ReadyParamType) => {
      this.setState({ deviceId });
      try {
        await transferUserPlayback(deviceId, this.state.spotifyAccessToken);
      } catch {
        // Prompt the user to actively select a playback device
        alert(`To start playing music, look for a device named "Virtual Club Dance Floor 🔥" to connect to in the Spotify app.`)
      }
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
      `${BASE_API_URL}/spotify/authorize?userId=${this.props.userId}`,
      '_blank',
      'width=600,height=400'
    );
    this.setState({ authorizeAttempted: true });
  };

  handleSpotifyConnect = async () => {
    const spotifyToken: SpotifyToken = await fetchSpotifyToken(this.props.token || '');
    await new Promise((resolve, reject) => {
      this.setState({ spotifyAccessToken: spotifyToken.accessToken }, () => {
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
