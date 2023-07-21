import { type NextApiRequest, type NextApiResponse } from "next";
import NextAuth from "next-auth";

import { authOptions } from "@/server/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextAuth(req, res, authOptions);
}
