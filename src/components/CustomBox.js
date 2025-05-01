import { Flex } from '@chakra-ui/react';

const CustomBox = ({ children, title }) => {
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
    >
      {children}
      <Flex
        bg="brand.purple2"
        color="white"
        h="50px"
        w="80%"
        rounded={6}
        position="absolute"
        bottom={0}
        transform="translate(0%,50%)"
        justifyContent="center"
        alignItems="center"
        fontSize="xl"
      >
        {title}
      </Flex>
    </Flex>
  );
};

export default CustomBox;
