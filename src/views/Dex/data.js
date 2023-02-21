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
    blockchain: 'ETH',
    name: 'ETH',
    chainId: 1,
    id: 'ethereum',
    logo: EthereumIcon,
  },
  {
    blockchain: 'BSC',
    name: 'BSC',
    chainId: 56,
    id: 'binance-smart-chain',
    logo: BscIcon,
  },
  {
    blockchain: 'FANTOM',
    name: 'FANTOM',
    chainId: 250,
    id: 'fantom',
    logo: FantomIcon,
  },
  {
    blockchain: 'AVAX_CCHAIN',
    name: 'AVALANCHE',
    chainId: 43114,
    id: 'avax_cchain',
    logo: AvalancheIcon,
  },
  {
    blockchain: 'POLYGON',
    name: 'POLYGON',
    chainId: 137,
    id: 'polygon',
    logo: PolygonIcon,
  },
  {
    blockchain: 'ARBITRUM',
    name: 'ARBITRUM',
    chainId: 42161,
    id: 'arbitrum',
    logo: ArbitrumIcon,
  },
  {
    blockchain: 'OPTIMISM',
    name: 'OPTIMISM',
    chainId: 10,
    id: 'optimism',
    logo: OptimismIcon,
  },
  
  {
    blockchain: 'HARMONY',
    name: 'HARMONY',
    chainId: 1666600000,
    id: 'harmony',
    logo: HarmonyIcon
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
    blockchain: 'BOBA',
    name: 'BOBA',
    chainId: 288,
    id: 'boba',
    logo: BobaIcon,
  },
  {
    blockchain: 'CRONOS',
    name: 'CRONOS',
    chainId: 25,
    id: 'cronos',
    logo: CronosIcon,
  },
  {
    blockchain: 'MOONRIVER',
    name: 'MOONRIVER',
    chainId: 1285,
    id: 'moonriver',
    logo: MoonriverIcon,
  },  
  {
    blockchain: 'AURORA',
    name: 'AURORA',
    chainId: 1313161554,
    id: 'aurora',
    logo: AuroraIcon,
  },
  {
    blockchain: 'HECO',
    name: 'HECO',
    chainId: 128,
    id: 'heco',
    logo: HecoIcon,
  },
  {
    blockchain: 'OKC',
    name: 'OKC',
    chainId: 66,
    id: 'okc',
    logo: OkcIcon,
  },
  {
    blockchain: 'EVMOS',
    name: 'EVMOS',
    chainId: 9001,
    id: 'evmos',
    logo: EvmosIcon,
  },
  {
    blockchain: 'MOONBEAM',
    name: 'MOONBEAM',
    chainId: 1284,
    id: 'moonbeam',
    logo: MoonbeamIcon,
  },
  // {
  //   blockchain: 'COSMOS',
  //   name: 'COSMOS',
  //   chainId: 'cosmoshub-4',
  //   id: 'cosmos',
  //   logo: CosmosIcon,
  // },
  // {
  //   blockchain: 'OSMOSIS',
  //   name: 'OSMOSIS',
  //   chainId: 'osmosis-1',
  //   id: 'osmosis',
  //   logo: OsmosisIcon,
  // },
  // {
  //   blockchain: 'BNB',
  //   name: 'Binance Chain',
  //   chainId: 'binance-chain-tigris',
  //   id: 'binance chain',
  //   logo: BscIcon,
  // },
  // {
  //   blockchain: 'JUNO',
  //   name: 'JUNO',
  //   chainId: 'juno-1',
  //   id: 'juno',
  //   logo: JunoIcon,
  // }
  
  
];

export const slippageList = [
  0.5, 1, 3, 5, 8, 13, 20
];
