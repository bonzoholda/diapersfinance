import { useEffect, useState, useContext } from 'react';
import {
  ChakraProvider,
  Flex,
  SimpleGrid,
  VStack,
  extendTheme,
  Button,
  Image,
  Box,
  useToast,
  Container,
} from '@chakra-ui/react';

import Menu from './components/Menu';
import DYPR from './components/DYPR';
import WYPE from './components/WYPE';
import GOLD from './components/GOLD';
import { Context } from './utils/Context';

import WalletButton from './components/WalletButton';

import {
  refreshAllDataDYPR,
  refreshStatsDYPR,
  refreshAllDataWYPE,
  refreshStatsWYPE,
  refreshAllDataGoldenShit,
  refreshStatsGoldenShit,
} from './utils/MaticHelper';

const colors = {
  brand: {
    purple: '#280059',
    purple2: '#1E0042',
    orange: '#F69D19',
    orange2: '#ce8313',
    orangebutton: {
      200: '#F69D19',
      300: '#ce8313',
      400: '#99610e',
    },
    purplebutton: {
      200: '#280059',
      300: '#22014a',
      400: '#1E0042',
    },
  },
};
const config = {
  initialColorMode: 'dark',
};
const styles = {
  global: {
    'html, body': {
      backgroundColor: colors.brand.purple,
    },
  },
};
const theme = extendTheme({ config, colors, styles });

const initialeDataDYPR = {
  addressDYPRBalance: 0,
  addressMATICBalance: 0,
  addressStakesDYPR: [],
};
const initialeDataWYPE = {
  addressWYPEBalance: 0,
  addressUSDCBalance: 0,
  addressStakesWYPE: [],
};
const initialeStatsDYPR = {
  shitPoolDYPRBalance: 0,
  DYPRPrice: 0,
};
const initialeStatsWYPE = {
  wypePoolBalance: 0,
  WYPEPrice: 0,
};
const initialeDataGoldenShit = {
  playerGoldenShits: [],
};
const initialeStatsGoldenShit = {
  wypeShitFarmBalance: 0,
  goldenShitCirculatingSupply: 0,
};

