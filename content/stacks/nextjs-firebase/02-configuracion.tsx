import { CodeBlock } from "@/components/ui/CodeBlock";
import { CommandBlock } from "@/components/ui/CommandBlock";

export default function Configuracion() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Configuración de Firebase</h1>
        <p className="content-subtitle">
          Las dos credenciales: App Web (navegador) y cuenta de servicio (servidor)
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🧠</span>
          1. Las DOS credenciales (clave para no confundirse)
        </h2>
        <p className="section-paragraph">
          Firebase usa <strong>dos credenciales distintas</strong>, y la gente suele
          confundirlas:
        </p>
        <CodeBlock
          code={`┌────────────────────────────┬─────────────────────────────────────┬──────────────────────────────┐
│                            │ App Web (navegador)              │ Cuenta de servicio (servidor) │
├────────────────────────────┼─────────────────────────────────┼──────────────────────────────┤
│ Dónde se usa               │ SDK web (firebase)              │ Admin SDK (firebase-admin)   │
│ Qué hace                   │ Login/registro del navegador    │ Crear cookie de sesión       │
│ Cómo obtenerla             │ Ajustes del proyecto -> Tus apps│ Ajustes del proyecto ->      │
│                            │   -> icono "</>" Web            │   Cuentas de servicio        │
│ Contiene                   │ apiKey, authDomain, appId...    │ private_key, client_email... │
│ ¿Es pública?               │ SÍ (va en NEXT_PUBLIC_*)        │ NO (solo en el servidor)     │
└────────────────────────────┴─────────────────────────────────┴──────────────────────────────┘`}
        />
        <div className="tip">
          <span className="tip-icon">🚨</span>
          <span>
            El JSON de <strong>cuenta de servicio</strong> (el que empieza con{" "}
            <code>{"{ \"type\": \"service_account\" }"}</code>) <strong>NO sirve para
            el navegador</strong>: es la clave privada del servidor. Para el login
            del navegador necesitas además la <strong>App Web</strong>, que se crea
            con el icono <code>&lt;/&gt;</code> en "Tus apps" y te da el objeto{" "}
            <code>firebaseConfig</code> con la <code>apiKey</code> (pública).
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔑</span>
          2. Habilitar Authentication
        </h2>
        <ol className="list-decimal pl-6 text-gray-300 space-y-2">
          <li>En Firebase Console, entra a tu proyecto.</li>
          <li>Menú lateral: <strong>Authentication → Empezar</strong> (habilita el producto).</li>
          <li>Pestaña <strong>Sign-in method</strong> → activa <strong>Email/Password</strong>.</li>
          <li>Guarda.</li>
        </ol>
        <div className="tip">
          <span className="tip-icon">⚠️</span>
          <span>
            Sin habilitar Authentication, el Admin SDK responde con un error tipo{" "}
            <em>"There is no configuration corresponding to the provided
            identifier"</em>. Habilita el producto primero.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🔐</span>
          3. Variables de entorno (<code>.env.local</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Crea <code>.env.local</code>. La parte 1 (cuenta de servicio) la obtienes
          en <strong>Ajustes del proyecto → Cuentas de servicio → Generar nueva
          clave privada</strong>. La parte 2 (app web) en{" "}
          <strong>Ajustes del proyecto → Tus apps</strong>:
        </p>
        <CodeBlock
          code={`# ============================================================
# 1) ADMIN SDK (servidor) — de "Cuentas de servicio" (JSON)
# ============================================================
FIREBASE_PROJECT_ID="tu-proyecto"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@tu-proyecto.iam.gserviceaccount.com"
# Importante: pega la clave con los \\n ESCAPADOS (tal como vienen en el JSON)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIIE...\\n-----END PRIVATE KEY-----\\n"

# ============================================================
# 2) SDK WEB (navegador) — de "Tus apps" (objeto firebaseConfig)
# ============================================================
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="tu-proyecto"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="tu-proyecto.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"

# URL de tu app
NEXT_PUBLIC_APP_URL="http://localhost:3000"`}
        />
        <div className="tip">
          <span className="tip-icon">🔒</span>
          <span>
            <code>FIREBASE_PRIVATE_KEY</code> es sensible: solo en{" "}
            <code>.env.local</code> (gitignored). Mantén los <code>\\n</code>{" "}
            escapados — el código del paso 4 los convierte en saltos de línea
            reales. Reinicia <code>npm run dev</code> tras editarlo.
          </span>
        </div>
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🖥️</span>
          4. Admin SDK (<code>lib/firebase/admin.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Se usa <strong>solo en el servidor</strong> (Server Actions, Server
          Components). Crea <code>lib/firebase/admin.ts</code>:
        </p>
        <CodeBlock
          code={`import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Inicializar el Admin SDK una sola vez (usa tu cuenta de servicio del .env.local)
const adminApp =
  getApps().length > 0
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // En .env el private key lleva \\n literales -> los convertimos a saltos de línea
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, "\\n"),
        }),
      });

export const adminAuth = getAuth(adminApp);
export default adminApp;`}
        />
      </section>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">🌐</span>
          5. SDK web (<code>lib/firebase/client.ts</code>) — archivo completo
        </h2>
        <p className="section-paragraph">
          Se usa <strong>solo en el navegador</strong>. Importante: se inicializa de
          forma <strong>perezosa</strong> (dentro de funciones, no al importar) para
          no romper el prerender estático de Next si las claves faltan. Crea{" "}
          <code>lib/firebase/client.ts</code>:
        </p>
        <CodeBlock
          code={`"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Inicialización perezosa: NO se ejecuta al importar (evita romper el
// prerender estático de Next si las claves faltan o en SSR).
// Se llama solo dentro de handlers del navegador.
export function getFirebaseApp(): FirebaseApp {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  return app;
}

export function getClientAuth(): Auth {
  return getAuth(getFirebaseApp());
}`}
        />
      </section>
    </>
  );
}
