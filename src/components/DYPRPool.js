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
} from '@chakra-ui/react';
import numeral from 'numeral';
import Countdown from 'react-countdown';
import { claimDYPR } from '../utils/MaticHelper';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../utils/Context';

let formatter12 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 12,
});
let formatter3 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});

const DYPRPool = ({
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
  const { addressPoolShareDYPR, addressStakesDYPR, rewardsAvailableDYPR } =
    data;
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
            Your share
          </Text>
          <Text color="brand.orange" as="span">
            <Skeleton
              isLoaded={!loading}
              startColor="brand.orange"
              endColor="brand.purple"
            >
              {numeral(addressPoolShareDYPR).format('%0,0.000')}
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
            {addressStakesDYPR.length > 0 ? (
              addressStakesDYPR.map((stake, index) => (
                <Text color="brand.orange" key={index} as="span">
                  {formatter12.format(stake.reward)} DYPR (
                  <Countdown
                    date={stake.readyTimestamp}
                    daysInHours
                    renderer={renderer}
                  />
                  )
                </Text>
              ))
            ) : (
              <Text as="span">0 DYPR</Text>
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
        isDisabled={!rewardsAvailableDYPR}
        onClick={async () => {
          setLoadingTX(true);
          try {
            infoToast('Approve the transaction in your Wallet...');
            let tx = await claimDYPR(signer);
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
      {addressStakesDYPR.length > 0 && (
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
                date={addressStakesDYPR[0].readyTimestamp}
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

export default DYPRPool;
