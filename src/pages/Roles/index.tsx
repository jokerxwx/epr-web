import ProTable, {ActionType} from '@ant-design/pro-table';
import type {ProColumns} from '@ant-design/pro-table';
import React, {useState, useRef, useEffect} from 'react';
import {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  updateRoleMenu,
  getRoleMenus,
} from '@/services/ant-design-pro/roles';
// import {getMenus} from '@/services/ant-design-pro/menus';
import {Button, Modal, Form, Input, Checkbox, InputNumber, message, Space, Tree} from 'antd';
import {DeleteOutlined, EditOutlined, SettingOutlined} from '@ant-design/icons';
import {useIntl} from 'umi';
import {DataNode} from 'antd/lib/tree';

const handleSaveRole: (role: API.Role) => Promise<boolean> = async (role) => {
  const hide = message.loading(`正在${role.id ? '修改' : '创建'}角色....`);

  const resp = role.id ? await updateRole(role) : await createRole(role);

  hide();
  if (resp && resp.code === 200) {
    message.success('角色添加成功!');
    return true;
  }

  message.error('角色添加失败!');
  return false;
};

const handleDeleteRole: (role: API.Role) => Promise<boolean> = async (role) => {
  const hide = message.loading('正在删除角色....');

  const resp = await deleteRole(role);

  hide();
  if (resp && resp.code === 200) {
    message.success('角色删除成功!');
    return true;
  }

  message.error('角色删除失败!');
  return false;
};

const handleEditRoleMenu: (id: number, meuns: string[]) => Promise<boolean> = async (id, menus) => {
  const hide = message.loading('正在修改角色菜单....');

  const resp = await updateRoleMenu(id, menus);

  hide();
  if (resp && resp.code === 200) {
    message.success('修改角色菜单删除成功!');
    return true;
  }

  message.error('修改角色菜单删除失败!');
  return false;
};

