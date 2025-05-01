import {
  Heading,
  Divider,
  HStack,
  NumberInput,
  NumberInputField,
  InputRightElement,
  Button,
  Text,
  IconButton,
  Icon,
  useBoolean,
  Flex,
  Skeleton,
  Box,
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import numeral from 'numeral';
import { buyGoldenShit } from '../utils/MaticHelper';
import { Context } from '../utils/Context';
import { ethers, utils } from 'ethers';
import { GoPlus, GoDash } from 'react-icons/go';
let formatter3 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});
let formatter12 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 12,
});
const GOLDBuyer = ({
  data,
  stats,
  MATICPrice,
  WYPEPrice,
  MATICBalance,
  loading,
  loadingStats,
  refreshData,
  refreshPoolBalanceAndCirculatingSupply,
  refreshPriceAndPoolBalanceWYPE,
  successToast,
  infoToast,
  errorToast,
}) => {
  const [buyAmount, setBuyAmount] = useState(1);
  const [loadingTX, setLoadingTX] = useState(false);
  const { goldenShitPrice } = stats;
  const { signer, address } = useContext(Context);
  return (
    <Flex
      rounded={20}
      px={6}
      py={3}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      position="relative"
      zIndex={10}
    >
      <Text fontWeight="semibold" as="span">
        Buy Golden Shits
      </Text>
      <HStack spacing={5} mt={2}>
        <IconButton
          // mt={2}
          // mb={3}
          onClick={() => {
            if (buyAmount > 1) {
              setBuyAmount(buyAmount - 1);
            }
          }}
          variant="solid"
          colorScheme="brand.orangebutton"
          icon={<Icon as={GoDash} color="white" w={6} h={6} />}
        />
        <NumberInput
          value={buyAmount}
          onChange={value => {
            if (parseFloat(value) > 0) {
              setBuyAmount(parseFloat(value));
            } else {
              setBuyAmount(parseFloat(1));
            }
          }}
        >
          <NumberInputField
            bg="gray.200"
            fontWeight="semibold"
            color="brand.purple"
            textAlign="center"
            w="60px"
            p={0}
          />
        </NumberInput>
        <IconButton
          // mt={2}
          // mb={3}
          onClick={() => {
            setBuyAmount(buyAmount + 1);
          }}
          variant="solid"
          colorScheme="brand.orangebutton"
          icon={<Icon as={GoPlus} color="white" w={6} h={6} />}
        />
      </HStack>
      <Flex w="100%" justifyContent="flex-end" mt={2}>
        <Text color="gray.400" as="span">
          <HStack>
            <Text as="span">Your balance:</Text>
            <Skeleton
              isLoaded={!loading}
              startColor="brand.orange"
              endColor="brand.purple"
            >
              {numeral(MATICBalance).format('0,0.000')} MATIC
            </Skeleton>
          </HStack>
        </Text>
      </Flex>
      <Button
        isLoading={loadingTX}
        isDisabled={!address || MATICBalance <= buyAmount * goldenShitPrice}
        colorScheme="brand.orangebutton"
        color="white"
        w="full"
        mt={3}
        onClick={async () => {
          if (MATICBalance <= buyAmount * goldenShitPrice) {
            errorToast("You don't have enough funds for the transaction");
            return;
          }
          setLoadingTX(true);
          try {
            infoToast('Approve the transaction in your Wallet...');
            let tx = await buyGoldenShit(buyAmount, goldenShitPrice, signer);
            infoToast('Waiting for the transaction to be confirmed...');
            await tx.wait();
            successToast('Buy confirmed !');
            refreshData(true);
            refreshPoolBalanceAndCirculatingSupply(true);
            refreshPriceAndPoolBalanceWYPE(true);
            setBuyAmount(1);
          } catch (err) {
            errorToast(err.message);
          }
          setLoadingTX(false);
        }}
      >
        {goldenShitPrice * buyAmount} MATIC
      </Button>
    </Flex>
  );
};

export default GOLDBuyer;
