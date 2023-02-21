import { Modal, Box, Typography, Fade } from "@material-ui/core";
import { memo } from "react";

import { swapNetworks } from "./data";
import "./dex.scss";

function NetworkModal(props) {

  return (
    <Modal open={props.open} onClose={() => props.onClose(props.type, null)}>
      <Fade in={props.open}>
        <Box className="network-modal" padding="20px">
          <Box mb="20px">
            <Typography variant="h4" color="textSecondary">Select Network</Typography>
          </Box>
          <Box px="10px" height="600px" overflow="auto">
            {
              swapNetworks.map((network, index) => {
                return <Box display="flex" justifyContent="start" className="cursor-pointer" width="100%" alignItems="center" mb="20px" key={network.blockchain} onClick={() => props.onClose(props.type, network)}>
                  <Box width={40} mr="20px">
                    {network.logo}
                  </Box>
                  <Typography variant="h5" color="textSecondary">{network.name}</Typography>
                </Box>
              })
            }
          </Box>
          
        </Box>
      </Fade>
    </Modal>
  );
}

export default memo(NetworkModal);