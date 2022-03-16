

const newBlock = async () => {
    // const [chadmin] = await hre.ethers.getSigners();
    // const walletBalance = await chadmin.getBalance();
  
    // console.log("Deploying contracts with account: ", chadmin.address);
    // console.log("Wallet balance: ", walletBalance.toString());
  
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.001"),
      });
    await waveContract.deployed();
  
    console.log("WavePortal address: ", waveContract.address);
  };
  
  const runNewBlock = async () => {
    try {
      await newBlock();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runNewBlock();