import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
const images = [
    "./home1.png", "./home2.png", "./home3.png", "./home4.png","./home5.png"
 ]
 const Home=()=>{
    const [index, setIndex] = useState(0);
    const props = useSpring({
        opacity: 1,
        from: { opacity: 0.85 },
        reset: true,
        config: { duration: 3000 },
        onRest: () => setIndex((index + 1) % images.length),
    });
    return (
        <div>
          <br></br>
          
            <div style={{ height: "", opacity: "80%",marginTop:"100px" }}>
 
            <animated.div style={props}>
                <img src={images[index]} width="100%" alt={`Image ${index + 1}`} />
            </animated.div></div>
            <div style={{ backgroundColor: "white", height: "5px" }}></div>
            <br/>
        <img src='image (2).png' style={{height:'150px', width:'100%'}}></img>
   
        </div>)
}
export default Home

