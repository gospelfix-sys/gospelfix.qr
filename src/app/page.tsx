import CreateForm from "@/components/create/CreateForm";
import LegacyLinkRedirect from "@/components/create/LegacyLinkRedirect";
import TransferHeader from "@/components/transfer/TransferHeader";

// 은행·계좌번호·예금주를 한 번 입력해 QR을 만드는 화면. 조합만 맡는다.
// 송금 화면은 /pay이며, 옛 링크(`/#b=...`)는 LegacyLinkRedirect가 /pay로 넘긴다
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col">
      <LegacyLinkRedirect />
      <TransferHeader title="QR 만들기" />
      <CreateForm />
    </main>
  );
}
