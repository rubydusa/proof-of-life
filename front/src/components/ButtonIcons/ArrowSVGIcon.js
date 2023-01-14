import React from 'react';

import { ReactComponent as ArrowSVG } from '../../svgs/arrow-back-solid-svgrepo-com.svg';

// original image is backwards
export default function ArrowSVGIcon({ backwards }) {
  return (
    <ArrowSVG
      className='svg-btn-icon'
      style={{
        transform: !backwards ? 'scale(-1, 1)' : undefined
      }}/>
  );
}
