// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import Tooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';

import { MDIcon } from '.';


type Props = {
  tooltipText: string,
  linkTo: string,
  icons: Array<string>,
  width: string
};


const HeaderLinkButton = ({ tooltipText, linkTo, icons, width = 'auto' }: Props) => (
  <div style={{ float: 'right', position: 'relative', top: '-4px' }}>
    <Tooltip title={tooltipText} PopperProps={{ style: { textAlign: 'center', width } }}>
      <span>
        <Link to={linkTo}>
          <Button dense raised color="primary">
            {icons.map(icon => <MDIcon key={icon}>{icon}</MDIcon>)}
          </Button>
        </Link>
      </span>
    </Tooltip>
  </div>
);

export default HeaderLinkButton;