const Role: React.FC = () => {
  const [modalOpen, setmodalOpen] = useState(false);

  const [editMenuRoleId, setEditMenuRoleId] = useState<string | null>(null);
  const [checkedMenus, setCheckedMenus] = useState<string[]>([]);
  const [menuDatas, setMenuDatas] = useState<DataNode[]>([]);
  const [editRole, setEditRole] = useState<API.Role | null>(null);
  const [form] = Form.useForm();
  const tableRef = useRef<ActionType>();
  const intl = useIntl();

  // const fetchMenus = async () => {
  //   const menus = await getMenus();

  //   const menuCombine: (m: API.Menu, p?: API.Menu) => API.Menu & { name: string } = (m, p) => {
  //     return {
  //       ...m,
  //       name: p && p.name ? `${p.name}.${m.name}` : `menu.${m.name}`,
  //       children: m.children?.map((c) =>
  //         menuCombine(c, {
  //           ...m,
  //           name: p && p.name ? `${p.name}.${m.name}` : `menu.${m.name}`,
  //         }),
  //       ),
  //     };
  //   };

  //   const combineMenus = menus.data.map((c: any) => menuCombine(c));
  //   const menu2Node: (m: API.Menu) => DataNode = (m) => {
  //     return {
  //       key: m.mid,
  //       title: intl.formatMessage({id: `${m.name}`}),
  //       children: m.children?.map(menu2Node),
  //     };
  //   };

  //   const nodes = combineMenus.map(menu2Node);

  //   setMenuDatas(nodes);
  // };

  // useEffect(() => {
  //   fetchMenus();
  // }, []);

  const columns: ProColumns<API.Role>[] = [
    {
      title: intl.formatMessage({
        id: 'roles.column.id',
        defaultMessage: 'ID',
      }),
      dataIndex: 'id', // data.id or data["id"]
    },
    {
      title: intl.formatMessage({
        id: 'roles.column.name',
        defaultMessage: 'Name',
      }),
      dataIndex: 'name',
    },
    // {
    //   title: intl.formatMessage({
    //     id: 'roles.column.identifier',
    //     defaultMessage: 'Identifier',
    //   }),
    //   dataIndex: 'identifier',
    // },
    // {
    //   title: intl.formatMessage({
    //     id: 'roles.column.order',
    //     defaultMessage: 'Order',
    //   }),
    //   dataIndex: 'order',
    // },
    {
      title: intl.formatMessage({
        id: 'roles.column.status',
        defaultMessage: 'status',
      }),
      dataIndex: 'status',
      valueEnum: {
        true: {
          text: intl.formatMessage({
            id: 'roles.column.status.true',
            defaultMessage: 'True',
          }),
          status: 'Success',
        },
        false: {
          text: intl.formatMessage({
            id: 'roles.column.status.false',
            defaultMessage: 'False',
          }),
          status: 'Warning',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (dom: any, entity: API.Role) => {
        return (
          <>
            <Space>
              <Button
                id={`roles-update-${entity.id}`}
                icon={<EditOutlined/>}
                onClick={() => {
                  setEditRole(entity);
                  setmodalOpen(true);
                  form.setFieldsValue(entity);
                }}
              />
              <Button
                id={`roles-delete-${entity.id}`}
                icon={<DeleteOutlined/>}
                onClick={async () => {
                  const result = await handleDeleteRole(entity);
                  if (result) {
                    if (tableRef.current) {
                      tableRef.current.reload();
                    }
                  }
                }}
              />
              {/* <Button
                id={`roles-menu-update-${entity.id}`}
                icon={<SettingOutlined/>}
                onClick={async () => {
                  const resp = await getRoleMenus(entity.id);
                  setCheckedMenus(resp.data.menus);
                  setEditMenuRoleId(entity.id);
                }}
              /> */}
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ProTable<API.Role>
        rowKey="id"
        actionRef={tableRef}
        columns={columns}
        pagination={{
          showSizeChanger: true,
        }}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params) => {
          // TODO 怎么去请求网络.
          const result = await getRoles();
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
              key={"primary"}
              type="primary"
              id="role-create"
              onClick={() => {
                setmodalOpen(true);
              }}
            >
              {intl.formatMessage({
                id: 'roles.btn.create',
                defaultMessage: 'create',
              })}
            </Button>,
          ],
        }}
      />

      <Modal
        onCancel={() => {
          setmodalOpen(false);
          setEditRole(null);
        }}
        onOk={() => {
          form.validateFields().then(async (values) => {
            const result = await handleSaveRole(values);
            if (result) {
              setmodalOpen(false);
              setEditRole(null);
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
              id: 'roles.column.id',
              defaultMessage: 'ID',
            })}
            name="id"
            hidden
          >
            <Input/>
          </Form.Item>
          <Form.Item
            label={intl.formatMessage({
              id: 'roles.column.name',
              defaultMessage: 'Name',
            })}
            name="name"
            required={true}
          >
            <Input/>
          </Form.Item>

          {/* <Form.Item
            label={intl.formatMessage({
              id: 'roles.column.identifier',
              defaultMessage: 'Identifier',
            })}
            name="identifier"
            required={true}
          >
            <Input disabled={!!editRole?.id}/>
          </Form.Item>

          <Form.Item
            label={intl.formatMessage({
              id: 'roles.column.order',
              defaultMessage: 'Order',
            })}
            name="order"
            required={true}
          >
            <InputNumber/>
          </Form.Item> */}

          <Form.Item
            label={intl.formatMessage({
              id: 'roles.column.status',
              defaultMessage: 'true',
            })}
            name="status"
            valuePropName="checked"
            required={true}
          >
            <Checkbox/>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={editMenuRoleId !== null}
        onCancel={() => setEditMenuRoleId(null)}
        onOk={async () => {
          if (editMenuRoleId) {
            const result = await handleEditRoleMenu(editMenuRoleId, checkedMenus);
            if (result) {
              setEditMenuRoleId(null);
              setCheckedMenus([]);
              if (tableRef.current) {
                tableRef.current.reload();
              }
            }
          }
        }}
      >
        <Tree
          checkable
          checkedKeys={checkedMenus}
          treeData={menuDatas}
          onCheck={(checked: any) => {
            setCheckedMenus(checked);
          }}
        />
      </Modal>
    </>
  );
};

export default Role;
