import GOLDBuyer from './GOLDBuyer';
import GOLDPool from './GOLDPool';
import {
  Collapse,
  Box,
  useDisclosure,
  Flex,
  Button,
  Image,
  HStack,
  VStack,
  Heading,
  Divider,
  Text,
  ButtonGroup,
  IconButton,
  Tooltip,
  Icon,
  SimpleGrid,
  StackDivider,
  Show,
  Wrap,
  WrapItem,
  Skeleton,
} from '@chakra-ui/react';
import {
  FaTelegram,
  FaBook,
  FaTwitter,
  FaBaby,
  FaPoo,
  FaChartLine,
  FaSwimmingPool,
  FaCoins,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import numeral from 'numeral';

let formatter3 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});
let formatter12 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 12,
});

const GOLD = ({
  data,
  stats,
  MATICPrice,
  MATICBalance,
  WYPEPrice,
  loading,
  loadingStats,
  refreshData,
  refreshPoolBalanceAndCirculatingSupply,
  refreshPriceAndPoolBalanceWYPE,
  successToast,
  infoToast,
  errorToast,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const { wypeShitFarmBalance, goldenShitCirculatingSupply } = stats;
  return (
    <Flex
      rounded={20}
      bg="rgba(255, 255, 255, 0.12)"
      backdropFilter="blur(10px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.25)"
      px={6}
      py={5}
      color="white"
      justifyContent="flex-start"
      alignItems="center"
      flexDirection="column"
      position="relative"
      zIndex={2}
      w="100%"
    >
      <Flex
        onClick={onToggle}
        cursor="pointer"
        w="100%"
        justifyContent="center"
      >
        <Show above="md">
          <HStack spacing={20}>
            <HStack
              spacing={10}
              divider={<StackDivider borderColor="whiteAlpha.300" />}
            >
              <VStack>
                <Image
                  src={require('../assets/gold.png')}
                  pointerEvents="none"
                  h="75"
                  zIndex={2}
                />
                <ButtonGroup spacing={0}>
                  <Tooltip label="GoldenShit Paper">
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      as="a"
                      href="/GoldenPaper.pdf"
                      target="_blank"
                      variant="link"
                      icon={<Icon as={FaBook} color="gray.400" w={5} h={5} />}
                    />
                  </Tooltip>
                  <Tooltip label="WypeShitFarm Contract">
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      as="a"
                      href="https://polygonscan.com/address/0xD960aE078DD5b3Ef676abEf7F03b2ae12A56f1F2"
                      target="_blank"
                      variant="link"
                      icon={
                        <Icon
                          as={FaSwimmingPool}
                          color="gray.400"
                          w={5}
                          h={5}
                        />
                      }
                    />
                  </Tooltip>
                </ButtonGroup>
              </VStack>

              {/* Stat 1: Price */}
              <VStack spacing={0} align="flex-start">
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  color="whiteAlpha.700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Price
                </Text>
                <Skeleton
                  isLoaded={!loadingStats}
                  startColor="brand.orange"
                  endColor="brand.purple"
                >
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="white"
                    fontFeatureSettings='"tnum"'
                  >
                    10
                  </Text>
                    <Text fontSize="xs" fontWeight="semibold" color="brand.orange">
                      POL
                    </Text>                      
                </Skeleton>
                <Skeleton
                  isLoaded={!loadingStats}
                  startColor="brand.orange"
                  endColor="brand.purple"
                >
                  <Text fontSize="xs" color="whiteAlpha.600" fontFeatureSettings='"tnum"'>
                    ({numeral(10 * MATICPrice).format('$0,0.00')})
                  </Text>
                </Skeleton>
              </VStack>

              {/* Stat 2: Circulating Supply */}
              <VStack spacing={0} align="flex-start">
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  color="whiteAlpha.700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Circulating supply
                </Text>
                <Skeleton
                  isLoaded={!loadingStats}
                  startColor="brand.orange"
                  endColor="brand.purple"
                >
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color="white"
                    fontFeatureSettings='"tnum"'
                  >
                    {goldenShitCirculatingSupply}
                  </Text>
                </Skeleton>
              </VStack>

              {/* Stat 3: Pool Balance */}
              <VStack spacing={0} align="flex-start">
                <Text
                  fontSize="xs"
                  fontWeight="normal"
                  color="whiteAlpha.700"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Pool Balance
                </Text>
                <Skeleton
                  isLoaded={!loadingStats}
                  startColor="brand.orange"
                  endColor="brand.purple"
                >
                  <HStack spacing={1.5} align="baseline">
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="white"
                      fontFeatureSettings='"tnum"'
                    >
                      {formatter3.format(wypeShitFarmBalance)}
                    </Text>
                    <Text fontSize="xs" fontWeight="semibold" color="brand.orange">
                      WYPE
                    </Text>
                  </HStack>
                </Skeleton>
                <Skeleton
                  isLoaded={!loadingStats}
                  startColor="brand.orange"
                  endColor="brand.purple"
                >
                  <Text fontSize="xs" color="whiteAlpha.600" fontFeatureSettings='"tnum"'>
                    (
                    {numeral(wypeShitFarmBalance * WYPEPrice).format('$0,0.00')}
                    )
                  </Text>
                </Skeleton>
              </VStack>
            </HStack>
            <IconButton
              variant="link"
              icon={
                <Icon
                  as={isOpen ? FaChevronUp : FaChevronDown}
                  color="whiteAlpha.800"
                  w={6}
                  h={6}
                />
              }
            />
          </HStack>
        </Show>

        <Show breakpoint="(max-width: 767px)">
          <VStack spacing={4}>
            <VStack>
              <Image
                src={require('../assets/gold.png')}
                pointerEvents="none"
                h="75"
                zIndex={2}
              />
              <ButtonGroup spacing={0}>
                <Tooltip label="GoldenShit Paper">
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    as="a"
                    href="/GoldenPaper.pdf"
                    target="_blank"
                    variant="link"
                    icon={<Icon as={FaBook} color="gray.400" w={5} h={5} />}
                  />
                </Tooltip>
                <Tooltip label="WypeShitFarm Contract">
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    as="a"
                    href="https://polygonscan.com/address/0xD960aE078DD5b3Ef676abEf7F03b2ae12A56f1F2"
                    target="_blank"
                    variant="link"
                    icon={
                      <Icon as={FaSwimmingPool} color="gray.400" w={5} h={5} />
                    }
                  />
                </Tooltip>
              </ButtonGroup>
              <IconButton
                variant="link"
                icon={
                  <Icon
                    as={isOpen ? FaChevronUp : FaChevronDown}
                    color="whiteAlpha.800"
                    w={6}
                    h={6}
                  />
                }
              />
            </VStack>
            <Wrap spacingX={8} spacingY={4} justify="center">
              <WrapItem>
                <VStack spacing={0} align="center">
                  <Text
                    fontSize="xs"
                    fontWeight="normal"
                    color="whiteAlpha.700"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Price
                  </Text>
                  <Skeleton
                    isLoaded={!loadingStats}
                    startColor="brand.orange"
                    endColor="brand.purple"
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="white"
                      fontFeatureSettings='"tnum"'
                    >
                      10 MATIC
                    </Text>
                  </Skeleton>
                  <Skeleton
                    isLoaded={!loadingStats}
                    startColor="brand.orange"
                    endColor="brand.purple"
                  >
                    <Text fontSize="xs" color="whiteAlpha.600" fontFeatureSettings='"tnum"'>
                      ({numeral(10 * MATICPrice).format('$0,0.00')})
                    </Text>
                  </Skeleton>
                </VStack>
              </WrapItem>
              <WrapItem>
                <VStack spacing={0} align="center">
                  <Text
                    fontSize="xs"
                    fontWeight="normal"
                    color="whiteAlpha.700"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Circulating supply
                  </Text>
                  <Skeleton
                    isLoaded={!loadingStats}
                    startColor="brand.orange"
                    endColor="brand.purple"
                  >
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="white"
                      fontFeatureSettings='"tnum"'
                    >
                      {goldenShitCirculatingSupply}
                    </Text>
                  </Skeleton>
                </VStack>
              </WrapItem>
              <WrapItem>
                <VStack spacing={0} align="center">
                  <Text
                    fontSize="xs"
                    fontWeight="normal"
                    color="whiteAlpha.700"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    Pool Balance
                  </Text>
                  <Skeleton
                    isLoaded={!loadingStats}
                    startColor="brand.orange"
                    endColor="brand.purple"
                  >
                    <HStack spacing={1.5} align="baseline">
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        color="white"
                        fontFeatureSettings='"tnum"'
                      >
                        {formatter3.format(wypeShitFarmBalance)}
                      </Text>
                      <Text fontSize="xs" fontWeight="semibold" color="brand.orange">
                        WYPE
                      </Text>
                    </HStack>
                  </Skeleton>
                  <Skeleton
                    isLoaded={!loadingStats}
                    startColor="brand.orange"
                    endColor="brand.purple"
                  >
                    <Text fontSize="xs" color="whiteAlpha.600" fontFeatureSettings='"tnum"'>
                      (
                      {numeral(wypeShitFarmBalance * WYPEPrice).format(
                        '$0,0.00'
                      )}
                      )
                    </Text>
                  </Skeleton>
                </VStack>
              </WrapItem>
            </Wrap>
          </VStack>
        </Show>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Divider borderColor="gray.400" mt={8} mb={6} />
        <SimpleGrid columns={[1, 1, 2]} spacingX={10}>
          <GOLDBuyer
            data={data}
            stats={stats}
            MATICPrice={MATICPrice}
            MATICBalance={MATICBalance}
            WYPEPrice={WYPEPrice}
            loading={loading}
            loadingStats={loadingStats}
            refreshData={refreshData}
            refreshPoolBalanceAndCirculatingSupply={
              refreshPoolBalanceAndCirculatingSupply
            }
            refreshPriceAndPoolBalanceWYPE={refreshPriceAndPoolBalanceWYPE}
            successToast={successToast}
            infoToast={infoToast}
            errorToast={errorToast}
          />
          <GOLDPool
            data={data}
            stats={stats}
            MATICPrice={MATICPrice}
            MATICBalance={MATICBalance}
            WYPEPrice={WYPEPrice}
            loading={loading}
            loadingStats={loadingStats}
            refreshData={refreshData}
            refreshPoolBalanceAndCirculatingSupply={
              refreshPoolBalanceAndCirculatingSupply
            }
            successToast={successToast}
            infoToast={infoToast}
            errorToast={errorToast}
          />
        </SimpleGrid>
      </Collapse>
    </Flex>
  );
};

export default GOLD;
