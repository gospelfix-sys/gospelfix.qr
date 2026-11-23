import { Card, CardContent } from "@/components/ui/card";

// fragment 누락·변조 시 보여주는 안내
export default function InvalidLink() {
  return (
    <div className="px-4 py-8">
      <Card role="alert">
        <CardContent className="text-muted-foreground">
          유효하지 않은 링크예요. 가스펄픽스 입금 안내 화면에서 QR을 다시 만들어 주세요.
        </CardContent>
      </Card>
    </div>
  );
}
