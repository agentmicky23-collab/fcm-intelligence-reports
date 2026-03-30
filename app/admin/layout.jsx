export const metadata = {
  title: "Mission Control | FCM Intelligence",
  description: "FCM Intelligence command centre",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #010409; color: #e6edf3; font-family: 'DM Sans', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #1e2733; border-radius: 2px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
