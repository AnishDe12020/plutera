import { useQuery } from "react-query";
import axios from "axios";

export async function useCreateUser(options: any) {
    const {data, status} = useQuery("user-create", async() => {
      
    })

}