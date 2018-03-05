// @flow

import React from 'react';
import type { Node } from 'react';
import MuiDialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Slide from 'material-ui/transitions/Slide';

const Transition = props => <Slide direction="up" {...props} />;


type Props = {
  title: string,
  content: Node,
  open: boolean,
  handleClose: boolean => () => any,
  confirmEnabled?: boolean,
  confirmText?: string,
  cancelText?: string
};


const defaultProps = {
  confirmEnabled: true,
  confirmText: 'Yes',
  cancelText: 'No'
};


const Dialog = ({
  title, content, open, handleClose, confirmEnabled, confirmText, cancelText
}: Props) => (
  <MuiDialog
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
  </MuiDialog>
);


Dialog.defaultProps = defaultProps;


export default Dialog;
