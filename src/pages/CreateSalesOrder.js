import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  ReloadOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  notification,
  Select,
  Input,
  Col,
  Row,
  DatePicker,
  Button,
  Typography,
  Table,
  Spin,
  Space,
  Modal,
  theme,
  ConfigProvider,
  Popconfirm,
  Dropdown,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateSalesOrder = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [loading, setLoading] = useState(false);
  const [materialsConversion, setMaterialsConversion] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const salesQuoteDetail = location.state;
  const [salesOrderDetail, setSalesOrderDetail] = useState(
    salesQuoteDetail.CustomerQuoteItem.map((item, index) => ({
      ...item,
      key: index,
    }))
  );
  //const projects = useSelector((state) => state.projects.projects);
  //const customers = useSelector((state) => state.customers.customers);
  const projects = localStorage.getItem("projects")
    ? JSON.parse(localStorage.getItem("projects"))
    : [];
  const customers = localStorage.getItem("customers")
    ? JSON.parse(localStorage.getItem("customers"))
    : [];
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
    });
  };
  const salesOrderColumns = [
    {
      title: "Nhà Máy",
      dataIndex: "FactoryIDCustom_SDK",
      render: (text, record) => record.FactoryIDCustom_SDK.slice(0, 7),
    },
    { title: "Hạng Mục", dataIndex: "SalesQuoteID" },
    { title: "Nhóm Vật Tư",  dataIndex: "ProductCategoryID" },
    {
      title: "Tên Vật Tư",
      dataIndex: "ProductID",
      
      render: (text, record) => `${record.ProductID} - ${record.Description}`,
    },
    { title: "Mã Thiết Kế", dataIndex: "", width: "10%" },
    {
      title: "Số Lượng (Md)",
      dataIndex: "RequestedQuantity",
      
      render: (text, record) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0, // No decimal places
        }).format(record.RequestedQuantity);
      },
    },
    {
      title: "Số Lượng (EA)",
      dataIndex: "CorrespondingQuantity",
      
      render: (text, record) => {
        if (record.RequestedQuantityUnit !== "MTR") {
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0, // No decimal places
          }).format(record.RequestedQuantity);
        }
        const x = materialsConversion.filter(
          (item) =>
            item.Material.InternalID === record.ProductID &&
            (item.CorrespondingQuantityUnitCode === "MTR" ||
              item.CorrespondingQuantityUnitCode === "EA")
        );
        if (x.length > 0) {
          if (
            new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 0, // No decimal places
            }).format(x[0].CorrespondingQuantity) != 1
          ) {
            return new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 0, // No decimal places
            }).format(
              Number(record.RequestedQuantity) /
                Number(x[0].CorrespondingQuantity)
            );
          }
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0, // No decimal places
          }).format(Number(record.RequestedQuantity) / Number(x[0].Quantity));
        }
      },
    },
    { title: "Đvt", dataIndex: "RequestedQuantityUnit", width: "5%" },
    {
      title: "Đơn Giá",
      dataIndex: "NetPrice",
      
      render: (text, record) =>
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0, // No decimal places
        }).format(record.NetPrice),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "NetAmount",
      
      render: (text, record) =>
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0, // No decimal places
        }).format(record.NetAmount),
    },
    { title: "Loại Tiền Tệ", dataIndex: "CurrencyCode", width: "10%" },
    {
      title: "",
      dataIndex: "0",
      render: (text, record) => (
        <Button
          onClick={() => {
            getMaterialsByProductCategoryID(record.ProductCategoryID);
            setOpenModal(true);  
          }}
          icon={<MenuUnfoldOutlined />}
        ></Button>
      ),
    },
  ];
  const getMaterialsByProductCategoryID = async (ProductCategoryID)=>{
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/getMaterialsByProductCategoryID",{ProductCategoryID});
      if (response?.data?.d?.results){
        console.log(response.data.d.results);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  const salesOrderDetailColumns = [
    {
      title: "Nhà Máy",
      dataIndex: "FactoryIDCustom_SDK",
      width: "5%",
      render: (text, record) => record.FactoryIDCustom_SDK.slice(0, 7),
    },
    { title: "Hạng Mục", dataIndex: "SalesQuoteID",width: "10%", },
    { title: "Từ Ngày", dataIndex: "ProductCategoryID",width: "8%", },
    {
      title: "Đến Ngày",
      dataIndex: "ProductID",
      width: "8%",
      render: (text, record) => `${record.ProductID} - ${record.Description}`,
    },
    { title: "Mã Vật Tư", dataIndex: "",width: "15%", },
    {
      title: "Tên Thiết Kế",
      dataIndex: "RequestedQuantity",
      width: "15%",
      render: (text, record) => {
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0, // No decimal places
        }).format(record.RequestedQuantity);
      },
    },
    {
      title: "Số Lượng",
      dataIndex: "CorrespondingQuantity",
      width: "7%",
      render: (text, record) => {
        if (record.RequestedQuantityUnit !== "MTR") {
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0, // No decimal places
          }).format(record.RequestedQuantity);
        }
        const x = materialsConversion.filter(
          (item) =>
            item.Material.InternalID === record.ProductID &&
            (item.CorrespondingQuantityUnitCode === "MTR" ||
              item.CorrespondingQuantityUnitCode === "EA")
        );
        if (x.length > 0) {
          if (
            new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 0, // No decimal places
            }).format(x[0].CorrespondingQuantity) != 1
          ) {
            return new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 0, // No decimal places
            }).format(
              Number(record.RequestedQuantity) /
                Number(x[0].CorrespondingQuantity)
            );
          }
          return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0, // No decimal places
          }).format(Number(record.RequestedQuantity) / Number(x[0].Quantity));
        }
      },
    },
    { title: "Đvt", dataIndex: "RequestedQuantityUnit", width: "5%", },
    {
      title: "Số Lượng (Md)",
      width: "7%",
      dataIndex: "NetPrice",
      render: (text, record) =>
        new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0, // No decimal places
        }).format(record.NetPrice),
    },
    {
      title: "",
      dataIndex: "0",
      width: "5%",
      render: () => (
        <Popconfirm
          title="Xác nhận xóa?"
          description=""
          icon={<QuestionCircleOutlined />}
        >
          <Button danger icon={DeleteOutlined}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];
  const controlsColumns = [
    {
      title: 'Nhà Máy',
      key: 'Factory',
      width: "5%",
      dataIndex: 'Factory',
    },
    {
      title: 'Hạng Mục',
      key: 'ProjectTask',
      width: "10%",
      dataIndex: 'ProjectTask',
      render: (text, record) => (
        <Select style={{width:"100%"}} menu={null} trigger={['click']}>
          
        </Select>
      ),
    },
    {
      title: 'Từ Ngày',
      key: 'FromDate',
      width: "8%",
      dataIndex: 'FromDate',
      render: (text, record) => (
        <DatePicker style={{width:"100%"}} format="DD/MM/YYYY" />
      ),
    },
    {
      title: 'Đến Ngày',
      key: 'ToDate',
      width: "8%",
      dataIndex: 'ToDate',
      render: (text, record) => (
        <DatePicker style={{width:"100%"}} format="DD/MM/YYYY" />
      ),
    },
    {
      title: 'Mã Vật Tư',
      key: 'Product',
      width: "15%",
      dataIndex: 'Product',
      render: (text, record) => (
        <Select style={{width:"100%"}} menu={null} trigger={['click']}>
        </Select>
      ),
    },
    {
      title: 'Tên Thiết Kế',
      key: 'Spec',
      width: "15%",
      dataIndex: 'Spec',
      render: (text, record) => (
        <Select style={{width:"100%"}} menu={null} trigger={['click']}>
        </Select>
      ),
    },
    {
      title: 'Số Lượng',
      key: 'Quantity',
      width: "7%",
      dataIndex: 'Quantity',
      render: (text, record) => (
        <Input style={{width:"100%"}} placeholder="Nhập số lượng" />
      ),
    },
    {
      title: 'Đvt',
      key: 'UnitCode',
      width: "5%", 
      dataIndex: 'UnitCode',
    },
    {
      title: 'Số Lượng (Md)',
      key: 'MdQuantity',
      width: "7%",
      dataIndex: 'MdQuantity',
    },
    {
      title: '',
      key: 'Action',
      width: "5%",
      dataIndex: 'Action',
      render: (text, record) => (
        <Button icon={<PlusOutlined />}></Button>
      ),
    },
  ];
  
  const controlsData = [
    {
      key: '1',
      Factory: 'Factory A',
      ProjectTask: 'Task 1',
      FromDate: '01/01/2023',
      ToDate: '31/01/2023',
      Product: 'Product A',
      Spec: 'Spec A',
      Quantity: 100,
      UnitCode: 'kg',
      MdQuantity: 90,
    },
  ];
  useEffect(() => {
    const fetchMaterialsConversion = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/getMaterialsConversionByInternalIDs",
          {
            InternalIDs: salesQuoteDetail.CustomerQuoteItem.map(
              (item) => item.ProductID
            ),
          }
        );
        if (response?.data?.d?.results) {
          setMaterialsConversion(response.data.d.results);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching materialsConversion:", error);
        setLoading(false);
      }
    };
    fetchMaterialsConversion();
  }, []);
  return (
    <>
      {contextHolder}
      <Spin style={{zIndex:"1001"}} tip="Loading" size="large" spinning={loading} fullscreen>
        {" "}
      </Spin>
      <Row align={"middle"} justify={"space-between"}>
        <Col span={3}>
          <Title level={3}>Create Sales Order</Title>
        </Col>
        <Col span={1}>
          <Button
            onClick={() => {
              navigate(-1);
            }}
          >
            Back
          </Button>
        </Col>
      </Row>

      <div
        style={{
          padding: 15,
          minHeight: 360,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Row>
          <Col span={2}>
            <Title style={{ marginTop: "0px" }} level={5}>
              Số Báo Giá
            </Title>
          </Col>
          <Col span={4}>
            <Title style={{ marginTop: "0px" }} level={5}>
              Tên Khách Hàng
            </Title>
          </Col>
          <Col span={4}>
            <Title style={{ marginTop: "0px" }} level={5}>
              Nội Dung Đơn Hàng
            </Title>
          </Col>
          <Col span={4}>
            <Title style={{ marginTop: "0px" }} level={5}>
              Đơn Vị Bán Hàng
            </Title>
          </Col>
          <Col span={3}>
            <Title style={{ marginTop: "0px" }} level={5}>
              Dự Án
            </Title>
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <TextArea
              disabled
              style={{ width: "95%", height: "50px" }}
              value={salesQuoteDetail.SalesQuoteID}
            />
          </Col>
          <Col span={4}>
            <TextArea
              disabled
              style={{ width: "95%", height: "50px" }}
              value={`${salesQuoteDetail.CustomerID} - ${
                customers.filter(
                  (item) => item.InternalID === salesQuoteDetail.CustomerID
                ).BusinessPartnerFormattedName !== undefined
                  ? customers.filter(
                      (item) => item.InternalID === salesQuoteDetail.CustomerID
                    ).BusinessPartnerFormattedName
                  : ""
              }`}
            />
          </Col>
          <Col span={4}>
            <TextArea
              style={{ width: "95%", height: "50px" }}
              value={salesQuoteDetail.SalesQuoteName}
            />
          </Col>
          <Col span={4}>
            <TextArea
              disabled
              style={{ width: "95%", height: "50px" }}
              value={salesQuoteDetail.SalesUnitID}
            />
          </Col>
          <Col span={6}>
            <TextArea
              disabled
              style={{ width: "95%", height: "50px" }}
              value={`${salesQuoteDetail.ProjectID} - ${
                projects.filter(
                  (item) => item.ProjectID === salesQuoteDetail.ProjectID
                ).ProjectName !== undefined
                  ? projects.filter(
                      (item) => item.ProjectID === salesQuoteDetail.ProjectID
                    ).ProjectName
                  : ""
              }`}
            />
          </Col>
          <Col span={3}>
            <Button style={{ height: "50px" }}>Tạo Mới</Button>
          </Col>

          <Col span={1}>
            <Space>
              <Button
                onClick={null}
                color="primary"
                variant="solid"
                style={{ height: "30px" }}
                icon={<ReloadOutlined />}
              />
            </Space>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Table
            columns={salesOrderColumns}
            dataSource={salesOrderDetail}
            style={{ width: "100%" }}
          />
        </Row>
        <Row>
          <Title level={5}>Chi Tiết</Title>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Table
            showHeader={false}
            columns={salesOrderColumns}
            dataSource={null}
            style={{ width: "100%" }}
          />
        </Row>
      </div>
      <Modal
        title=""
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        width={"90%"}
      >
        <ConfigProvider renderEmpty={() => <></>}>
          <Table
            style={{ marginTop: "30px" }}
            columns={salesOrderDetailColumns}
            dataSource={null}
            pagination={false}
            components={{
              body: {
                wrapper: (props) => <tbody {...props} style={{ display: 'none' }} />,
              },
            }}
          />
        </ConfigProvider>
        <Table
          showHeader={false}
          columns={controlsColumns}
          dataSource={controlsData}
          pagination={false}
          rowKey={"key"}
        ></Table>
      </Modal>
    </>
  );
};

export default CreateSalesOrder;
