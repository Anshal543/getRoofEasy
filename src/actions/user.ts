"use server";
import { api } from "@/utils/axios";
import { currentUser } from "@clerk/nextjs/server";
export const authenticateUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return { status: 401, error: "user is not authenticatd" };
    }
    const getUserFromDb = await api.get(
      `api/users/${user.emailAddresses[0].emailAddress}/`,
    );
    if (getUserFromDb.data.status == "success") {
      return {
        status: 200,
        data: getUserFromDb.data.data,
        message: "user is authenticatd",
      };
    }
    return {
      status: 401,
      message: "user is not found",
      data: null,
    };
  } catch (error) {
    return { status: 500, error: "Something went wrong." };
  }
};

export const onSignUpUser = async (clerkId: string, email: string) => {
  try {
    const existingUser = await api.get(`api/users/${email}/`);
    if (existingUser?.data?.status === "success") {
      const updatedUser = await api.patch(
        `api/users/update/${existingUser?.data?.data?.id}/`,
        {
          clerk_user_id: clerkId,
        },
      );
      return {
        status: 200,
        message: "User already exists",
        data: updatedUser?.data?.data,
      };
    }
  } catch (error) {
    console.log("User does not exist, proceeding to create.");
  }

  try {
    const createdUser = await api.post(`api/users/create/`, {
      clerk_user_id: clerkId,
      email: email,
    });

    if (createdUser.data.status === "success") {
      return {
        status: 200,
        message: "User created successfully",
        data: createdUser?.data?.data,
      };
    }

    return {
      status: 400,
      message: "User could not be created! Try again",
    };
  } catch (error) {
    console.log("Error creating user:", error);
    return {
      status: 500,
      message: "Something went wrong.",
    };
  }
};

export const onSignInUser = async (id: string) => {
  try {
    const authUser = await api.get(`api/users/${id}/`);
    if (authUser.data.status == "success" && authUser?.data?.data?.name) {
      return {
        status: 200,
        data: authUser.data.data,
        message: "user is authenticatd",
      };
    } else if (
      authUser.data.status == "success" &&
      !authUser.data.data.name &&
      authUser.data.data.status == "onboarding"
    ) {
      return {
        status: 201,
        data: authUser.data.data,
        message: "user is found but not onboarded",
      };
    }
    return {
      status: 401,
      message: "user is not found",
      data: null,
    };
  } catch (error) {
    return { status: 500, message: "something went wrong", data: null };
  }
};
