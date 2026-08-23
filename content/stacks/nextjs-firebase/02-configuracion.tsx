import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Firebase</h1>
        <p className="content-subtitle">
          Clientes, variables de entorno y middleware
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔧</span>
          1. Creación de proyecto en Firebase
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>Ve a <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Firebase Console</a>.</li>
          <li>Haz clic en <strong>"Agregar proyecto"</strong> y sigue los pasos.</li>
          <li>Después de crear el proyecto, haz clic en <strong>"Agregar Firebase a tu app web"</strong>.</li>
          <li>Registra la aplicación con un nombre (ej. "mi-app").</li>
          <li>Copia el objeto de configuración de Firebase (claves, etc.).</li>
          <li>Habilita <strong>Authentication</strong> en el panel: ve a <strong>Authentication → Sign-in methods</strong> y activa <strong>Email/Password</strong> y <strong>Google</strong>.</li>
          <li>Habilita <strong>Firestore Database</strong> en modo <strong>Test</strong> (para desarrollo).</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>En producción, configura reglas de seguridad adecuadas para Firestore y Storage.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          2. Variables de entorno (<code>.env.local</code>)
        </h2>
        <p className="section-paragraph">Crea el archivo <code>.env.local</code> con las siguientes variables:</p>
        <CodeBlock
          code={`# Firebase Client (público)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="mi-app.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="mi-app"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="mi-app.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"

# Firebase Admin (servidor - privado)
FIREBASE_PROJECT_ID="mi-app"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@mi-app.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----"`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>La clave privada del Admin SDK debe estar en una variable de entorno y nunca exponerse en el cliente. Para desarrollo, puedes copiarla de la consola de Firebase → Configuración → Cuentas de servicio → Generar nueva clave privada.</span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📦</span>
          3. Cliente de Firebase (navegador)
        </h2>
        <p className="section-paragraph">
          Crea <code>lib/firebase/client.ts</code> con el SDK del cliente:
        </p>
        <CodeBlock
          code={`import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase solo una vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Clientes para autenticación, base de datos y almacenamiento
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configurar persistencia de sesión
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistencia configurada"))
  .catch((error) => console.error("Error configurando persistencia:", error));

export default app;`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🛡️</span>
          4. Admin SDK de Firebase (servidor)
        </h2>
        <p className="section-paragraph">
          Crea <code>lib/firebase/admin.ts</code> para usar Firebase en el servidor:
        </p>
        <CodeBlock
          code={`import * as admin from "firebase-admin";

// Si ya existe una app admin, la reutiliza
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, "\\n"),
      }),
    });
    console.log("Firebase Admin SDK initialized");
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export default admin;`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          5. Middleware de protección
        </h2>
        <p className="section-paragraph">
          Crea <code>middleware.ts</code> en la raíz para proteger rutas del dashboard:
        </p>
        <CodeBlock
          code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/firebase/auth";

export const runtime = "nodejs";

const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
const protectedPaths = ["/dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = publicPaths.some((p) => path.startsWith(p));
  const isProtected = protectedPaths.some((p) => path.startsWith(p));

  // Obtener la sesión del usuario (desde la cookie de Firebase)
  const session = await getSession();

  if (session && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};`}
        />
        <div className="tip">
          <span className="tip-icon">💡</span>
          <span>La función <code>getSession()</code> se implementará en el paso 3 (autenticación).</span>
        </div>
      </section>
    </>
  );
}