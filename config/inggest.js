import { Inngest } from "inngest";
import connectDb from "./db";
import User from "@/models/User";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });
export const syncUserCreation  = inngest.createFunction(
    {
        id:"sync-user-from-clerk"
    },
    {event:'clerk/user.created'},
     async ({event})=>{
        const{id,first_name,last_name,email_adresses,image_url} = event.data
        const userData ={
            id:id,
            email:email_adresses[0].email_adresses,
            name:first_name+' '+last_name,
            image_Url:image_url
        }
        await connectDb()
        await User.create(userData)
     }
)


export const syncUserUpdation = inngest.createFunction(
    {
        id:'update-user-from-clerk'
    },
      {event:'clerk/user.updated'},
      async ({event})=>{
        const{id,first_name,last_name,email_adresses,image_url} = event.data
        const userData ={
            id:id,
            email:email_adresses[0].email_adresses,
            name:first_name+' '+last_name,
            image_Url:image_url
        }
        await connectDb()
        await User.findByIdAndUpdate(id,userData)
      }
      
)

export const syncUserDeletion= inngest.createFunction(
    {
        id:'delete-user-from-clerk',

    },
    {event:'clerk/user.deleted'},
    async ({event})=>{
        const {id}=event.data


        await connectDb()
        await User.findByIdAndDelete(id)
    }
)



