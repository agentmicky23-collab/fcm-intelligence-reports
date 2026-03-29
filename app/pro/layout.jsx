/**
 * Layout for /pro routes
 * Includes Crisp live chat widget (loads only on Pro dashboard)
 */

export default function ProLayout({ children }) {
  return (
    <>
      {children}
      {/* Crisp Live Chat — replace CRISP_WEBSITE_ID with your actual ID */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.$crisp=[];
            window.CRISP_WEBSITE_ID="YOUR_CRISP_WEBSITE_ID";
            (function(){
              var d=document;
              var s=d.createElement("script");
              s.src="https://client.crisp.chat/l.js";
              s.async=1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `,
        }}
      />
    </>
  );
}
