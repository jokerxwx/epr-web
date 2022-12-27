import { request } from '@umijs/max';

export async function getRoles() {
  return request(`/api/role/list`,{
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
  });
}

export async function createRole(role: API.Role) {
  return request(`/api/role/create`, {
    method: 'post',
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
    data: role,
  });
}

export async function updateRole(role: API.Role) {
  return request(`/api/role/update`, {
    method: 'post',
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
    data: role,
  });
}

export async function deleteRole(role: API.Role) {
  return request(`/api/role/delete/${role.id}`, {
    method: 'delete',
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
    data: role,
  });
}
export async function getRoleMenus(id: string) {
  return request(`/api/role/${id}/menus`, {
    method: 'get',
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
  });
}

export async function updateRoleMenu(id: string, menus: string[]) {
  return request(`/api/role/${id}/menus`, {
    method: 'post',
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
    data: {
      menus,
    },
  });
}
export async function fetchCurrentUserRole(id: string) {
  return request(`/api/role/fetch/${id}`, {
    method: 'get',
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
  });
}



