import { UserRole } from "~/lib/constants";
import withAuth from "~/utils/withAuth";

const Settings = () => {
  return <div>Settings</div>;
};

export default withAuth(Settings, UserRole.Admin);
