import Pool from './Pool';
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
import { useState } from 'react';
import WYPESwapper from './WYPESwapper';
import WYPEPool from './WYPEPool';

let formatter3 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});
let formatter12 = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 12,
});

const WYPE = ({
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
  const { isOpen, onToggle } = useDisclosure();
  const { wypePoolBalance, WYPEPrice } = stats;
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
                  src={require('../assets/wype.png')}
                  pointerEvents="none"
                  h="75"
                  zIndex={2}
                />
                <ButtonGroup spacing={0}>
                  <Tooltip label="WYPE Paper">
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      as="a"
                      href="/WypePaper.pdf"
                      target="_blank"
                      variant="link"
                      icon={<Icon as={FaBook} color="gray.400" w={5} h={5} />}
                    />
                  </Tooltip>
                  <Tooltip label="WYPE Contract">
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      as="a"
                      href="https://polygonscan.com/address/0x9fACF2F2Bc061Ceb2f3Cd68B0917e98F590E8ea6"
                      target="_blank"
                      variant="link"
                      icon={<Icon as={FaCoins} color="gray.400" w={5} h={5} />}
                    />
                  </Tooltip>
                  <Tooltip label="WypePool Contract">
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      as="a"
                      href="https://polygonscan.com/address/0x47b15Da820c2CCe99a3299669C02849122ab02de"
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
                  <Tooltip label="Chart">
                    <IconButton
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      as="a"
                      href="https://dexscreener.com/polygon/0x59ec17f69ebcf42c75e171df98853d42c17e7f1d"
                      target="_blank"
                      variant="link"
                      icon={
                        <Icon as={FaChartLine} color="gray.400" w={5} h={5} />
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
                    {numeral(WYPEPrice).format('$0,0.00')}
                  </Text>
                </Skeleton>
              </VStack>

              {/* Stat 2: Pool Balance */}
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
                      {formatter3.format(wypePoolBalance)}
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
                    ({numeral(wypePoolBalance * WYPEPrice).format('$0,0.00')})
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
                src={require('../assets/wype.png')}
                pointerEvents="none"
                h="75"
                zIndex={2}
              />
              <ButtonGroup spacing={0}>
                <Tooltip label="WYPE Paper">
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    as="a"
                    href="/WypePaper.pdf"
                    target="_blank"
                    variant="link"
                    icon={<Icon as={FaBook} color="gray.400" w={5} h={5} />}
                  />
                </Tooltip>
                <Tooltip label="WYPE Contract">
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    as="a"
                    href="https://polygonscan.com/address/0x9fACF2F2Bc061Ceb2f3Cd68B0917e98F590E8ea6"
                    target="_blank"
                    variant="link"
                    icon={<Icon as={FaCoins} color="gray.400" w={5} h={5} />}
                  />
                </Tooltip>
                <Tooltip label="WypePool Contract">
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    as="a"
                    href="https://polygonscan.com/address/0x47b15Da820c2CCe99a3299669C02849122ab02de"
                    target="_blank"
                    variant="link"
                    icon={
                      <Icon as={FaSwimmingPool} color="gray.400" w={5} h={5} />
                    }
                  />
                </Tooltip>
                <Tooltip label="Chart">
                  <IconButton
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    as="a"
                    href="https://dexscreener.com/polygon/0x59ec17f69ebcf42c75e171df98853d42c17e7f1d"
                    target="_blank"
                    variant="link"
                    icon={
                      <Icon as={FaChartLine} color="gray.400" w={5} h={5} />
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
                      {numeral(WYPEPrice).format('$0,0.00')}
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
                        {formatter3.format(wypePoolBalance)}
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
                      ({numeral(wypePoolBalance * WYPEPrice).format('$0,0.00')})
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
        <SimpleGrid columns={[1, 1, 2]} spacingX={10} maxW="3xl">
          <WYPESwapper
            data={data}
            stats={stats}
            loading={loading}
            loadingStats={loadingStats}
            refreshData={refreshData}
            refreshPriceAndPoolBalance={refreshPriceAndPoolBalance}
            successToast={successToast}
            infoToast={infoToast}
            errorToast={errorToast}
          />
          <WYPEPool
            data={data}
            stats={stats}
            loading={loading}
            loadingStats={loadingStats}
            refreshData={refreshData}
            refreshPriceAndPoolBalance={refreshPriceAndPoolBalance}
            successToast={successToast}
            infoToast={infoToast}
            errorToast={errorToast}
            DYPRBalance={DYPRBalance}
          />
        </SimpleGrid>
      </Collapse>
    </Flex>
  );
};

export default WYPE;
