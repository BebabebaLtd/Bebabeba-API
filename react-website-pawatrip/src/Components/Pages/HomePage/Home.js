import React from 'react';
import HeroSection from '../../HeroSection';
import { homeObjOne, homeObjTwo, homeObjThree, homeObjFour} from './Data';
import Undraw from '../../Undraw';
import Icons from '../../Icons';





function Home() {
  
  return (
    <>
      <HeroSection {...homeObjOne} />
     <Undraw />
            
      <HeroSection {...homeObjTwo} />
      <Icons />
      <HeroSection {...homeObjFour} />
    </>
  );
}

export default Home;