// import {ReactComponent as FantomIcon} from "src/assets/networks/fantom_icon.svg";
// import {ReactComponent as EthereumIcon} from "src/assets/networks/ethereum_icon.svg";
// import {ReactComponent as BscIcon} from "src/assets/networks/bsc_icon.svg";
// import {ReactComponent as AvalancheIcon} from "src/assets/networks/avalanche_icon.svg";
// import {ReactComponent as PolygonIcon} from "src/assets/networks/polygon_icon.svg";
// import {ReactComponent as HarmonyIcon} from "src/assets/networks/harmony_icon.svg";
// import {ReactComponent as ArbitrumIcon} from "src/assets/networks/arbitrum_icon.svg";
// import {ReactComponent as OptimismIcon} from "src/assets/networks/optimism_icon.svg";
// import {ReactComponent as FuseIcon} from "src/assets/networks/fuse_icon.svg";
// import {ReactComponent as GnosisIcon} from "src/assets/networks/gnosis_icon.svg";
// import {ReactComponent as BobaIcon} from "src/assets/networks/boba_icon.svg";
// import {ReactComponent as CronosIcon} from "src/assets/networks/cronos_icon.svg";
// import {ReactComponent as MoonriverIcon} from "src/assets/networks/moonriver_icon.svg";
// import {ReactComponent as MoonbeamIcon} from "src/assets/networks/moonbeam_icon.svg";
// import {ReactComponent as AuroraIcon} from "src/assets/networks/aurora_icon.svg";
// import {ReactComponent as HecoIcon} from "src/assets/networks/heco_icon.svg";
// import {ReactComponent as OkcIcon} from "src/assets/networks/okc_icon.svg";
// import {ReactComponent as EvmosIcon} from 'src/assets/networks/evmos_icon.svg'; 
// import {ReactComponent as CosmosIcon} from 'src/assets/networks/cosmos_icon.svg';
// import {ReactComponent as OsmosisIcon} from 'src/assets/networks/osmosis_icon.svg';
// import {ReactComponent as JunoIcon} from 'src/assets/networks/juno_icon.svg';
// import MoonbeamIcon from "src/components/moobeamlogo";
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
  },
  {
    blockchain: 'ARBITRUM',
    name: 'ARBITRUM',
    chainId: 42161,
    id: 'arbitrum',
    logo: ArbitrumIcon,
  },
  {
    blockchain: 'AURORA',
    name: 'AURORA',
    chainId: 1313161554,
    id: 'aurora',
    logo: AuroraIcon,
  },
  {
    blockchain: 'AVAX_CCHAIN',
    name: 'AVALANCHE',
    chainId: 43114,
    id: 'avax_cchain',
    logo: AvalancheIcon,
  },
  {
    blockchain: "BANDCHAIN",
    name: "BandChain",
    chainId: "injective-1",
    id: "bandchain",
    logo: BandchainIcon,
  },
  {
    blockchain: 'BITCANNA',
    name: 'Bitcanna',
    chainId: 'bitcanna-1',
    id: 'bitcanna',
    logo: BitcannaIcon
  },
  {
    blockchain: 'BOBA',
    name: 'BOBA',
    chainId: 288,
    id: 'boba',
    logo: BobaIcon,
  },
  {
    blockchain: 'BNB',
    name: 'Binance Chain',
    chainId: 'binance-chain-tigris',
    id: 'binance chain',
    logo: BscIcon,
  },
  {
    blockchain: 'BSC',
    name: 'BSC',
    chainId: 56,
    id: 'binance-smart-chain',
    logo: BscIcon,
  },
  {
    blockchain: "CHIHUAHUA",
    name: "Chihuahua",
    chainId: "chihuahua-1",
    id: "chihuahua",
    logo: ChihuahuaIcon,
  },
  {
    blockchain: 'COMDEX',
    name: 'COMDEX',
    chainId:'comdex-1',
    id: 'comdex',
    logo: ComdexIcon
  },
  {
    blockchain: 'COSMOS',
    name: 'COSMOS',
    chainId: 'cosmoshub-4',
    id: 'cosmos',
    logo: CosmosIcon,
  },
  {
    blockchain: 'CRYPTO_ORG',
    name: 'Crypto.org',
    chainId: 'crypto-org-chain-mainnet-1',
    id: 'crypto.org',
    logo: Crypto_orgIcon

  },
  {
    blockchain: 'CRONOS',
    name: 'CRONOS',
    chainId: 25,
    id: 'cronos',
    logo: CronosIcon,
  },
  {
    blockchain: 'DESMOS',
    name: 'Desmos',
    chainId: 'desmos-mainnet',
    id: 'desmos',
    logo: DesmosIcon
  },
  {
    blockchain: 'EMONEY',
    name: 'e-money',
    chainId: 'emoney-3',
    id: 'e-money',
    logo: E_moneyIcon,
  },
  {
    blockchain: 'ETH',
    name: 'ETH',
    chainId: 1,
    id: 'ethereum',
    logo: EthereumIcon,
  },
  {
    blockchain: 'EVMOS',
    name: 'EVMOS',
    chainId: 9001,
    id: 'evmos',
    logo: EvmosIcon,
  },  
  {
    blockchain: 'FANTOM',
    name: 'FANTOM',
    chainId: 250,
    id: 'fantom',
    logo: FantomIcon,
  },
  {
    blockchain: 'FUSE',
    name: 'FUSE',
    chainId: 122,
    id: 'fuse',
    logo: FuseIcon,
  },
  {
    blockchain: 'GNOSIS',
    name: 'GNOSIS',
    chainId: 100,
    id: 'gnosis',
    logo: GnosisIcon,
  },
  {
    blockchain: 'HARMONY',
    name: 'HARMONY',
    chainId: 1666600000,
    id: 'harmony',
    logo: HarmonyIcon
  },
  {
    blockchain: 'HECO',
    name: 'HECO',
    chainId: 128,
    id: 'heco',
    logo: HecoIcon,
  },
  {
    blockchain: "IRIS",
    name: "IRISnet",
    chainId: "irishub-1",
    id: "irisnet",
    logo: IrisnetIcon,

  },
  {
    blockchain: 'JUNO',
    name: 'JUNO',
    chainId: 'juno-1',
    id: 'juno',
    logo: JunoIcon,
  },
  {
    blockchain: 'KI',
    name: 'KI',
    chainId: 'Kichain-2',
    id: 'ki',
    logo: KiIcon,
  },
  {
    blockchain: 'KUJIRA',
    name: 'KUJIRA',
    chainId: 'kaiyo-1',
    id: 'kujira',
    logo: KujiraIcon
  },
  {
    blockchain: 'LUMNETWORK',
    name: 'Lum Network',
    chainId: 'lum-network-1',
    id: 'lumnetwork',
    logo: Lum_networkIcon
  },
  {
    blockchain: 'MOONBEAM',
    name: 'MOONBEAM',
    chainId: 1284,
    id: 'moonbeam',
    logo: MoonbeamIcon,
  },
  {
    blockchain: 'MOONRIVER',
    name: 'MOONRIVER',
    chainId: 1285,
    id: 'moonriver',
    logo: MoonriverIcon,
  },   
  {
    blockchain: 'OKC',
    name: 'OKC',
    chainId: 66,
    id: 'okc',
    logo: OkcIcon,
  },
  {
    blockchain: 'OPTIMISM',
    name: 'OPTIMISM',
    chainId: 10,
    id: 'optimism',
    logo: OptimismIcon,
  },
  {
    blockchain: 'OSMOSIS',
    name: 'OSMOSIS',
    chainId: 'osmosis-1',
    id: 'osmosis',
    logo: OsmosisIcon,
  },
  {
    blockchain: 'PERSISTENCE',
    name: 'PERSISTENCE',
    chainId: 'core-1',
    id: 'persistence',
    logo: PersistenceIcon
  },
  {
    blockchain: 'POLYGON',
    name: 'POLYGON',
    chainId: 137,
    id: 'polygon',
    logo: PolygonIcon,
  },
  {
    blockchain: 'REGEN',
    name:'Regen Network',
    chainId: 'regen-1',
    id: 'regen',
    logo: Regen_networkIcon
  },
  {
    blockchain: 'SENTINEL',
    name: 'Sentinel',
    chainId: 'sentinelhub-2',
    id: 'sentinel',
    logo: SentinelIcon
  },
  {
    blockchain: "STARGAZE",
    name: "Stargaze",
    chainId: "stargaze-1",
    id: "stargaze",
    logo: StargazeIcon,
  },
  {
    blockchain: "STARNAME",
    name: "Starname",
    chainId: "iov-mainnet-ibc",
    id: "starname",
    logo: StarnameIcon, 
  },
  {
    blockchain: 'UMEE',
    name: 'Umee',
    chainId: 'umee-1',
    id: 'umee',
    logo: UmeeIcon
  },
  {
    blockchain: 'THOR',
    name: 'Thorchain',
    chainId: '',
    id: 'thorchain',
    logo: ThorChainIcon
  },  
//   {
//     blockchain: "BTC",
//     name: "Bitcoin",
//     chainId: "",
//     id: "btc",
//     logo: BtcIcon,
//   }, 
//   {
//     blockchain: 'LTC',
//     name: 'Litecoin',
//     chainId: '',
//     id: 'litecoin',
//     logo: LitecoinIcon
//   },
//   {
//     blockchain: 'BCH',
//     name: 'Bitcoin Cash',
//     chainId: '',
//     id: 'bch',
//     logo: BitcoinCashIcon
//   },
//   {
//     blockchain: 'SOLANA',
//     name: 'Solana',
//     chainId: 'SOLANA',
//     id: 'solana',
//     logo: SolanaIcon
//   }
];

export const slippageList = [
  0.5, 1, 3, 5, 8, 13, 20
];
