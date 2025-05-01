import { HStack, Flex, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { FaTelegram, FaTwitter, FaGamepad } from 'react-icons/fa';
import React from 'react';
import customIcon from './src/assets/shitbotlogo.svg';

const CustomIcon = () => <img src={customIcon} alt="Custom Icon" width={24} height={24} />;

const PolygonLogo = () => {
  return (
    <Icon viewBox="0 0 38.4 33.5" color="gray.400" w={6} h={6}>
      <path
        fill="currentColor"
        d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3
		c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7
		c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1
		L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7
		c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"
      />
    </Icon>
  );
};

const Menu = () => {
  return (
    <Flex zIndex={2} justifyContent="center" mb={5}>
      <HStack
        w="100%"
        maxW="4xl"
        justifyContent="flex-end"
        alignItems="baseline"
      >
        <Tooltip label="ShitbotDEXtrader">
          <IconButton
            as="a"
            href="https://bonzoholda.github.io/shitbot-site/"
            target="_blank"
            mb={3}
            variant="link"
            icon={<Icon as={customIcon} color="gray.400" w={6} h={6} />}
          />
        </Tooltip>
        <Tooltip label="Telegram">
          <IconButton
            as="a"
            href="https://t.me/DiapersFinance"
            target="_blank"
            mb={3}
            variant="link"
            icon={<Icon as={FaTelegram} color="gray.400" w={6} h={6} />}
          />
        </Tooltip>
        <Tooltip label="Twitter">
          <IconButton
            as="a"
            href="https://twitter.com/DiapersFinance"
            target="_blank"
            mb={3}
            variant="link"
            icon={<Icon as={FaTwitter} color="gray.400" w={6} h={6} />}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default Menu;
