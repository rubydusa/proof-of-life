import React from 'react'

import { ReactComponent as XSVG } from '../../svgs/x-svgrepo-com.svg';

export default function XSVGIcon() {
  return (
    <XSVG 
      className='svg-btn-icon'
      style={{
        transform: 'translate(0px, 2px)',
      }}/>
  )
}
