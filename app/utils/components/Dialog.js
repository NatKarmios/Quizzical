// @flow
import React, { Component } from 'react';
import Dialog_, { DialogTitle, DialogContent, DialogContentText, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';

const Transition = props => <Slide direction="up" {...props} />;

const Dialog = ({
  title, content, open, handleClose, confirmEnabled=true,
  confirmText='Yes', cancelText='No'
}) => (
  <Dialog_
    open={open}
    transition={Transition}
    keepMounted
    onClose={handleClose(false)}
  >
    <DialogTitle>
      {title}
    </DialogTitle>
    <DialogContent style={{ color: 'black' }}>
      {content}
    </DialogContent>
    <DialogActions>
      <Button disabled={!confirmEnabled} color="primary" onClick={handleClose(true)}>
        {confirmText}
      </Button>
      <Button color="primary" onClick={handleClose(false)}>
        {cancelText}
      </Button>
    </DialogActions>
  </Dialog_>
);

export default Dialog;
