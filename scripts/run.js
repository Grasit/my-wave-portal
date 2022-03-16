// const hre = require("hardhat");

const wavesCount = async () => {
    const [_, pleb] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
      });
    await waveContract.deployed();
    console.log("Contract addy:", waveContract.address);
  
    // console.log("Contract deployed to:", waveContract.address);
    // console.log("Contract deployed by:", chad.address);

      /*
   * this get's the Contract's balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    waveContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  )
  
  let waveTxn = await waveContract.wave("a pleb has waved for the first time");
  await waveTxn.wait();

  // let waveTxn2 = await waveContract.wave("This is wave #2");
  // await waveTxn2.wait();

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    // console.log(waveCount.toNumber());
  
     /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

    //  waveTxn = await waveContract.connect(pleb).wave("Another message");
    // await waveTxn.wait();

    // let allWaves = await waveContract.getAllWaves();
    // console.log(allWaves);
};

const runWavesCount = async () => {
    try {
      await wavesCount();
      // process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      // process.exit(1);
       // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
   
  };
  
  runWavesCount();