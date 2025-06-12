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
import { Camera } from "lucide-react";
import { useEffect, useState } from "react";

// UserProfileData 타입 (Sidebar와 동일하게 유지하거나, 공유 타입으로 분리)
interface UserProfileData {
  profileImageUrl?: string;
  nickname: string;
  job?: string;
  generation?: string;
  // 기타 필요한 필드들
}

interface ProfileEditDialogProps {
  userProfile: UserProfileData;
  onProfileUpdate: (updatedProfile: Partial<UserProfileData>) => void; // 업데이트된 정보를 부모로 전달
  // triggerButton?: React.ReactNode; // 외부에서 트리거 버튼을 주입하고 싶을 경우
}

export default function ProfileEditDialog({ userProfile, onProfileUpdate }: ProfileEditDialogProps) {
  const [nickname, setNickname] = useState(userProfile.nickname);
  const [job, setJob] = useState(userProfile.job || "");
  const [generation, setGeneration] = useState(userProfile.generation || "");
  // TODO: 이미지 파일 상태 및 미리보기 URL 상태 추가
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  // const [previewUrl, setPreviewUrl] = useState<string | null>(userProfile.profileImageUrl || null);


  // userProfile prop이 변경될 때 내부 상태 업데이트 (선택적)
  useEffect(() => {
    setNickname(userProfile.nickname);
    setJob(userProfile.job || "");
    setGeneration(userProfile.generation || "");
    // setPreviewUrl(userProfile.profileImageUrl || null);
  }, [userProfile]);

  const handleSaveChanges = () => {
    // TODO: 이미지 업로드 로직이 있다면 여기서 처리 후 URL 받아오기
    const updatedData: Partial<UserProfileData> = {
      nickname,
      job,
      generation,
      // profileImageUrl: newImageUrl // 이미지 업로드 후 받은 URL
    };
    onProfileUpdate(updatedData);
    // 성공 시 Dialog는 DialogClose에 의해 자동으로 닫히거나,
    // 부모 컴포넌트에서 open 상태를 제어한다면 해당 상태를 false로 변경
  };

  // const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     setSelectedImage(file);
  //     setPreviewUrl(URL.createObjectURL(file));
  //   }
  // };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 w-full max-w-[120px] rounded-lg text-sm"
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
              {/* TODO: 현재 프로필 이미지 또는 기본 이미지 표시 (previewUrl 사용) */}
              {/* {previewUrl ? (
                <Image src={previewUrl} alt="프로필 이미지" layout="fill" objectFit="cover" className="rounded-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 rounded-full">
                  <UserIcon className="w-12 h-12" />
                </div>
              )} */}
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
            // onChange={handleImageChange}
            />
          </div>

          {/* 이름 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name-modal" className="text-right col-span-1">
              이름
            </Label>
            <Input
              id="name-modal"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="col-span-3"
              placeholder="닉네임을 입력하세요"
            />
          </div>
          {/* 직군 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="job-modal" className="text-right col-span-1">
              직군
            </Label>
            <Input
              id="job-modal"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              className="col-span-3"
              placeholder="예: 프론트엔드 개발자"
            />
          </div>
          {/* 감자 기수 */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="generation-modal" className="text-right col-span-1">
              감자 기수
            </Label>
            <Input
              id="generation-modal"
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              className="col-span-3"
              placeholder="예: 9기"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              취소
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSaveChanges}>
            완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 임시 UserIcon (실제 아이콘 라이브러리 사용 권장, 또는 공유 유틸리티로 분리)
// function UserIcon(props: React.SVGProps<SVGSVGElement>) { ... }