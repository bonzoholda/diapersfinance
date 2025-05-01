import { Flex } from '@chakra-ui/react';
const Pool = ({ children }) => {
  return (
    <Flex
      rounded={20}
      bg="white"
      px={6}
      py={10}
      color="brand.purple"
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
