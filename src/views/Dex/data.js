
import EthereumIcon from '../../assets/network_logo/eth.svg'
import FantomIcon from '../../assets/network_logo/fantom.png'
import BscIcon from '../../assets/network_logo/bsc.svg'
import AvalancheIcon from '../../assets/network_logo/avalanche.svg'
import PolygonIcon from '../../assets/network_logo/polygon.svg'
import ArbitrumIcon from '../../assets/network_logo/abitrum.svg'
import OptimismIcon from '../../assets/network_logo/optimism.svg'
import HarmonyIcon from '../../assets/network_logo/harmony.svg'
import FuseIcon from '../../assets/network_logo/fuse.png'
import GnosisIcon from '../../assets/network_logo/gnosis.svg'
import BobaIcon from '../../assets/network_logo/boba.png'
import CronosIcon from '../../assets/network_logo/cronos.svg'
import MoonriverIcon from '../../assets/network_logo/moonriver.svg'
import AuroraIcon from '../../assets/network_logo/aurora.svg'
import HecoIcon from '../../assets/network_logo/heco.png'
import OkcIcon from '../../assets/network_logo/okx.png'
import EvmosIcon from '../../assets/network_logo/evmos.png'
import MoonbeamIcon from '../../assets/network_logo/moonbeam.png'
import CosmosIcon from '../../assets/network_logo/cosmos.svg'
import OsmosisIcon from '../../assets/network_logo/osmosis.svg'
import JunoIcon from '../../assets/network_logo/juno.svg'
import AkashIcon from '../../assets/network_logo/akash.svg'
import StargazeIcon from '../../assets/network_logo/stargaze.png'
import ChihuahuaIcon from '../../assets/network_logo/chihuahua.png'
import BandchainIcon from '../../assets/network_logo/bandchain.svg'
import BtcIcon from '../../assets/network_logo/btc.svg'
import IrisnetIcon from '../../assets/network_logo/iris.png'
import StarnameIcon from '../../assets/network_logo/starname.png'
import KiIcon from '../../assets/network_logo/ki.png'
import KujiraIcon from '../../assets/network_logo/kuji.svg'
import PersistenceIcon from '../../assets/network_logo/persistence.png'
import Crypto_orgIcon from '../../assets/network_logo/crypto_org.png'
import ComdexIcon from '../../assets/network_logo/comdex.svg'
import Regen_networkIcon from '../../assets/network_logo/regen.png'
import E_moneyIcon from '../../assets/network_logo/emoney.svg'
import SentinelIcon from '../../assets/network_logo/sentinel.png'
import UmeeIcon from '../../assets/network_logo/umee.svg'
import BitcannaIcon from '../../assets/network_logo/bitcanna.svg'
import DesmosIcon from '../../assets/network_logo/desmos.svg'
import Lum_networkIcon from '../../assets/network_logo/lumnetwork.svg'
import ThorChainIcon from '../../assets/network_logo/thorchain.svg'
import LitecoinIcon from '../../assets/network_logo/ltc.svg'
import BitcoinCashIcon from '../../assets/network_logo/bch.svg'
import SolanaIcon from '../../assets/network_logo/solana.svg'
import KccIcon from '../../assets/network_logo/kcc.png'
import MarsIcon from '../../assets/network_logo/mars.svg'
import StrideIcon from '../../assets/network_logo/stride.svg'
import TerraIcon from '../../assets/network_logo/terra.png'
export const modalType = {
  from: "from",
  to: "to",
  bond: "bond"
};



export const bondActionType = {
  deposit: "deposit",
  approve: "approve",
};

