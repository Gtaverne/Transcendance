import React from 'react';
import './Overlay.css';
import { useNavigate } from 'react-router-dom';

type OverlayProps = {
  title: string;
  children: any;
};

const Overlay = ({title, children}:OverlayProps) => {
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
      </div>
      <div className="overlayContainer">
        {children}
      </div>
    </div>
  )
}

export default Overlay
