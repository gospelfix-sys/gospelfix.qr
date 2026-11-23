import qrcode from "qrcode-generator";

// SVG/HTML 문자열이 아닌 모듈 행렬만 돌려준다. UI가 <svg>를 직접 그려
// dangerouslySetInnerHTML을 쓸 필요가 없게 하기 위함이다.
// 오류정정 M은 화면 표시·인쇄에서 크기와 복원력의 균형이 좋고, typeNumber 0은 길이에 맞춰 자동 선택한다.
// 입력이 QR 최대 용량을 넘으면 라이브러리가 throw하므로 null로 바꿔 호출부가 안내하게 한다
export function createQrMatrix(text: string): boolean[][] | null {
  try {
    const qr = qrcode(0, "M");
    qr.addData(text);
    qr.make();
    const size = qr.getModuleCount();
    return Array.from({ length: size }, (_, r) =>
      Array.from({ length: size }, (_, c) => qr.isDark(r, c)),
    );
  } catch {
    return null;
  }
}
