import type { NextApiRequest } from "next";
import type { NextApiResponse } from "next";

import { Server } from "socket.io";

import { inboxEvents } from "@/server/inbox-state";

export const config = {
  api: {
    bodyParser: false,
  },
};

type NextSocketServer = {
  io?: Server;
  __inboxWired?: boolean;
};

type NextNetSocket = {
  server: NextSocketServer;
};

type NextSocketResponse = NextApiResponse & {
  socket: NextNetSocket;
};

export default function handler(_req: NextApiRequest, res: NextSocketResponse) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server as unknown as object, {
      path: "/api/ws/inbox",
      cors: {
        origin: true,
        credentials: true,
      },
    });

    const nsp = io.of("/inbox");
    nsp.on("connection", (socket) => {
      const orgIdRaw = socket.handshake.auth?.organizationId;
      const orgId = typeof orgIdRaw === "string" ? orgIdRaw.trim() : "";
      if (orgId.length > 0) socket.join(`org:${orgId}`);
    });

    res.socket.server.io = io;
  }

  if (!res.socket.server.__inboxWired) {
    res.socket.server.__inboxWired = true;
    const io = res.socket.server.io!;
    const nsp = io.of("/inbox");

    inboxEvents.on("new_message", ({ orgId, threadId, message }) => {
      nsp.to(`org:${orgId}`).emit("new_message", { threadId, message });
    });

    inboxEvents.on("thread_updated", ({ orgId, threadId, patch }) => {
      nsp.to(`org:${orgId}`).emit("thread_updated", { threadId, patch });
    });

    inboxEvents.on("unread_count_changed", ({ orgId, unreadCount }) => {
      nsp.to(`org:${orgId}`).emit("unread_count_changed", { unreadCount });
    });
  }

  res.status(200).end();
}
