import Image from "next/image";

interface UserActivityStatItemProps {
  icon: string;
  label: string;
  count: number;
}

export default function UserActivityStatItem({ icon, label, count }: UserActivityStatItemProps) {
  return (
    <li className="flex flex-col items-center gap-1">
      {/* alt는 의미를 전달하도록 설정하거나, 장식용 이미지이고 label로 충분하다면 alt="" 또는 aria-hidden="true" 사용 */}
      <Image src={icon} alt={`${label} 아이콘`} width={23} height={23} />
      <span className="mt-1 text-gray-600">{label}</span>
      <span className="text-lg font-semibold">{count}</span>
    </li>
  );
}
