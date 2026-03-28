import { Outlet } from "react-router-dom";
import { DocsAppFrame } from "../../components/docs/DocsAppFrame";

export function DocsLayout() {
  return (
    <DocsAppFrame>
      <Outlet />
    </DocsAppFrame>
  );
}
