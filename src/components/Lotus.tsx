import { COLORS } from "@/lib/data";

export default function Lotus({
  size = 32,
  color = COLORS.gold,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <path
        d="M32 52C32 52 12 40 12 24C12 16 20 10 28 14C28 14 24 20 24 28C24 28 28 22 32 20C36 22 40 28 40 28C40 20 36 14 36 14C44 10 52 16 52 24C52 40 32 52 32 52Z"
        fill={color}
        opacity=".9"
      />
      <path
        d="M32 52C32 52 20 44 18 34C22 36 26 40 32 44C38 40 42 36 46 34C44 44 32 52 32 52Z"
        fill={color}
        opacity=".4"
      />
    </svg>
  );
}
