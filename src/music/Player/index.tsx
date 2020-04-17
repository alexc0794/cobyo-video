import React, { Component } from 'react';

class Player extends Component {

  async componentDidMount() {
    const { Player }: any = await this.waitForSpotifyWebPlaybackSDKToLoad()
    const token = 'BQAMiQRYcug7UG0QRFQ6wI28tH1tF_gLmvyqNctL1KG0q9FWsLwYN_7E6mZx9eYYi-YMPYaGLGiPHx0DoemwHtwy_hBdkhGdd3qpjQNpxu_fCNFaf-YYB0SrjuF8yeEXgfgApb9ZTuHBehlqPlnvSGY9KyLtKuKOX2U';

    const player = new Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: (cb: any) => { cb(token); }
    });

    // Error handling
    type CallbackParamType = { message: string };
    player.addListener('initialization_error', ({ message }: CallbackParamType) => { console.error(message); });
    player.addListener('authentication_error', ({ message }: CallbackParamType) => { console.error(message); });
    player.addListener('account_error', ({ message }: CallbackParamType) => { console.error(message); });
    player.addListener('playback_error', ({ message }: CallbackParamType) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', (state: any) => { console.log(state); });


    type ReadyParamType = { device_id: string };
    // Ready
    player.addListener('ready', ({ device_id }: ReadyParamType) => {
      console.log('Ready with Device ID', device_id);
    });
    // Not Ready
    player.addListener('not_ready', ({ device_id }: ReadyParamType) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
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
  };

  render() {
    return (
      <div>Spotify</div>
    );
  }
}

export default Player;
