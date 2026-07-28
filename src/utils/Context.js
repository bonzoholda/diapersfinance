import { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

// 1. Impor konfigurasi terpusat dari rpcConfig.js
import { DEFAULT_POLYGON_RPC, POLYGON_RPC_URLS, getFallbackProvider } from './rpcConfig';

export const Context = createContext();

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          137: DEFAULT_POLYGON_RPC, // Menggunakan RPC terpusat
        },
        supportedChainIds: [137],
      },
    },
  },
});

const ContextProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [instance, setInstance] = useState(null);
  const [signer, setSigner] = useState(null);
  const [wrongChain, setWrongChain] = useState(false);
  const [address, setAddress] = useState('');

  // Fallback provider terpusat untuk operasi read-only
  const readOnlyProvider = getFallbackProvider();

  const askForMaticChain = (provider) => {
    provider.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x89',
          chainName: 'Polygon Mainnet',
          // Memberikan seluruh array RPC ke wallet agar MetaMask punya cadangan RPC
          rpcUrls: POLYGON_RPC_URLS,
          nativeCurrency: {
            name: 'POL',
            symbol: 'POL',
            decimals: 18,
          },
          blockExplorerUrls: ['https://polygonscan.com/'],
        },
      ],
    });
  };

  const connectWallet = async () => {
    try {
      setInstance(await web3Modal.connect());
    } catch (error) {
      console.error('Gagal connect wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    setWallet(null);
    setSigner(null);
    setAddress('');
    setWrongChain(false);
    web3Modal.clearCachedProvider();
    window.location.reload(false);
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    const handleSetup = async () => {
      if (!instance || !instance.on) return;

      const provider = new ethers.providers.Web3Provider(instance);

      const checkNetworkAndAccount = async () => {
        try {
          const chainId = (await provider.getNetwork()).chainId;

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
          const accounts = await provider.listAccounts();
          setAddress(accounts[0] || '');
          setWrongChain(false);
        } catch (error) {
          console.error('Error saat verifikasi provider:', error);
        }
      };

      instance.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkNetworkAndAccount();
        }
      });

      instance.on('chainChanged', () => {
        checkNetworkAndAccount();
      });

      instance.on('connect', () => {
        checkNetworkAndAccount();
      });

      instance.on('disconnect', () => {
        setWallet(null);
        setSigner(null);
      });

      await checkNetworkAndAccount();
    };

    handleSetup();
  }, [instance]);

  return (
    <Context.Provider
      value={{
        wallet,
        signer,
        instance,
        readOnlyProvider, // Diexport untuk pemanggilan read-only contract
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