export const swapNetworks = [
  {
    blockchain: "AKASH",
    name: "Akash",
    chainId: "akashnet-2",
    id: "akash",
    logo: AkashIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'ARBITRUM',
    name: 'ARBITRUM',
    chainId: 42161,
    id: 'arbitrum',
    logo: ArbitrumIcon,
    type: "EVM",
  },
  {
    blockchain: 'AURORA',
    name: 'AURORA',
    chainId: 1313161554,
    id: 'aurora',
    logo: AuroraIcon,
    type: "EVM",

  },
  {
    blockchain: 'AVAX_CCHAIN',
    name: 'AVALANCHE',
    chainId: 43114,
    id: 'avax_cchain',
    logo: AvalancheIcon,
    type: "EVM",

  },
  {
    blockchain: "BANDCHAIN",
    name: "BandChain",
    chainId: "injective-1",
    id: "bandchain",
    logo: BandchainIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'BITCANNA',
    name: 'Bitcanna',
    chainId: 'bitcanna-1',
    id: 'bitcanna',
    logo: BitcannaIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'BOBA',
    name: 'BOBA',
    chainId: 288,
    id: 'boba',
    logo: BobaIcon,
    type: "EVM",

  },
  {
    blockchain: 'BNB',
    name: 'Binance Chain',
    chainId: 'binance-chain-tigris',
    id: 'binance chain',
    logo: BscIcon,
    type: "COSMOS",

  },
  {
    blockchain: 'BSC',
    name: 'BSC',
    chainId: 56,
    id: 'binance-smart-chain',
    logo: BscIcon,
    type: "EVM",

  },
  {
    blockchain: "CHIHUAHUA",
    name: "Chihuahua",
    chainId: "chihuahua-1",
    id: "chihuahua",
    logo: ChihuahuaIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'COMDEX',
    name: 'COMDEX',
    chainId:'comdex-1',
    id: 'comdex',
    logo: ComdexIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'COSMOS',
    name: 'COSMOS',
    chainId: 'cosmoshub-4',
    id: 'cosmos',
    logo: CosmosIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'CRYPTO_ORG',
    name: 'Crypto.org',
    chainId: 'crypto-org-chain-mainnet-1',
    id: 'crypto.org',
    logo: Crypto_orgIcon,
    type: "COSMOS",

  },
  {
    blockchain: 'CRONOS',
    name: 'CRONOS',
    chainId: 25,
    id: 'cronos',
    logo: CronosIcon,
    type: "EVM",

  },
  {
    blockchain: 'DESMOS',
    name: 'Desmos',
    chainId: 'desmos-mainnet',
    id: 'desmos',
    logo: DesmosIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'EMONEY',
    name: 'e-money',
    chainId: 'emoney-3',
    id: 'e-money',
    logo: E_moneyIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'ETH',
    name: 'ETH',
    chainId: 1,
    id: 'ethereum',
    logo: EthereumIcon,
    type: "EVM",

  
  },
  {
    blockchain: 'EVMOS',
    name: 'EVMOS',
    chainId: 9001,
    id: 'evmos',
    logo: EvmosIcon,
    type: "EVM",

  },  
  {
    blockchain: 'FANTOM',
    name: 'FANTOM',
    chainId: 250,
    id: 'fantom',
    logo: FantomIcon,
    type: "EVM",

  },
  {
    blockchain: 'FUSE',
    name: 'FUSE',
    chainId: 122,
    id: 'fuse',
    logo: FuseIcon,
    type: "EVM",

  },
  {
    blockchain: 'GNOSIS',
    name: 'GNOSIS',
    chainId: 100,
    id: 'gnosis',
    logo: GnosisIcon,
    type: "EVM",

  },
  {
    blockchain: 'HARMONY',
    name: 'HARMONY',
    chainId: 1666600000,
    id: 'harmony',
    logo: HarmonyIcon,
    type: "EVM",

  },
  {
    blockchain: 'HECO',
    name: 'HECO',
    chainId: 128,
    id: 'heco',
    logo: HecoIcon,
    type: "EVM",

  },
  {
    blockchain: "IRIS",
    name: "IRISnet",
    chainId: "irishub-1",
    id: "irisnet",
    logo: IrisnetIcon,
    type: "COSMOS",

  },
  {
    blockchain: 'JUNO',
    name: 'JUNO',
    chainId: 'juno-1',
    id: 'juno',
    logo: JunoIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'KI',
    name: 'KI',
    chainId: 'Kichain-2',
    id: 'ki',
    logo: KiIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'KUJIRA',
    name: 'KUJIRA',
    chainId: 'kaiyo-1',
    id: 'kujira',
    logo: KujiraIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'LUMNETWORK',
    name: 'Lum Network',
    chainId: 'lum-network-1',
    id: 'lumnetwork',
    logo: Lum_networkIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'MOONBEAM',
    name: 'MOONBEAM',
    chainId: 1284,
    id: 'moonbeam',
    logo: MoonbeamIcon,
    type: "EVM",

  },
  {
    blockchain: 'MOONRIVER',
    name: 'MOONRIVER',
    chainId: 1285,
    id: 'moonriver',
    logo: MoonriverIcon,
    type: "EVM",

  },   
  {
    blockchain: 'OKC',
    name: 'OKC',
    chainId: 66,
    id: 'okc',
    logo: OkcIcon,
    type: "EVM",

  },
  {
    blockchain: 'OPTIMISM',
    name: 'OPTIMISM',
    chainId: 10,
    id: 'optimism',
    logo: OptimismIcon,
    type: "EVM",

  },
  {
    blockchain: 'OSMOSIS',
    name: 'OSMOSIS',
    chainId: 'osmosis-1',
    id: 'osmosis',
    logo: OsmosisIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'PERSISTENCE',
    name: 'PERSISTENCE',
    chainId: 'core-1',
    id: 'persistence',
    logo: PersistenceIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'POLYGON',
    name: 'POLYGON',
    chainId: 137,
    id: 'polygon',
    logo: PolygonIcon,
    type: "EVM",

  },
  {
    blockchain: 'REGEN',
    name:'Regen Network',
    chainId: 'regen-1',
    id: 'regen',
    logo: Regen_networkIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'SENTINEL',
    name: 'Sentinel',
    chainId: 'sentinelhub-2',
    id: 'sentinel',
    logo: SentinelIcon,
    type: "COSMOS",
  },
  {
    blockchain: "STARGAZE",
    name: "Stargaze",
    chainId: "stargaze-1",
    id: "stargaze",
    logo: StargazeIcon,
    type: "COSMOS",
  },
  {
    blockchain: "STARNAME",
    name: "Starname",
    chainId: "iov-mainnet-ibc",
    id: "starname",
    logo: StarnameIcon, 
    type: "COSMOS",
  },
  {
    blockchain: 'UMEE',
    name: 'Umee',
    chainId: 'umee-1',
    id: 'umee',
    logo: UmeeIcon,
    type: "COSMOS",
  },
  {
    blockchain: 'THOR',
    name: 'Thorchain',
    chainId: '',
    id: 'thorchain',
    logo: ThorChainIcon,
    type: "COSMOS",
  },
  {
    blockchain: "TERRA",
    name: 'Terra',
    chainId: 'columbus-5',
    logo: TerraIcon,
    type: 'COSMOS'
  },
  {
    blockchain: "MARS",
    name: 'Mars',
    chainId: 'mars-1',
    logo: MarsIcon,
    type: 'COSMOS'
  },
  {
    blockchain: "KCC",
    name: 'Kcc',
    chainId: 321,
    logo: KccIcon,
    type: 'EVM'
  },
  {
    blockchain: "STRIDE",
    name: 'Stride',
    chainId: 'stride-1',
    logo: StrideIcon,
    type: 'COSMOS'
  },
  // {
  //   blockchain: "SIF",
  //   name: 'Sifechain',
  //   chainId: 'sifchain-1',
  //   logo: StrideIcon,
  //   type: 'COSMOS'
  // },
  {
    blockchain: "BTC",
    name: "Bitcoin",
    chainId: "",
    id: "btc",
    logo: BtcIcon,
  }, 
  {
    blockchain: 'LTC',
    name: 'Litecoin',
    chainId: '',
    id: 'litecoin',
    logo: LitecoinIcon
  },
  {
    blockchain: 'BCH',
    name: 'Bitcoin Cash',
    chainId: '',
    id: 'bch',
    logo: BitcoinCashIcon
  },
  {
    blockchain: 'SOLANA',
    name: 'Solana',
    chainId: 'SOLANA',
    id: 'solana',
    logo: SolanaIcon
  }
];

export const slippageList = [
  0.5, 1, 3, 5, 8, 13, 20
];
