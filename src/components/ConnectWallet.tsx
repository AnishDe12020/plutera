import {
  ButtonProps,
  forwardRef,
  Menu,
  MenuButton,
  Avatar as ChakraAvatar,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  VStack,
  AvatarGroup,
  Divider,
  Text,
  useDisclosure,
  Image,
  HStack,
  Collapse,
  Link,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  chakra,
  useClipboard,
  Flex,
  Spinner,
  FormControl,
  FormLabel,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { TorusWalletName } from "@solana/wallet-adapter-wallets";
import axios from "axios";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import base58 from "bs58";
import {
  Check,
  ClipboardCopy,
  ExternalLink,
  LogOut,
  Wallet,
} from "lucide-react";
import { truncatePubkey } from "../utils/truncate";
import { useQuery } from "react-query";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useSocialProtocol from "../hooks/useSocialProtocol";

interface ConnectWalletProps extends ButtonProps {
  callbackUrl?: string;
}

interface SignUpForm {
  username: string;
}

const ConnectWallet = forwardRef<ConnectWalletProps, "button">(
  ({ children, callbackUrl, ...otherProps }, ref) => {
    const {
      isOpen: isModalOpen,
      onOpen: onModalOpen,
      onClose: onModalClose,
    } = useDisclosure();

    const { select, publicKey, disconnect, signMessage, wallets } = useWallet();

    // const { socialProtocol } = useSocialProtocol();

    const {
      isOpen: isCollapsedWalletsOpen,
      onToggle: onCollapsedWalletsToggle,
    } = useDisclosure();

    const [isSigningIn, setIsSigningIn] = useState(false);

    const { data: session } = useSession();

    const {
      onCopy: onPubkeyCopy,
      hasCopied: hasCopiedPubkey,
      setValue: setPubkey,
    } = useClipboard("");

    const { data: user, isLoading: isLoadingUser } = useQuery<User | null>(
      "user",
      () => {
        return null;
      },
      {
        enabled: !!publicKey,
      }
    );

    const { register, handleSubmit } = useForm<SignUpForm>();

    useEffect(() => {
      if (!publicKey) return;

      setPubkey(publicKey.toBase58());
    }, [setPubkey, publicKey]);

    const connectWithTorus: MouseEventHandler<HTMLButtonElement> = useCallback(
      async (e) => {
        if (e.defaultPrevented) return;

        select(TorusWalletName);
      },
      [select]
    );

    const logout: MouseEventHandler<HTMLButtonElement> = useCallback(
      async (e) => {
        if (e.defaultPrevented) return;

        await disconnect();

        await signOut();
      },
      [disconnect]
    );

    const login = useCallback(
      async (name?: string) => {
        // if (!socialProtocol) return;

        setIsSigningIn(true);
        const res = await axios.get("/api/nonce");

        if (res.status != 200) {
          console.error("failed to fetch nonce");
          return;
        }

        const { nonce } = res.data;

        const message = `Sign this message for authenticating with your wallet. Nonce: ${nonce}`;
        const encodedMessage = new TextEncoder().encode(message);

        if (!signMessage) {
          console.error("signMessage is not defined");
          return;
        }

        const signedMessage = await signMessage(encodedMessage);

        await signIn("credentials", {
          publicKey: publicKey?.toBase58(),
          signature: base58.encode(signedMessage),
          callbackUrl: callbackUrl
            ? `${window.location.origin}/${callbackUrl}`
            : `${window.location.origin}/`,
          name: name,
        });

        // await socialProtocol.createUser(name, null, null, null);

        setIsSigningIn(false);
      },
      [signMessage, publicKey, callbackUrl]
    );

    return publicKey && session ? (
      <Popover>
        <PopoverTrigger>
          <Button
            color="white"
            variant="ghost"
            h="fit-content"
            minW="36"
            py={2}
            left={-2}
          >
            <HStack gap={2}>
              <Icon as={Wallet} />
              <Text fontSize="xs">{truncatePubkey(publicKey.toBase58())}</Text>
            </HStack>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody as={VStack} gap={4} py={4}>
            <Button
              bg="brand.secondary"
              justifyContent="center"
              alignItems="center"
              rounded="lg"
              cursor="copy"
              onClick={onPubkeyCopy}
              h={10}
              as={HStack}
              spacing={6}
              textAlign="center"
              role="group"
              fontWeight="normal"
              fontSize={["xs", "sm", "md"]}
            >
              <Text color="gray.300" fontFamily="mono" fontSize="xs">
                Address: {truncatePubkey(publicKey.toBase58())}
              </Text>
              <chakra.span
                bg={hasCopiedPubkey ? "green.600" : "brand.tertiary"}
                rounded="full"
                w={8}
                h={8}
                as={Flex}
                alignItems="center"
                justifyContent="center"
                _groupHover={{
                  bg: hasCopiedPubkey ? "green.500" : "brand.quaternary",
                }}
              >
                <Icon
                  as={hasCopiedPubkey ? Check : ClipboardCopy}
                  aria-label={"Copy Command"}
                  w={4}
                  h={4}
                  textAlign="center"
                />
              </chakra.span>
            </Button>

            <Button
              colorScheme="red"
              leftIcon={<Icon as={LogOut} />}
              onClick={logout}
            >
              Logout
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    ) : (
      <>
        <Button color="white" onClick={onModalOpen} {...otherProps}>
          {children || "Get Started"}
        </Button>

        <Modal isOpen={isModalOpen} onClose={onModalClose} size="xs">
          <ModalOverlay />
          <ModalContent>
            <ModalBody p={2}>
              <Alert status="info" rounded="lg">
                <VStack alignItems="start" gap={4}>
                  <HStack>
                    <AlertIcon />

                    <AlertTitle>Please use devnet</AlertTitle>
                  </HStack>

                  <AlertDescription>
                    We are currently only deployed on the Solana devnet. Please
                    change your Solana wallet&apos;s network to devnet. If you
                    have already done this, you can ignore this alert.
                  </AlertDescription>
                </VStack>
              </Alert>

              <VStack>
                {publicKey ? (
                  <>
                    {isLoadingUser ? (
                      <Spinner />
                    ) : user ? (
                      <Button
                        onClick={async () => {
                          await login();
                        }}
                        isLoading={isSigningIn}
                      >
                        Sign Message
                      </Button>
                    ) : (
                      <VStack
                        as="form"
                        gap={4}
                        onSubmit={handleSubmit(async (data: SignUpForm) => {
                          console.log(data);
                          await login(data.username);
                        })}
                      >
                        <FormControl isRequired>
                          <FormLabel>Username</FormLabel>
                          <Input
                            {...register("username", { required: true })}
                          />
                        </FormControl>
                        <Button
                          color="white"
                          type="submit"
                          isLoading={isSigningIn}
                        >
                          Sign Up
                        </Button>
                      </VStack>
                    )}
                  </>
                ) : (
                  <>
                    <VStack my={4} gap={4}>
                      {wallets.filter(
                        (wallet) => wallet.readyState === "Installed"
                      ).length > 0 ? (
                        wallets
                          .filter((wallet) => wallet.readyState === "Installed")
                          .map((wallet) => (
                            <Button
                              key={wallet.adapter.name}
                              onClick={() => select(wallet.adapter.name)}
                              leftIcon={
                                <Image
                                  src={wallet.adapter.icon}
                                  alt={wallet.adapter.name}
                                  h={6}
                                  w={6}
                                />
                              }
                            >
                              <Text>{wallet.adapter.name}</Text>
                            </Button>
                          ))
                      ) : (
                        <>
                          <Text mx={4} textAlign="center">
                            Looks like you don&apos;t have a Solana wallet
                            installed. We recommend using{" "}
                            <Link
                              href="https://phantom.app"
                              color="purple.400"
                              _hover={{ color: "purple.500" }}
                            >
                              Phantom
                            </Link>{" "}
                            if you are just starting out.
                          </Text>

                          <Button
                            isExternal
                            href="https://phantom.app"
                            as={Link}
                            leftIcon={
                              <ChakraAvatar
                                src="/assets/phantom.png"
                                h={5}
                                w={5}
                              />
                            }
                            rightIcon={<Icon as={ExternalLink} />}
                          >
                            Get Phantom
                          </Button>

                          <Text mx={4} textAlign="center">
                            Alternatively, click on the button below to login
                            with Google or email (this uses{" "}
                            <Link
                              href="https://tor.us"
                              color="blue.400"
                              _hover={{ color: "blue.500" }}
                            >
                              Torus
                            </Link>{" "}
                            which creates a non-custodial wallet associated to
                            your login method)
                          </Text>
                        </>
                      )}

                      <Button color="white" onClick={onCollapsedWalletsToggle}>
                        {isCollapsedWalletsOpen ? "Hide" : "Show"} unavailable
                        wallets
                      </Button>
                      <Collapse in={isCollapsedWalletsOpen} unmountOnExit>
                        <VStack my={4} gap={4}>
                          {wallets.filter(
                            (wallet) => wallet.readyState !== "Installed"
                          ).length > 0 ? (
                            wallets
                              .filter(
                                (wallet) => wallet.readyState !== "Installed"
                              )
                              .map((wallet) => (
                                <Button
                                  key={wallet.adapter.name}
                                  onClick={() => select(wallet.adapter.name)}
                                  leftIcon={
                                    <Image
                                      src={wallet.adapter.icon}
                                      alt={wallet.adapter.name}
                                      h={6}
                                      w={6}
                                    />
                                  }
                                >
                                  <Text>{wallet.adapter.name}</Text>
                                </Button>
                              ))
                          ) : (
                            <Text>No unavailable wallets!</Text>
                          )}
                        </VStack>
                      </Collapse>
                    </VStack>
                    <Divider />
                    <Button
                      onClick={connectWithTorus}
                      variant="unstyled"
                      w="full"
                      _hover={{
                        background: "brand.secondary",
                      }}
                      h="fit-content"
                      py={4}
                    >
                      <VStack gap={4}>
                        <AvatarGroup>
                          <ChakraAvatar
                            name="Google"
                            src="/assets/google.png"
                            backgroundColor="brand.secondary"
                          />
                          <ChakraAvatar name="Torus" src="/assets/torus.svg" />
                        </AvatarGroup>
                        <Text wordBreak="break-all">
                          Login with email or Google
                        </Text>
                      </VStack>
                    </Button>
                  </>
                )}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

export default ConnectWallet;
