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
  useToast,
} from "@chakra-ui/react";
import { Buidl } from "@prisma/client";
import { BN } from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey } from "@solana/web3.js";
import axios from "axios";
import { ObjectId } from "bson";
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
  buidl: Buidl;
}

const CreaeUpdateModal = ({
  children = "Post Update",
  buidl,
  ...otherProps
}: CreateUpdateModalProps) => {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { program } = useProgram();

  const toast = useToast();
  const { connection } = useConnection();

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

      let db_id = new ObjectId().toString();

      const updateAccountKeypair = Keypair.generate();

      const sig = await program.methods
        .postUpdate(db_id, new BN(buidl.updatesTillNow || 0).add(new BN(1)))
        .accounts({
          buidlAccount: new PublicKey(buidl.pubkey),
          payer: new PublicKey(session.user.name),
          updateAccount: updateAccountKeypair.publicKey,
        })
        .signers([updateAccountKeypair])
        .rpc();

      await connection.confirmTransaction(sig);

      const {
        data: { update },
      } = await axios.post("/api/updates", {
        id: db_id,
        buidlId: buidl.id,
        name: data.name,
        description: data.description,
        updateNumber: (buidl.updatesTillNow || 0) + 1,
        pubkey: updateAccountKeypair.publicKey.toBase58(),
      });

      await axios.patch("/api/buidls/update", {
        id: buidl.id,
        updates: (buidl.updatesTillNow || 0) + 1,
      });

      console.log("created update", update);

      toast({
        title: "Update created",
        description: "Your update has been created",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    [program, session?.user?.name, buidl, connection, toast]
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
