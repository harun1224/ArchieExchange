import {useCallback, useContext, useMemo, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
} from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TimeLeftTimer from "./TimeLeftTimer";
import TabPanel from "../../components/TabPanel";
import {
  formatPercent,
  getOhmTokenImage,
  getRebaseBlock,
  getTokenImage,
  prettifySeconds,
  trim
} from "../../helpers";
import { changeApproval, changeClaim, changeStake } from "../../slices/StakeStakeThunk";
import "./stake30.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import {clearPendingTxn, isPendingTxn, txnButtonText} from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import {NavLink} from "react-router-dom";
import {value} from "lodash/seq";
import {prettyDOM} from "@testing-library/dom";
import {NetworkIds, networks} from "../../networks";
import {Lazy} from "../../slices/AppSlice";
import {getBalances, loadAccountDetails} from "../../slices/AccountSlice";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const sOhmImg = getTokenImage("sfhm");
const ohmImg = getOhmTokenImage(16, 16);

function Stake30Days() {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainId } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector(state => state.app.loading);
  const currentIndex = useSelector(state => {
    return state.app.currentIndex;
  });
  const totalHoldings = useSelector(state => {
    return trim(state.account.balances.totalHoldings, 2);
  });
  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const noFeeBlocks = useSelector(state => {
    return state.account.balances.noFeeBlocks;
  });
  const fiveDayRate = useSelector(state => {
    return state.app.fiveDayRate;
  });
  const thirtyDayRate = useSelector(state => {
    return state.app.thirtyDayRate;
  });
  const lastStakedBlock = useSelector(state => {
    return state.account.balances.lastStakedBlock;
  });
  const ohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const stakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.wsohmStake;
  });
  const unstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.ohmUnstake;
  });
  const needToClaim = useSelector(state => {
    return state.account.staking && state.account.staking.needToClaim;
  });
  const unstake30DayAllowance = useSelector(state => {
    return state.account.staking && state.account.balances.ohmThirtyDayStaked;
  });
  const stake30DayTotal = useSelector(state => {
    return state.account.staking && state.account.balances.ohmThirtyDayTotal;
  });
  const stake30DayClaimable = useSelector(state => {
    return state.account.staking && state.account.balances.ohmThirtyDayClaimable;
  });
  const wsfhmstakeAllowance = useSelector(state => {
    return state.account.staking && state.account.staking.wsohmStake;
  });

  const actualRewards = useSelector(state => {
    return state.app.actualRewards;
  });
  const thirtyDayTVL = useSelector(state => {
    return state.app.thirtyDayTVL;
  });
  const stakingAPY = useSelector(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector(state => {
    return state.app.stakingTVL;
  });
  const stakingRebase = useSelector(state => {
    return state.app.stakingRebase;
  });
  const stakingStakingAPY = useSelector(state => {
    return state.app.stakingStakingAPY;
  });
  const blocksPerSample = useSelector(state => {
    return state.app.blocksPerSample;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const rebasesPerDay = blocksPerSample ? 24 * 60 * 60 / (blocksPerSample * networks[chainId].blocktime) : 0;
  const thirtyDaysApy = rebasesPerDay ? Math.pow(1 + stakingRebase + (actualRewards / thirtyDayTVL), 365 * rebasesPerDay) - 1 : 0;

  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const thirtyDayRebasePercentage = thirtyDayTVL ? trim(actualRewards / thirtyDayTVL * 100, 4) : 0;

  const setMax = () => {
    if (view === 0) {
      setQuantity(wsohmBalance);
    } else {
      setQuantity(stake30DayTotal);
    }
  };

  const onSeekApproval = async token => {
    await dispatch(changeApproval({ address, token, provider, networkId: chainId }));
  };

  const onChangeStake = async action => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || Number(quantity) < 0 || quantity === "") {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }
    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, 18);
    if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(wsohmBalance, 18))) {
      return dispatch(error("You cannot stake more than your wsFHM balance."));
    }

    if (action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(stake30DayTotal, 18))) {
      return dispatch(error("You cannot unstake more than your sFHM balance."));
    }

    await dispatch(changeStake({ address, action, value: quantity.toString(), provider, networkId: chainId }));
    await Promise.all([
      await dispatch(getBalances({ address: address, networkId: chainId })),
      await dispatch(loadAccountDetails({ address: address, networkId: chainId }))
    ])

  };

  const onChangeClaim = async action => {
    await dispatch(changeClaim({ address, action, value: quantity.toString(), provider, networkId: chainId }));
    await Promise.all([
      await dispatch(getBalances({ address: address, networkId: chainId })),
      await dispatch(loadAccountDetails({ address: address, networkId: chainId }))
    ])
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "sfhm") return unstake30DayAllowance > 0;
      if (token === "wsfhm") return stakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);
  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      Connect Wallet
    </Button>,
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = (balance) => {
    // TODO show better next yield for wrapped token [sohmBalance, fsohmBalance, wsohmBalance]
    return Number(
        [balance]
            .filter(Boolean)
            .map(balance => Number(balance))
            .reduce((a, b) => a + b, 0)
            .toFixed(4)
    );
  }

  let wsFHM = [NetworkIds.FantomOpera, NetworkIds.FantomTestnet].indexOf(chainId) > -1 ? "fwsFHM" : "wsFHM";
  wsFHM = [NetworkIds.Moonriver, NetworkIds.MoonbaseAlpha].indexOf(chainId) > -1 ? "mwsFHM" : wsFHM;
  wsFHM = [NetworkIds.Ethereum, NetworkIds.Rinkeby].indexOf(chainId) > -1 ? "ewsFHM" : wsFHM;

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <div className="card-header">
                <Typography variant="h5">30-Days Stake (6,6)</Typography>
                <RebaseTimer />
                <div style={{marginBottom: "10px"}}/>
                <Typography variant="body1" style={{marginBottom: "5px"}}>Warmup period ends:</Typography><TimeLeftTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-top-metrics">
                <Grid container spacing={2} alignItems="flex-end">
                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <div className="stake-apy">
                      <Typography variant="h5" color="textSecondary">
                        APY
                      </Typography>
                      <Typography variant="h4">
                        {thirtyDaysApy ? formatPercent(thirtyDaysApy, 0) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <div className="stake-tvl">
                      <Typography variant="h5" color="textSecondary">
                        Total Value Deposited
                      </Typography>
                      <Typography variant="h4">
                        {thirtyDayTVL ? (
                          `${trim(thirtyDayTVL / 10**18, 4)} ${wsFHM}`
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <Paper className="ohm-card ohm-modal">
              { Number(wsohmBalance) === 0.0 ? (
                  <Grid container spacing={4}>
                    <Grid item xs={8}>
                      <Typography variant="body1" style={{ lineHeight: 1.5}}>You don't have any {wsFHM}. Stake and wrap your FHM before you can stake for 30-Days.</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Link component={NavLink} to={`/wrap`}>
                        <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                        >{txnButtonText(pendingTransactions, "staking", "Wrap sFHM")}
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                ) : (view === 0 ?
                    <Typography className="body1" style={{ lineHeight: 1.5 }}>Each time you stake your 30 day warm-up period resets. When you wait until the end of the warm-up period, you can withdraw without fees.</Typography>
                  : (view === 1 ?
                    <Typography className="body1" style={{ lineHeight: 1.5 }}>Your deposit is auto-compounding and it will be fully claimed when you unstake. If you are interested, you can up update your balance.  This is only so you can see how much is in your account. It is NOT necessary. Only for your peace of mind.</Typography>
                  : <Typography className="body1" style={{ lineHeight: 1.5 }}>If you withdraw {wsFHM} before the warm-up period ends, you will lose your rewards and 30% of the originally staked {wsFHM}.</Typography>
                  ))}
            </Paper>

            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">Connect your wallet to stake {wsFHM}</Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                    >
                      <Tab label="Stake" {...a11yProps(0)} />
                      <Tab label="Update" {...a11yProps(1)} />
                      <Tab label="Unstake" {...a11yProps(2)} />
                    </Tabs>

                    <Box className="stake-action-row " display="flex" alignItems="center">
                      {address && !isAllowanceDataLoading ? (
                        (!hasAllowance("wsfhm") && view === 0) || (!hasAllowance("wsfhm") && view === 2) ? (
                          <Box className="help-text">
                            <Typography variant="body1" className="stake-note" color="textSecondary">
                              {view === 0 ? (
                                <>
                                  First time staking <b>{wsFHM}</b>?
                                  <br />
                                  Please approve FantOHM to use your <b>{wsFHM}</b> for staking.
                                </>
                              ) : (
                                <>
                                  First time unstaking <b>{wsFHM}</b>?
                                  <br />
                                  Please approve FantOHM to use your <b>{wsFHM}</b> for unstaking.
                                </>
                              )}
                            </Typography>
                          </Box>
                        ) : (
                          <FormControl className="ohm-input" variant="outlined" color="primary">
                            <InputLabel htmlFor="amount-input"></InputLabel>
                            <OutlinedInput
                              id="amount-input"
                              type="number"
                              placeholder="Enter an amount"
                              className="stake-input"
                              value={quantity}
                              onChange={e => setQuantity(e.target.value)}
                              labelWidth={0}
                              disabled={view === 1}
                              endAdornment={
                                <InputAdornment position="end">
                                  <Button variant="text" onClick={setMax} color="inherit" disabled={view === 1}>
                                    Max
                                  </Button>
                                </InputAdornment>
                              }
                            />
                          </FormControl>
                        )
                      ) : (
                        <Skeleton width="150px" />
                      )}

                      <TabPanel value={view} index={0} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("wsfhm") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "staking")}
                            onClick={() => {
                              onChangeStake("stake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "staking", "Stake 30-Days")}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                            onClick={() => {
                              onSeekApproval("wsfhm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_staking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                      <TabPanel value={view} index={1} className="stake-tab-panel">
                            <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "claiming")}
                                onClick={() => {
                                  onChangeClaim("claim");
                                }}
                            >
                              {txnButtonText(pendingTransactions, "claiming", "Update")}
                            </Button>

                      </TabPanel>
                      <TabPanel value={view} index={2} className="stake-tab-panel">
                        {isAllowanceDataLoading ? (
                          <Skeleton />
                        ) : address && hasAllowance("wsfhm") ? (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "unstaking")}
                            onClick={() => {
                              onChangeStake("unstake");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "unstaking", `Unstake ${wsFHM}`)}
                          </Button>
                        ) : (
                          <Button
                            className="stake-button"
                            variant="contained"
                            color="primary"
                            disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                            onClick={() => {
                              onSeekApproval("wsfhm");
                            }}
                          >
                            {txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}
                          </Button>
                        )}
                      </TabPanel>
                    </Box>
                  </Box>

                  <div className={`stake-user-data`}>

                    <div className="data-row">
                      <Typography variant="body1">Your {wsFHM} Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(wsohmBalance, 9)} {wsFHM}</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">Staked Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(stake30DayTotal, 9)} {wsFHM}</>}
                      </Typography>
                    </div>

                    {(needToClaim) ? (
                        <div className="data-row">
                          <Typography variant="body1"></Typography>
                          <Button
                              className="claim-button"
                              variant="contained"
                              color="primary"
                              disabled={isPendingTxn(pendingTransactions, "claim")}
                              onClick={() => {
                                onChangeClaim("claim");
                              }}
                          >
                            {txnButtonText(pendingTransactions, "claim", `Claim ${wsFHM}`)}
                          </Button>
                        </div>
                    ) : <></>
                    }
                    {((stake30DayClaimable && stake30DayTotal) && (stake30DayClaimable < stake30DayTotal)) ? (
                    <div className="data-row">
                      <Typography variant="body1">Withdrawable Balance</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(stake30DayClaimable, 9)} {wsFHM}</>}
                      </Typography>
                    </div>
                      ) : <></>
                    }

                    <div className="data-row">
                      <Typography variant="body1">Next Reward Yield (3,3)</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">Next Reward Yield (6,6)</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{thirtyDayRebasePercentage}%</>}
                      </Typography>
                    </div>

                    <div className="data-row">
                      <Typography variant="body1">ROI (30-Day Rate) (3,3 + 6,6)</Typography>
                      <Typography variant="body1">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{formatPercent(thirtyDayRate, 0)}</>}
                      </Typography>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}

export default Stake30Days;
