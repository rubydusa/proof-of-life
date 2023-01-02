import React from 'react'

import { ReactComponent as PlaySVG } from '../../svgs/play-1-svgrepo-com.svg';

export default function PlaySVGIcon() {
  return (
    <PlaySVG 
      className='svg-btn-icon' 
      style={{
        transform: 'translate(0px, 2px)',
      }}/>
  )
}
