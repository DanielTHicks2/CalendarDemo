import React from 'react'
import { Spinner } from 'react-bootstrap'


const WaitAnimation = (props: {hover: boolean, className?: string}) => {
  return (
      <div className="text-center">
          <Spinner
              animation="border"
              role="status"
              style={props.hover ? { zIndex: 500, position: 'fixed' } : {}}
              className={props.className}
          />
      </div>
  );
}

export default WaitAnimation;