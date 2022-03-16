import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "../utils/WavePortal.json";

const App =() =>  {

   /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  /* state variable to show progress bar*/
  const [showBar, setShowBar] = useState("");
  /* state variable to show all waves*/
  const [allWaves, setAllWaves] = useState([]);
  /*state variable to return message sent*/
  const [msg, setMsg] = useState(""); 

  /*function to show loader*/
    const onClick = async () =>{
      setShowBar(true)
    };
    
const handleChange = event => {
        const { value } = event.target;
        setMsg(value);
    }
  
   /* Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    const { ethereum } = window;
    try { 
      if (ethereum) {
        const provider = new       
           ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new 
         ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await wavePortalContract.getAllWaves();
        
        /*
         * We only need address, timestamp, and message in our               UI so let's pick those out
         */
        // const wavesCleaned = [];
        // waves.forEach(wave => {
        //   wavesCleaned.push({
        //     address: wave.waver.toString().slice(0, 5) + "..." +             wave.waver.toString().slice((wave.waver.length-1)-4,             wave.waver.length),
        //     timestamp: new Date(wave.timestamp * 1000),
        //     message: wave.message
        //   });
        // });

        /* function that allows the address, timestap. and 
       message updated to the UI without the page being 
       refreshed
        */
      const wavesCleaned = waves.map(wave=>{
        return{
        address: wave.waver.toString().slice(0, 5) + "..." + 
                 wave.waver.toString().slice((wave.waver.length- 
                 1)-4, wave.waver.length),
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
        }
      });
        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
        // console.log(waves);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
 * Listen in for emitter events!
 */
useEffect(() => {
  let wavePortalContract;

  const onNewWave = (from, timestamp, message) => {
    console.log("NewWave", from, timestamp, message);
    setAllWaves(prevState => [
      ...prevState,
      {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message: message,
      },
    ]);
  };

    if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    wavePortalContract.on("NewWave", onNewWave);
  }

  return () => {
    if (wavePortalContract) {
      wavePortalContract.off("NewWave", onNewWave);
    }
  };
}, []);
  
  /*
    Create a variable here that holds the contract address     
    after you deploy!
   */
  const contractAddress =   
   "0xef5d1A64cEB25Cd89706EbF6e141b02D0900864E";

  /**
   * Create a variable here that references the abi content!
   */
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 
       "eth_accounts" });
  
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

   /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask, you pleb!");
        return;
      }

      const accounts = await ethereum.request({ method: 
        "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const sendWave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new 
         ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new 
         ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", 
         count.toNumber());
         /*
        * this executes the actual wave from your smart contract
        */
         const waveTxn = await wavePortalContract.wave(msg,  
           {gasLimit:300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", 
         count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
}
  
  //   const checkIfWalletIsConnected = () => {
  //   /*
  //   * First make sure we have access to window.ethereum
  //   */
  //   const { ethereum } = window;

  //   if (!ethereum) {
  //     console.log("Make sure you have metamask!");
  //   } else {
  //     console.log("We have the ethereum object", ethereum);
  //   }
  // }

  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  /* this hides the loader after 5 seconds*/
   useEffect ( () => 
    {setTimeout(() => {
      setShowBar(false)
    }, 5000);
  }, []);
  clearTimeout();
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <p className="bio">
          I am Grasit and I just got into web3. Connect your     
          Ethereum wallet and wave at me!
        </p>

        <button className="waveButton" 
          onClick={() => {
            sendWave(); 
            onClick();
            }
          }>
          Wave at Me
        </button>
        
        {showBar && (
         <div className="progress"> 
           </div>
        )}
      
        {!currentAccount && (
          <button className="connectButton" onClick=            
            {connectWallet}>
            Connect Wallet
          </button>
        )}
        {allWaves.map((wave, index) => {
          return (
            <div className="allWaves" key={index}>
              <div>Pleb's Address: {wave.address}
              </div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        })}
        <
        input type = "text"
        value = { msg }
        onChange = { handleChange }
        placeholder='Send anything'
        />
      </div>
    </div>
  );
}

export default App;
