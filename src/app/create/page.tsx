import CreateForm from "@/components/create/CreateForm";
import TransferHeader from "@/components/transfer/TransferHeader";

// 은행·계좌번호·예금주를 한 번 입력해 QR을 만드는 화면. 조합만 맡는다
export default function CreatePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col">
      <TransferHeader title="QR 만들기" />
      <CreateForm />
    </main>
  );
}
