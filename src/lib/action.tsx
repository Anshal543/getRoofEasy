"use server";

import { api } from "@/utils/axios";
import { fetchTableData } from "./data-service";

export async function fetchSearchSuggestions(query: string, userId?: number) {
  return await fetchTableData(1, 5, query, undefined, userId);
}

export async function getDbUserIdFromClerk(
  email: string,
): Promise<number | null> {
  if (!email) {
    return null;
  }
  try {
    const response = await api.get(`api/users/${email}/`);
    if (response.status === 200) {
      return response.data.data.id;
    } else {
      console.error("Error fetching user ID:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}
