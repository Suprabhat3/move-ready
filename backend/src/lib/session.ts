import type { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth";

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthedRequest = Request & {
  user?: SessionUser;
};

export async function getSessionUser(
  req: Request,
): Promise<SessionUser | null> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    role: session.user.role as Role,
    emailVerified: session.user.emailVerified,
    createdAt: session.user.createdAt,
    updatedAt: session.user.updatedAt,
  };
}

function withRoles(allowedRoles: Role[]) {
  return async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await getSessionUser(req);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Session middleware error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export const requireAuth = withRoles([Role.TENANT, Role.SITE_AGENT, Role.ADMIN]);
export const requireTenant = withRoles([Role.TENANT]);
export const requireAgentOrAdmin = withRoles([Role.SITE_AGENT, Role.ADMIN]);
export const requireAdmin = withRoles([Role.ADMIN]);
