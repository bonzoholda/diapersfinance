import { useState, useEffect, createContext } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const Context = createContext();

// Menggunakan RPC publik yang lebih stabil atau URL Alchemy/Infura Anda
const POLYGON_RPC_URL = 'https://polygon-rpc.com';

const web3Modal = new Web3Modal({
  cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: {
          137: POLYGON_RPC_URL,
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

  const askForMaticChain = (provider) => {
    provider.provider.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x89', // Hexadecimal untuk chain ID 137
          chainName: 'Polygon Mainnet',
          rpcUrls: [
            POLYGON_RPC_URL,
            'https://rpc-mainnet.maticvigil.com',
            'https://rpc.ankr.com/polygon',
          ],
          nativeCurrency: {
            name: 'POL', // Catatan: Polygon berpindah nama simbol dari MATIC ke POL
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
      const modalInstance = await web3Modal.connect();
      setInstance(modalInstance);
    } catch (error) {
      console.error('Gagal menghubungkan wallet:', error);
    }
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
    const handleProviderSetup = async () => {
      if (!instance || !instance.on) return;

      const provider = new ethers.providers.Web3Provider(instance);

      const setupNetworkAndAccount = async () => {
        try {
          const network = await provider.getNetwork();
          const chainId = network.chainId;

          if (!(chainId === 137 || chainId === 80001 || chainId === 31337)) {
            askForMaticChain(provider);
            setWallet(provider);
            setSigner(provider.getSigner());
            setAddress(null);
            setWrongChain(true);
            return;
          }

          const accounts = await provider.listAccounts();
          setWallet(provider);
          setSigner(provider.getSigner());
          setAddress(accounts[0] || null);
          setWrongChain(false);
        } catch (error) {
          console.error('Error saat setup provider:', error);
        }
      };

      // Event listener
      instance.on('accountsChanged', (accounts) => {
        console.log('accountsChanged', accounts);
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setupNetworkAndAccount();
        }
      });

      instance.on('chainChanged', () => {
        console.log('chainChanged');
        setupNetworkAndAccount();
      });

      instance.on('connect', (info) => {
        console.log('connect', info);
        setupNetworkAndAccount();
      });

      instance.on('disconnect', (error) => {
        console.log('disconnect', error);
        setWallet(null);
        setSigner(null);
      });

      // Jalankan pertama kali saat instance tersedia
      await setupNetworkAndAccount();
    };

    handleProviderSetup();
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
