import { Flex } from '@chakra-ui/react';

const Pool = ({ children }) => {
  return (
    <Flex
      rounded={20}
      bg="rgba(255, 255, 255, 0.15)"
      backdropFilter="blur(12px)"
      border="1px solid rgba(255, 255, 255, 0.25)"
      boxShadow="0 8px 32px 0 rgba(0, 0, 0, 0.37)"
      px={6}
      py={10}
      color="white"
      justifyContent="flex-start"
      alignItems="center"
      flexDirection="column"
      position="relative"
      zIndex={2}
      w="100%"
    >
      {children}
    </Flex>
  );
};

export default Pool;
