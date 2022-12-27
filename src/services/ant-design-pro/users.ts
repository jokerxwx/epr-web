// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取用户列表 */
export async function getUsers() {
  return request('/api/user/list', {
    method: 'GET',
    headers:{
      'token':`${localStorage.getItem('token')}`
    },
  });
}
  
export async function createUser(user: API.User) {
    return request(`/api/user/create`, {
      method: 'post',
      headers:{
        'token':`${localStorage.getItem('token')}`
      },
      data: user,
    });
}
  
export async function updateUser(user: API.User) {
    return request(`/api/user/update`, {
      method: 'post',
      headers:{
        'token':`${localStorage.getItem('token')}`
      },
      data: user,
    });
}
  
export async function deleteUser(user: API.User) {
    return request(`/api/user/delete/${user.id}`, {
      method: 'delete',
      headers:{
        'token':`${localStorage.getItem('token')}`
      },
      data: user,
    });
}
  