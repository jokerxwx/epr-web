// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string;
    avatar?: string;
    id?: number;
    email?: string;
    roles?: String[];
    // signature?: string;
    // title?: string;
    // group?: string;
    // tags?: { key?: string; label?: string }[];
    // notifyCount?: number;
    // unreadCount?: number;
    // country?: string;
    // access?: string;
    // geographic?: {
    //   province?: { label?: string; key?: string };
    //   city?: { label?: string; key?: string };
    // };
    // address?: string;
    phonenumber?: string;
  };

  type LoginResult = {
    code?: number;
    msg?: string;
    data: {
      token:string
    };
  };

  type PageParams = {
    current?: number;
    pageSize?: number;
  };

  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    // autoLogin?: boolean;
    // type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type Role = {
    id: string;
    name?: string;
    // order?: number;
    enabled?: boolean;
    create_time?: string;
    update_time?: string;
    // 角色所属菜单
    menus?: Menu[];
  };
  type Menu = {
    id: string;
    name?: string;
    icon?: string;
    identifier: string;
    // 路径
    path?: string;
    parent?: string;
    hide?: boolean;
    order?: number;
    // 子菜单
    children?: Menu[];
    type?: 'inner' | 'outter' | undefined;
  };
   type User = {
    id: string;
    username: string;
    name: string;
    password: string;
    avatar: string;
    mobile: string;
    email: string;
    status: boolean;
    roles: string[];
  };
}
