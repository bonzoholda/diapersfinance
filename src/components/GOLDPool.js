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
import numeral from 'numeral';
import Countdown from 'react-countdown';
import { claimGoldenShit, claimAllGoldenShit } from '../utils/MaticHelper';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../utils/Context';
const formatter12 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 12,
});
const formatter3 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});
const GOLDPool = ({
  data,
  stats,
  MATICPrice,
  WYPEPrice,
  MATICBalance,
  loading,
  loadingStats,
  refreshData,
  refreshPoolBalanceAndCirculatingSupply,
  successToast,
  infoToast,
  errorToast,
}) => {
  const { goldenShitPrice } = stats;
  const { playerGoldenShits, rewardsPerGoldenShit, maturityGoldenShit } = data;
  const { signer, address } = useContext(Context);
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
            Your Golden Shits
          </Text>
        </VStack>
        <VStack>
          <Skeleton
            isLoaded={!loading}
            startColor="brand.orange"
            endColor="brand.purple"
          >
            {playerGoldenShits.map((goldenShit, index) => (
              <HStack key={index}>
                <VStack spacing={0}>
                  <Image
                    boxSize="30px"
                    objectFit="contain"
                    src={require('../assets/gold.png')}
                    pointerEvents="none"
                  />
                  <Text fontWeight="semibold" as="span">
                    #{goldenShit.id}
                  </Text>
                </VStack>
                <Text color="brand.orange" key={index}>
                  {formatter12.format(rewardsPerGoldenShit)} WYPE (
                  <Countdown
                    date={goldenShit.timestamp + maturityGoldenShit}
                    daysInHours
                    renderer={renderer}
                  />
                  )
                </Text>
                {Date.now() > goldenShit.timestamp + maturityGoldenShit && (
                  <Button
                    colorScheme="brand.purplebutton"
                    color="white"
                    size="xs"
                    isLoading={loadingTX}
                    onClick={async () => {
                      setLoadingTX(true);
                      try {
                        infoToast('Approve the transaction in your Wallet...');
                        let tx = await claimGoldenShit(goldenShit.id, signer);
                        infoToast(
                          'Waiting for the transaction to be confirmed...'
                        );
                        await tx.wait();
                        successToast('Claim confirmed !');
                        refreshData(true);
                        refreshPoolBalanceAndCirculatingSupply(true);
                      } catch (err) {
                        errorToast(err.message);
                      }
                      setLoadingTX(false);
                    }}
                  >
                    CLAIM
                  </Button>
                )}
              </HStack>
            ))}
          </Skeleton>
        </VStack>
      </VStack>
      <Button
        colorScheme="brand.orangebutton"
        color="white"
        w="full"
        isLoading={loadingTX}
        mt={5}
        isDisabled={
          playerGoldenShits.filter(
            goldenshit => Date.now() > goldenshit.timestamp + maturityGoldenShit
          ).length <= 0
        }
        onClick={async () => {
          setLoadingTX(true);
          try {
            infoToast('Approve the transaction in your Wallet...');
            let tx = await claimAllGoldenShit(signer);
            infoToast('Waiting for the transaction to be confirmed...');
            await tx.wait();
            successToast('Claim confirmed !');
            refreshData(true);
            refreshPoolBalanceAndCirculatingSupply(true);
          } catch (err) {
            errorToast(err.message);
          }
          setLoadingTX(false);
        }}
      >
        CLAIM ALL
      </Button>
    </Flex>
  );
};

export default GOLDPool;
