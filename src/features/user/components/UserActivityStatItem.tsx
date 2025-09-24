import Image from "next/image";

interface UserActivityStatItemProps {
  icon: string;
  label: string;
  count: number;
}

export default function UserActivityStatItem({ icon, label, count }: UserActivityStatItemProps) {
  return (
    <li className="flex flex-col items-center gap-0.5 md:gap-1">
      {/* alt는 의미를 전달하도록 설정하거나, 장식용 이미지이고 label로 충분하다면 alt="" 또는 aria-hidden="true" 사용 */}
      <Image
        src={icon}
        alt={`${label} 아이콘`}
        width={20}
        height={20}
        className="h-[18px] w-[18px] object-contain md:h-[23px] md:w-[23px]"
      />
      <span className="mt-0.5 text-[14px] text-gray-600 md:mt-1">{label}</span>
      <span className="text-[14px] font-semibold md:text-lg">{count}</span>
    </li>
  );
}
