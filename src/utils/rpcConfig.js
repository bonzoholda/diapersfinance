import { ethers } from 'ethers';

// 1. Daftar RPC Polygon Mainnet yang diurutkan berdasarkan prioritas.
// Tambahkan atau ubah RPC di sini secara terpusat!
export const POLYGON_RPC_URLS = [
  'https://polygon-bor-rpc.publicnode.com', // RPC Utama Anda
  'https://rpc.ankr.com/polygon',          // Cadangan 1
  'https://1rpc.io/matic',                 // Cadangan 2
  'https://polygon.meowrpc.com',           // Cadangan 3
];

// RPC tunggal default untuk library yang tidak mendukung array (seperti WalletConnect)
export const DEFAULT_POLYGON_RPC = POLYGON_RPC_URLS[0];

/**
 * Membuat FallbackProvider dari Ethers.js.
 * Jika RPC pertama error, Ethers.js akan mencoba RPC berikutnya secara otomatis.
 * 
 * @returns {ethers.providers.FallbackProvider}
 */
export const getFallbackProvider = () => {
  const providers = POLYGON_RPC_URLS.map((url, index) => {
    const staticProvider = new ethers.providers.StaticJsonRpcProvider(url, {
      chainId: 137,
      name: 'polygon',
    });

    return {
      provider: staticProvider,
      priority: index + 1, // Urutan prioritas (1 = paling utama)
      weight: 1,
      stallTimeout: 2000,  // Batas waktu tunggu (ms) sebelum beralih ke RPC berikutnya
    };
  });

  return new ethers.providers.FallbackProvider(providers, 1);
};
