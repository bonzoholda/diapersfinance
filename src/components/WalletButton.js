import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverFooter,
  useDisclosure,
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../utils/Context';
const WalletButton = () => {
  const {
    wallet,
    wrongChain,
    address,
    askForMaticChain,
    connectWallet,
    disconnectWallet,
  } = useContext(Context);
  const { isOpen, onToggle, onClose } = useDisclosure();
  return (
    <>
      {!wallet && !wrongChain && (
        <Button
          colorScheme="brand.orangebutton"
          color="white"
          zIndex={2}
          onClick={() => connectWallet()}
        >
          Connect Wallet
        </Button>
      )}
      {address && (
        <Popover isOpen={isOpen} onClose={onClose} placement="bottom">
          <PopoverTrigger>
            <Button
              colorScheme="brand.orangebutton"
              color="white"
              zIndex={2}
              onClick={onToggle}
            >
              {address.slice(0, 6) +
                '...' +
                address.slice(address.length - 4, address.length)}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>Do you want to disconnect your wallet ?</PopoverBody>
            <PopoverFooter
              border="0"
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button
                colorScheme="brand.orangebutton"
                color="white"
                onClick={() => {
                  disconnectWallet();
                }}
              >
                Yes
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      )}
      {wrongChain && (
        <Button
          colorScheme="red"
          bg="red"
          color="white"
          zIndex={2}
          onClick={() => askForMaticChain()}
        >
          Wrong chain
        </Button>
      )}
    </>
  );
};

export default WalletButton;
