import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextAuth(req, res, authOptions);
}