function App() {
  const { address } = useContext(Context);
  const [dataDYPR, setDataDYPR] = useState(initialeDataDYPR);
  const [statsDYPR, setStatsDYPR] = useState(initialeStatsDYPR);
  const [dataWYPE, setDataWYPE] = useState(initialeDataWYPE);
  const [statsWYPE, setStatsWYPE] = useState(initialeStatsWYPE);
  const [dataGoldenShit, setDataGoldenShit] = useState(initialeDataGoldenShit);
  const [statsGoldenShit, setStatsGoldenShit] = useState(
    initialeStatsGoldenShit
  );
  const [loadingDYPR, setLoadingDYPR] = useState(false);
  const [loadingStatsDYPR, setLoadingStatsDYPR] = useState(false);
  const [loadingWYPE, setLoadingWYPE] = useState(false);
  const [loadingStatsWYPE, setLoadingStatsWYPE] = useState(false);
  const [loadingGoldenShit, setLoadingGoldenShit] = useState(false);
  const [loadingStatsGoldenShit, setLoadingStatsGoldenShit] = useState(false);
  const toast = useToast();
  useEffect(() => {
    let interval;
    if (address) {
      refreshDataDYPR(true);
      refreshDataWYPE(true);
      refreshDataGoldenShit(true);
      interval = setInterval(() => {
        refreshDataDYPR(false);
        refreshDataWYPE(false);
        refreshDataGoldenShit(false);
      }, 30000);
    } else {
      setDataDYPR(initialeDataDYPR);
      setDataWYPE(initialeDataWYPE);
      setDataGoldenShit(initialeDataGoldenShit);
    }
    return () => {
      clearTimeout(interval);
    };
  }, [address]);
  useEffect(() => {
    refreshPriceAndPoolBalanceDYPR(true);
    refreshPriceAndPoolBalanceWYPE(true);
    refreshPoolBalanceAndCirculatingSupplyGoldenShitFarm(true);
    let interval = setInterval(() => {
      refreshPriceAndPoolBalanceDYPR(false);
      refreshPriceAndPoolBalanceWYPE(false);
      refreshPoolBalanceAndCirculatingSupplyGoldenShitFarm(false);
    }, 30000);
    return () => {
      clearTimeout(interval);
    };
  }, []);
  const refreshDataDYPR = async showLoading => {
    if (showLoading) {
      setLoadingDYPR(true);
    }
    const dataDYPR = await refreshAllDataDYPR(address);
    console.log(dataDYPR);
    setDataDYPR(dataDYPR);
    if (showLoading) {
      setLoadingDYPR(false);
    }
  };
  const refreshDataWYPE = async showLoading => {
    if (showLoading) {
      setLoadingWYPE(true);
    }
    const dataWYPE = await refreshAllDataWYPE(address);
    console.log(dataWYPE);
    setDataWYPE(dataWYPE);
    if (showLoading) {
      setLoadingWYPE(false);
    }
  };
  const refreshDataGoldenShit = async showLoading => {
    if (showLoading) {
      setLoadingGoldenShit(true);
    }
    const dataGoldenShit = await refreshAllDataGoldenShit(address);
    console.log(dataGoldenShit);
    setDataGoldenShit(dataGoldenShit);
    if (showLoading) {
      setLoadingGoldenShit(false);
    }
  };
  const refreshPriceAndPoolBalanceDYPR = async showLoading => {
    if (showLoading) {
      setLoadingStatsDYPR(true);
    }
    const dataDYPR = await refreshStatsDYPR();
    console.log(dataDYPR);
    setStatsDYPR(dataDYPR);
    if (showLoading) {
      setLoadingStatsDYPR(false);
    }
  };
  const refreshPriceAndPoolBalanceWYPE = async showLoading => {
    if (showLoading) {
      setLoadingStatsWYPE(true);
    }
    const dataWYPE = await refreshStatsWYPE();
    console.log(dataWYPE);
    setStatsWYPE(dataWYPE);
    if (showLoading) {
      setLoadingStatsWYPE(false);
    }
  };
  const refreshPoolBalanceAndCirculatingSupplyGoldenShitFarm =
    async showLoading => {
      if (showLoading) {
        setLoadingStatsGoldenShit(true);
      }
      const dataGoldenShit = await refreshStatsGoldenShit();
      console.log(dataGoldenShit);
      setStatsGoldenShit(dataGoldenShit);
      if (showLoading) {
        setLoadingStatsGoldenShit(false);
      }
    };
  const successToast = text => {
    toast({
      title: text,
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };
  const infoToast = text => {
    toast({
      title: text,
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };
  const errorToast = text => {
    toast({
      title: 'An error has occured',
      description: text,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };
  return (
    <ChakraProvider theme={theme}>
      <Container maxW="5xl">
        <Flex minH="100vh" py={10} direction="column">
          <Menu />
          <VStack spacing={10} justifyContent="center">
            <Image
              src={require('./assets/DiapersFinance-logo.png')}
              pointerEvents="none"
              h="150"
              zIndex={2}
            />
            <WalletButton />
            <DYPR
              data={dataDYPR}
              stats={statsDYPR}
              loading={loadingDYPR}
              loadingStats={loadingStatsDYPR}
              refreshData={refreshDataDYPR}
              refreshPriceAndPoolBalance={refreshPriceAndPoolBalanceDYPR}
              successToast={successToast}
              infoToast={infoToast}
              errorToast={errorToast}
            />
            <WYPE
              data={dataWYPE}
              DYPRBalance={dataDYPR.addressDYPRBalance}
              stats={statsWYPE}
              loading={loadingWYPE}
              loadingStats={loadingStatsWYPE}
              refreshData={refreshDataWYPE}
              refreshPriceAndPoolBalance={refreshPriceAndPoolBalanceWYPE}
              successToast={successToast}
              infoToast={infoToast}
              errorToast={errorToast}
            />
            <GOLD
              data={dataGoldenShit}
              stats={statsGoldenShit}
              MATICPrice={statsDYPR.MATICPrice}
              MATICBalance={dataDYPR.addressMATICBalance}
              WYPEPrice={statsWYPE.WYPEPrice}
              loading={loadingGoldenShit}
              loadingStats={loadingStatsGoldenShit}
              refreshData={refreshDataGoldenShit}
              refreshPoolBalanceAndCirculatingSupply={
                refreshPoolBalanceAndCirculatingSupplyGoldenShitFarm
              }
              refreshPriceAndPoolBalanceWYPE={refreshPriceAndPoolBalanceWYPE}
              successToast={successToast}
              infoToast={infoToast}
              errorToast={errorToast}
            />
          </VStack>
        </Flex>
      </Container>
      <Image
        src={require('./assets/Ellipse.png')}
        position="fixed"
        top={0}
        left="50%"
        transform="translate(-80%, -50%)"
        zIndex="0"
        pointerEvents="none"
        h="1000px"
        w="1000px"
      />
      <Image
        src={require('./assets/Ellipse.png')}
        position="fixed"
        bottom={0}
        left="50%"
        pointerEvents="none"
        transform="translate(0%, 50%)"
        zIndex="0"
        h="1000px"
        w="1000px"
      />
      <Image
        src={require('./assets/Dots.png')}
        position="absolute"
        top={30}
        left="15%"
        pointerEvents="none"
        transform="translate(-50%, 0%)"
        zIndex="0"
        h="30px"
        w="30px"
      />
      <Image
        src={require('./assets/Dots.png')}
        position="absolute"
        bottom={30}
        left="75%"
        pointerEvents="none"
        transform="translate(-50%, 0%)"
        zIndex="0"
        h="30px"
        w="30px"
      />
    </ChakraProvider>
  );
}

export default App;
