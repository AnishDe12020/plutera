import {
  Box,
  Drawer,
  DrawerContent,
  HStack,
  Link,
  List,
  ListItem,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRef } from "react";
import { Rotate } from "hamburger-react";
import ConnectWallet from "./ConnectWallet";

interface INavLink {
  content: string;
  href: string;
}

const links: INavLink[] = [
  {
    content: "Home",
    href: "/",
  },
  {
    content: "Dashboard",
    href: "/dashboard",
  },
];

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <HStack
      as="nav"
      px={[4, 12, 24]}
      py={6}
      justifyContent="space-between"
      alignItems="center"
      height="10vh"
      borderBottom="1px solid"
      borderBottomColor="brand.secondary"
    >
      <Box display={{ base: "inline-flex", md: "none" }}>
        <Rotate
          toggle={onOpen}
          toggled={isOpen}
          direction="right"
          label="Menu"
          size={24}
          rounded
        />
      </Box>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        size="full"
        initialFocusRef={closeButtonRef}
      >
        <DrawerContent backgroundColor="brand.primary" mt={20}>
          <VStack as={List} mt={8} w="full" alignItems="start" px={8} gap={4}>
            {links.map((link) => (
              <ListItem
                key={link.content}
                borderBottom="1px solid"
                borderBottomColor="brand.secondary"
                _hover={{
                  opacity: 0.6,
                }}
                py={1}
                w="full"
                onClick={onClose}
              >
                <Link
                  as={NextLink}
                  href={link.href}
                  _hover={{ opacity: 0.6 }}
                  textColor="red.500"
                >
                  {link.content}
                </Link>
              </ListItem>
            ))}
          </VStack>
        </DrawerContent>
      </Drawer>
      <HStack gap={2} display={{ base: "none", md: "flex" }} as={List}>
        {links.map((link) => (
          <ListItem key={link.content}>
            <Link as={NextLink} href={link.href} _hover={{ opacity: 0.6 }}>
              {link.content}
            </Link>
          </ListItem>
        ))}
      </HStack>
      <ConnectWallet />
    </HStack>
  );
};

export default Header;
