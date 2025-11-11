import { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const Context = createContext();
const web3Modal = new Web3Modal({
  cacheProvider: true, // optional
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        rpc: {
          137: 'https://polygon-rpc.com',
        },
        supportedChainIds: [137],
      },
    },
  }, // required
});

const ContextProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [instance, setInstance] = useState(null);
  const [signer, setSigner] = useState(null);
  const [wrongChain, setWrongChain] = useState(false);
  const [address, setAddress] = useState('');
  const askForMaticChain = provider => {
    provider.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x89',
          rpcUrls: ['https://polygon-rpc.com'],
          chainName: 'Polygon',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
      ],
    });
  };
  const connectWallet = async () => {
    setInstance(await web3Modal.connect());
  };
  const disconnectWallet = async () => {
    setWallet(null);
    setSigner(null);
    setAddress(null);
    setWrongChain(false);
    web3Modal.clearCachedProvider();
    window.location.reload(false);
  };
  useEffect(() => {
    if (web3Modal.cachedProvider.length > 0) {
      connectWallet();
    }
  }, []);
  useEffect(() => {
    const newInstance = async () => {
      if (!instance || !instance.on) return;
      instance.on('accountsChanged', async accounts => {
        console.log('accountsChanged', accounts);
        if (accounts.length === 0) {
          setWallet(null);
          setSigner(null);
          setAddress(null);
          setWrongChain(false);
          web3Modal.clearCachedProvider();
        } else {
          let provider = new ethers.providers.Web3Provider(instance);
          let chainId = (await provider.getNetwork()).chainId;
          if (!(chainId === 137 || chainId === 80001 || chainId === 31337)) {
            askForMaticChain(provider);
            setWallet(provider);
            setSigner(provider.getSigner());
            setAddress(null);
            setWrongChain(true);
            return;
          }
          setWallet(provider);
          setSigner(provider.getSigner());
          setAddress((await provider.listAccounts())[0]);
          setWrongChain(false);
        }
      });
      // Subscribe to chainId change
      instance.on('chainChanged', async () => {
        let provider = new ethers.providers.Web3Provider(instance);
        let chainId = (await provider.getNetwork()).chainId;
        console.log('chainChanged', chainId);
        if (!(chainId === 137 || chainId === 80001 || chainId === 31337)) {
          askForMaticChain(provider);
          setWallet(provider);
          setSigner(provider.getSigner());
          setAddress(null);
          setWrongChain(true);
          return;
        } else {
          setWallet(provider);
          setSigner(provider.getSigner());
          setAddress((await provider.listAccounts())[0]);
          setWrongChain(false);
        }
      });

      // Subscribe to provider connection
      instance.on('connect', async info => {
        console.log('connect', info);
        let provider = new ethers.providers.Web3Provider(instance);
        let chainId = (await provider.getNetwork()).chainId;
        // console.log('chainChanged', chainId);
        if (!(chainId === 137 || chainId === 80001 || chainId === 31337)) {
          askForMaticChain(provider);
          setWallet(provider);
          setSigner(provider.getSigner());
          setAddress(null);
          setWrongChain(true);
          return;
        } else {
          setWallet(provider);
          setSigner(provider.getSigner());
          setAddress((await provider.listAccounts())[0]);
          setWrongChain(false);
        }
      });
      // Subscribe to provider disconnection
      instance.on('disconnect', error => {
        console.log('disconnect', error);
        setWallet(null);
        setSigner(null);
      });
      let provider = new ethers.providers.Web3Provider(instance);
      let chainId = (await provider.getNetwork()).chainId;
      if (!(chainId === 137 || chainId === 80001 || chainId === 31337)) {
        askForMaticChain(provider);
        setWallet(provider);
        setSigner(provider.getSigner());
        setAddress(null);
        setWrongChain(true);
        return;
      } else {
        setWallet(provider);
        setSigner(provider.getSigner());
        setAddress((await provider.listAccounts())[0]);
        setWrongChain(false);
      }
    };
    newInstance();
  }, [instance]);
  return (
    <Context.Provider
      value={{
        wallet,
        signer,
        instance,
        setWallet,
        setInstance,
        wrongChain,
        address,
        askForMaticChain,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
