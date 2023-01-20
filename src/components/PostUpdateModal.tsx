import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  VStack,
  ButtonProps,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import { BN } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Anchor, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import useProgram from "../hooks/useProgram";

interface NewUpdateForm {
  name: string;
  description: string;
}

interface CreateUpdateModalProps extends ButtonProps {
  buidl: any; // TODO: type this
}

const CreaeUpdateModal = ({
  children = "Post Update",
  buidl,
  ...otherProps
}: CreateUpdateModalProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { program } = useProgram();

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<NewUpdateForm>();

  const handlePostUpdate = useCallback(
    async (data: NewUpdateForm) => {
      if (!program) {
        throw new Error("Program not initialized");
      }

      if (!session?.user?.name) {
        throw new Error("User not logged in");
      }

      console.log(data);

      // TODO: create buidl on db and store the id in db_id

      let db_id = "test";

      const updateAccountKeypair = Keypair.generate();

      //   program.methods
      //     .postUpdate(db_id, new BN(buidl.updatesTillNow).add(1))
      //     .accounts({
      //       buidlAccount: new PublicKey(buidl.address),
      //       payer: new PublicKey(session.user.name),
      //       updateAccount: updateAccountKeypair.publicKey,
      //     })
      //     .signers([updateAccountKeypair])
      //     .rpc();
    },
    [program, session?.user?.name, buidl]
  );

  const { mutate, isLoading } = useMutation(handlePostUpdate);

  return (
    <>
      <Button
        leftIcon={<Icon as={PlusIcon} />}
        onClick={onOpen}
        {...otherProps}
      >
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Update</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              gap={4}
              as="form"
              onSubmit={handleSubmit((data) => mutate(data))}
            >
              <FormControl isRequired isInvalid={errors.name ? true : false}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register("name", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                  })}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl
                isRequired
                isInvalid={errors.description ? true : false}
              >
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register("description", {
                    required: {
                      value: true,
                      message: "Required",
                    },
                  })}
                />
                <FormHelperText>Details on the update</FormHelperText>
                {errors.description && (
                  <FormErrorMessage>
                    {errors.description.message}
                  </FormErrorMessage>
                )}
              </FormControl>

              <Button isLoading={isLoading} type="submit">
                Post Update
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreaeUpdateModal;
