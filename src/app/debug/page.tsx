import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function DebugPage() {
    const envStatus = {
        AUTH_SECRET: process.env.AUTH_SECRET ? "✅ Loaded" : "❌ MISSING",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ MISSING",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "✅ Loaded" : "❌ MISSING",
        NEXTAUTH_URL: process.env.NEXTAUTH_URL ? `✅ ${process.env.NEXTAUTH_URL}` : "❌ MISSING",
        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "✅ Loaded" : "❌ MISSING",
    };

    let dbStatus = "Checking...";
    let userCount = -1;
    let dbError = null;

    try {
        userCount = await prisma.user.count();
        dbStatus = "✅ Success";
    } catch (e: any) {
        dbStatus = "❌ Failed";
        dbError = e.message;
    }

    return (
        <div style={{ padding: 40, fontFamily: 'monospace', maxWidth: 800, margin: '0 auto' }}>
            <h1>🛠 System Diagnosis</h1>

            <h2>1. Environment Variables</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 40 }}>
                <tbody>
                    {Object.entries(envStatus).map(([key, value]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #ccc' }}>
                            <td style={{ padding: 10, fontWeight: 'bold' }}>{key}</td>
                            <td style={{ padding: 10, color: value.includes('✅') ? 'green' : 'red' }}>{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>2. Database Connection</h2>
            <div style={{ padding: 20, border: '1px solid #ccc', borderRadius: 8, background: '#f5f5f5' }}>
                <p><strong>Status:</strong> {dbStatus}</p>
                <p><strong>User Count:</strong> {userCount >= 0 ? userCount : 'N/A'}</p>
                {dbError && (
                    <div style={{ color: 'red', marginTop: 10, whiteSpace: 'pre-wrap' }}>
                        <strong>Error:</strong><br />
                        {dbError}
                    </div>
                )}
            </div>

            <p style={{ marginTop: 40, color: '#666' }}>
                Capture this screen and send it to the developer.
            </p>
        </div>
    );
}
