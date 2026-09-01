import {
  Globe,
  Headphones,
  MapPinned,
  ShieldCheck,
  Timer,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { MktContainer } from '@/components/marketing/MarketingUI';

const ITEMS: Array<{
  icon: LucideIcon;
  value: string;
  label: string;
  copy?: boolean;
}> = [
  { icon: Globe, value: '220+', label: 'Countries Covered' },
  { icon: Truck, value: '1200+', label: 'Carrier Partners' },
  { icon: MapPinned, value: '10M+', label: 'Shipments Tracked' },
  { icon: Timer, value: '99.6%', label: 'On-time Delivery' },
  { icon: Headphones, value: '24/7', label: 'Customer Support' },
  {
    icon: ShieldCheck,
    value: 'Your Data is Safe',
    label: 'Bank-level encryption & secure servers',
    copy: true,
  },
];

export default function TrackingTrustBar() {
  return (
    <div className="vr-trust-wrap">
      <MktContainer>
        <ul className="vr-trust-bar">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label} className={item.copy ? 'is-copy' : undefined}>
                <span className="vr-trust-bar__glyph" aria-hidden>
                  <Icon className="vr-trust-bar__icon" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="vr-trust-bar__value">{item.value}</p>
                  <p className="vr-trust-bar__label">{item.label}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </MktContainer>
    </div>
  );
}
