import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectToken } from 'redux/appSelectors';
import { selectCurrentlyPlaying } from 'music/selectors';
import { fetchAndUpdateCurrentlyPlaying } from 'music/actions';
import Button from 'react-bootstrap/Button';
import {
  fetchSpotifyToken,
  connectSpotify,
  transferUserPlayback,
  playTrack,
} from 'services';
import { SpotifyToken, CurrentlyPlaying } from 'types';
import { BASE_API_URL } from 'config';
import cx from 'classnames';
import { debounce } from 'debounce';
import './index.css';

type SpotifyPlayer = any;

type PropTypes = {
  userId: string,
  tableId: string,
  tableName: string,
  ws: WebSocket,
  // From redux
  token: string|null,
  currentlyPlaying: CurrentlyPlaying,
  fetchAndUpdateCurrentlyPlaying: (channelId: string) => void
};

type StateTypes = {
  authorizeAttempted: boolean,
  isDJ: boolean,
  deviceId: string,
  spotifyAccessToken: string,
};

class Player extends Component<PropTypes, StateTypes> {

  state = {
    authorizeAttempted: false,
    isDJ: false,
    deviceId: '',
    spotifyAccessToken: '',
  }

  player: SpotifyPlayer;
  authorizeWindow: any;

  async componentDidMount() {
    const { Player }: SpotifyPlayer = await this.waitForSpotifyWebPlaybackSDKToLoad()
    this.player = new Player({
      name: this.props.tableName,
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
    this.player.addListener(
      'player_state_changed',
      debounce(this.handleSongChange, 500), // Spotify does this weird thing where it blasts 3 near-identical events when song changes, so only trigger one
    );

    type ReadyParamType = { device_id: string };
    // Ready
    this.player.addListener('ready', async ({ device_id: deviceId }: ReadyParamType) => {
      this.setState({ deviceId });
      if (this.state.isDJ) {
        try {
          await transferUserPlayback(deviceId, this.state.spotifyAccessToken);
        } catch {
          // Prompt the user to actively select a playback device
          alert(`To start playing music, look for a device named "Virtual Club Dance Floor 🔥" to connect to in the Spotify app.`)
        }
      } else {
        this.props.fetchAndUpdateCurrentlyPlaying(this.props.tableId);
      }
    });
    // Not Ready
    this.player.addListener('not_ready', ({ device_id }: ReadyParamType) => {
      this.setState({ deviceId: '' });
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.disconnect();
    }
  }

  async componentDidUpdate(previousProps: PropTypes) {
    // if (this.state.isDJ) { return; }  // Commenting this out so DJ plays song in-sync with other users who have the added latency of websockets.
    const previouslyPlaying = previousProps.currentlyPlaying;
    const currentlyPlaying = this.props.currentlyPlaying;
    if (previouslyPlaying.trackId !== currentlyPlaying.trackId) {
      await playTrack(this.state.deviceId, this.state.spotifyAccessToken, currentlyPlaying.trackUri, currentlyPlaying.position);
    }

    const previouslyPaused = previousProps.currentlyPlaying.paused;
    const currentlyPaused = this.props.currentlyPlaying.paused;
    const didPause = !previouslyPaused && currentlyPaused;
    const didResume = previouslyPaused && !currentlyPaused;
    if (this.player) {
      didPause && this.player.pause();
      didResume && this.player.resume();
    }
  }

  handleSongChange = (state: any) => {
    if (!this.state.isDJ) { return; } // Only the DJ should be firing change song requests
    if (!state) { return; }

    const track = state.track_window.current_track;
    const payload: CurrentlyPlaying = {
      fromUserId: this.props.userId,
      trackId: track.id,
      trackUri: track.uri,
      trackName: track.name,
      artistName: track.artists[0].name,
      position: state.position,
      duration: state.duration,
      paused: state.paused,
    };
    this.props.ws.send(JSON.stringify({
      action: 'CHANGE_SONG',
      channelId: this.props.tableId,
      ...payload
    }));
  };

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
    this.authorizeWindow = window.open(
      `${BASE_API_URL}/spotify/authorize?userId=${this.props.userId}`,
      '_blank',
      'width=600,height=400'
    );
    this.setState({ authorizeAttempted: true });
  };

  handleSpotifyConnect = async () => {
    this.authorizeWindow && this.authorizeWindow.close(); // Close the authorize window for the user when they connect
    const spotifyToken: SpotifyToken = await fetchSpotifyToken(this.props.token || '');
    await new Promise((resolve, reject) => {
      this.setState({ spotifyAccessToken: spotifyToken.accessToken }, () => {
        return resolve();
      });
    });
    // Connect to the player!
    const connected = await this.player.connect();
    if (!connected) {
      alert('Failed to connect Spotify Player to device');
    }
    const userIdsConnectedToSpotify = await connectSpotify(this.props.tableId, this.props.token || '');
    if (userIdsConnectedToSpotify.length > 0 && this.props.userId === userIdsConnectedToSpotify[0]) {
      this.setState({ isDJ: true });
    }
  }

  render() {
    const { currentlyPlaying } = this.props;
    const { authorizeAttempted, deviceId, isDJ } = this.state;
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
                return <p>Waiting for {isDJ ? 'your music' : 'DJ'}</p>;
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
  token: selectToken(state),
  currentlyPlaying: selectCurrentlyPlaying(state),
});

const mapDispatchToProps = {
  fetchAndUpdateCurrentlyPlaying
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Player);
