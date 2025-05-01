import CustomBox from './CustomBox';
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
import { BsArrowDown } from 'react-icons/bs';
import numeral from 'numeral';
import { useState, useEffect, useContext } from 'react';
import {
  getAmountMaticInDYPROut,
  getAmountDYPRInMaticOut,
  buyDYPRTx,
  sellDYPRTx,
  approveDYPRQuickSwap,
} from '../utils/MaticHelper';
import { Context } from '../utils/Context';
import { ethers, utils } from 'ethers';

Number.prototype.toFixedDown = function (digits) {
  var re = new RegExp('(\\d+\\.\\d{' + digits + '})(\\d)'),
    m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};

let formatter3 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});
let formatter12 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 12,
});

const MATICInput = ({
  addressMATICBalance,
  amount,
  setAmount,
  isReadOnly,
  loading,
}) => {
  return (
    <Flex direction="column">
      <HStack>
        <NumberInput
          value={amount}
          onChange={value => {
            setAmount(value);
          }}
          isReadOnly={isReadOnly}
        >
          <NumberInputField
            bg="gray.200"
            fontWeight="semibold"
            color="brand.purple"
          />
          {!isReadOnly && (
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                colorScheme="brand.orangebutton"
                color="white"
                onClick={() => {
                  setAmount(
                    parseFloat(addressMATICBalance).toFixedDown(18).toString()
                  );
                }}
              >
                Max
              </Button>
            </InputRightElement>
          )}
        </NumberInput>
        <Text fontWeight="semibold" as="span">
          MATIC
        </Text>
      </HStack>
      <Flex w="100%" justifyContent="flex-end">
        <Text color="gray.400" as="span">
          <HStack>
            <Text as="span">Your balance:</Text>
            <Skeleton
              isLoaded={!loading}
              startColor="brand.orange"
              endColor="brand.purple"
            >
              {numeral(addressMATICBalance).format('0,0.000')}
            </Skeleton>
          </HStack>
        </Text>
      </Flex>
    </Flex>
  );
};

const DYPRInput = ({
  addressDYPRBalance,
  amount,
  setAmount,
  isReadOnly,
  loading,
}) => {
  return (
    <Flex direction="column">
      <HStack>
        <NumberInput
          value={amount}
          onChange={value => {
            setAmount(value);
          }}
          isReadOnly={isReadOnly}
        >
          <NumberInputField
            bg="gray.200"
            fontWeight="semibold"
            color="brand.purple"
          />
          {!isReadOnly && (
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                colorScheme="brand.orangebutton"
                color="white"
                onClick={() => {
                  setAmount(
                    parseFloat(addressDYPRBalance).toFixedDown(18).toString()
                  );
                }}
              >
                Max
              </Button>
            </InputRightElement>
          )}
        </NumberInput>
        <Text fontWeight="semibold" as="span">
          DYPR
        </Text>
      </HStack>
      <Flex w="100%" justifyContent="flex-end">
        <Text color="gray.400" as="span">
          <HStack>
            <Text as="span">Your balance:</Text>
            <Skeleton
              isLoaded={!loading}
              startColor="brand.orange"
              endColor="brand.purple"
            >
              {formatter12.format(addressDYPRBalance)}
            </Skeleton>
          </HStack>
        </Text>
      </Flex>
    </Flex>
  );
};

