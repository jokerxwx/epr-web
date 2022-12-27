/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    admin: currentUser && currentUser.roles?.includes("admin"),
    test: currentUser && currentUser.roles?.includes("test")
  };
}
