import CustomBox from './CustomBox';
import {
  Heading,
  Divider,
  Button,
  Text,
  VStack,
  useBoolean,
  Skeleton,
  HStack,
  Flex,
  Image,
  Icon,
} from '@chakra-ui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import numeral from 'numeral';
import Countdown from 'react-countdown';
import { claimWYPE } from '../utils/MaticHelper';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../utils/Context';

let formatter12 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 12,
});
let formatter3 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});

const WYPEPool = ({
  data,
  stats,
  loading,
  loadingStats,
  refreshData,
  refreshPriceAndPoolBalance,
  successToast,
  infoToast,
  errorToast,
  DYPRBalance,
}) => {
  const {
    addressPoolShareWYPE,
    addressStakesWYPE,
    rewardsAvailableWYPE,
    addressWYPEBalance,
  } = data;
  const { signer } = useContext(Context);
  const [loadingTX, setLoadingTX] = useState(false);
  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return 'available';
    } else {
      // Render a countdown
      return (
        <span>
          {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };
  const renderer2 = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return 'You can claim now';
    } else {
      // Render a countdown
      return (
        <span>
          {hours}h {minutes}m {seconds}s
        </span>
      );
    }
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
      <VStack>
        <VStack spacing={0}>
          <Text fontWeight="semibold" as="span">
            Your balances
          </Text>
          <HStack>
            <Image
              src={require('../assets/wype.png')}
              pointerEvents="none"
              h="30"
            />
            <Text color="brand.orange" as="span">
              {formatter12.format(addressWYPEBalance)}
            </Text>
          </HStack>
          <HStack>
            <Image
              src={require('../assets/dypr.png')}
              pointerEvents="none"
              h="30"
            />
            <Text color="brand.orange" as="span">
              {formatter12.format(DYPRBalance)}
            </Text>
          </HStack>
        </VStack>
        <VStack>
          <Text fontWeight="semibold" as="span">
            Your share
          </Text>

          <Text color="brand.orange" as="span">
            <Skeleton
              isLoaded={!loading}
              startColor="brand.orange"
              endColor="brand.purple"
            >
              <VStack spacing={0}>
                <HStack>
                  <Text
                    as="span"
                    textDecoration={
                      DYPRBalance < addressWYPEBalance && 'line-through'
                    }
                  >
                    {numeral(addressPoolShareWYPE).format('%0,0.000')}
                  </Text>
                  {DYPRBalance > addressWYPEBalance ? (
                    <Icon as={FaCheck} />
                  ) : (
                    <Icon as={FaTimes} />
                  )}
                </HStack>
                {DYPRBalance < addressWYPEBalance && (
                  <>
                    <Text as="span">
                      {numeral(DYPRBalance / 100).format('%0,0.000')}
                    </Text>
                    <Text as="span">You share is reduced !</Text>
                    <Text as="span" align="center">
                      Get {formatter12.format(addressWYPEBalance - DYPRBalance)}{' '}
                      more DYPR to claim your full share of WYPE
                    </Text>
                  </>
                )}
              </VStack>
            </Skeleton>
          </Text>
        </VStack>
        <VStack spacing={0}>
          <Text fontWeight="semibold" as="span">
            Next est. Reward
          </Text>
          <Skeleton
            isLoaded={!loading}
            startColor="brand.orange"
            endColor="brand.purple"
            textAlign="center"
          >
            {addressStakesWYPE.length > 0 ? (
              addressStakesWYPE.map((stake, index) => (
                <>
                  <Text
                    color="brand.orange"
                    key={index}
                    textDecoration={
                      DYPRBalance < addressWYPEBalance && 'line-through'
                    }
                  >
                    {formatter12.format(stake.reward)} WYPE (
                    <Countdown
                      date={stake.readyTimestamp}
                      daysInHours
                      renderer={renderer}
                    />
                    )
                  </Text>
                  {DYPRBalance < addressWYPEBalance && (
                    <Text color="brand.orange" key={index}>
                      {formatter12.format(stake.adjustedreward)} WYPE (
                      <Countdown
                        date={stake.readyTimestamp}
                        daysInHours
                        renderer={renderer}
                      />
                      )
                    </Text>
                  )}
                </>
              ))
            ) : (
              <Text as="span">0 WYPE</Text>
            )}
          </Skeleton>
        </VStack>
      </VStack>
      <Button
        colorScheme="brand.orangebutton"
        color="white"
        w="full"
        isLoading={loadingTX}
        mt={5}
        isDisabled={!rewardsAvailableWYPE}
        onClick={async () => {
          setLoadingTX(true);
          try {
            infoToast('Approve the transaction in your Wallet...');
            let tx = await claimWYPE(signer);
            infoToast('Waiting for the transaction to be confirmed...');
            await tx.wait();
            successToast('Claim confirmed !');
            refreshData(true);
            refreshPriceAndPoolBalance(true);
          } catch (err) {
            errorToast(err.message);
          }
          setLoadingTX(false);
        }}
      >
        CLAIM SHARES
      </Button>
      {addressStakesWYPE.length > 0 && (
        <VStack spacing={0}>
          <Text fontWeight="semibold" as="span">
            You can claim after
          </Text>
          <Text color="brand.orange" as="span">
            <Skeleton
              isLoaded={!loading}
              startColor="brand.orange"
              endColor="brand.purple"
              textAlign="center"
            >
              <Countdown
                date={addressStakesWYPE[0].readyTimestamp}
                daysInHours
                renderer={renderer2}
              />
            </Skeleton>
          </Text>
        </VStack>
      )}
    </Flex>
  );
};

export default WYPEPool;
