import React from 'react';
import './Overlay.css';
import { useNavigate } from 'react-router-dom';

type OverlayProps = {
  title: string;
  children: any;
  background?: string | undefined;
};

const Overlay = ({title, children, background}:OverlayProps) => {
  const navigate = useNavigate();

  return (
    <div className="overlayModal">
      <div className="navbar">
        <div className="navBack" onMouseUp={() => navigate(-1)}>
          Back
        </div>
        <div className="navTitle">
          {title}
        </div>
        <div className="navBack" onMouseUp={() => navigate('/')}>
          Exit
        </div>
      </div>
      <div className="overlayContainer" style={{backgroundColor: background}}>
        {children}
      </div>
    </div>
  )
}

export default Overlay
