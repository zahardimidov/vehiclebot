import { useState } from 'react';
import Loading from '../Loading/Loading';
import './Layout.css';

function Layout({ gif = null, loading = false, children }) {
    const [gifready, setGif] = useState(gif == null);

    const handleImageLoad = () => {
        setTimeout(() => {
            setGif(true);
        }, 50);
    };

    return (
        <>
            {loading || !gifready ? <Loading /> : ''}

            <div className='layout'>
                {gif && (
                    <div className='gif-container'>
                        <img src={gif} onLoad={handleImageLoad}></img>
                    </div>
                )}
                <div className='content'>
                    {children}
                </div>
            </div>
        </>
    );
}

export default Layout;