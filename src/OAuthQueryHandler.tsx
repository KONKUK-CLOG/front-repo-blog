import { useNavigate } from "react-router-dom"
import OAuthHandler from "@/components/oauth-handler"

/** HashRouter + S3 루트 redirect: ?code= 처리 후 /#/ 홈으로 */
export default function OAuthQueryHandler() {
  const navigate = useNavigate()
  return <OAuthHandler onDone={() => navigate("/", { replace: true })} />
}
