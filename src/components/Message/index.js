import React from 'react';

import { Popup } from 'semantic-ui-react';

const Message = (props) => (
    <Popup
        open={props.open}
        content={props.text}
        basic
   />
)