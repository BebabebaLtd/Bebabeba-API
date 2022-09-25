import React from 'react';
import './HeroSection.css';


function HeroSection({
  lightBg,
  topLine,
  lightText,
  lightTextDesc,
  headline,
  description,  
  img,
  img2,
  bgimg,
  alt,
  imgStyles,
  imgStyling,
  imgStart, 
  imgUrl
}) {
 
  return (
    <>
      <div className={lightBg ? 'home__hero-section' : 'home__hero-section darkBg'} style={bgimg?{padding:0}: {}}>
      
        <div className='container' style={bgimg?{backgroundImage :`url(${bgimg})`, backgroundRepeat: "no-repeat" , backgroundSize : "cover" , padding:"2rem", backgroundPosition : "center center", minHeight: "30rem"}: {}}>
          <div
            className='row home__hero-row'
            style={{
              display: 'flex',
              flexDirection: imgStart === 'start' ? 'row-reverse' : 'row'
            }}
          >
            <div className='col'>
              <div className='home__hero-text-wrapper'>
                <div className='top-line'>{topLine}</div>
                <h1 className={lightText ? 'heading' : 'heading dark'}>
                  {headline}
                </h1>
                <p
                  className={
                    lightTextDesc
                      ? 'home__hero-subtitle'
                      : 'home__hero-subtitle dark'
                  }
                >
                  {description}
                </p>
                
              </div>
            </div>
            <div className='col'>
              <div className='home__hero-img-wrapper'>

                {img?(imgUrl ? <a href={imgUrl} ><img src={img} alt={alt} className={`home__hero-img ${imgStyling}`} style= {{...imgStyles}}/></a>:<img src={img} alt={alt} className={`home__hero-img ${imgStyling}`} style= {{...imgStyles}}/>): null }
              </div>
              
              
              <div className='home__hero-img-wrapper'>
                {img2?<img src={img2} alt={alt} className='home__hero-img2' />: null}
              </div>
              </div>
          </div>
       </div>
      </div>
    </>
  );
  }
  

export default HeroSection;