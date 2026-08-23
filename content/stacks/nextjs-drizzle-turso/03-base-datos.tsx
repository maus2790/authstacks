import { CodeBlock } from "@/components/ui/CodeBlock";

export default function BaseDatos() {
  return (
    <>
      <header className="content-header">
        <h1 className="content-title">Correos, Logger y Rate Limit</h1>
        <p className="content-subtitle">
          Envío de correos con Resend, sistema de logs y protección contra ataques de fuerza bruta
        </p>
      </header>

      <section className="section-card">
        <h2 className="section-title">
          <span className="section-icon">📧</span>
          ETAPA 6: Correos con Resend, Logger y utilidades
        </h2>
        <p className="section-paragraph">
          <strong>Objetivo:</strong> Configurar el envío de correos electrónicos con Resend, crear un
          logger para actividad y una utilidad de estilos.
        </p>
        <h3 className="subsection-title">6.1. <code>lib/mail.ts</code></h3>
        <p className="section-paragraph">
          Configura el cliente de Resend y genera las plantillas HTML para verificación y
          restablecimiento de contraseña:
        </p>
        <CodeBlock
          code={`import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Error al enviar email:', error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error en sendEmail:', error);
    throw error;
  }
}

export function generateVerificationEmail(email: string, token: string, appUrl: string) {
  const verifyUrl = \`\${appUrl}/api/auth/verify-email?token=\${token}\`;
  return {
    subject: 'Verifica tu correo electrónico',
    html: \`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de correo</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0; color: white; }
      .content { padding: 30px 24px; }
      .button { display: inline-block; padding: 14px 32px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background 0.2s; }
      .button:hover { background: #5a6fd6; }
      .footer { text-align: center; padding: 20px; font-size: 13px; color: #888; border-top: 1px solid #eee; }
      .link { word-break: break-all; color: #667eea; }
      @media (max-width: 480px) { .container { padding: 10px; } .header { padding: 20px 0; } .content { padding: 20px 16px; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0;">Verifica tu cuenta</h1>
      </div>
      <div class="content">
        <p style="font-size:16px; line-height:1.6;">Hola,</p>
        <p style="font-size:16px; line-height:1.6;">Gracias por registrarte en <strong>nuestra plataforma</strong>. Para completar el proceso, por favor verifica tu dirección de correo electrónico haciendo clic en el siguiente botón:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="\${verifyUrl}" class="button">Verificar correo</a>
        </p>
        <p style="font-size:14px; line-height:1.6; color:#555;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="font-size:14px; line-height:1.6;"><a href="\${verifyUrl}" class="link">\${verifyUrl}</a></p>
        <p style="font-size:14px; line-height:1.6; color:#555;">Este enlace expirará en <strong>24 horas</strong>.</p>
        <p style="font-size:14px; line-height:1.6; color:#555;">Si no solicitaste este registro, ignora este mensaje.</p>
      </div>
      <div class="footer">
        <p>&copy; 2026 Tu Plataforma. Todos los derechos reservados.</p>
      </div>
    </div>
  </body>
</html>\`,
  };
}

export function generateResetPasswordEmail(email: string, token: string, appUrl: string) {
  const resetUrl = \`\${appUrl}/reset-password/\${token}\`;
  return {
    subject: 'Restablece tu contraseña',
    html: \`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer contraseña</title>
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      .header { text-align: center; padding: 30px 0; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px 12px 0 0; color: white; }
      .content { padding: 30px 24px; }
      .button { display: inline-block; padding: 14px 32px; background: #f5576c; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background 0.2s; }
      .button:hover { background: #e04a5f; }
      .footer { text-align: center; padding: 20px; font-size: 13px; color: #888; border-top: 1px solid #eee; }
      .link { word-break: break-all; color: #f5576c; }
      @media (max-width: 480px) { .container { padding: 10px; } .header { padding: 20px 0; } .content { padding: 20px 16px; } }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0;">Restablecer contraseña</h1>
      </div>
      <div class="content">
        <p style="font-size:16px; line-height:1.6;">Hola,</p>
        <p style="font-size:16px; line-height:1.6;">Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="\${resetUrl}" class="button">Restablecer contraseña</a>
        </p>
        <p style="font-size:14px; line-height:1.6; color:#555;">Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="font-size:14px; line-height:1.6;"><a href="\${resetUrl}" class="link">\${resetUrl}</a></p>
        <p style="font-size:14px; line-height:1.6; color:#555;">Este enlace expirará en <strong>1 hora</strong>.</p>
        <p style="font-size:14px; line-height:1.6; color:#555;">Si no solicitaste este cambio, ignora este mensaje.</p>
      </div>
      <div class="footer">
        <p>&copy; 2026 Tu Plataforma. Todos los derechos reservados.</p>
      </div>
    </div>
  </body>
</html>\`,
  };
}`}
        />

        <h3 className="subsection-title">6.2. <code>lib/logger.ts</code></h3>
        <CodeBlock
          code={`import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";

export async function logActivity({
  userId,
  action,
  details,
  ip,
  userAgent,
}: {
  userId?: number;
  action: string;
  details: string;
  ip?: string;
  userAgent?: string;
}) {
  await db.insert(activityLogs).values({
    userId,
    action,
    details,
    ip,
    userAgent,
  });
}`}
        />
        <h3 className="subsection-title">6.3. <code>lib/utils.ts</code></h3>
        <CodeBlock
          code={`import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`}
        />
      </section>
    </>
  );
}