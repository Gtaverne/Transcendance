import React from 'react';
import useSound from 'use-sound';

import '../../pages/Home.css';

import clicksound from './click.mp3';
import clocksound from './clock.mp3';

type GlassProps = {
  title: string;
  onClick?: any;
  children: any;
};

function GlassButton({title, onClick, children}: GlassProps)
{
    const [play] = useSound(clicksound, { volume: 0.5});
    const [playClock] = useSound(clocksound, { volume: 0.5});

    return (
        <div className="glassButton"  onMouseUp={onClick} onMouseEnter={() => play()} onMouseDown={() => playClock()}>
            <div className="glassShine"></div>
            <div className="glassSelectionRing"></div>

            <div className="glassAngleContainer">
                <div className="glassAngle"></div>
            </div>
            <div className="glassContainer">

                <div className="glassLogo">
                    {children}
                </div>
                <div className="glassName">
                    {title}
                </div>
            </div>
        </div>
    );
}

export default GlassButton;
