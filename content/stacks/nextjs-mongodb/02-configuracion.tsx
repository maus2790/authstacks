import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de MongoDB</h1>
        <p className="content-subtitle">
          URI de Atlas, variables de entorno, conexión y modelo User
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          1. Obtener la connection string de Atlas
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>En <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">MongoDB Atlas</a>, crea un cluster <strong>M0</strong> (Free).</li>
          <li>Crea un <strong>Database User</strong> (Authentication → Database Access → Add New User) con nombre y contraseña.</li>
          <li>
            Añade tu IP en <strong>Network Access → Add IP Address</strong> (o "Allow
            access from anywhere" para desarrollo).
          </li>
          <li>
            En tu cluster, clic en <strong>Connect → Drivers</strong> → copia el
            connection string:
          </li>
        </ol>
        <CodeBlock
          code={`mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>
            El connection string <strong>no incluye nombre de base de datos</strong>:
            se lo añades tú antes del <code>?</code> (ej:{" "}
            <code>/next-auth?</code>). Si no pones nombre, Mongo usa la base{" "}
            <code>test</code>.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          2. Variables de entorno (<code>.env.local</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`# MongoDB Atlas (tu connection string + nombre de la base de datos)
MONGODB_URI="mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/next-auth?retryWrites=true&w=majority"

# JWT (firma la cookie de sesión) — genera con: openssl rand -hex 32
JWT_SECRET="tu-secreto-generado"

# URL de tu app
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <code>JWT_SECRET</code> es sensible: genéralo con{" "}
            <code>openssl rand -hex 32</code> y nunca lo subas al repositorio.
            Reinicia <code>npm run dev</code> tras editarlo.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          3. Conexión a MongoDB (<code>lib/db/index.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Usa el patrón singleton de Mongoose (evita abrir cientos de conexiones con
          el hot reload de Next):
        </p>
        <CodeBlock
          code={`import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Define MONGODB_URI en .env.local");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Patrón singleton: evita múltiples conexiones en desarrollo (hot reload)
const globalForMongoose = globalThis as unknown as {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
};
globalForMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📋</span>
          4. Modelo User (<code>lib/db/models.ts</code>) — archivo completo
        </h2>
        <CodeBlock
          code={`import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const User: mongoose.Model<IUser> =
  models.User || model<IUser>("User", userSchema);`}
        />
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            <code>models.User || model(...)</code> evita el error de Mongoose de
            "OverwriteModelError" en desarrollo (el modelo se re-compila en cada
            hot reload). Nunca guardes el <code>passwordHash</code> en el cliente.
          </span>
        </div>
      </section>
    </>
  );
}
