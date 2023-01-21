import { useQuery } from "react-query";
import axios from "axios";

export async function useCreateUser(options: any) {
    const {data, status} = useQuery("user-create", async() => {
        const res = await axios({
            method: 'POST',
            url: '/api/user/create',
            headers: {
              'Content-Type': 'application/json'
            },
            data: options
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while loading user"]

   return [data, status, "User has been successfully saved!"]
}



export async function useReadUser(id: string) {
    const {data, status} = useQuery("user-read", async() => {
        const res = await axios({
            method: 'GET',
            url: '/api/user/read',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
                id: id
            }
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while loading user"]

   return [data, status, "User has been successfully fetched!"]
}


export async function useDeleteUser(id: string) {
    const {data, status} = useQuery("user-delete", async() => {
        const res = await axios({
            method: 'DELETE',
            url: '/api/user/delete',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
                id: id
            }
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while deleting user"]

   return [data, status, "User has been successfully deleted!"]
}


export async function useUpdateUser(options: any) {
    const {data, status} = useQuery("user-update", async() => {
        const res = await axios({
            method: 'PATCH',
            url: '/api/user/update',
            headers: {
              'Content-Type': 'application/json'
            },
            data: options
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while updating user"]

   return [data, status, "User has been successfully updated!"]
}