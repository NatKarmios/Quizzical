// @flow
import React, { Component } from 'react';
import Dialog, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';

const Transition = props => <Slide direction="up" {...props} />;

const SettingsDialog = ({ title, content, open, handleClose }) => (
  <Dialog
    open={open}
    transition={Transition}
    keepMounted
    onClose={handleClose(false)}
  >
    <DialogTitle>
      {title}
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onClick={handleClose(true)}>
        Yes
      </Button>
      <Button color="primary" onClick={handleClose(false)}>
        No
      </Button>
    </DialogActions>
  </Dialog>
);

export default SettingsDialog;
