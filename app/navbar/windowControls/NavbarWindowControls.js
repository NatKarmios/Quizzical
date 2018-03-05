// @flow
import React, { Component } from 'react';
import ControlButton from './NavbarWindowControlButton';
import { getWindow } from '../../utils/helperFuncs';


const minimize = () => {
  getWindow().minimize();
};

const toggleMaximise = () => {
  const window = getWindow();
  (window.isMaximized() ? window.unmaximize : window.maximize)();
};

const closeWindow = () => {
  getWindow().close();
};


let setMaximized: boolean => void = () => {};
getWindow().on('maximize', () => { setMaximized(true); });
getWindow().on('unmaximize', () => { setMaximized(false); });


type Props = {};
type State = { maximized: boolean };


class NavbarWindowControls extends Component<void, Props, State> {
  state = { maximized: false };

  render() {
    setMaximized = (maximized) => this.setState({ maximized });

    const { maximized } = this.state;
    return (
      <div style={{ color: 'white', WebkitAppRegion: 'no-drag' }}>
        <ControlButton onClick={minimize} icon="window-minimize" />
        <ControlButton onClick={toggleMaximise} icon={`window-${maximized ? 'restore' : 'maximize'}`} />
        <ControlButton onClick={closeWindow} icon="window-close" />
      </div>
    );
  }
}


export default NavbarWindowControls;
