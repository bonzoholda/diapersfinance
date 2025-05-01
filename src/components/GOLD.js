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
      bg="white"
      px={6}
      py={5}
      color="brand.purple"
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
              divider={<StackDivider borderColor="gray.200" />}
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
              <VStack spacing={0}>
                <Text fontWeight="semibold" as="span">
                  Price
                </Text>
                <Text fontWeight="semibold" as="span">
                  <HStack>
                    <Skeleton
                      isLoaded={!loadingStats}
                      startColor="brand.orange"
                      endColor="brand.purple"
                    >
                      10 MATIC
                    </Skeleton>
                  </HStack>
                </Text>
                <Text as="span">
                  <Skeleton
                    isLoaded={!loadingStats}
                    startColor="brand.orange"
                    endColor="brand.purple"
                  >
                    ({numeral(10 * MATICPrice).format('$0,0.00')})
                  </Skeleton>
                </Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontWeight="semibold" as="span">
                  Circulating supply
                </Text>
                <Text fontWeight="semibold" as="span">
                  <HStack>
                    <Skeleton
                      isLoaded={!loadingStats}
                      startColor="brand.orange"
                      endColor="brand.purple"
                    >
                      {goldenShitCirculatingSupply}
                    </Skeleton>
                  </HStack>
                </Text>
              </VStack>
              <VStack spacing={0}>
                <Text fontWeight="semibold" as="span">
                  Pool Balance
                </Text>
                <Text fontWeight="semibold" as="span">
                  <HStack>
                    <Skeleton
                      isLoaded={!loadingStats}
                      startColor="brand.orange"
                      endColor="brand.purple"
                    >
                      {formatter3.format(wypeShitFarmBalance)}
                    </Skeleton>
                    <Text as="span">WYPE</Text>
                  </HStack>
                </Text>
                <Text as="span">
                  <Skeleton
                    isLoaded={!loadingStats}
                    startColor="brand.orange"
                    endColor="brand.purple"
                  >
                    (
                    {numeral(wypeShitFarmBalance * WYPEPrice).format('$0,0.00')}
                    )
                  </Skeleton>
                </Text>
              </VStack>
            </HStack>
            <IconButton
              variant="link"
              icon={
                <Icon
                  as={isOpen ? FaChevronUp : FaChevronDown}
                  color="brand.purple"
                  w={6}
                  h={6}
                />
              }
            />
          </HStack>
        </Show>
        <Show breakpoint="(max-width: 767px)">
          <VStack>
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
                    color="brand.purple"
                    w={6}
                    h={6}
                  />
                }
              />
            </VStack>
            <Wrap spacingX={10} justify="center">
              <WrapItem>
                <VStack spacing={0}>
                  <Text fontWeight="semibold" as="span">
                    Price
                  </Text>
                  <Text fontWeight="semibold" as="span">
                    <HStack>
                      <Skeleton
                        isLoaded={!loadingStats}
                        startColor="brand.orange"
                        endColor="brand.purple"
                      >
                        10 MATIC
                      </Skeleton>
                    </HStack>
                  </Text>
                  <Text as="span">
                    <Skeleton
                      isLoaded={!loadingStats}
                      startColor="brand.orange"
                      endColor="brand.purple"
                    >
                      ({numeral(10 * MATICPrice).format('$0,0.00')})
                    </Skeleton>
                  </Text>
                </VStack>
              </WrapItem>
              <WrapItem>
                <VStack spacing={0}>
                  <Text fontWeight="semibold" as="span">
                    Circulating supply
                  </Text>
                  <Text fontWeight="semibold" as="span">
                    <HStack>
                      <Skeleton
                        isLoaded={!loadingStats}
                        startColor="brand.orange"
                        endColor="brand.purple"
                      >
                        {goldenShitCirculatingSupply}
                      </Skeleton>
                    </HStack>
                  </Text>
                </VStack>
              </WrapItem>
              <WrapItem>
                <VStack spacing={0}>
                  <Text fontWeight="semibold" as="span">
                    Pool Balance
                  </Text>
                  <Text fontWeight="semibold" as="span">
                    <HStack>
                      <Skeleton
                        isLoaded={!loadingStats}
                        startColor="brand.orange"
                        endColor="brand.purple"
                      >
                        {formatter3.format(wypeShitFarmBalance)}
                      </Skeleton>
                      <Text as="span">WYPE</Text>
                    </HStack>
                  </Text>
                  <Text as="span">
                    <Skeleton
                      isLoaded={!loadingStats}
                      startColor="brand.orange"
                      endColor="brand.purple"
                    >
                      (
                      {numeral(wypeShitFarmBalance * WYPEPrice).format(
                        '$0,0.00'
                      )}
                      )
                    </Skeleton>
                  </Text>
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
