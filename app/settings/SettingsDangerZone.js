// @flow
import React from 'react';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';

import { Space, Dialog, InlineIcon } from '../utils/components';


const DIALOG_CONTENT = (
  <span>
    This action cannot be undone, and Quizzical will automatically restart.
    <br />
    Do you wish to continue?
  </span>
);


type Props = {
  // eslint-disable-next-line flowtype/no-weak-types
  onLogout: () => any,
  // eslint-disable-next-line flowtype/no-weak-types
  onDeleteQuestions: () => any,
  // eslint-disable-next-line flowtype/no-weak-types
  onReset: () => any
};
type State = {
  logoutDialogOpen: boolean,
  deleteQuestionsDialogOpen: boolean,
  resetDialogOpen: boolean
};


class SettingsDangerZone extends React.Component<void, Props, State> {

  state = { logoutDialogOpen: false, deleteQuestionsDialogOpen: false, resetDialogOpen: false };

  render() {
    const { onLogout, onDeleteQuestions, onReset } = this.props;
    const { logoutDialogOpen, deleteQuestionsDialogOpen, resetDialogOpen } = this.state;

    const onLogoutButton = () =>
      this.setState({ ...this.state, logoutDialogOpen: true });
    const onDeleteQuestionsButton = () =>
      this.setState({ ...this.state, deleteQuestionsDialogOpen: true });
    const onResetButton = () =>
      this.setState({ ...this.state, resetDialogOpen: true });

    const onLogoutDialogClose = confirm => () => {
      this.setState({ ...this.state, logoutDialogOpen: false });
      if (confirm) onLogout();
    };
    const onDeleteQuestionsDialogClose = confirm => () => {
      this.setState({ ...this.state, deleteQuestionsDialogOpen: false });
      if (confirm) onDeleteQuestions();
    };
    const onResetDialogClose = confirm => () => {
      this.setState({ ...this.state, resetDialogOpen: false });
      if (confirm) onReset();
    };

    return (
      <Paper style={{ marginTop: '20px', padding: '20px', backgroundColor: '#FDD' }}>
        <Typography type="subheading">
          Danger Zone
        </Typography>
        <br />
        <div style={{ textAlign: 'center' }}>
          <Tooltip title="Log out of Twitch">
            <span>
              <Button raised color="accent" onClick={onLogoutButton}>
                <InlineIcon>twitch</InlineIcon>
                <InlineIcon>logout-variant</InlineIcon>
              </Button>
            </span>
          </Tooltip>

          <Space>8</Space>

          <Tooltip title="Delete all question data">
            <span>
              <Button raised color="accent" onClick={onDeleteQuestionsButton}>
                <InlineIcon>comment-question-outline</InlineIcon>
                <InlineIcon>delete-sweep</InlineIcon>
              </Button>
            </span>
          </Tooltip>

          <Space>8</Space>

          <Tooltip title="Clear all settings">
            <span>
              <Button raised color="accent" onClick={onResetButton}>
                <InlineIcon>settings</InlineIcon>
                <InlineIcon>delete-sweep</InlineIcon>
              </Button>
            </span>
          </Tooltip>
        </div>

        <Dialog
          title="Log out of Twitch?"
          content={DIALOG_CONTENT}
          open={logoutDialogOpen}
          handleClose={onLogoutDialogClose}
        />

        <Dialog
          title="Delete all question data"
          content={DIALOG_CONTENT}
          open={deleteQuestionsDialogOpen}
          handleClose={onDeleteQuestionsDialogClose}
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
