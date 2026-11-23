// 3단계 안내와 고지문. 고지문은 항상 보여야 하므로 조건 없이 렌더링한다
export default function GuideSteps() {
  return (
    <section aria-label="송금 방법" className="space-y-4">
      <ol className="list-decimal space-y-2 pl-4 text-[13px]">
        <li>계좌번호 복사</li>
        <li>금융앱 열기</li>
        <li>붙여넣고 은행·계좌번호·예금주·금액 확인</li>
      </ol>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        앱이 열리지 않으면 계좌번호를 복사해 사용 중인 금융앱에서 직접 송금해 주세요.
      </p>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        금융앱 송금 화면을 여는 편의 기능이며 가스펄픽스는 해당 금융앱 회사와 제휴 관계가 아니에요.
        보내기 전 받는 은행·계좌번호·예금주·금액을 꼭 확인해주세요.
      </p>
    </section>
  );
}
