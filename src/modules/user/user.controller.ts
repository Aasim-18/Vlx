import {AsyncHandler} from "../../utils/AsyncHandler.js";
// import {userTable} from "../../DB/schema/user.js";
import {ApiError} from "../../utils/ApiError.js";
// import {ApiResponce} from "../../utils/ApiResponse.js";
import { Webhook } from "svix";
// import { WebhookEvent } from "@clerk/backend";
import dotenv from "dotenv";


dotenv.config();





const RegisterUser = AsyncHandler(async (req, res) => {

const WebhookSecret = process.env.WEBHOOK_SECRET;

  if (!WebhookSecret) {
    throw new ApiError(500, "Webhook secret is not defined");
  }

    const {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
    } = req.headers;

    if (!svixId || !svixTimestamp || !svixSignature) {
        throw new ApiError(400, "Missing Svix headers");
    }

    


    

})

    


export { RegisterUser };