const PAYMENT_METHODS = [
  "visa", "diners-club", "amex", "discover", "mastercard",
  "maestro", "stripe", "paypal", "interac", "verifone",
  "google-pay", "apple-pay", "bitpay", "bitcoin", "ethereum",
  "litecoin", "bitcoin-cash", "yandex", "qiwi", "elo",
  "shop-pay", "amazon-pay", "alipay", "wechat-pay", "ideal",
  "giropay", "unionpay", "jcb", "webmoney", "citadele",
  "sofort", "klarna", "skrill", "bancontact", "sepa",
  "forbrugsforeningen", "payoneer", "affirm", "paysafe",
  "facebook-pay", "venmo", "poli",
] as const;

type PaymentMethod = (typeof PAYMENT_METHODS)[number];
type PaymentMethodSize = 16 | 24 | 48;

const SIZE_WIDTHS: Record<PaymentMethodSize, number> = {
  16: 24,
  24: 35,
  48: 70,
};

interface PaymentMethodIconProps {
  method: PaymentMethod;
  size?: PaymentMethodSize;
  className?: string;
}

function PaymentMethodIcon({ method, size = 24, className }: PaymentMethodIconProps) {
  return (
    <img
      src={`/images/payments/${size}/${method}.svg`}
      width={SIZE_WIDTHS[size]}
      height={size}
      alt={method}
      className={className}
    />
  );
}

export { PAYMENT_METHODS, PaymentMethodIcon };
export type { PaymentMethod, PaymentMethodSize };
