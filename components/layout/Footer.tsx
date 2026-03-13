import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-black py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo-transparent.png"
              alt="FCM Intelligence"
              width={120}
              height={40}
              className="h-8 w-auto mb-4"
            />
            <p className="text-sm text-muted-foreground">
              Reports & Listings — Post Office business intelligence for serious buyers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-primary">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Listings</Link></li>
              <li><Link href="/reports" className="text-sm text-muted-foreground hover:text-primary transition-colors">Report Pricing</Link></li>
              <li>
                <a href="https://fcm-intelligence-nextjs.vercel.app" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FCM Intelligence ↗
                </a>
              </li>
              <li>
                <a href="https://fcm-intelligence-nextjs.vercel.app/contact" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-primary">Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All listing data is sourced from third-party platforms (RightBiz, Daltons, BusinessesForSale). 
              FCM Intelligence verifies and curates but does not guarantee accuracy. Always conduct your own 
              due diligence before making any purchase decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-900 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FCM Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
