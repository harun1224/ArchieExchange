import { useSelector, useDispatch } from "react-redux";
import { secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box, Link, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useMemo, useState } from "react";
import { useWeb3Context } from "../../hooks/web3Context";

function TimeLeftTimer() {
    const dispatch = useDispatch();
    const { provider, staticProviders, chainId } = useWeb3Context();

    const SECONDS_TO_REFRESH = 60;
    const [secondsToStake, setSecondsToStake] = useState(0);
    const [stakeString, setStakeString] = useState("");
    const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

    const currentBlock = useSelector(state => {
        return state.app.currentBlock;
    });

    const noFeeBlocks = useSelector(state => {
        return state.account.balances.noFeeBlocks;
    });

    const lastStakedBlock = useSelector(state => {
        return state.account.balances.lastStakedBlock;
    });

    function initializeTimer() {
        const seconds = secondsUntilBlock(chainId, currentBlock, (Number(lastStakedBlock) + Number(noFeeBlocks)));
        const prettified = prettifySeconds(seconds);
        setSecondsToStake(seconds);
        setStakeString(prettified !== "" ? prettified : "Less than a minute");
    }

    // This initializes secondsToStake as soon as currentBlock becomes available
    useMemo(() => {
        if (currentBlock && lastStakedBlock && noFeeBlocks) {
            initializeTimer();
        }
    }, [currentBlock, lastStakedBlock, noFeeBlocks]);

    // After every period SECONDS_TO_REFRESH, decrement secondsToStake by SECONDS_TO_REFRESH,
    // keeping the display up to date without requiring an on chain request to update currentBlock.
    useEffect(() => {
        let interval = null;

        if (secondsToRefresh > 0) {
            interval = setInterval(() => {
                setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
            }, 1000);
        } else {
            // When the countdown goes negative, reload the app details and reinitialize the timer
            if (secondsToStake < 0) {
                setStakeString("-");
            } else {
                clearInterval(interval);
                setSecondsToStake(secondsToStake => secondsToStake - SECONDS_TO_REFRESH);
                setSecondsToRefresh(SECONDS_TO_REFRESH);
                const prettified = prettifySeconds(secondsToStake);
                setStakeString(prettified !== "" ? prettified : "Less than a minute");
            }
        }
        return () => clearInterval(interval);
    }, [secondsToStake, secondsToRefresh]);

    return (
        <Box>
            <Typography variant="body1">
                {stakeString ? (
                    secondsToStake > 0 ? (
                        <>
                            ~{stakeString}
                        </>
                    ) : (
                        <>-</>
                    )
                ) : (
                    <Skeleton width="155px" />
                )}
            </Typography>
        </Box>
    );
}

export default TimeLeftTimer;
