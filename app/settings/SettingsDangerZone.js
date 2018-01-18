// @flow
import React from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog from './dialog/SettingsDialog';

import { Space } from '../utils/components';


const DIALOG_CONTENT = (
  <span>
    This action cannot be undone, and Quizzical will automatically restart.
    <br/>
    Do you wish to continue?
  </span>
);


type DefaultProps = {};
type Props = {
  onLogout: () => void,
  onReset: () => void
};
type State = {
  logoutDialogOpen: boolean,
  resetDialogOpen: boolean
}

class SettingsDangerZone extends React.Component<DefaultProps, Props, State> {
  state = { logoutDialogOpen: false, resetDialogOpen: false };

  render() {
    const { onLogout, onReset } = this.props;
    const { logoutDialogOpen, resetDialogOpen } = this.state;

    const onLogoutButton = () =>
      this.setState({logoutDialogOpen: true, resetDialogOpen});
    const onResetButton = () =>
      this.setState({logoutDialogOpen, resetDialogOpen: true});

    const onLogoutDialogClose = confirm => () => {
      this.setState({logoutDialogOpen: false, resetDialogOpen});
      if (confirm) onLogout();
    };
    const onResetDialogClose = confirm => () => {
      this.setState({logoutDialogOpen, resetDialogOpen: false});
      if (confirm) onReset();
    };

    return (
      <Paper style={{marginTop: '20px', padding: '20px', backgroundColor: '#FDD'}}>
        <Typography type="subheading">
          Danger Zone
        </Typography>
        <br/>
        <div style={{textAlign: 'center'}}>
          <Button raised color="accent" onClick={onLogoutButton}>LOG OUT OF TWITCH</Button>
          <Space>8</Space>
          <Button raised color="accent" onClick={onResetButton}>RESET ALL TO DEFAULT</Button>
        </div>

        <Dialog
          title="Log out of Twitch?"
          content={DIALOG_CONTENT}
          open={logoutDialogOpen}
          handleClose={onLogoutDialogClose}
        />
        <Dialog
          title="Reset all settings?"
          content={DIALOG_CONTENT}
          open={resetDialogOpen}
          handleClose={onResetDialogClose}
        />

      </Paper>
    );
  }
}

export default SettingsDangerZone;
