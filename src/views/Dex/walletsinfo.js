import binance from './WalletImages/Binance.svg';
import clover from './WalletImages/Clover.jfif';
import coin98 from './WalletImages/Coin98.svg';
import coinbase from './WalletImages/Coinbase.svg';
import cosmostation from './WalletImages/Cosmostation.png';
import exdous from './WalletImages/Exdous.png';
import kepir from './WalletImages/Kepir.png';
import metamask from './WalletImages/Metamask.svg';
import okx from './WalletImages/Okx.png';
import phantom from './WalletImages/Phantom.svg';
import safepal from './WalletImages/SafePal.png';
import tokenpocket from './WalletImages/Tokenpocket.png';
import trustwallet from './WalletImages/TrustWallet.png';
import walletconnect from './WalletImages/WalletConnect.svg';
import xdefi from './WalletImages/XDefi.jfif';
import frontier from './WalletImages/Frontier.png';
import leap_cosmos from './WalletImages/leap_cosmos.png';
export const wallets = [
    {
        logo:metamask,
        name:"Metamask",
        status:"install",
        id: 0,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:walletconnect,
        name:"WallectConect",
        status:"disconnect",
        id: 1,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:binance,
        name:"Binance",
        status:"install",
        id: 2,
        evmSupport:["ETH", "BSC"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:trustwallet,
        name:"TrustWallet",
        status:"install",
        id: 3,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },   
    {
        logo:coin98,
        name:"Coin98",
        status:"install",
        id: 4,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:coinbase,
        name:"Coinbase",
        status:"install",
        id: 5,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:exdous,
        name:"Exdous",
        status:"install",
        id: 6,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo: frontier,
        name: "Frontier",
        status: "install",
        id: 7,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:clover,
        name:"Clover",
        status:"install",
        id: 8,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo: xdefi,
        name:"XDefi",
        status:"install",
        id: 9,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo: safepal,
        name:"Safepal",
        status:"install",
        id: 10,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:tokenpocket,
        name:"Tokenpocket",
        status:"install",
        id: 11,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:okx,
        name:"Okx",
        status:"install",
        id: 12,
        evmSupport:["ETH", "BSC", "POLYGON"],
        cosmosSupport:[],
        solanaSupport:[],
        utxoSupport: [],
    }, 
    {
        logo:cosmostation,
        name:"Cosmostation",
        status:"install",
        id: 13,
        evmSupport:[],
        cosmosSupport:["cosmos"],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:kepir,
        name:"keplr",
        status:"install",
        id: 14,
        evmSupport:[],
        cosmosSupport:["cosmos"],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo: leap_cosmos,
        name: 'leap',
        status: 'install',
        id: 15,
        evmSupport:[],
        cosmosSupport:["cosmos"],
        solanaSupport:[],
        utxoSupport: [],
    },
    {
        logo:phantom,
        name:"Phantom",
        status:"Not supported yet",
        id: 16,
        evmSupport:[],
        cosmosSupport:["cosmos"],
        solanaSupport:[],
        utxoSupport: [],
    },
]