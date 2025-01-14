// server.ts
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { blogRepository } from "@/models/Blog";
import { userRepository } from "@/models/User";
import { Like, likeRepository } from "@/models/action/Like";

// Inisialisasi app Next.js
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Membuat server HTTP
  const server = createServer((req, res) => {
    handle(req, res);
  });

  // Setup Socket.IO
  const io = new Server(server, {
    cors: {
      origin: "*", // sesuaikan dengan domain yang digunakan
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    // Contoh event, menerima like dari frontend dan broadcast perubahan
    socket.on("add-like", async (data) => {
      const { user_id, content_id, content_type } = data;

      try {
        const validContentTypes: ("blog" | "project")[] = ["blog", "project"];
        if (!validContentTypes.includes(content_type)) {
          socket.emit("error", "Invalid content_type.");
          return;
        }

        const cekBLog = await blogRepository()
          .whereEqualTo("id", content_id)
          .findOne();
        if (!cekBLog) {
          socket.emit("error", "Blog ID tidak ditemukan.");
          return;
        }

        const cekUer = await userRepository()
          .whereNotEqualTo("id", user_id)
          .findOne();
        if (!cekUer) {
          socket.emit("error", "User ID tidak ditemukan.");
          return;
        }

        const repository = likeRepository();
        const data = await repository
          .whereEqualTo("content_type", content_type)
          .whereEqualTo("content_id", content_id)
          .whereEqualTo("user_id", user_id)
          .findOne();

        if (data) {
          await repository.delete(data.id);
          socket.emit("like-status", {
            status: false,
            message: "Like berhasil dihapus",
          });
        } else {
          const newLike = new Like();
          newLike.user_id = user_id;
          newLike.content_id = content_id;
          newLike.content_type = content_type;
          newLike.created_at = new Date();
          const createdData = await repository.create(newLike);
          socket.emit("like-status", {
            status: true,
            message: "Like berhasil ditambahkan",
            data: createdData,
          });
        }
      } catch (err) {
        socket.emit("error", "Error: " + err);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

  // Menjalankan server
  server.listen(3000, () => {
    console.log("> Server listening on http://localhost:3000");
  });
});
