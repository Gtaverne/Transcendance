import React, { useState } from 'react';

import '../../pages/Home.css';

import clicksound from './click.mp3';
import clocksound from './clock.mp3';
import useAudio from '../../features/game/useAudio';

type GlassProps = {
  title: string;
  onClick?: any;
  children: any;
};

function GlassButton({title, onClick, children}: GlassProps)
{
    const [clicked, setClicked] = useState(false);
    const play = useAudio(clicksound);
    const playClock = useAudio(clocksound);


    window.addEventListener("click", () => {
      setClicked(true);
    });

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
