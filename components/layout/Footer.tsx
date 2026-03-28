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
              <li><Link href="/opportunities" className="text-sm text-muted-foreground hover:text-primary transition-colors">Opportunities</Link></li>
              <li><Link href="/insider" className="text-sm text-muted-foreground hover:text-primary transition-colors">Insider</Link></li>
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

        {/* Legal Links */}
        <div className="mt-8 pt-8 border-t border-gray-900">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
            <span className="text-gray-700">|</span>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <span className="text-gray-700">|</span>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
            <span className="text-gray-700">|</span>
            <Link href="/refunds" className="text-xs text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} FCM Intelligence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
