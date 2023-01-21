import { useQuery } from "react-query";
import axios from "axios";

export async function useCreateBuidls(options: any) {
    const {data, status} = useQuery("buidls-create", async() => {
        const res = await axios({
            method: 'POST',
            url: '/api/buidls/create',
            headers: {
              'Content-Type': 'application/json'
            },
            data: options
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while loading buidl"]

   return [data, status, "buidl has been successfully saved!"]
}



export async function buidlseadbuidls(id: string) {
    const {data, status} = useQuery("buidls-read", async() => {
        const res = await axios({
            method: 'GET',
            url: '/api/buidls/read',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
                id: id
            }
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while loading buidl!"]

   return [data, status, "buidl has been successfully fetched!"]
}


export async function useDeletebuidls(id: string) {
    const {data, status} = useQuery("buidls-delete", async() => {
        const res = await axios({
            method: 'DELETE',
            url: '/api/buidls/delete',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
                id: id
            }
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while deleting buidls"]

   return [data, status, "buidls has been successfully deleted!"]
}


export async function useUpdatebuidls(options: any) {
    const {data, status} = useQuery("buidls-update", async() => {
        const res = await axios({
            method: 'PATCH',
            url: '/api/buidls/update',
            headers: {
              'Content-Type': 'application/json'
            },
            data: options
          });
          return res
    })
   if(status === "error") return [null, status, "There was an error while updating buidls"]

   return [data, status, "buidls has been successfully updated!"]
}