import { AsyncHandler } from '../../utils/AsyncHandler.js';
import { user } from '../../DB/schema/user.js';
import { user_profile } from "../../DB/schema/userProfile.js";
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/backend';
import { db } from '../../DB/index.js';
import { eq, ne, and } from 'drizzle-orm';
import { userSchma } from './userValidation.js';
import { getAuth } from '@clerk/express';

const HandleUser = AsyncHandler(async (req, res) => {
  const WebhookSecret = process.env.WEBHOOK_SECRET;

  if (!WebhookSecret) {
    throw new ApiError(500, 'Webhook secret is not defined');
  }

  const {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  } = req.headers;

  if (!svixId || !svixTimestamp || !svixSignature) {
    throw new ApiError(400, 'Missing Svix headers');
  }

  const payload = await req.body;

  const body = JSON.stringify(payload);

  const webhook = new Webhook(WebhookSecret);

  let evt: WebhookEvent;

  try {
    evt = webhook.verify(body, {
      'svix-id': svixId as string,
      'svix-timestamp': svixTimestamp as string,
      'svix-signature': svixSignature as string,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw new ApiError(400, 'Invalid webhook signature');
  }
  // for development
  console.log('Received event:', evt);

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType == 'user.created') {
    try {
      if (!id || !eventType) {
        throw new ApiError(404, 'Clerk_id and Event Type not found');
      }

      const existedUser = await db.query.user.findFirst({
        where: eq(user.clerkId, id),
        columns: {
          id: true,
        },
      });

      if (existedUser) {
        throw new ApiError(400, 'Authentication Error');
      }

      const { email_addresses, primary_email_address_id: primaryEmailAddressId } = evt.data;

      const primaryEmail = email_addresses.find((email) => email.id === primaryEmailAddressId);

      if (!primaryEmail) {
        throw new ApiError(400, 'Primary email address not found');
      }

      // debugging logs
      console.log('Clerk ID:', id);
      console.log('Primary Email:', primaryEmail.email_address);

      const newUser = await db.insert(user).values({
        clerkId: id,
        email: primaryEmail.email_address,
      });

      if (!newUser) {
        throw new ApiError(500, 'Failed to create user');
      }

      return res.status(200).json(new ApiResponse(200, newUser, 'User Created Succesfully'));
    } catch (error) {
      console.error('Error creating user:', error);
      throw new ApiError(401, 'Error Saving User');
    }
  }

  if (eventType === 'user.deleted') {
    try {
      if (!id || !eventType) {
        throw new ApiError(404, 'Clerk_id and Event Type not found');
      }

      const { userId } = getAuth(req);

      if (!userId) {
        throw new ApiError(401, ' not Authorized!');
      }

      const [existedUser] = await db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.clerkId, userId))
        .limit(1);

      if (!existedUser) {
        throw new ApiError(404, 'User not found');
      }

      const deletedUser = await db
        .delete(user)
        .where(eq(user.clerkId, userId))
        .returning();

      if (!deletedUser) {
        throw new ApiError(500, 'Error deleting User');
      }

      res.status(200).json(new ApiResponse(200, 'User Deleted Successfully'));
    } catch (error) {
      console.error('error deleting User: ', error);
      throw new ApiError(401, 'Error deleting User');
    }
  }
});

const SetDetails = AsyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new ApiError(401, 'Unauthorized');
  }

  const result = userSchma.safeParse(req.body);

  if (!result.success) {
    throw new ApiError(402, 'Validation Failed');
  }

  const user = result.data;

  const existedMobile = await db.query.user_profile.findFirst({
    where: and(eq(user_profile.mobile, user.mobile), ne(user_profile.user_id, userId)),
    columns: {
      mobile: true,
    },
  });

  if (existedMobile) {
    throw new ApiError(401, 'Mobile Number Already exist');
  }

  const [User] = await db
    .update(user_profile)
    .set({
      name: user.name,
      mobile: user.mobile,
      batch: user.batch,
      collageName: user.collageName,
    })
    .where(eq(user_profile.user_id, userId))
    .returning();

  if (!User) {
    throw new ApiError(500, 'Error Updating User Details');
  }

  res.status(200).json(new ApiResponse(200, User, 'Registration Completed'));
});

export { HandleUser, SetDetails };
