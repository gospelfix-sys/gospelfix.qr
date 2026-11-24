// @gospelfix/qr 로직 진입점. react·next·window에 의존하지 않는다(UI는 @gospelfix/qr/react).
// 공개 API는 최소로 유지한다. 내부 헬퍼(별칭 표, 정규화 함수 등)는 내보내지 않는다.
export { parseTransferHash } from "./lib/parseTransfer";
export type { Transfer } from "./lib/parseTransfer";
export { LAUNCH_APPS, BANK_OPTIONS } from "./lib/apps";
export type { LaunchApp, BankOption } from "./lib/apps";
export { buildTransferHash, buildTransferUrl } from "./lib/buildTransfer";
export type { TransferInput } from "./lib/buildTransfer";
export { createQrMatrix } from "./lib/qr";
