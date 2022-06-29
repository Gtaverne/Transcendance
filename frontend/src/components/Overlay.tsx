import React from 'react';
import './Overlay.css';
import { useNavigate } from 'react-router-dom';

type OverlayProps = {
  title: string;
  children: any;
  style?: any;
};

const Overlay = ({ title, children, style }: OverlayProps) => {
  const navigate = useNavigate();

  return (
    <div className="overlayModal">
      <div className="navbar">
        <div className="navBack" onMouseUp={() => navigate(-1)}>
          Back
        </div>
        <div className="navTitle">{title}</div>
        <div className="navBack" onMouseUp={() => navigate('/')}>
          Exit
        </div>
      </div>
      <div className="overlayContainer" style={style}>
        {children}
      </div>
    </div>
  );
};

export default Overlay;
