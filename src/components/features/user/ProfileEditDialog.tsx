"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { Position } from "@/enums/position";
import { PositionKey, UserProfileData } from "@/types/user";
import { Camera, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUpdateProfile, useUpdateProfileImage, useWithdrawAccount } from "../../../hooks/queries/useUserQueries";
import { cn } from "../../../lib/utils";

interface ProfileEditDialogProps {
  userProfile: UserProfileData;
  onProfileUpdate: (updatedProfile: Partial<UserProfileData>) => void; // 업데이트된 정보를 부모로 전달
  // triggerButton?: React.ReactNode; // 외부에서 트리거 버튼을 주입하고 싶을 경우
}

export default function ProfileEditDialog({ userProfile, onProfileUpdate }: ProfileEditDialogProps) {

  console.log("ProfileEditDialog userProfile", userProfile);

  const router = useRouter();

  const [email, setEmail] = useState(userProfile.email || "");
  const [studentNumber, setStudentNumber] = useState(userProfile.studentNumber || "");
  const [gamjaBatch, setGamjaBatch] = useState(userProfile.gamjaBatch?.toString() || "");
  const [position, setPosition] = useState(userProfile.position || "");
  const [isWithdrawing, setIsWithdrawing] = useState(false); // 회원탈퇴 로딩 상태
  // TODO: 이미지 파일 상태 및 미리보기 URL 상태 추가
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(userProfile.profileImageUrl || null);


  // userProfile prop이 변경될 때 내부 상태 업데이트 (선택적)
  useEffect(() => {
    setEmail(userProfile.email || "");
    setStudentNumber(userProfile.studentNumber || "");
    setGamjaBatch(userProfile.gamjaBatch?.toString() || "");
    setPosition(userProfile.position || "");
    setPreviewUrl(userProfile.profileImageUrl || null);
  }, [userProfile]);

  // 컴포넌트 언마운트 시 메모리 누수 방지를 위한 cleanup
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 뮤테이션 훅들
  const updateProfileImageMutation = useUpdateProfileImage();
  const updateProfileMutation = useUpdateProfile();
  const withdrawAccountMutation = useWithdrawAccount();

  const handlePositionChange = (value: string) => {
    setPosition(value as PositionKey);
  };

  const handleSaveChanges = async () => {
    try {
      let profileImageUrl = userProfile.profileImageUrl;

      // 새로운 이미지가 선택된 경우 먼저 이미지 업로드
      if (selectedImage) {
        console.log('프로필 이미지 업로드 중...');
        profileImageUrl = await updateProfileImageMutation.mutateAsync(selectedImage);
        console.log('프로필 이미지 업로드 완료:', profileImageUrl);
      }

      // 프로필 데이터 업데이트
      const updatedData: Partial<UserProfileData> = {
        email,
        studentNumber,
        gamjaBatch: gamjaBatch ? parseInt(gamjaBatch, 10) : undefined,
        position: position as PositionKey,
        profileImageUrl
      };

      console.log('프로필 업데이트 중...');
      const updatedProfile = await updateProfileMutation.mutateAsync(updatedData);
      console.log('프로필 업데이트 완료:', updatedProfile);

      // 부모 컴포넌트에 업데이트된 프로필 전달
      onProfileUpdate(updatedProfile);

      alert('프로필이 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleWithdrawAccount = () => {
    withdrawAccountMutation.mutate();
  };


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // 이전 blob URL 정리 (메모리 누수 방지)
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 w-full max-w-[120px] rounded-lg text-sm hover:cursor-pointer"
        >
          프로필 수정
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription>
            변경사항을 입력하고 완료 버튼을 눌러주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* 프로필 이미지 수정 영역 */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-24 h-24 rounded-full bg-gray-200 group cursor-pointer" onClick={() => document.getElementById('profileImageUploadModal')?.click()}>
              {/* 현재 프로필 이미지 또는 기본 이미지 표시 (previewUrl 사용) */}
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="프로필 이미지"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 rounded-full">
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
                <Camera className="text-white w-8 h-8" />
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => document.getElementById('profileImageUploadModal')?.click()}>
              이미지 변경
            </Button>
            <Input
              type="file"
              className="hidden"
              id="profileImageUploadModal"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {/* 이메일 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email-modal" className="text-right col-span-1">
              이메일
            </Label>
            <Input
              id="email-modal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3 flex items-center rounded-full px-6 h-12 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full focus:ring-2 focus:ring-[#20242B]/20 transition"
              placeholder="이메일을 입력하세요"
            />
          </div>
          {/* 직군 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position-modal" className="text-right col-span-1">
              직군
            </Label>
            <Select
              value={position}
              onValueChange={handlePositionChange}
            >
              <SelectTrigger className="col-span-3 flex items-center rounded-full px-6 h-12 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full focus:ring-2 focus:ring-[#20242B]/20 transition">
                <SelectValue placeholder="직군을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Position).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* 학번 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentNumber-modal" className="text-right col-span-1">
              학번
            </Label>
            <Input
              id="studentNumber-modal"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              className="col-span-3 flex items-center rounded-full px-6 h-12 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full focus:ring-2 focus:ring-[#20242B]/20 transition"
              placeholder="학번을 입력하세요"
            />
          </div>
          {/* 감자 기수 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gamjaBatch-modal" className="text-right col-span-1">
              감자 기수
            </Label>
            <Input
              id="gamjaBatch-modal"
              value={gamjaBatch}
              onChange={(e) => setGamjaBatch(e.target.value)}
              className="col-span-3 flex items-center rounded-full px-6 h-12 border border-[#F2F4F6] outline-none text-[#222] placeholder:text-[#D9D9D9] text-base bg-transparent w-full focus:ring-2 focus:ring-[#20242B]/20 transition"
              placeholder="기수를 입력하세요"
              type="number"
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-between w-full">
            {/* 회원탈퇴 AlertDialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn("text-[#B5BBC7] underline")}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? "처리 중..." : "회원탈퇴"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>정말로 회원탈퇴를 하시겠습니까?</AlertDialogTitle>
                  <AlertDialogDescription className="space-y-2">
                    <p>회원탈퇴를 진행하면 다음과 같은 데이터가 영구적으로 삭제됩니다:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li>프로필 정보 및 개인정보</li>
                      <li>작성한 모든 게시글과 댓글</li>
                      <li>좋아요 및 활동 기록</li>
                    </ul>
                    <p className="font-semibold text-red-600">
                      이 작업은 되돌릴 수 없습니다.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleWithdrawAccount}
                    disabled={isWithdrawing}
                    className={cn(
                      "bg-red-600 hover:bg-red-700 focus:ring-red-600",
                      isWithdrawing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isWithdrawing ? "처리 중..." : "회원탈퇴"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* 취소/완료 버튼 */}
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSaveChanges}
                disabled={updateProfileImageMutation.isPending || updateProfileMutation.isPending}
              >
                {updateProfileImageMutation.isPending
                  ? '이미지 업로드 중...'
                  : updateProfileMutation.isPending
                    ? '프로필 업데이트 중...'
                    : '완료'
                }
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 임시 UserIcon (실제 아이콘 라이브러리 사용 권장, 또는 공유 유틸리티로 분리)
// function UserIcon(props: React.SVGProps<SVGSVGElement>) { ... }