const DYPRSwapper = ({
  data,
  stats,
  loading,
  loadingStats,
  refreshData,
  refreshPriceAndPoolBalance,
  successToast,
  infoToast,
  errorToast,
}) => {
  const [buy, setBuy] = useBoolean(true);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const { signer, address } = useContext(Context);
  const { addressDYPRBalance, addressMATICBalance, DYPRAllowanceQuickSwap } =
    data;
  const { DYPRPrice, MATICPrice } = stats;
  const [loadingTX, setLoadingTX] = useState(false);
  useEffect(() => {
    if (parseFloat(amountIn) > 0) {
      if (buy) {
        setAmountMaticInDYPROut(amountIn);
      } else {
        setAmountDYPRInMaticOut(amountIn);
      }
    } else {
      setAmountOut('');
    }
  }, [amountIn]);
  const setAmountMaticInDYPROut = async amount => {
    const amountInDYPR = await getAmountMaticInDYPROut(amount);
    setAmountOut(amountInDYPR);
  };
  const setAmountDYPRInMaticOut = async amount => {
    const amountInMatic = await getAmountDYPRInMaticOut(amount);
    setAmountOut(amountInMatic);
  };
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
      {buy ? (
        <MATICInput
          addressMATICBalance={addressMATICBalance}
          amount={amountIn}
          setAmount={setAmountIn}
          loading={loading}
        />
      ) : (
        <DYPRInput
          addressDYPRBalance={addressDYPRBalance}
          amount={amountIn}
          setAmount={setAmountIn}
          loading={loading}
        />
      )}
      <IconButton
        mt={2}
        mb={3}
        onClick={() => {
          setBuy.toggle();
          setAmountIn('');
          setAmountOut('');
        }}
        variant="link"
        icon={<Icon as={BsArrowDown} color="brand.orange" w={6} h={6} />}
      />
      {buy ? (
        <DYPRInput
          addressDYPRBalance={addressDYPRBalance}
          amount={amountOut}
          setAmount={setAmountOut}
          isReadOnly
          loading={loading}
        />
      ) : (
        <MATICInput
          addressMATICBalance={addressMATICBalance}
          amount={amountOut}
          setAmount={setAmountOut}
          isReadOnly
          loading={loading}
        />
      )}

      <Button
        isLoading={loadingTX}
        isDisabled={!(parseFloat(amountIn) >= 0 && parseFloat(amountOut) >= 0)}
        colorScheme="brand.orangebutton"
        color="white"
        w="full"
        mt={5}
        onClick={async () => {
          if (buy) {
            if (addressMATICBalance < amountIn) {
              errorToast("You don't have enough funds for the transaction");
              return;
            }
            setLoadingTX(true);
            try {
              infoToast('Approve the transaction in your Wallet...');
              let tx = await buyDYPRTx(amountIn, amountOut, signer, address);
              infoToast('Waiting for the transaction to be confirmed...');
              await tx.wait();
              successToast('Buy confirmed !');
              refreshData(true);
              refreshPriceAndPoolBalance(true);
              setAmountIn('');
            } catch (err) {
              errorToast(err.message);
            }
            setLoadingTX(false);
          } else {
            if (
              DYPRAllowanceQuickSwap <
              parseFloat(utils.formatEther(ethers.constants.MaxUint256))
            ) {
              setLoadingTX(true);
              try {
                infoToast('Approve the transaction in your Wallet...');
                let tx = await approveDYPRQuickSwap(signer);
                infoToast('Waiting for the transaction to be confirmed...');
                await tx.wait();
                successToast('DYPR approved !');
              } catch (err) {
                errorToast(err.message);
              }
            } else {
              if (addressDYPRBalance < amountIn) {
                errorToast("You don't have enough funds for the transaction");
                return;
              }
              setLoadingTX(true);
              try {
                infoToast('Approve the transaction in your Wallet...');
                let tx = await sellDYPRTx(amountIn, amountOut, signer, address);
                infoToast('Waiting for the transaction to be confirmed...');
                await tx.wait();
                successToast('Sell confirmed !');
                refreshData(true);
                refreshPriceAndPoolBalance(true);
                setAmountIn('');
              } catch (err) {
                errorToast(err.message);
              }
            }
            setLoadingTX(false);
          }
        }}
      >
        {!buy &&
        DYPRAllowanceQuickSwap <
          parseFloat(utils.formatEther(ethers.constants.MaxUint256))
          ? 'APPROVE'
          : 'SWAP'}
      </Button>

      <Text color="brand.orange" as="span">
        You'll receive ≈ {formatter12.format(amountOut * (buy ? 0.97 : 0.67))}{' '}
        {buy ? 'DYPR' : 'MATIC'} after tax
      </Text>
    </Flex>
  );
};

export default DYPRSwapper;
