import React from 'react';
import './Icons.css';


function IconsTwo() {
  return (
    
      <div className='iconscontainer'>
        <div className='icons__wrapper'>
         
          <div className='icon__containerr'>   

              <div className='icon__containerr-cardInfo'>
                <div className='iconOne'>
                  <img src="images/wallet.svg" alt="wallet" height="100" width="100" color="blue" />
                </div>
                <h1>The best prices</h1>
                <p>We guarantee the best offers</p>
                <p>to our users</p>
                </div>
               
                <div className='icon__containerr-cardInfo'>
                <div className='iconTwo'>
                  <img src="images/tick.svg" alt="tick" height="100" width="100"/>
                </div>
                <h1>Easy to use</h1>
                <p>Minimalist design and</p>
                <p>layout makes it simple to</p>
                <p>navigate across the app</p>
                </div>


                
                <div className='icon__containerr-cardInfo'>
                <div className='iconThree'>
                  <img src="images/safe.svg" alt="Convenient" height="100" width="100" />
                </div>
                <h1>Safe and Convenient</h1>
                <p>Our verification process</p>
                <p>ensures high level security</p>
                <p>check and verification</p>
                
              </div>


              <div className='icon__containerr-cardInfo'>
                <div className='iconThree'>
                  <img src="images/chat.svg" alt="Chat" width="100" height="100"/>
                </div>
                <h1>Chat with driver/passenger</h1>
                <p>Communicate without the</p>
                <p>hassle of exiting the app</p>
                </div>
            
           
              
            
           
             
        </div>
      </div>
   </div>
  );
}
export default IconsTwo;