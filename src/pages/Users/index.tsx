import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useState, useRef, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/ant-design-pro/users';
import { Button, Modal, Form, Input, message, Space, Select } from 'antd';
import { DeleteOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import { getRoles, fetchCurrentUserRole } from '@/services/ant-design-pro/roles';

const handleSaveUser: (user: API.User) => Promise<boolean> = async (user) => {
  const hide = message.loading(`正在${user.id ? '修改' : '创建'}用户....`);

  const resp = user.id ? await updateUser(user) : await createUser(user);

  hide();
  if (resp && resp.code === 200) {
    message.success('用户保存成功!');
    return true;
  }

  message.error('用户保存失败!');
  return false;
};

const handleDeleteUser: (user: API.User) => Promise<boolean> = async (user) => {
  const hide = message.loading('正在删除用户....');

  const resp = await deleteUser(user);

  hide();
  if (resp && resp.code === 200) {
    message.success('用户删除成功!');
    return true;
  }

  message.error('用户删除失败!');
  return false;
};

const UserList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<API.User | null>(null);
  const [roles, setRoles] = useState<API.Role[]>([]);
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const intl = useIntl();


  const fetchRoles = async () => {
    const result = await getRoles();
    setRoles(result.data.records);
  };

  const getCurrentUserRole = async (entity: API.User) =>{
    const result = await fetchCurrentUserRole(entity.id);
    entity.roles = result.data
  }

  useEffect(() => {
    fetchRoles();
  }, []);

  const columns: ProColumns<API.User>[] = [
    // {
    //   title: intl.formatMessage({
    //     id: 'user.column.id',
    //     defaultMessage: 'ID',
    //   }),
    //   dataIndex: 'id', // data.id or data["id"]
    // },
    {
      title: intl.formatMessage({
        id: 'user.column.name',
        defaultMessage: 'name',
      }),
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'user.column.username',
        defaultMessage: 'username',
      }),
      dataIndex: 'username',
    },
    {
      title: intl.formatMessage({
        id: 'user.column.avatar',
        defaultMessage: 'avatar',
      }),
      dataIndex: 'avatar',
      render: (_, entity) => {
        return (
          <>
            <img src={entity?.avatar || ''} width={40} />
          </>
        );
      },
    },

    {
      title: intl.formatMessage({
        id: 'user.column.mobile',
        defaultMessage: 'mobile',
      }),
      dataIndex: 'mobile',
    },
    {
      title: intl.formatMessage({
        id: 'user.column.email',
        defaultMessage: 'email',
      }),
      dataIndex: 'email',
    },

    {
      title: '操作',
      dataIndex: 'action',
      render: (dom: any, entity: API.User) => {
        return (
          <>
            <Space>
              <Button
                id={`user-update-${entity.id}`}
                icon={<EditOutlined />}
                onClick={() => {
                  getCurrentUserRole(entity);
                  setSelectedUser(entity);
                  setTimeout(() => {
                    form.setFieldsValue(entity)
                  }, 100)
                  setModalOpen(true);
                }}
              />
              <Button
                id={`user-delete-${entity.id}`}
                icon={<DeleteOutlined />}
                onClick={async () => {
                  const result = await handleDeleteUser(entity);
                  if (result) {
                    setModalOpen(false);

                    if (tableRef.current) {
                      tableRef.current.reload();
                    }
                  }
                }}
              />
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<API.User>
        rowKey="id"
        actionRef={tableRef}
        columns={columns}
        pagination={{
          showSizeChanger: true,
        }}
        request={async () => {
          // TODO 怎么去请求网络.
          const result = await getUsers();
          return {
            data: result.data.records,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: true,
            // 不传会使用 data 的长度，如果是分页一定要传
            total: result.data.total,
          };
        }}
        toolbar={{
          actions: [
            <Button
              key="primary"
              type="primary"
              id="user-create"
              onClick={() => {
                setModalOpen(true);
                form.resetFields();
              }}
            >
              {intl.formatMessage({
                id: 'user.btn.create',
                defaultMessage: 'create',
              })}
            </Button>,
          ],
        }}
      />

      <Modal
        onCancel={() => {
          setModalOpen(false);
        }}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const result = await handleSaveUser(values);
            if (result) {
              setModalOpen(false);

              if (tableRef.current) {
                tableRef.current.reload();
              }
            }
          });
        }}
        open={modalOpen}
      >
        
        <Form form={form}>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.id',
              defaultMessage: 'ID',
            })}
            name="id"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.username',
              defaultMessage: 'username',
            })}
            name="username"
            required={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.name',
              defaultMessage: 'Name',
            })}
            name="name"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.password',
              defaultMessage: 'password',
            })}
            name="password"
            required={true}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.avatar',
              defaultMessage: 'avatar',
            })}
            name="avatar"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.mobile',
              defaultMessage: 'mobile',
            })}
            name="mobile"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.email',
              defaultMessage: 'email',
            })}
            name="email"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'user.column.roles',
              defaultMessage: 'roles',
            })}
            name="roles"
            required={true}
          >
            <Select mode="tags">
              {roles.map((r) => (
                <Select.Option key={r.id}  value={r.name}>
                  {r.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserList;